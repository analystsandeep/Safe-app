import React from 'react';
import { Collapsible } from '../common/Collapsible.jsx';
import EDUCATIONAL_CONTENT from '../../data/educationalContent.js';
import './EducationalInsights.css';

export function EducationalInsights() {
    return (
        <section className="edu-section">
            <div className="edu-section-header">
                <div className="section-label">Knowledge Base</div>
                <h2 className="edu-section-title">Security Intelligence</h2>
                <p className="edu-section-sub">
                    Understand the technical risks behind Android permissions and manifest declarations.
                </p>
            </div>

            <div className="edu-list">
                {EDUCATIONAL_CONTENT.map(item => (
                    <Collapsible key={item.id} title={item.title}>
                        <p className="edu-content">{item.content}</p>
                    </Collapsible>
                ))}
            </div>
        </section>
    );
}
