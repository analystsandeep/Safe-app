import React from 'react';
import { Collapsible } from '../common/Collapsible.jsx';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import EDUCATIONAL_CONTENT from '../../data/educationalContent.js';
import './EducationalInsights.css';

export function EducationalInsights() {
    return (
        <Card icon={AppIcons.BookOpen} title="Security Knowledge Base">
            <div className="edu-list">
                {EDUCATIONAL_CONTENT.map(item => (
                    <Collapsible key={item.id} title={item.title} accent="var(--accent-primary)">
                        <p className="edu-content">{item.content}</p>
                    </Collapsible>
                ))}
            </div>
        </Card>
    );
}
