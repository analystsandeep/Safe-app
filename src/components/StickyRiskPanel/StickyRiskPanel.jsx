import React, { useEffect, useRef, useState } from 'react';
import './StickyRiskPanel.css';

import {
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineExclamationCircle,
    HiOutlineBellAlert
} from 'react-icons/hi2';

const GRADE_ICONS = {
    'A': HiOutlineShieldCheck,
    'B': HiOutlineCheckCircle,
    'C': HiOutlineExclamationTriangle,
    'D': HiOutlineExclamationCircle,
    'F': HiOutlineBellAlert,
};

export function StickyRiskPanel({ riskScore, suspiciousCombos, onReset }) {
    const [visible, setVisible] = useState(false);

    // This component receives a sentinel ref from App to know when to show
    useEffect(() => {
        const sentinel = document.getElementById('risk-score-sentinel');
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [riskScore]);

    if (!riskScore) return null;

    const { grade, label, color, normalizedScore, breakdown } = riskScore;
    const topDrivers = [];
    if (breakdown.high > 0) topDrivers.push({ label: `${breakdown.high} High Risk`, color: '#ef4444' });
    if (breakdown.medium > 0 && topDrivers.length < 2) topDrivers.push({ label: `${breakdown.medium} Medium`, color: '#f59e0b' });
    if (suspiciousCombos?.length > 0) topDrivers.push({ label: `${suspiciousCombos.length} Threat Combo${suspiciousCombos.length > 1 ? 's' : ''}`, color: '#ff2d55' });

    return (
        <div className={`sticky-risk-panel ${visible ? 'srp-visible' : ''}`}>
            <div className="srp-inner">
                <div className="srp-grade" style={{ background: color }}>
                    <div className="srp-grade-icon-wrap">
                        {React.createElement(GRADE_ICONS[grade] || HiOutlineExclamationTriangle, { className: "srp-premium-icon" })}
                    </div>
                    <span className="srp-grade-letter">{grade}</span>
                    <span className="srp-grade-label">{label}</span>
                </div>

                <div className="srp-score-bar-wrap">
                    <div className="srp-score-num">{normalizedScore}<span>/100</span></div>
                    <div className="srp-score-bar">
                        <div className="srp-score-fill" style={{ width: `${normalizedScore}%`, background: color }} />
                    </div>
                </div>

                {topDrivers.length > 0 && (
                    <div className="srp-drivers">
                        {topDrivers.map((d, i) => (
                            <span key={i} className="srp-driver-chip" style={{ color: d.color, borderColor: `${d.color}30`, background: `${d.color}10` }}>
                                {d.label}
                            </span>
                        ))}
                    </div>
                )}

                <button className="srp-scan-btn" onClick={onReset}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Scan Another
                </button>
            </div>
        </div>
    );
}
