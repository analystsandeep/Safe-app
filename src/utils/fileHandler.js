import JSZip from 'jszip';
import { parseAxml } from './axmlParser.js';

/**
 * Handles APK and raw XML file uploads.
 * For APKs: extracts AndroidManifest.xml and parses binary XML via AXML parser.
 * Falls back to string extraction if AXML parser fails.
 *
 * @param {File} file
 * @returns {Promise<{manifestContent: string, fileType: string, fileName: string}>}
 */
export async function handleFile(file) {
    const fileName = file.name;
    const extension = fileName.split('.').pop().toLowerCase();

    // ── Plain XML file ──────────────────────────────────────────────
    if (extension === 'xml') {
        const text = await file.text();
        return { manifestContent: text, fileType: 'xml', fileName };
    }

    // ── APK file ────────────────────────────────────────────────────
    if (extension === 'apk') {
        const arrayBuffer = await file.arrayBuffer();

        let zip;
        try {
            zip = await JSZip.loadAsync(arrayBuffer);
        } catch (e) {
            throw new Error('Could not open APK. The file may be corrupted or not a valid APK/ZIP archive.');
        }

        const manifestEntry = zip.file('AndroidManifest.xml');
        if (!manifestEntry) {
            throw new Error('AndroidManifest.xml not found inside the APK.');
        }

        // Try the AXML binary parser first (uint8array → XML string)
        try {
            const binaryData = await manifestEntry.async('uint8array');

            // Check for AXML magic number: first two bytes should be 0x03 0x00
            const magic = (binaryData[0] | (binaryData[1] << 8)) >>> 0;
            if (magic === 0x0003) {
                const parsed = parseAxml(binaryData);
                if (parsed && parsed.length > 50) {
                    return { manifestContent: parsed, fileType: 'apk', fileName };
                }
            }

            // If magic check failed, it might still be binary — try parse anyway
            const parsed = parseAxml(binaryData);
            if (parsed && parsed.length > 50) {
                return { manifestContent: parsed, fileType: 'apk', fileName };
            }

            // Fallback: maybe it IS already text XML in the APK
            const textContent = await manifestEntry.async('text');
            if (!isBinaryXml(textContent)) {
                return { manifestContent: textContent, fileType: 'apk', fileName };
            }

            // Last resort: string extraction (partial data)
            const fallbackContent = extractReadableStrings(binaryData);
            return { manifestContent: fallbackContent, fileType: 'apk', fileName };

        } catch (e) {
            // Parser threw — still try text fallback
            const textContent = await manifestEntry.async('text');
            return { manifestContent: textContent, fileType: 'apk', fileName };
        }
    }

    throw new Error('Unsupported file type. Please upload an .apk or .xml file.');
}

/** True if the text string looks like binary (has many null bytes). */
function isBinaryXml(content) {
    const nullCount = (content.match(/\0/g) || []).length;
    return nullCount > content.length * 0.1;
}

/**
 * Last-resort fallback: extract readable ASCII + UTF-16LE strings
 * from binary content so at least permissions can be found.
 */
function extractReadableStrings(uint8array) {
    const results = [];
    let ascii = '';
    let i = 0;

    while (i < uint8array.length) {
        const byte = uint8array[i];

        // Try to detect UTF-16LE sequences (common in AXML string pools)
        // Two-byte pattern: valid ASCII char followed by 0x00
        if (
            byte >= 32 && byte <= 126 &&
            i + 1 < uint8array.length &&
            uint8array[i + 1] === 0
        ) {
            ascii += String.fromCharCode(byte);
            i += 2;
            continue;
        }

        // Plain ASCII
        if (byte >= 32 && byte <= 126) {
            ascii += String.fromCharCode(byte);
            i++;
            continue;
        }

        // Non-printable — flush collected string
        if (ascii.length >= 4) results.push(ascii);
        ascii = '';
        i++;
    }
    if (ascii.length >= 4) results.push(ascii);

    return results.join('\n');
}
