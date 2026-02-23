import React from 'react';
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
                    <span className="combo-clean-check">✓</span>
                    <p>No high-risk permission combinations detected.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card icon={AppIcons.Warning} title="Suspicious Permission Combinations">
            <div className="combo-list">
                {combos.map(combo => (
                    <div key={combo.id} className="combo-item" style={{ borderLeft: `3px solid ${RISK_COLORS[combo.risk] || '#ef4444'}` }}>
                        <div className="combo-header">
                            <span className="combo-title">{combo.title}</span>
                            <Badge text={combo.risk} color={RISK_COLORS[combo.risk] || '#ef4444'} textColor="white" />
                        </div>
                        <p className="combo-reason">{combo.reason}</p>
                        <div className="combo-perms">
                            {combo.combo.map(p => (
                                <span key={p} className="combo-perm-pill">{p.split('.').pop()}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
