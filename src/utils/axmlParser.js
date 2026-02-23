/**
 * Android Binary XML (AXML) Parser
 *
 * Parses the compiled AndroidManifest.xml (binary format) from an APK
 * and converts it back to a text representation that our regex-based
 * analyzers can understand.
 *
 * Binary XML chunk types:
 *   0x0003 - String pool
 *   0x0100 - Start namespace
 *   0x0101 - End namespace
 *   0x0102 - Start element (tag open)
 *   0x0103 - End element (tag close)
 *   0x0180 - Resource map
 */

const CHUNK_STRING_POOL = 0x0001;
const CHUNK_START_TAG = 0x0102;
const CHUNK_END_TAG = 0x0103;
const CHUNK_RESOURCE_MAP = 0x0180;

// Android attribute resource IDs we care about
const KNOWN_ATTRS = {
    0x0101021b: 'name',          // android:name
    0x0101021c: 'package',       // android:package (rare)
    0x01010001: 'label',         // android:label
    0x01010003: 'debuggable',    // android:debuggable
    0x01010004: 'exported',      // android:exported
    0x01010005: 'permission',    // android:permission
    0x0101001a: 'allowBackup',   // android:allowBackup
    0x0101020c: 'versionCode',   // android:versionCode
    0x0101021f: 'versionName',   // android:versionName
    0x0101020b: 'minSdkVersion', // android:minSdkVersion
    0x01010270: 'targetSdkVersion', // android:targetSdkVersion
    0x0101027f: 'authorities',   // android:authorities
    0x01010023: 'scheme',        // android:scheme
    0x0101028c: 'networkSecurityConfig',
    0x01010280: 'usesCleartextTraffic',
    0x0101048d: 'requestLegacyExternalStorage',
};

function readUint32LE(buf, offset) {
    return (buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16) | (buf[offset + 3] << 24)) >>> 0;
}
function readUint16LE(buf, offset) {
    return (buf[offset] | (buf[offset + 1] << 8)) >>> 0;
}

/**
 * Parse the string pool chunk.
 * Returns an array of strings indexed by their pool position.
 */
function parseStringPool(buf, offset) {
    // chunk header: type(2) size(2) chunkSize(4) stringCount(4) styleCount(4) flags(4) stringsStart(4) stylesStart(4)
    const chunkSize = readUint32LE(buf, offset + 4);
    const stringCount = readUint32LE(buf, offset + 8);
    const flags = readUint32LE(buf, offset + 16);
    const stringsStart = readUint32LE(buf, offset + 20);
    const isUtf8 = !!(flags & (1 << 8));

    const offsets = [];
    for (let i = 0; i < stringCount; i++) {
        offsets.push(readUint32LE(buf, offset + 28 + i * 4));
    }

    const strBase = offset + stringsStart;
    const strings = [];

    for (let i = 0; i < stringCount; i++) {
        const strOffset = strBase + offsets[i];
        try {
            if (isUtf8) {
                // Encoded length (skip 1-2 bytes for char length)
                let pos = strOffset;
                // Skip UTF-16 char count
                if (buf[pos] & 0x80) pos += 2; else pos += 1;
                // Read UTF-8 byte count
                let byteLen;
                if (buf[pos] & 0x80) {
                    byteLen = ((buf[pos] & 0x7f) << 8) | buf[pos + 1];
                    pos += 2;
                } else {
                    byteLen = buf[pos];
                    pos += 1;
                }
                let str = '';
                for (let j = 0; j < byteLen; j++) {
                    str += String.fromCharCode(buf[pos + j]);
                }
                strings.push(str);
            } else {
                // UTF-16LE: 2-byte length header
                let pos = strOffset;
                let charLen = readUint16LE(buf, pos);
                if (charLen & 0x8000) {
                    charLen = ((charLen & 0x7fff) << 16) | readUint16LE(buf, pos + 2);
                    pos += 4;
                } else {
                    pos += 2;
                }
                let str = '';
                for (let j = 0; j < charLen; j++) {
                    str += String.fromCharCode(readUint16LE(buf, pos + j * 2));
                }
                strings.push(str);
            }
        } catch {
            strings.push('');
        }
    }

    return strings;
}

/**
 * Convert AXML attribute value to string.
 * type: 0x10=int, 0x12=bool, 0x03=string, 0x04=float, 0x01=ref
 */
function attrValueToString(type, data, strPool) {
    if (type === 0x03) return strPool[data] ?? '';          // string
    if (type === 0x12) return data !== 0 ? 'true' : 'false'; // bool
    if (type === 0x10) return String(data);                 // int dec
    if (type === 0x11) return `0x${data.toString(16)}`;    // int hex
    if (type === 0x04) {
        const view = new DataView(new Uint8Array([
            data & 0xff, (data >> 8) & 0xff, (data >> 16) & 0xff, (data >> 24) & 0xff
        ]).buffer);
        return String(view.getFloat32(0, true));             // float
    }
    if (type === 0x01) return `@0x${data.toString(16)}`;   // reference
    return String(data);
}

/**
 * Main parser: converts AXML uint8array → XML-like text string.
 */
export function parseAxml(uint8array) {
    const buf = uint8array;
    const len = buf.length;

    // Verify AXML magic
    if (len < 8) return null;
    const magic = readUint16LE(buf, 0);
    if (magic !== 0x0003 && magic !== 0x0002) {
        // Not binary XML — might already be text
        return null;
    }

    let strings = [];
    let resourceMap = [];
    const lines = [];
    const tagStack = [];
    let indent = 0;

    let pos = 0;

    while (pos < len - 4) {
        const chunkType = readUint16LE(buf, pos);
        const chunkHeaderSize = readUint16LE(buf, pos + 2);
        const chunkSize = readUint32LE(buf, pos + 4);
        if (chunkSize === 0 || pos + chunkSize > len) break;

        if (chunkType === CHUNK_STRING_POOL || chunkType === 0x0001) {
            strings = parseStringPool(buf, pos);

        } else if (chunkType === CHUNK_RESOURCE_MAP) {
            const count = (chunkSize - 8) / 4;
            resourceMap = [];
            for (let i = 0; i < count; i++) {
                resourceMap.push(readUint32LE(buf, pos + 8 + i * 4));
            }

        } else if (chunkType === CHUNK_START_TAG) {
            // line(4) comment(4) ns(4) name(4) attrStart(2) attrSize(2) attrCount(2) idIdx(2) classIdx(2) styleIdx(2)
            const nameIdx = readUint32LE(buf, pos + 20);
            const attrStart = readUint16LE(buf, pos + 24);
            const attrSize = readUint16LE(buf, pos + 26);
            const attrCount = readUint16LE(buf, pos + 28);
            const tagName = strings[nameIdx] ?? `tag${nameIdx}`;

            const ind = '  '.repeat(indent);
            let attrStr = '';

            // ResXMLTree_node = 16 bytes (chunk header 8 + lineNumber 4 + comment 4)
            // ResXMLTree_attrExt starts at pos+16; attrStart is offset from that struct
            // So attributes begin at: pos + 16 + attrStart
            const attrBase = pos + 16 + attrStart;
            for (let i = 0; i < attrCount; i++) {
                const aBase = attrBase + i * attrSize;
                if (aBase + attrSize > len) break;

                const nsIdx = readUint32LE(buf, aBase);
                const nameIdx2 = readUint32LE(buf, aBase + 4);
                const rawVal = readUint32LE(buf, aBase + 8);    // raw value string index
                const valType = buf[aBase + 15];                  // value type byte
                const data = readUint32LE(buf, aBase + 16);   // typed value data

                // Resolve attribute name
                let attrName = strings[nameIdx2] ?? `attr${nameIdx2}`;
                // Check resource map for well-known attribute IDs
                if (!attrName && nameIdx2 < resourceMap.length) {
                    attrName = KNOWN_ATTRS[resourceMap[nameIdx2]] ?? `attr${nameIdx2}`;
                }
                if (KNOWN_ATTRS[resourceMap?.[nameIdx2]]) {
                    attrName = KNOWN_ATTRS[resourceMap[nameIdx2]];
                }

                // Resolve value
                let attrVal;
                if (rawVal !== 0xffffffff && rawVal < strings.length && valType === 0x03) {
                    attrVal = strings[rawVal];
                } else {
                    attrVal = attrValueToString(valType, data, strings);
                }

                const ns = nsIdx < strings.length && strings[nsIdx] === 'http://schemas.android.com/apk/res/android'
                    ? 'android' : (strings[nsIdx] ? strings[nsIdx].split('/').pop() : '');
                const prefix = ns ? `${ns}:` : '';
                attrStr += ` ${prefix}${attrName}="${attrVal}"`;
            }

            lines.push(`${ind}<${tagName}${attrStr}>`);
            tagStack.push(tagName);
            indent++;

        } else if (chunkType === CHUNK_END_TAG) {
            indent = Math.max(0, indent - 1);
            const tag = tagStack.pop() ?? 'unknown';
            lines.push(`${'  '.repeat(indent)}</${tag}>`);
        }

        pos += chunkSize;
    }

    return lines.join('\n');
}
