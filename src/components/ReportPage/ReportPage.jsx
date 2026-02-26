import React, { useState, useEffect, useRef } from 'react';
import {
    HiOutlineShieldCheck,
    HiOutlineExclamationTriangle,
    HiOutlineFire,
    HiOutlineLightBulb,
    HiOutlineCodeBracket,
    HiOutlineChartBar,
    HiOutlineArrowLeft,
    HiOutlineCpuChip,
    HiOutlineGlobeAlt,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineBolt,
    HiOutlineDocumentText,
    HiOutlineBeaker,
    HiOutlineFingerPrint,
    HiOutlineSignal,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineWrenchScrewdriver,
    HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import './ReportPage.css';

/* ── HELPERS ── */
const GRADE_CONFIG = {
    A: { color: '#22c55e', glow: 'rgba(34,197,94,0.4)', label: 'SAFE', ring: '#22c55e' },
    B: { color: '#84cc16', glow: 'rgba(132,204,22,0.4)', label: 'LOW RISK', ring: '#84cc16' },
    C: { color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', label: 'MODERATE', ring: '#f59e0b' },
    D: { color: '#ef4444', glow: 'rgba(239,68,68,0.4)', label: 'HIGH RISK', ring: '#ef4444' },
    F: { color: '#ff2d55', glow: 'rgba(255,45,85,0.5)', label: 'CRITICAL', ring: '#ff2d55' },
};

const RISK_COLORS = {
    critical: '#ff2d55', high: '#ef4444', medium: '#f59e0b', low: '#22c55e', unknown: '#52525b'
};

const RISK_ICONS = {
    critical: HiOutlineFire,
    high: HiOutlineExclamationTriangle,
    medium: HiOutlineBolt,
    low: HiOutlineShieldCheck,
    unknown: HiOutlineInformationCircle,
};

function AnimatedNumber({ value }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        if (isNaN(end)) return;
        const duration = 1200;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(Math.floor(start * 10) / 10);
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <>{display}</>;
}

/* ══ REPORT PAGE ══════════════════════════════════════════════════════════ */
export function ReportPage({ result, onReset, onOpenCustomization }) {
    const { riskScore, metadata, fileType, permissions, totalPermissions,
        suspiciousCombos, dexAnalysis, simulations, domainProfile } = result;

    const { normalizedScore, grade, label, color, breakdown,
        explanation, dexScore, simulationScore, mlScore, mlConfidence } = riskScore;

    const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG['F'];
    const cardRef = useRef(null);
    const tiltRef = useRef({ dx: 0, dy: 0, active: false });
    const rafRef = useRef(null);
    const [activeSection, setActiveSection] = useState('overview');

    /* 3D grade orb tilt */
    useEffect(() => {
        const onMouse = (e) => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            tiltRef.current = { dx, dy, active: Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5 };
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        const animate = () => {
            if (cardRef.current) {
                const { dx, dy, active } = tiltRef.current;
                if (active) {
                    cardRef.current.style.transform = `perspective(800px) rotateX(${dy * -18}deg) rotateY(${dx * 22}deg) translateZ(20px)`;
                    cardRef.current.style.filter = `brightness(${1 + Math.abs(dx) * 0.12})`;
                } else {
                    cardRef.current.style.transform = '';
                    cardRef.current.style.filter = '';
                }
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouse);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const highRiskPerms = permissions.filter(p => p.risk === 'critical' || p.risk === 'high');
    const medRiskPerms = permissions.filter(p => p.risk === 'medium');
    const lowRiskPerms = permissions.filter(p => p.risk === 'low');

    return (
        <div className="rp-root">

            {/* ══ CINEMATIC REPORT HERO ══ */}
            <div className="rp-hero" style={{ '--grade-color': gradeConfig.color, '--grade-glow': gradeConfig.glow }}>

                {/* Background elements */}
                <div className="rp-hero-grid" aria-hidden="true" />
                <div className="rp-hero-blob" aria-hidden="true" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${gradeConfig.glow} 0%, transparent 70%)` }} />



                {/* Back button */}
                <button className="rp-back-btn" onClick={onReset}>
                    <HiOutlineArrowLeft />
                    Scan Another
                </button>

                {/* Centre: grade orb */}
                <div className="rp-hero-centre">
                    <div ref={cardRef} className="rp-grade-orb" style={{ '--grade-color': gradeConfig.color, '--grade-glow': gradeConfig.glow }}>
                        <div className="rp-grade-inner">
                            <span className="rp-grade-letter">{grade}</span>
                            <span className="rp-grade-label">{gradeConfig.label}</span>
                        </div>
                        {/* Scanning arc */}
                        <div className="rp-grade-scan" />
                    </div>

                    <div className="rp-hero-info">
                        <h1 className="rp-app-name">{metadata.appLabel || metadata.fileName}</h1>
                        <div className="rp-app-meta">
                            <span className="rp-meta-pill">{fileType.toUpperCase()}</span>
                            {metadata.packageName && <span className="rp-meta-mono">{metadata.packageName}</span>}
                            {metadata.versionName && <span className="rp-meta-mono">v{metadata.versionName}</span>}
                        </div>
                    </div>
                </div>

                {/* Hero stat row */}
                <div className="rp-hero-stats">
                    <div className="rp-hero-stat">
                        <span className="rp-hs-num" style={{ color: gradeConfig.color }}>
                            <AnimatedNumber value={normalizedScore} /><span className="rp-hs-unit">/100</span>
                        </span>
                        <span className="rp-hs-label">Risk Score</span>
                    </div>
                    <div className="rp-hs-div" />
                    <div className="rp-hero-stat">
                        <span className="rp-hs-num" style={{ color: '#ef4444' }}>
                            <AnimatedNumber value={breakdown.high + (breakdown.critical || 0)} />
                        </span>
                        <span className="rp-hs-label">High Risk Perms</span>
                    </div>
                    <div className="rp-hs-div" />
                    <div className="rp-hero-stat">
                        <span className="rp-hs-num"><AnimatedNumber value={totalPermissions} /></span>
                        <span className="rp-hs-label">Total Permissions</span>
                    </div>
                    <div className="rp-hs-div" />
                    <div className="rp-hero-stat">
                        <span className="rp-hs-num" style={{ color: '#f59e0b' }}>
                            <AnimatedNumber value={suspiciousCombos.length} />
                        </span>
                        <span className="rp-hs-label">Threat Combos</span>
                    </div>
                    <div className="rp-hs-div" />
                    <div className="rp-hero-stat">
                        <span className="rp-hs-num" style={{ color: '#3DDC84' }}>
                            {mlConfidence ? `${(mlConfidence * 100).toFixed(0)}%` : 'N/A'}
                        </span>
                        <span className="rp-hs-label">AI Confidence</span>
                    </div>
                </div>
            </div>

            {/* ══ BENTO DASHBOARD ══ */}
            <div className="rp-bento">

                {/* ── CARD: Score Breakdown ── */}
                <div className="rp-bento-card rp-card-score">
                    <div className="rp-card-header">
                        <HiOutlineChartBar className="rp-card-icon" />
                        <span>Score Breakdown</span>
                    </div>
                    <div className="rp-score-gauge-wrap">
                        <div className="rp-score-arc">
                            <svg viewBox="0 0 120 70" className="rp-arc-svg">
                                <path d="M10,65 A55,55 0 0,1 110,65" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />
                                <path d="M10,65 A55,55 0 0,1 110,65" fill="none"
                                    stroke={gradeConfig.color}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(normalizedScore / 100) * 172} 172`}
                                    style={{ filter: `drop-shadow(0 0 6px ${gradeConfig.glow})`, transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                                />
                            </svg>
                            <div className="rp-arc-label">
                                <span className="rp-arc-num" style={{ color: gradeConfig.color }}>{normalizedScore}</span>
                                <span className="rp-arc-unit">/ 100</span>
                            </div>
                        </div>
                    </div>
                    <div className="rp-breakdown-bars">
                        {[
                            { label: 'Critical', count: breakdown.critical || 0, color: '#ff2d55' },
                            { label: 'High', count: breakdown.high, color: '#ef4444' },
                            { label: 'Medium', count: breakdown.medium, color: '#f59e0b' },
                            { label: 'Low', count: breakdown.low, color: '#22c55e' },
                        ].map(s => (
                            <div className="rp-bar-row" key={s.label}>
                                <span className="rp-bar-label">{s.label}</span>
                                <div className="rp-bar-track">
                                    <div className="rp-bar-fill"
                                        style={{ width: `${(s.count / (totalPermissions || 1)) * 100}%`, background: s.color, boxShadow: `0 0 8px ${s.color}60` }}
                                    />
                                </div>
                                <span className="rp-bar-count" style={{ color: s.color }}>{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CARD: AI Intel ── */}
                <div className="rp-bento-card rp-card-ai">
                    <div className="rp-card-header">
                        <HiOutlineCpuChip className="rp-card-icon" style={{ color: '#3DDC84' }} />
                        <span>AI Intelligence</span>
                    </div>
                    <div className="rp-ai-grid">
                        {[
                            {
                                label: 'ML Adjustment',
                                value: mlScore !== 0 ? (mlScore > 0 ? `+${mlScore}` : `${mlScore}`) : '—',
                                color: mlScore > 0 ? '#ef4444' : mlScore < 0 ? '#22c55e' : '#71717a',
                                icon: HiOutlineArrowTrendingUp,
                                tooltip: 'AI model score adjustment applied to the final risk score'
                            },
                            {
                                label: 'DEX Points',
                                value: dexScore > 0 ? `+${dexScore}` : '0',
                                color: dexScore > 0 ? '#f59e0b' : '#22c55e',
                                icon: HiOutlineCodeBracket,
                                tooltip: 'Risk points added from code-level DEX analysis findings'
                            },
                            {
                                label: 'Sim. Points',
                                value: simulationScore > 0 ? `+${simulationScore}` : '0',
                                color: simulationScore > 0 ? '#f59e0b' : '#22c55e',
                                icon: HiOutlineBeaker,
                                tooltip: 'Risk points added from simulated behavior forecasts'
                            },
                        ].map(({ label, value, color, icon: Icon }) => (
                            <div className="rp-ai-tile" key={label}>
                                <Icon className="rp-ai-tile-icon" style={{ color }} />
                                <span className="rp-ai-tile-val" style={{ color }}>{value}</span>
                                <span className="rp-ai-tile-label">{label}</span>
                            </div>
                        ))}
                    </div>
                    {mlConfidence != null && (
                        <div className="rp-confidence-block">
                            <div className="rp-conf-label">
                                <HiOutlineFingerPrint style={{ color: '#3DDC84' }} />
                                AI Confidence
                                <span style={{ color: '#3DDC84', fontWeight: 700 }}>{(mlConfidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="rp-conf-track">
                                <div className="rp-conf-fill" style={{ width: `${mlConfidence * 100}%` }} />
                            </div>
                        </div>
                    )}
                    <p className="rp-ai-explanation">{explanation}</p>
                </div>

                {/* ── CARD: App Identity ── */}
                <div className="rp-bento-card rp-card-identity">
                    <div className="rp-card-header">
                        <HiOutlineDocumentText className="rp-card-icon" />
                        <span>App Identity</span>
                    </div>
                    <div className="rp-identity-rows">
                        {[
                            { label: 'File', value: metadata.fileName, icon: HiOutlineDocumentText },
                            { label: 'Package', value: metadata.packageName || '—', icon: HiOutlineGlobeAlt, mono: true },
                            { label: 'Version', value: metadata.versionName ? `${metadata.versionName}${metadata.versionCode ? ` (${metadata.versionCode})` : ''}` : '—', icon: HiOutlineWrenchScrewdriver },
                            { label: 'Type', value: fileType.toUpperCase(), icon: HiOutlineCodeBracket },
                        ].map(({ label, value, icon: Icon, mono }) => (
                            <div className="rp-id-row" key={label}>
                                <Icon className="rp-id-icon" />
                                <span className="rp-id-label">{label}</span>
                                <span className={`rp-id-value ${mono ? 'mono' : ''}`} title={typeof value === 'string' ? value : ''}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CARD: Threat Combos ── */}
                {suspiciousCombos.length > 0 ? (
                    <div className="rp-bento-card rp-card-threats">
                        <div className="rp-card-header">
                            <HiOutlineFire className="rp-card-icon" style={{ color: '#ff2d55' }} />
                            <span>Threat Combinations</span>
                            <span className="rp-threat-count">{suspiciousCombos.length}</span>
                        </div>
                        <div className="rp-threat-list">
                            {suspiciousCombos.map((combo, i) => {
                                const rc = RISK_COLORS[combo.risk] || '#ef4444';
                                const Icon = RISK_ICONS[combo.risk] || HiOutlineExclamationTriangle;
                                return (
                                    <div className="rp-threat-item" key={combo.id || i}
                                        style={{ '--t-color': rc }}>
                                        <div className="rp-threat-item-head">
                                            <Icon className="rp-threat-icon" style={{ color: rc }} />
                                            <span className="rp-threat-title">{combo.title}</span>
                                            <span className="rp-threat-badge" style={{ color: rc, borderColor: `${rc}40`, background: `${rc}12` }}>{combo.risk.toUpperCase()}</span>
                                        </div>
                                        <p className="rp-threat-reason">{combo.reason}</p>
                                        <div className="rp-threat-perms">
                                            {combo.combo.map(p => (
                                                <span key={p} className="rp-threat-perm">{p.split('.').pop()}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="rp-bento-card rp-card-threats rp-card-clean">
                        <div className="rp-card-header">
                            <HiOutlineShieldCheck className="rp-card-icon" style={{ color: '#22c55e' }} />
                            <span>Threat Combinations</span>
                        </div>
                        <div className="rp-clean-state">
                            <HiOutlineCheckCircle className="rp-clean-icon" />
                            <p>No dangerous combinations found</p>
                        </div>
                    </div>
                )}

                {/* ── CARD: High Risk Permissions ── */}
                <div className="rp-bento-card rp-card-perms-high">
                    <div className="rp-card-header">
                        <HiOutlineLockClosed className="rp-card-icon" style={{ color: '#ef4444' }} />
                        <span>High Risk Permissions</span>
                        <span className="rp-perm-count-badge" style={{ color: '#ef4444', background: '#ef444418' }}>{highRiskPerms.length}</span>
                    </div>
                    <div className="rp-perm-list">
                        {highRiskPerms.length === 0 ? (
                            <div className="rp-clean-state small">
                                <HiOutlineCheckCircle className="rp-clean-icon small" />
                                <p>No high risk permissions</p>
                            </div>
                        ) : highRiskPerms.slice(0, 8).map(p => {
                            const rc = RISK_COLORS[p.risk];
                            return (
                                <div className="rp-perm-row" key={p.name}
                                    style={{ '--p-color': rc }}>
                                    <div className="rp-perm-dot" style={{ background: rc, boxShadow: `0 0 6px ${rc}` }} />
                                    <div className="rp-perm-body">
                                        <span className="rp-perm-name">{p.shortName}</span>
                                        <p className="rp-perm-desc">{p.description}</p>
                                    </div>
                                    <span className="rp-perm-badge" style={{ color: rc, borderColor: `${rc}35`, background: `${rc}10` }}>{p.risk}</span>
                                </div>
                            );
                        })}
                        {highRiskPerms.length > 8 && (
                            <p className="rp-perm-more">+{highRiskPerms.length - 8} more below ↓</p>
                        )}
                    </div>
                </div>

                {/* ── CARD: Simulated Risks ── */}
                {simulations && simulations.length > 0 && (
                    <div className="rp-bento-card rp-card-sims">
                        <div className="rp-card-header">
                            <HiOutlineLightBulb className="rp-card-icon" style={{ color: '#f59e0b' }} />
                            <span>Behavior Forecasts</span>
                            <span className="rp-sim-badge">{simulations.length} Threats</span>
                        </div>
                        <div className="rp-sim-list">
                            {simulations.map((sim, i) => (
                                <div className="rp-sim-item" key={i}>
                                    <div className="rp-sim-icon-wrap">
                                        <HiOutlineEye />
                                    </div>
                                    <div className="rp-sim-body">
                                        <p className="rp-sim-desc">{sim.description}</p>
                                        <span className="rp-sim-pts">+{sim.points} risk pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── CARD: DEX / Code Insights ── */}
                {dexAnalysis && (
                    <div className="rp-bento-card rp-card-dex">
                        <div className="rp-card-header">
                            <HiOutlineCodeBracket className="rp-card-icon" style={{ color: '#60a5fa' }} />
                            <span>DEX Code Analysis</span>
                        </div>
                        <div className="rp-dex-grid">
                            {[
                                { label: 'Runtime Perms', items: dexAnalysis.runtimePerms, icon: HiOutlineSignal, color: '#ef4444' },
                                { label: 'Dynamic Loads', items: dexAnalysis.dynamicLoads, icon: HiOutlineBolt, color: '#f59e0b' },
                                { label: 'Data Sinks', items: dexAnalysis.dataSinks, icon: HiOutlineGlobeAlt, color: '#60a5fa' },
                                { label: 'Suspicious APIs', items: dexAnalysis.suspiciousStrings, icon: HiOutlineWrenchScrewdriver, color: '#a78bfa' },
                            ].map(({ label, items, icon: Icon, color }) => (
                                <div className="rp-dex-tile" key={label}>
                                    <div className="rp-dex-tile-header">
                                        <Icon style={{ color }} />
                                        <span>{label}</span>
                                        <span className="rp-dex-count" style={{ color }}>{items?.length || 0}</span>
                                    </div>
                                    {items && items.length > 0 && (
                                        <ul className="rp-dex-list">
                                            {items.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}
                                            {items.length > 3 && <li className="rp-dex-more">+{items.length - 3} more</li>}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── CARD: All Permissions full table ── */}
                <div className="rp-bento-card rp-card-all-perms">
                    <div className="rp-card-header">
                        <HiOutlineEye className="rp-card-icon" />
                        <span>All Permissions ({totalPermissions})</span>
                    </div>
                    <div className="rp-all-perms">
                        {['critical', 'high', 'medium', 'low', 'unknown'].map(risk => {
                            const group = permissions.filter(p => p.risk === risk);
                            if (!group.length) return null;
                            const rc = RISK_COLORS[risk];
                            const Icon = RISK_ICONS[risk];
                            return (
                                <details key={risk} className="rp-perm-group" open={risk === 'critical' || risk === 'high'}>
                                    <summary className="rp-perm-group-hd" style={{ '--g-color': rc }}>
                                        <Icon style={{ color: rc }} />
                                        <span style={{ color: rc }}>{risk.charAt(0).toUpperCase() + risk.slice(1)}</span>
                                        <span className="rp-pg-count" style={{ color: rc, background: `${rc}15` }}>{group.length}</span>
                                    </summary>
                                    <div className="rp-perm-grid">
                                        {group.map(p => (
                                            <div className="rp-pg-card" key={p.name}
                                                style={{ '--p-color': rc, borderColor: `${rc}25` }}>
                                                <span className="rp-pg-name">{p.shortName}</span>
                                                <p className="rp-pg-desc">{p.description}</p>
                                                {p.category && <span className="rp-pg-chip">{p.category}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
