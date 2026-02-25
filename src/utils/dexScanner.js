/**
 * Simple DEX scanner that looks for sensitive strings and method calls
 * directly in the classes.dex binary buffer.
 * 
 * This is a lightweight alternative to full decompilation, suitable for browser use.
 */
export function scanDex(dexBuffer) {
    if (!dexBuffer) return null;

    const findings = {
        runtimePerms: [],
        dynamicLoads: [],
        dataSinks: [],
        suspiciousStrings: []
    };

    const uint8 = new Uint8Array(dexBuffer);
    const textDecoder = new TextDecoder('utf-8');

    // Convert buffer to strings (coarse approach: split by non-printable characters)
    // In a real implementation, we would parse the StringId section of the DEX header.
    // For this heuristic implementation, we scan for specific critical pattern bytes.

    const content = textDecoder.decode(uint8);

    // 1. Runtime Permission Requests
    if (content.includes('requestPermissions')) {
        findings.runtimePerms.push('Found call to requestPermissions()');
    }
    if (content.includes('checkSelfPermission')) {
        findings.runtimePerms.push('Found call to checkSelfPermission()');
    }

    // 2. Dynamic Code Loading
    if (content.includes('DexClassLoader')) {
        findings.dynamicLoads.push('Found usage of DexClassLoader');
    }
    if (content.includes('PathClassLoader')) {
        findings.dynamicLoads.push('Found usage of PathClassLoader');
    }
    if (content.includes('loadDex')) {
        findings.dynamicLoads.push('Found call to loadDex()');
    }

    // 3. Potential Data Sinks
    const sinkPatterns = [
        { pattern: 'HttpURLConnection', label: 'Network: HttpURLConnection' },
        { pattern: 'OkHttpClient', label: 'Network: OkHttpClient' },
        { pattern: 'Socket;', label: 'Network: Raw Socket' },
        { pattern: 'URL;->openConnection', label: 'Network: URL.openConnection' },
        { pattern: 'FileOutputStream', label: 'Storage: FileOutputStream' },
        { pattern: 'content://', label: 'Content Provider Access' }
    ];

    sinkPatterns.forEach(s => {
        if (content.includes(s.pattern)) {
            findings.dataSinks.push(s.label);
        }
    });

    // 4. Trace Analysis (Simulated)
    // Check for sensitive API combinations
    if (content.includes('getDeviceId') || content.includes('getImei')) {
        findings.suspiciousStrings.push('Identifier: Device ID/IMEI access');
    }
    if (content.includes('getLine1Number')) {
        findings.suspiciousStrings.push('Identity: Phone number access');
    }
    if (content.includes('getLastKnownLocation')) {
        findings.suspiciousStrings.push('Location: Last known location access');
    }

    return findings;
}
