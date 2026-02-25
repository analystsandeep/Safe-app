import rules from '../data/simulationRules.json';

/**
 * Simulates potential application behaviors based on manifest and DEX data.
 */
export function simulateBehaviors(analysisData) {
    const { permissions, dexAnalysis, manifestAnalysis } = analysisData;
    const warnings = [];

    // Helper to check if a permission exists (case-insensitive and partial match)
    const hasPermission = (perm) => permissions.some(p => p.name.includes(perm));

    rules.forEach(rule => {
        let triggered = false;
        const cond = rule.condition;

        // Check permissions
        if (cond.permissions) {
            triggered = cond.permissions.some(p => hasPermission(p));
        }

        // Check DEX patterns
        if (cond.dexPatterns && dexAnalysis) {
            triggered = cond.dexPatterns.some(pattern => dexAnalysis[pattern] && dexAnalysis[pattern].length > 0);
        }

        // Check for specific components (e.g. BOOT_COMPLETED in manifest)
        if (cond.components && manifestAnalysis) {
            // Simplified check: if BOOT_COMPLETED is in the manifest text
            if (cond.components.includes('BOOT_COMPLETED')) {
                if (analysisData.rawManifest.includes('RECEIVE_BOOT_COMPLETED') || analysisData.rawManifest.includes('BOOT_COMPLETED')) {
                    triggered = true;
                }
            }
        }

        if (triggered) {
            warnings.push({
                id: rule.id,
                description: rule.description,
                points: rule.points
            });
        }
    });

    return warnings;
}
