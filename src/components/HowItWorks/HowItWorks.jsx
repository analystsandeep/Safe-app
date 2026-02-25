import React from 'react';
import './HowItWorks.css';

const STEPS = [
    {
        num: '01',
        title: 'Manifest Parsing',
        desc: 'Your APK is decompressed entirely in the browser. The AndroidManifest.xml is extracted and parsed into a structured permission tree — no data ever leaves your machine.',
        tags: ['APK decompression', 'JSZip', 'In-memory parsing'],
    },
    {
        num: '02',
        title: 'Permission Classification',
        desc: 'Each declared permission is matched against a curated risk taxonomy covering 200+ definitions across Android API levels 21–34 — categorising by danger level, tracking capability, and surveillance potential.',
        tags: ['Risk taxonomy', '200+ permissions', 'API 21–34'],
    },
    {
        num: '03',
        title: 'Behavior Simulation',
        desc: 'Our proprietary simulation engine combines manifest flags with code-level insights to forecast risky runtime behaviors, such as background surveillance or silent data exfiltration.',
        tags: ['Heuristic engine', 'Threat forecasting', 'Combo simulation'],
    },
    {
        num: '04',
        title: 'AI & DEX Scoring',
        desc: 'TensorFlow.js runs deep code scanning (DEX) and ML inference locally. The final risk score is a context-aware grade based on permission vectors and suspicious API usage patterns.',
        tags: ['TensorFlow.js', 'DEX scanning', 'Neural adjustments'],
    },
];

export function HowItWorks() {
    return (
        <section className="hiw-section">
            <div className="hiw-header">
                <div className="section-label">Technical Architecture</div>
                <h2 className="hiw-title">How It Works</h2>
                <p className="hiw-subtitle">Three deterministic steps. Zero network calls.</p>
            </div>

            <div className="hiw-steps">
                {STEPS.map((step, i) => (
                    <div className="hiw-step" key={step.num}>
                        {/* Left: step number + vertical line */}
                        <div className="hiw-step-left">
                            <div className="hiw-step-num">{step.num}</div>
                            {i < STEPS.length - 1 && <div className="hiw-step-line" />}
                        </div>

                        {/* Right: content */}
                        <div className="hiw-step-content">
                            <h3 className="hiw-step-title">{step.title}</h3>
                            <p className="hiw-step-desc">{step.desc}</p>
                            <div className="hiw-step-tags">
                                {step.tags.map(tag => (
                                    <span className="hiw-tag" key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
