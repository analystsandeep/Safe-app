import React, { useEffect, useRef } from 'react';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import './WhyAppranium.css';

const FEATURES = [
    { label: '100% Local Analysis', appranium: true, virustotal: false, manual: false },
    { label: 'Permission Intelligence', appranium: true, virustotal: false, manual: true },
    { label: 'Threat Combo Detection', appranium: true, virustotal: false, manual: false },
    { label: 'Code-Level Scan (DEX)', appranium: true, virustotal: false, manual: false },
    { label: 'AI Risk Scoring (ML)', appranium: true, virustotal: false, manual: false },
    { label: 'Behavior Simulation', appranium: true, virustotal: false, manual: false },
    { label: 'Manifest Security Scan', appranium: true, virustotal: true, manual: true },
    { label: 'No Upload / No Account', appranium: true, virustotal: false, manual: true },
    { label: 'Plain-English Explanations', appranium: true, virustotal: false, manual: false },
];

function Cell({ yes }) {
    return yes
        ? <HiOutlineCheck className="wa-check-icon" />
        : <HiOutlineXMark className="wa-cross-icon" />;
}

export function WhyAppranium() {
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
        <section ref={sectionRef} className="wa-section">
            <div className="wa-header reveal-item">
                <span className="wa-label">Comparison</span>
                <h2 className="wa-title">Why not just use VirusTotal?</h2>
                <p className="wa-sub">VirusTotal checks for known malware. Appranium analyzes <em>what an app can do to you</em> — before it installs.</p>
            </div>
            <div className="wa-table-wrap reveal-item" style={{ transitionDelay: '0.15s' }}>
                <table className="wa-table">
                    <thead>
                        <tr>
                            <th className="wa-feat-col">Feature</th>
                            <th className="wa-app-col">Appranium</th>
                            <th>VirusTotal</th>
                            <th>Manual Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FEATURES.map(f => (
                            <tr key={f.label}>
                                <td className="wa-feat-name">{f.label}</td>
                                <td className="wa-app-cell"><Cell yes={f.appranium} /></td>
                                <td><Cell yes={f.virustotal} /></td>
                                <td><Cell yes={f.manual} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
