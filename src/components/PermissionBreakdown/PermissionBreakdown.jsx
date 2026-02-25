import React, { useState, useMemo } from 'react';
import { RiskBadge } from '../common/Badge.jsx';
import './PermissionBreakdown.css';

import { AppIcons } from '../common/icons.jsx';

const RISK_BORDER = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e', unknown: '#52525b', critical: '#ff2d55' };
const RISK_ORDER = { critical: 0, high: 1, medium: 2, low: 3, unknown: 4 };

const RISK_GROUPS = [
    { key: 'critical', label: 'Critical', Icon: AppIcons.Critical, color: '#ff2d55' },
    { key: 'high', label: 'High Risk', Icon: AppIcons.Risk, color: '#ef4444' },
    { key: 'medium', label: 'Medium Risk', Icon: AppIcons.Warning, color: '#f59e0b' },
    { key: 'low', label: 'Low Risk', Icon: AppIcons.Shield, color: '#22c55e' },
    { key: 'unknown', label: 'Unknown', Icon: AppIcons.Info, color: '#52525b' },
];

// Build plain-English AI summary from top permission categories
function buildIntelligenceSummary(permissions) {
    if (!permissions || permissions.length === 0) return null;
    const highRisk = permissions.filter(p => p.risk === 'high' || p.risk === 'critical');
    if (highRisk.length === 0) return null;

    const names = highRisk.slice(0, 5).map(p => {
        const key = p.name.split('.').pop();
        const labels = {
            CAMERA: 'camera', RECORD_AUDIO: 'microphone', ACCESS_FINE_LOCATION: 'precise location',
            ACCESS_COARSE_LOCATION: 'location', READ_CONTACTS: 'contacts', READ_EXTERNAL_STORAGE: 'storage',
            WRITE_EXTERNAL_STORAGE: 'storage access', INTERNET: 'internet', RECEIVE_SMS: 'SMS messages',
            READ_CALL_LOG: 'call logs', SYSTEM_ALERT_WINDOW: 'screen overlay', PROCESS_OUTGOING_CALLS: 'outgoing calls',
        };
        return labels[key] || p.shortName || key.toLowerCase();
    });
    const unique = [...new Set(names)];

    const hasInternet = permissions.some(p => p.name.includes('INTERNET'));
    const hasComboDanger = (unique.includes('camera') || unique.includes('microphone')) && hasInternet;

    let summary = `This app requests access to ${unique.slice(0, 3).join(', ')}`;
    if (unique.length > 3) summary += ` and ${unique.length - 3} more sensitive resource${unique.length - 3 > 1 ? 's' : ''}`;
    summary += '.';
    if (hasComboDanger) summary += ' Combined with internet access, this may allow remote data collection or exfiltration.';

    return summary;
}

export function PermissionBreakdown({ permissions }) {
    const [collapsed, setCollapsed] = useState({ low: true, unknown: true });

    const grouped = useMemo(() => {
        const groups = {};
        for (const g of RISK_GROUPS) groups[g.key] = [];
        for (const p of permissions) {
            const key = p.risk in groups ? p.risk : 'unknown';
            groups[key].push(p);
        }
        return groups;
    }, [permissions]);

    const intelligenceSummary = useMemo(() => buildIntelligenceSummary(permissions), [permissions]);

    const toggleGroup = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

    if (permissions.length === 0) {
        return (
            <div className="perm-empty">
                <AppIcons.Search className="perm-empty-icon" size={24} />
                <p>No permissions match your current filters.</p>
            </div>
        );
    }

    return (
        <div className="permission-section">
            <h2 className="section-title"><AppIcons.Search size={22} style={{ marginRight: '8px' }} /> Permission Breakdown</h2>

            {/* AI Intelligence Summary */}
            {intelligenceSummary && (
                <div className="perm-intelligence-banner">
                    <span className="pib-icon"><AppIcons.Brain size={24} /></span>
                    <div>
                        <span className="pib-label">Intelligence Summary</span>
                        <p className="pib-text">{intelligenceSummary}</p>
                    </div>
                </div>
            )}

            {/* Grouped collapsible sections */}
            {RISK_GROUPS.map(group => {
                const perms = grouped[group.key];
                if (perms.length === 0) return null;
                const isCollapsed = collapsed[group.key];

                return (
                    <div key={group.key} className="perm-group">
                        <button
                            className="perm-group-header"
                            onClick={() => toggleGroup(group.key)}
                            aria-expanded={!isCollapsed}
                        >
                            <span className="pgh-icon"><group.Icon size={18} color={group.color} /></span>
                            <span className="pgh-label" style={{ color: group.color }}>{group.label}</span>
                            <span className="pgh-count" style={{ background: `${group.color}18`, color: group.color }}>{perms.length}</span>
                            <span className="pgh-toggle">{isCollapsed ? '▼' : '▲'}</span>
                        </button>

                        {!isCollapsed && (
                            <div className="perm-grid">
                                {perms.map(perm => (
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
                        )}
                    </div>
                );
            })}
        </div>
    );
}
