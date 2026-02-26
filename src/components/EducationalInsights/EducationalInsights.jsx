import React, { useEffect, useRef } from 'react';
import { Collapsible } from '../common/Collapsible.jsx';
import EDUCATIONAL_CONTENT from '../../data/educationalContent.js';
import './EducationalInsights.css';

export function EducationalInsights() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            },
            { threshold: 0.08 }
        );

        const items = sectionRef.current?.querySelectorAll('.reveal-item');
        items?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="edu-section">
            <div className="edu-section-header reveal-item">
                <div className="section-label">Knowledge Base</div>
                <h2 className="edu-section-title">Security Intelligence</h2>
                <p className="edu-section-sub">
                    Understand the technical risks behind Android permissions and manifest declarations.
                </p>
            </div>

            <div className="edu-list reveal-item" style={{ transitionDelay: '0.15s' }}>
                {EDUCATIONAL_CONTENT.map(item => (
                    <Collapsible key={item.id} title={item.title}>
                        <p className="edu-content">{item.content}</p>
                    </Collapsible>
                ))}
            </div>
        </section>
    );
}
