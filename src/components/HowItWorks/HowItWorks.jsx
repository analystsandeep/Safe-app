import React, { useEffect, useRef } from 'react';
import './HowItWorks.css';

const STEPS = [
    {
        num: '01',
        title: 'Manifest Parsing',
        desc: 'Your APK is decompressed in the browser. The AndroidManifest.xml is parsed into a structured permission tree — no data ever leaves your machine.',
        tags: ['APK decompression', 'In-memory parsing'],
    },
    {
        num: '02',
        title: 'Permission Classification',
        desc: 'Each permission is matched against a curated risk taxonomy covering 200+ definitions across Android API levels 21–34, categorising by danger and surveillance potential.',
        tags: ['Risk taxonomy', 'API 21–34'],
    },
    {
        num: '03',
        title: 'Behavior Simulation',
        desc: 'Our proprietary simulation engine combines manifest flags with code-level insights to forecast risky runtime behaviors such as background surveillance.',
        tags: ['Heuristic engine', 'Threat forecasting'],
    },
    {
        num: '04',
        title: 'AI & DEX Scoring',
        desc: 'TensorFlow.js runs deep code scanning and ML inference locally. The final risk score is a context-aware grade based on permission vectors and suspicious API usage.',
        tags: ['TensorFlow.js', 'Neural adjustments'],
    },
];

export function HowItWorks() {
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
            { threshold: 0.1 }
        );

        const cards = sectionRef.current?.querySelectorAll('.hiw-card');
        cards?.forEach((card) => observer.observe(card));

        const header = sectionRef.current?.querySelector('.hiw-header');
        if (header) observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="hiw-section">
            <div className="hiw-header reveal-item">
                <div className="section-label">Technical Architecture</div>
                <h2 className="hiw-title">How It Works</h2>
                <p className="hiw-subtitle">Four deterministic steps. Zero network calls.</p>
            </div>

            <div className="hiw-grid">
                {STEPS.map((step, i) => (
                    <div
                        className="hiw-card reveal-item"
                        key={step.num}
                        style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                        <div className="hiw-card-num">{step.num}</div>
                        <h3 className="hiw-card-title">{step.title}</h3>
                        <p className="hiw-card-desc">{step.desc}</p>
                        <div className="hiw-card-tags">
                            {step.tags.map(tag => (
                                <span className="hiw-tag" key={tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
