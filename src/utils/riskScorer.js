import PERMISSION_DATABASE from '../data/permissionDatabase.js';

const WEIGHTS = { high: 20, medium: 10, low: 2, unknown: 5 };

const GRADES = [
    { max: 29, grade: 'A', label: 'Low Risk', color: '#27ae60' },
    { max: 49, grade: 'B', label: 'Moderate', color: '#f1c40f' },
    { max: 69, grade: 'C', label: 'Elevated', color: '#e67e22' },
    { max: 84, grade: 'D', label: 'High', color: '#e74c3c' },
    { max: 100, grade: 'F', label: 'Critical', color: '#c0392b' }
];

export function calculateRiskScore(permissions) {
    const breakdown = { high: 0, medium: 0, low: 0, unknown: 0 };

    permissions.forEach(perm => {
        const entry = PERMISSION_DATABASE[perm];
        if (entry) {
            breakdown[entry.risk] = (breakdown[entry.risk] || 0) + 1;
        } else {
            breakdown.unknown += 1;
        }
    });

    const rawScore =
        (breakdown.high * WEIGHTS.high) +
        (breakdown.medium * WEIGHTS.medium) +
        (breakdown.low * WEIGHTS.low) +
        (breakdown.unknown * WEIGHTS.unknown);

    const normalizedScore = Math.min(100, rawScore);

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

    return { score: rawScore, normalizedScore, grade: gradeInfo.grade, label: gradeInfo.label, color: gradeInfo.color, breakdown, explanation };
}
