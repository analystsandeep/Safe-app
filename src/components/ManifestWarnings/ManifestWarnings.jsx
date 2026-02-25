import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import './ManifestWarnings.css';

const SEVERITY_CONFIG = {
    critical: { color: '#ff2d55', bg: 'rgba(255,45,85,0.07)', Icon: AppIcons.Critical },
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.07)', Icon: AppIcons.Risk },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', Icon: AppIcons.Warning },
};

const STATUS_ICONS = {
    danger: { Icon: AppIcons.Critical, label: 'DANGER' },
    warn: { Icon: AppIcons.Warning, label: 'WARN' },
    safe: { Icon: AppIcons.Success, label: 'SAFE' },
    '': { Icon: AppIcons.Info, label: 'INFO' },
};

export function ManifestWarnings({ analysis }) {
    const { minSdkVersion, targetSdkVersion, isDebuggable, allowsBackup, warnings } = analysis;
    const infoBoxes = [
        { label: 'Min SDK', value: minSdkVersion ?? '—', cls: '', desc: 'Minimum Android version' },
        { label: 'Target SDK', value: targetSdkVersion ?? '—', cls: '', desc: 'Target Android version' },
        { label: 'Debuggable', value: isDebuggable ? 'Yes' : 'No', cls: isDebuggable ? 'danger' : 'safe', desc: isDebuggable ? 'Debug mode enabled — attackers can use ADB' : 'Debug mode disabled' },
        { label: 'Allow Backup', value: allowsBackup ? 'Yes' : 'No', cls: allowsBackup ? 'warn' : 'safe', desc: allowsBackup ? 'App data can be backed up via ADB' : 'Backups restricted' },
    ];

    return (
        <Card icon={AppIcons.Manifest} title="Manifest Security Analysis">
            <div className="manifest-info-grid">
                {infoBoxes.map(b => {
                    const statusInfo = STATUS_ICONS[b.cls] || STATUS_ICONS[''];
                    return (
                        <div className={`manifest-info-box mib-status-${b.cls || 'neutral'}`} key={b.label}>
                            <div className="mib-status-stripe" />
                            <span className="mib-status-icon"><statusInfo.Icon size={16} color={b.cls === 'neutral' ? 'var(--text-muted)' : 'white'} /></span>
                            <span className="mib-label">{b.label}</span>
                            <span className={`mib-value ${b.cls}`}>{b.value}</span>
                            <span className="mib-desc">{b.desc}</span>
                        </div>
                    );
                })}
            </div>

            {warnings.length === 0 ? (
                <div className="manifest-clean">
                    <AppIcons.Security className="manifest-clean-icon" size={24} />
                    No manifest security issues detected.
                </div>
            ) : (
                <div className="manifest-warnings-list">
                    {warnings.map((w, i) => {
                        const cfg = SEVERITY_CONFIG[w.severity] || SEVERITY_CONFIG.medium;
                        return (
                            <div key={i} className="manifest-warning-card" style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                                <div className="mwc-header">
                                    <span className="mwc-sev-icon"><cfg.Icon size={14} /></span>
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
