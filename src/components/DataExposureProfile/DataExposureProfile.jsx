import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons, DomainIcons } from '../common/icons.jsx';
import '../common/icon-box.css';
import './DataExposureProfile.css';

import { useState } from 'react';

export function DataExposureProfile({ domains }) {
    const [expanded, setExpanded] = useState(null);
    const sorted = Object.entries(domains).sort((a, b) => b[1].count - a[1].count);

    return (
        <Card icon={AppIcons.DataMap} title="Data Exposure Profile">
            <div className="dep-list">
                {sorted.map(([cat, info]) => {
                    // Get react-icon for this domain category
                    const DomainIcon = DomainIcons[cat] || DomainIcons['Default'];
                    const isOpen = expanded === cat;
                    return (
                        <div key={cat} className="dep-row">
                            <button className="dep-btn" onClick={() => setExpanded(isOpen ? null : cat)}>
                                <div className="dep-left">
                                    <span className="dep-icon-wrap" style={{ color: info.color, background: `${info.color}18` }}>
                                        <DomainIcon size={17} />
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                        <span className="dep-cat">{cat}</span>
                                        <span className="dep-desc">{info.description}</span>
                                    </div>
                                </div>
                                <div className="dep-right">
                                    <span className="dep-count" style={{ color: info.color }}>{info.count}</span>
                                    <span className="dep-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'block' }}>▾</span>
                                </div>
                            </button>
                            {isOpen && (
                                <div className="dep-perms">
                                    {info.permissions.map(p => (
                                        <span key={p} className="dep-perm-chip"
                                            style={{ borderColor: info.color, color: info.color }}>
                                            {p.split('.').pop()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
