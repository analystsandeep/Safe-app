import React, { useState } from 'react';
import { Card } from '../common/Card.jsx';
import { GaugeCircle } from '../common/GaugeCircle.jsx';
import { RiskBadge } from '../common/Badge.jsx';
import {
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineExclamationCircle,
    HiOutlineBellAlert,
    HiOutlineFire,
    HiOutlineAdjustmentsHorizontal
} from 'react-icons/hi2';
import '../common/icon-box.css';
import { AppIcons, PermissionIcons } from '../common/icons.jsx';
import './RiskScore.css';

const RISK_COLORS = {
    critical: '#ff2d55',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
    unknown: '#71717a'
};

const GRADE_ICONS = {
    'A': AppIcons.Shield,
    'B': AppIcons.Success,
    'C': AppIcons.Warning,
    'D': AppIcons.Info,
    'F': AppIcons.Critical,
};

const GRADE_EXPLANATIONS = {
    A: { text: 'Minimal risk. App requests only necessary permissions with no dangerous combinations.', color: '#22c55e' },
    B: { text: 'Low risk. A few elevated permissions but no critical threat combinations detected.', color: '#84cc16' },
    C: { text: 'Moderate risk. Several medium-risk permissions present. Review before installing.', color: '#f59e0b' },
    D: { text: 'High risk. Multiple dangerous permissions and/or suspicious combinations detected.', color: '#ef4444' },
    F: { text: 'Critical risk. This app requests highly sensitive permission combos that may enable surveillance, data theft, or device control.', color: '#ff2d55' },
};

function getTopDrivers(breakdown, permissions) {
    if (!permissions || permissions.length === 0) return [];
    const sorted = [...permissions].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    const high = sorted.filter(p => p.risk === 'high' || p.risk === 'critical');
    return high.slice(0, 3).map(p => {
        const key = p.name.split('.').pop();
        return {
            name: p.shortName || key,
            Icon: PermissionIcons[key] || PermissionIcons.DEFAULT,
            risk: p.risk,
            confidence: p.confidence || 0.9
        };
    });
}

export function RiskScore({ data, totalPermissions, permissions, onOpenCustomization }) {
    const { normalizedScore, grade, label, color, breakdown, explanation, dexScore, simulationScore, mlScore, mlConfidence } = data;
    const [showGradeExplain, setShowGradeExplain] = useState(false);
    const gradeInfo = GRADE_EXPLANATIONS[grade] || GRADE_EXPLANATIONS['F'];
    const topDrivers = getTopDrivers(breakdown, permissions || []);

    const stats = [
        { key: 'high', label: 'High Risk', color: '#ef4444', count: breakdown.high },
        { key: 'medium', label: 'Medium', color: '#f59e0b', count: breakdown.medium },
        { key: 'low', label: 'Low Risk', color: '#22c55e', count: breakdown.low },
        { key: 'unknown', label: 'Unknown', color: '#71717a', count: breakdown.unknown },
    ];

    return (
        <Card icon={AppIcons.Risk} title="Privacy Risk Score">
            <div className="risk-layout">
                <div className="risk-gauge-area">
                    <GaugeCircle value={normalizedScore} color={color} size={180} strokeWidth={14} />
                    <div className="grade-badge" style={{ background: color }}>
                        <div className="grade-icon-wrap">
                            {React.createElement(GRADE_ICONS[grade] || AppIcons.Warning, { className: "grade-premium-icon" })}
                        </div>
                        <div className="grade-text">
                            <span className="grade-letter">{grade}</span>
                            <span className="grade-label">{label}</span>
                        </div>
                    </div>
                </div>
                <div className="risk-stats-area">
                    <div className="risk-header-actions">
                        <div className="risk-total">
                            <span className="stat-number">{totalPermissions}</span>
                            <span className="stat-label">Total Permissions</span>
                        </div>
                    </div>

                    <div className="risk-breakdown">
                        {stats.map(s => (
                            <div className="breakdown-row" key={s.key}>
                                <div className="breakdown-dot" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                                <span className="breakdown-name">{s.label}</span>
                                <span className="breakdown-count" style={{ color: s.color }}>{s.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Advanced Scoring Insights */}
                    <div className="advanced-scores">
                        {dexScore > 0 && <div className="adv-score-item">DEX Findings: <span className="red">+{dexScore}</span></div>}
                        {simulationScore > 0 && <div className="adv-score-item">Simulated Risks: <span className="orange">+{simulationScore}</span></div>}
                        {mlScore !== 0 && (
                            <div className="adv-score-item ml-insight">
                                AI Adjustment: <span className={mlScore > 0 ? 'red' : 'green'}>{mlScore > 0 ? `+${mlScore}` : mlScore}</span>
                                <div className="ml-confidence-bar">
                                    <div className="ml-conf-fill" style={{ width: `${mlConfidence * 100}%` }}></div>
                                    <span className="ml-conf-text">AI Confidence: {(mlConfidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="risk-score-footer">
                <button
                    className="grade-explain-btn"
                    onClick={() => setShowGradeExplain(v => !v)}
                >
                    {showGradeExplain ? '▲ Hide Grade Breakdown' : '▼ What does this grade mean?'}
                </button>
            </div>

            {/* Grade Explanation Panel */}
            {showGradeExplain && (
                <div className="grade-explanation-panel" style={{ borderLeft: `3px solid ${gradeInfo.color}` }}>
                    <div className="gep-header">
                        <span className="gep-grade-chip" style={{ color: gradeInfo.color, borderColor: `${gradeInfo.color}40`, background: `${gradeInfo.color}10` }}>Grade {grade}</span>
                        <span className="gep-title">Security Intelligence Report</span>
                    </div>
                    <p className="gep-text">{gradeInfo.text}</p>
                    <div className="gep-scale">
                        {Object.entries(GRADE_EXPLANATIONS).map(([g, info]) => (
                            <div key={g} className={`gep-grade-dot ${g === grade ? 'active' : ''}`} style={{ background: info.color }} title={`Grade ${g}`}>
                                <span>{g}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="risk-explanation" style={{ borderLeft: `3px solid ${color}` }}>
                <p>{explanation}</p>
            </div>

            {/* Top Risk Drivers */}
            {topDrivers.length > 0 && (
                <div className="risk-drivers">
                    <span className="risk-drivers-label">
                        <HiOutlineFire className="risk-fire-icon" /> Top Risk Drivers
                    </span>
                    <div className="risk-drivers-list">
                        {topDrivers.map((d, i) => (
                            <div key={i} className="driver-chip">
                                <span className="driver-icon"><d.Icon size={14} color={RISK_COLORS[d.risk] || '#ef4444'} /></span>
                                <span className="driver-name">{d.name}</span>
                                <div className="driver-confidence">
                                    <div className="conf-dot" style={{ background: d.confidence > 0.8 ? '#22c55e' : '#f59e0b' }}></div>
                                    {(d.confidence * 100).toFixed(0)}%
                                </div>
                                <RiskBadge risk={d.risk} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
