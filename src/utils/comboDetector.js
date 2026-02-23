import SUSPICIOUS_COMBOS from '../data/suspiciousCombos.js';

export function detectSuspiciousCombos(permissions) {
    const permSet = new Set(permissions);
    const detected = [];

    SUSPICIOUS_COMBOS.forEach(rule => {
        const allPresent = rule.combo.every(perm => permSet.has(perm));
        if (allPresent) {
            detected.push({ ...rule, matched: rule.combo.filter(p => permSet.has(p)) });
        }
    });

    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    detected.sort((a, b) => (severityOrder[a.risk] || 99) - (severityOrder[b.risk] || 99));

    return detected;
}
