import React from 'react';
import { Card } from '../common/Card.jsx';
import { Collapsible } from '../common/Collapsible.jsx';
import { AppIcons } from '../common/icons.jsx';
import './ComponentExposure.css';

export function ComponentExposure({ data }) {
    const { exportedActivities, exportedServices, exportedReceivers, exportedProviders, totalExported, unprotectedCount } = data;
    const statItems = [
        { label: 'Exported', value: totalExported, color: totalExported > 0 ? '#ef4444' : '#22c55e' },
        { label: 'Unprotected', value: unprotectedCount, color: unprotectedCount > 0 ? '#ff2d55' : '#22c55e' },
        { label: 'Activities', value: exportedActivities.length, color: '#c084fc' },
        { label: 'Services', value: exportedServices.length, color: '#fb923c' },
        { label: 'Receivers', value: exportedReceivers.length, color: '#f59e0b' },
        { label: 'Providers', value: exportedProviders.length, color: '#f43f5e' },
    ];
    const groups = [
        { type: 'Activities', items: exportedActivities },
        { type: 'Services', items: exportedServices },
        { type: 'Receivers', items: exportedReceivers },
        { type: 'Providers', items: exportedProviders },
    ].filter(g => g.items.length > 0);

    return (
        <Card icon={AppIcons.Exposure} title="Component Exposure">
            <div className="comp-stats-grid">
                {statItems.map(s => (
                    <div className="comp-stat-box" key={s.label}>
                        <span className="csb-value" style={{ color: s.color }}>{s.value}</span>
                        <span className="csb-label">{s.label}</span>
                    </div>
                ))}
            </div>
            {totalExported === 0 && <div className="comp-clean">No exported components detected.</div>}
            {unprotectedCount > 0 && (
                <div className="comp-warning">{unprotectedCount} exported component{unprotectedCount > 1 ? 's' : ''} have no permission protection.</div>
            )}
            {groups.length > 0 && (
                <div className="comp-groups">
                    {groups.map(({ type, items }) => (
                        <Collapsible key={type} title={`${type} (${items.length})`}>
                            <ul className="comp-name-list">
                                {items.map(name => <li key={name} className="comp-name">{name}</li>)}
                            </ul>
                        </Collapsible>
                    ))}
                </div>
            )}
        </Card>
    );
}
