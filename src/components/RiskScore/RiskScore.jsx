import React from 'react';
import { Card } from '../common/Card.jsx';
import { GaugeCircle } from '../common/GaugeCircle.jsx';
import { RiskBadge } from '../common/Badge.jsx';
import { AppIcons } from '../common/icons.jsx';
import '../common/icon-box.css';
import './RiskScore.css';

export function RiskScore({ data, totalPermissions }) {
    const { normalizedScore, grade, label, color, breakdown, explanation } = data;

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
                        <span className="grade-letter">{grade}</span>
                        <span className="grade-label">{label}</span>
                    </div>
                </div>
                <div className="risk-stats-area">
                    <div className="risk-total">
                        <span className="stat-number">{totalPermissions}</span>
                        <span className="stat-label">Total Permissions</span>
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
                </div>
            </div>
            <div className="risk-explanation" style={{ borderLeft: `3px solid ${color}` }}>
                <p>{explanation}</p>
            </div>
        </Card>
    );
}
