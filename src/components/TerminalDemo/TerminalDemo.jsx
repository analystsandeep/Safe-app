import React from 'react';
import './TerminalDemo.css';

const LINES = [
    { prefix: '$', text: 'appranium analyze app-release.apk', type: 'cmd' },
    { prefix: '›', text: 'Extracting AndroidManifest.xml…', type: 'info' },
    { prefix: '›', text: 'Parsing 47 permission declarations…', type: 'info' },
    { prefix: '›', text: 'Analyzing 12 exported components…', type: 'info' },
    { prefix: '›', text: 'Detecting suspicious permission combos…', type: 'info' },
    { prefix: '!', text: 'Found: LOCATION + BACKGROUND_ACCESS + BOOT_COMPLETED', type: 'warn' },
    { prefix: '!', text: 'Found: android:debuggable = true', type: 'warn' },
    { prefix: '✓', text: 'Risk Score: 7.4 / 10  [HIGH]', type: 'risk' },
];

export function TerminalDemo() {
    return (
        <section className="term-section">
            <div className="term-header">
                <div className="section-label">Live Output</div>
                <h2 className="term-title">Analysis in Action</h2>
            </div>

            <div className="term-window">
                {/* Window chrome */}
                <div className="term-chrome">
                    <div className="term-dots">
                        <span className="term-dot red" />
                        <span className="term-dot amber" />
                        <span className="term-dot green" />
                    </div>
                    <div className="term-chrome-title">appranium — analysis output</div>
                    <div className="term-chrome-right" />
                </div>

                {/* Output */}
                <div className="term-body">
                    {LINES.map((line, i) => (
                        <div
                            key={i}
                            className={`term-line term-line--${line.type}`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <span className="term-prefix">{line.prefix}</span>
                            <span className="term-text">{line.text}</span>
                        </div>
                    ))}
                    <div className="term-cursor" />
                </div>
            </div>
        </section>
    );
}
