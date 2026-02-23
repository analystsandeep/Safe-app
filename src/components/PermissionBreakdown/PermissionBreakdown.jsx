import React from 'react';
import { RiskBadge } from '../common/Badge.jsx';
import './PermissionBreakdown.css';

const RISK_BORDER = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e', unknown: '#52525b', critical: '#ff2d55' };

export function PermissionBreakdown({ permissions }) {
    if (permissions.length === 0) {
        return (
            <div className="perm-empty">
                <span>🔍</span>
                <p>No permissions match your current filters.</p>
            </div>
        );
    }

    return (
        <div className="permission-section">
            <h2 className="section-title">🔍 Permission Breakdown</h2>
            <div className="perm-grid">
                {permissions.map(perm => (
                    <div
                        key={perm.name}
                        className="perm-card"
                        style={{ borderLeft: `3px solid ${RISK_BORDER[perm.risk] || '#52525b'}` }}
                    >
                        <div className="perm-header">
                            <div className="perm-title-group">
                                <span className="perm-short" title={perm.shortName}>{perm.shortName}</span>
                                <span className="perm-full" title={perm.name}>{perm.name}</span>
                            </div>
                            <div className="perm-badges">
                                <RiskBadge risk={perm.risk} />
                            </div>
                        </div>
                        <p className="perm-desc">{perm.description}</p>
                        <span className="perm-cat-chip">{perm.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
