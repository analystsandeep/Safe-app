import PERMISSION_DATABASE from '../data/permissionDatabase.js';

const WEIGHTS = { high: 20, medium: 10, low: 2, unknown: 5 };
const DEFAULT_WEIGHTS = { high: 20, medium: 10, low: 2, unknown: 5 };

const GRADES = [
    { max: 29, grade: 'A', label: 'Low Risk', color: '#27ae60' },
    { max: 49, grade: 'B', label: 'Moderate', color: '#f1c40f' },
    { max: 69, grade: 'C', label: 'Elevated', color: '#e67e22' },
    { max: 84, grade: 'D', label: 'High', color: '#e74c3c' },
    { max: 100, grade: 'F', label: 'Critical', color: '#c0392b' }
];

export function calculateRiskScore(permissions, dexAnalysis = null, simulations = [], mlResult = null, customWeights = null) {
    const weights = customWeights || DEFAULT_WEIGHTS;
    const breakdown = { high: 0, medium: 0, low: 0, unknown: 0 };

    permissions.forEach(perm => {
        const entry = PERMISSION_DATABASE[perm];
        if (entry) {
            breakdown[entry.risk] = (breakdown[entry.risk] || 0) + 1;
        } else {
            breakdown.unknown += 1;
        }
    });

    let rawScore =
        (breakdown.high * weights.high) +
        (breakdown.medium * weights.medium) +
        (breakdown.low * weights.low) +
        (breakdown.unknown * weights.unknown);

    // ── Code-level (DEX) scoring ────────────────────────────────────
    let dexScore = 0;
    if (dexAnalysis) {
        dexScore += (dexAnalysis.runtimePerms?.length || 0) * 15;
        dexScore += (dexAnalysis.dynamicLoads?.length || 0) * 20;
        dexScore += (dexAnalysis.dataSinks?.length || 0) * 10;
        dexScore += (dexAnalysis.suspiciousStrings?.length || 0) * 5;
    }

    // ── Simulation scoring ──────────────────────────────────────────
    let simulationScore = 0;
    if (simulations && simulations.length > 0) {
        simulationScore = simulations.reduce((sum, s) => sum + (s.points || 0), 0);
    }

    rawScore += dexScore + simulationScore;

    let mlAdjustment = 0;
    let mlConfidence = 0;
    if (mlResult) {
        mlAdjustment = mlResult.adjustedScore;
        mlConfidence = mlResult.confidence;
    }

    // ── Normalization and ML Blending ──────────────────────────────

    // Instead of a hard cap at 100, we use a logistic-like dampening function
    // This ensures that scores differentiate even for very risky apps
    // ruleScore = 100 * (1 - e^(-rawScore / 80))
    const ruleScore = Math.round(100 * (1 - Math.exp(-rawScore / 100)));

    const finalScore = mlResult
        ? Math.round(0.6 * ruleScore + 0.4 * mlAdjustment)
        : ruleScore;

    const normalizedScore = Math.min(100, Math.max(0, finalScore));

    let gradeInfo = GRADES[GRADES.length - 1];
    for (const g of GRADES) {
        if (normalizedScore <= g.max) { gradeInfo = g; break; }
    }

    let explanation = '';
    if (normalizedScore <= 29) explanation = 'This app requests minimal permissions with low privacy impact.';
    else if (normalizedScore <= 49) explanation = 'This app requests some permissions that could affect privacy. Review the details below.';
    else if (normalizedScore <= 69) explanation = 'This app requests several sensitive permissions. Consider whether all are necessary.';
    else if (normalizedScore <= 84) explanation = 'This app requests multiple high-risk permissions that significantly impact user privacy.';
    else explanation = 'This app requests an alarming number of sensitive permissions. Extreme caution is advised.';

    return {
        score: rawScore,
        normalizedScore,
        grade: gradeInfo.grade,
        label: gradeInfo.label,
        color: gradeInfo.color,
        breakdown,
        explanation,
        dexScore,
        simulationScore,
        mlScore: mlAdjustment,
        mlConfidence: mlConfidence
    };
}
