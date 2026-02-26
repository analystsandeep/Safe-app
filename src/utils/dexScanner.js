/**
 * Advanced DEX Scanner and parser.
 * Reads strings, types, fields, and methods from the DEX binary format directly using DataView,
 * avoiding crude .toString() regex approaches.
 */

export function parseDex(arrayBuffer) {
    if (!arrayBuffer) return { strings: [], classes: [], methods: [], fields: [], error: 'Empty buffer' };

    try {
        const dv = new DataView(arrayBuffer);
        const magic = dv.getUint32(0, true);

        // Simple magic check. The first bytes are 'd', 'e', 'x', '\n' => hex matches below
        // 'dex\n' => 0x64 0x65 0x78 0x0a -> as uint32 little endian: 0x0a786564
        if (magic !== 0x0a786564) {
            console.warn("Invalid DEX magic number: " + magic.toString(16));
            return { strings: [], classes: [], methods: [], fields: [], error: 'Invalid DEX magic' };
        }

        const endianTag = dv.getUint32(0x28, true);
        const isLittleEndian = endianTag === 0x12345678;

        // Read sizes and offsets
        const stringIdsSize = dv.getUint32(0x38, isLittleEndian);
        const stringIdsOff = dv.getUint32(0x3c, isLittleEndian);
        const typeIdsSize = dv.getUint32(0x40, isLittleEndian);
        const typeIdsOff = dv.getUint32(0x44, isLittleEndian);
        const fieldIdsSize = dv.getUint32(0x50, isLittleEndian);
        const fieldIdsOff = dv.getUint32(0x54, isLittleEndian);
        const methodIdsSize = dv.getUint32(0x58, isLittleEndian);
        const methodIdsOff = dv.getUint32(0x5c, isLittleEndian);
        const classDefsSize = dv.getUint32(0x60, isLittleEndian);
        const classDefsOff = dv.getUint32(0x64, isLittleEndian);

        const strings = [];
        const types = [];
        const fields = [];
        const methods = [];
        const classNames = [];

        const decoder = new TextDecoder('utf-8');

        function readUleb128(offset) {
            let result = 0;
            let shift = 0;
            let bytesRead = 0;
            while (offset + bytesRead < dv.byteLength) {
                const byte = dv.getUint8(offset + bytesRead);
                bytesRead++;
                result |= (byte & 0x7f) << shift;
                if ((byte & 0x80) === 0) break;
                shift += 7;
            }
            return { value: result, bytesRead };
        }

        // Parse Strings
        for (let i = 0; i < stringIdsSize; i++) {
            if (stringIdsOff + i * 4 + 4 > dv.byteLength) break;
            const stringDataOff = dv.getUint32(stringIdsOff + i * 4, isLittleEndian);
            if (stringDataOff >= dv.byteLength) { strings.push(""); continue; }

            const { bytesRead } = readUleb128(stringDataOff);
            let strOff = stringDataOff + bytesRead;

            // MUTF-8 to JS String
            let endOff = strOff;
            while (endOff < dv.byteLength && dv.getUint8(endOff) !== 0) {
                endOff++;
            }
            const strBytes = new Uint8Array(arrayBuffer, strOff, endOff - strOff);
            // Standard utf-8 decode mostly works, ignoring MUTF-8 quirks for our analysis purposes
            const str = decoder.decode(strBytes);
            strings.push(str);
        }

        // Parse Types
        for (let i = 0; i < typeIdsSize; i++) {
            if (typeIdsOff + i * 4 + 4 > dv.byteLength) break;
            const descriptorIdx = dv.getUint32(typeIdsOff + i * 4, isLittleEndian);
            types.push(strings[descriptorIdx] || "");
        }

        // Parse Fields
        // Field Id struct: class_idx (ushort), type_idx (ushort), name_idx (uint) -> 8 bytes total
        for (let i = 0; i < fieldIdsSize; i++) {
            const off = fieldIdsOff + i * 8;
            if (off + 8 > dv.byteLength) break;
            const classIdx = dv.getUint16(off, isLittleEndian);
            const nameIdx = dv.getUint32(off + 4, isLittleEndian);

            const className = types[classIdx] || "";
            const fieldName = strings[nameIdx] || "";
            fields.push(`${className}->${fieldName}`);
        }

        // Parse Methods
        // Method Id struct: class_idx (ushort), proto_idx (ushort), name_idx (uint) -> 8 bytes total
        for (let i = 0; i < methodIdsSize; i++) {
            const off = methodIdsOff + i * 8;
            if (off + 8 > dv.byteLength) break;
            const classIdx = dv.getUint16(off, isLittleEndian);
            const nameIdx = dv.getUint32(off + 4, isLittleEndian);

            const className = types[classIdx] || "";
            const methodName = strings[nameIdx] || "";
            methods.push(`${className}->${methodName}`);
        }

        // Parse Classes
        for (let i = 0; i < classDefsSize; i++) {
            const off = classDefsOff + i * 32;
            if (off + 32 > dv.byteLength) break;
            const classIdx = dv.getUint32(off, isLittleEndian);
            classNames.push(types[classIdx] || "");
        }

        return { strings, types, fields, methods, classNames };
    } catch (e) {
        console.error("DEX Parsing failed:", e);
        return { strings: [], types: [], fields: [], methods: [], classNames: [], error: e.message };
    }
}

export function scanForRiskPatterns(parsedDex) {
    const { strings, methods } = parsedDex;

    // We'll collect suspicious findings
    const findings = {
        suspiciousStrings: [],
        riskyMethods: [],
        riskIndicators: [], // array of { type: "high/medium", reason: "...", evidence: "..." }
        scoreContribution: 0
    };

    const addIndicator = (type, reason, evidence, points) => {
        findings.riskIndicators.push({ type, reason, evidence });
        findings.scoreContribution += points;
    };

    // Helper functions
    const strMatch = (pattern) => strings.some(s => s.includes(pattern));
    const rawStrValues = strings.filter(s => s.length > 3);

    // 1. Dynamic Code Loading
    const dynamicCodeLoadingEvidences = methods
        .filter(m => m.includes('dalvik/system/DexClassLoader') ||
            m.includes('dalvik/system/PathClassLoader') ||
            m.includes('loadDex'))
        .slice(0, 3);
    if (dynamicCodeLoadingEvidences.length > 0) {
        addIndicator('high', 'Dynamic Code Loading detected', dynamicCodeLoadingEvidences.join(', '), 25);
        findings.riskyMethods.push(...dynamicCodeLoadingEvidences);
    } else if (strMatch('DexClassLoader') || strMatch('PathClassLoader')) {
        addIndicator('medium', 'References to ClassLoaders found in strings', 'DexClassLoader/PathClassLoader found', 10);
        findings.suspiciousStrings.push('DexClassLoader');
    }

    // 2. Reflection Abuse
    const reflectionEvidences = methods
        .filter(m => m.includes('Ljava/lang/reflect/Method;->invoke') ||
            m.includes('Ljava/lang/Class;->forName'))
        .slice(0, 3);
    if (reflectionEvidences.length > 0) {
        addIndicator('medium', 'Usage of Java Reflection API', reflectionEvidences.join(', '), 15);
        findings.riskyMethods.push(...reflectionEvidences);
    }

    // 3. Sensitive APIs
    const sensitiveEvidences = methods
        .filter(m => m.includes('Landroid/telephony/TelephonyManager;->getDeviceId') ||
            m.includes('Landroid/telephony/TelephonyManager;->getImei') ||
            m.includes('Landroid/telephony/SmsManager;->sendTextMessage') ||
            m.includes('Landroid/media/AudioRecord;->startRecording') ||
            m.includes('Landroid/hardware/Camera;->open') ||
            m.includes('Landroid/hardware/camera2/CameraManager;->openCamera'))
        .slice(0, 5);
    if (sensitiveEvidences.length > 0) {
        addIndicator('high', 'Direct usage of sensitive hardware or identity APIs', sensitiveEvidences.join(', '), 20);
        findings.riskyMethods.push(...sensitiveEvidences);
    }

    // 4. Crypto and Encoding
    const cryptoEvidences = methods
        .filter(m => m.includes('Ljavax/crypto/Cipher;->getInstance'))
        .slice(0, 3);
    if (cryptoEvidences.length > 0) {
        addIndicator('medium', 'Usage of cryptographic routines', cryptoEvidences.join(', '), 5);
        findings.riskyMethods.push(...cryptoEvidences);
    }

    // 5. WebView Interfaces
    const webViewEvidences = methods
        .filter(m => m.includes('Landroid/webkit/WebView;->addJavascriptInterface'))
        .slice(0, 3);
    if (webViewEvidences.length > 0) {
        addIndicator('high', 'Insertion of JS interfaces into WebView (potential arbitrary code execution if unsanitized)', webViewEvidences.join(', '), 20);
        findings.riskyMethods.push(...webViewEvidences);
    }

    // 6. Shell / Native Process Execution
    const processEvidences = methods
        .filter(m => m.includes('Ljava/lang/Runtime;->exec') || m.includes('Ljava/lang/ProcessBuilder;->start'))
        .slice(0, 3);
    if (processEvidences.length > 0) {
        addIndicator('high', 'Execution of shell commands via Runtime/ProcessBuilder', processEvidences.join(', '), 25);
        findings.riskyMethods.push(...processEvidences);
    }

    // 7. Base64 / Hex encodings strings
    // We just check string table for "http" or suspicious IPs
    const ipMatcher = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipsFound = rawStrValues.filter(s => ipMatcher.test(s)).slice(0, 3);
    if (ipsFound.length > 0) {
        addIndicator('medium', 'Hardcoded IP addresses found in strings', ipsFound.join(', '), 10);
        findings.suspiciousStrings.push(...ipsFound);
    }

    return findings;
}

// Default export wrapper
export function scanDexWorkerFriendly(dexBuffer) {
    if (!dexBuffer) return null;
    const parsed = parseDex(dexBuffer);
    if (parsed.error) return null;
    return scanForRiskPatterns(parsed);
}
