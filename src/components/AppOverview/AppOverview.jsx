import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import { RiskBadge } from '../common/Badge.jsx';
import '../common/icon-box.css';
import './AppOverview.css';

export function AppOverview({ metadata, fileType }) {
    const rows = [
        { label: 'File Name', value: metadata.fileName, mono: false },
        { label: 'File Type', value: <span className={`file-type-badge ${fileType}`}>{fileType.toUpperCase()}</span> },
        { label: 'Package', value: metadata.packageName || 'Not detected', mono: !!metadata.packageName },
        { label: 'Version', value: metadata.versionName ? `${metadata.versionName}${metadata.versionCode ? ` (build ${metadata.versionCode})` : ''}` : 'N/A' },
        { label: 'App Label', value: metadata.appLabel || 'Not detected' },
    ];
    return (
        <Card icon={AppIcons.Package} title="Application Overview">
            <table className="overview-table">
                <tbody>
                    {rows.map(({ label, value, mono }) => (
                        <tr key={label}>
                            <td className="ot-label">{label}</td>
                            <td className={`ot-value ${mono ? 'mono' : ''}`}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
