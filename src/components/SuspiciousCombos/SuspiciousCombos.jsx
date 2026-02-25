import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { AppIcons } from '../common/icons.jsx';
import './SuspiciousCombos.css';

const RISK_COLORS = { critical: '#ff2d55', high: '#ef4444' };

export function SuspiciousCombos({ combos }) {
    if (combos.length === 0) {
        return (
            <Card icon={AppIcons.Warning} title="Suspicious Permission Combinations">
                <div className="combo-clean">
                    <HiOutlineCheckCircle className="combo-clean-icon" />
                    <p>No high-risk permission combinations detected.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card icon={AppIcons.Warning} title="Suspicious Permission Combinations" className="combo-card-alert">
            {/* Threat detected header banner */}
            <div className="combo-threat-banner">
                <HiOutlineExclamationTriangle className="combo-threat-icon-premium" />
                <div>
                    <div className="combo-threat-title">THREAT COMBINATIONS DETECTED</div>
                    <div className="combo-threat-sub">
                        {combos.length} dangerous permission combination{combos.length > 1 ? 's' : ''} found — this app may exploit these together for malicious purposes.
                    </div>
                </div>
                <span className="combo-threat-count">{combos.length}</span>
            </div>

            <div className="combo-list">
                {combos.map(combo => {
                    const riskColor = RISK_COLORS[combo.risk] || '#ef4444';
                    return (
                        <div
                            key={combo.id}
                            className="combo-item"
                            style={{ borderLeft: `4px solid ${riskColor}`, '--combo-glow': riskColor }}
                        >
                            <div className="combo-header">
                                <span className="combo-title">{combo.title}</span>
                                <Badge text={combo.risk} color={riskColor} textColor="white" />
                            </div>
                            <p className="combo-reason">{combo.reason}</p>
                            <div className="combo-perms">
                                {combo.combo.map(p => (
                                    <span key={p} className="combo-perm-pill">{p.split('.').pop()}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
