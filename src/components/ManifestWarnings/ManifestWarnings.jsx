import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import './ManifestWarnings.css';

const SEVERITY_CONFIG = {
    critical: { color: '#ff2d55', bg: 'rgba(255,45,85,0.07)' },
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.07)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)' },
};

export function ManifestWarnings({ analysis }) {
    const { minSdkVersion, targetSdkVersion, isDebuggable, allowsBackup, warnings } = analysis;
    const infoBoxes = [
        { label: 'Min SDK', value: minSdkVersion ?? '—', cls: '' },
        { label: 'Target SDK', value: targetSdkVersion ?? '—', cls: '' },
        { label: 'Debuggable', value: isDebuggable ? 'Yes' : 'No', cls: isDebuggable ? 'danger' : 'safe' },
        { label: 'Allow Backup', value: allowsBackup ? 'Yes' : 'No', cls: allowsBackup ? 'warn' : 'safe' },
    ];

    return (
        <Card icon={AppIcons.Manifest} title="Manifest Security Analysis">
            <div className="manifest-info-grid">
                {infoBoxes.map(b => (
                    <div className="manifest-info-box" key={b.label}>
                        <span className="mib-label">{b.label}</span>
                        <span className={`mib-value ${b.cls}`}>{b.value}</span>
                    </div>
                ))}
            </div>
            {warnings.length === 0 ? (
                <div className="manifest-clean">No manifest security issues detected.</div>
            ) : (
                <div className="manifest-warnings-list">
                    {warnings.map((w, i) => {
                        const cfg = SEVERITY_CONFIG[w.severity] || SEVERITY_CONFIG.medium;
                        return (
                            <div key={i} className="manifest-warning-card" style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                                <div className="mwc-header">
                                    <span className="mwc-severity" style={{ color: cfg.color }}>{w.severity.toUpperCase()}</span>
                                </div>
                                <p className="mwc-message">{w.message}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
