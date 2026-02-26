import { describe, it, expect } from 'vitest';
import { parseDex, scanForRiskPatterns } from '../dexScanner.js';

// Helper to create a fake DEX header for tests
function createFakeDex(magicNum, options = {}) {
    // 112 bytes for header
    const buffer = new ArrayBuffer(128 + (options.extraBytes || 0));
    const dv = new DataView(buffer);

    // Write Magic
    dv.setUint32(0, magicNum, true); // 0x0a786564 equals 'dex\n' in little-endian
    // Write Endian Tag
    dv.setUint32(0x28, 0x12345678, true); // Little endian tag

    // Normally we'd need to mock out strings and types properly,
    // but building an entire valid binary DEX manually is complex.
    // Our parseDex won't crash on zeroed offsets (it just exits the loops safely).
    return buffer;
}

// Full mock DEX is hard to construct manually as binary array. 
// We will test `scanForRiskPatterns` directly which is the core intelligence logic.

describe('DEX Scanner Intelligence (scanForRiskPatterns)', () => {

    it('Test Case 1: Base case (No findings)', () => {
        const parsed = {
            strings: ['Ljava/lang/Object;', 'hello_world'],
            methods: ['Ljava/lang/Object;-><init>'],
            fields: [],
            classNames: ['LMainActivity;']
        };

        const result = scanForRiskPatterns(parsed);
        expect(result.scoreContribution).toBe(0);
        expect(result.riskIndicators.length).toBe(0);
        expect(result.riskyMethods.length).toBe(0);
        expect(result.suspiciousStrings.length).toBe(0);
    });

    it('Test Case 2: Known risky patterns (Dynamic Loading, Reflection, Exec)', () => {
        const parsed = {
            strings: ['dalvik/system/DexClassLoader'],
            methods: [
                'Ldalvik/system/DexClassLoader;-><init>',
                'Ljava/lang/reflect/Method;->invoke',
                'Ljava/lang/Runtime;->exec'
            ],
            fields: [],
            classNames: []
        };

        const result = scanForRiskPatterns(parsed);

        // 25 (Dynamic Loader) + 15 (Reflection) + 25 (Runtime Exec) = 65
        expect(result.scoreContribution).toBe(65);
        expect(result.riskIndicators.length).toBe(3);

        const reasons = result.riskIndicators.map(i => i.reason);
        expect(reasons.some(r => r.includes('Dynamic Code Loading'))).toBe(true);
        expect(reasons.some(r => r.includes('Reflection API'))).toBe(true);
        expect(reasons.some(r => r.includes('shell commands'))).toBe(true);
    });

    it('Test Case 3: Sensitive APIs & WebView', () => {
        const parsed = {
            strings: [],
            methods: [
                'Landroid/webkit/WebView;->addJavascriptInterface',
                'Landroid/media/AudioRecord;->startRecording'
            ],
            fields: [],
            classNames: []
        };

        const result = scanForRiskPatterns(parsed);

        // 20 (WebView interface) + 20 (Sensitive APIs) = 40
        expect(result.scoreContribution).toBe(40);
        expect(result.riskIndicators.some(i => i.type === 'high')).toBe(true);
        expect(result.riskyMethods.includes('Landroid/webkit/WebView;->addJavascriptInterface')).toBe(true);
    });

    it('Test Case 4: Base64 / IP encodings', () => {
        const parsed = {
            strings: ['192.168.1.100', 'just_a_normal_string'],
            methods: [],
            fields: [],
            classNames: []
        };

        const result = scanForRiskPatterns(parsed);

        // 10 for IP address
        expect(result.scoreContribution).toBe(10);
        expect(result.suspiciousStrings).toContain('192.168.1.100');
    });

});

describe('DEX Parser Basic Binary Handlers (parseDex)', () => {

    it('Should reject empty buffer safely', () => {
        const result = parseDex(null);
        expect(result.error).toBe('Empty buffer');
    });

    it('Should reject invalid magic number gracefully (Malformed/Corrupted)', () => {
        // e.g. a zip file instead of dex
        const invalidBuffer = createFakeDex(0x504B0304);
        const result = parseDex(invalidBuffer);
        expect(result.error).toBe('Invalid DEX magic');
        expect(result.strings.length).toBe(0);
    });

    it('Should accept valid magic number and parse without crashing (Basic valid DEX)', () => {
        // 'dex\n' = 100, 101, 120, 10
        const validBuffer = createFakeDex(0x0a786564); // "dex\n"
        const result = parseDex(validBuffer);

        // Because sizes/offsets are zeroed, it just safely exits and returns empty arrays
        expect(result.error).toBeUndefined();
        expect(Array.isArray(result.strings)).toBe(true);
        expect(Array.isArray(result.methods)).toBe(true);
    });

});
