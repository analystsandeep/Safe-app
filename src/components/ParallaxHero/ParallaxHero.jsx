import React, { useEffect, useRef } from 'react';
import './ParallaxHero.css';

const ORBS = [
    { width: 320, height: 320, top: '-10%', left: '-8%', opacity: 0.18, speed: 0.12 },
    { width: 200, height: 200, top: '60%', left: '5%', opacity: 0.1, speed: 0.2 },
    { width: 500, height: 500, top: '-20%', right: '-12%', opacity: 0.08, speed: 0.08 },
    { width: 150, height: 150, top: '70%', right: '8%', opacity: 0.12, speed: 0.25 },
    { width: 80, height: 80, top: '30%', left: '45%', opacity: 0.1, speed: 0.3 },
];

const GRID_LINES = Array.from({ length: 10 });

export function ParallaxHero({ children }) {
    const containerRef = useRef(null);
    const orbRefs = useRef([]);
    const gridRef = useRef(null);
    const bgRef = useRef(null);
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const cardTiltRef = useRef({ dx: 0, dy: 0, active: false });

    useEffect(() => {
        let scrollY = 0;

        const onScroll = () => { scrollY = window.scrollY; };
        window.addEventListener('scroll', onScroll, { passive: true });

        const onMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            };

            // 3D tilt — dramatic (up to 22 deg)
            if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                // normalised distance from card centre → −1..1
                const dx = (e.clientX - cx) / (rect.width * 0.8);
                const dy = (e.clientY - cy) / (rect.height * 0.8);
                const dist = Math.sqrt(dx * dx + dy * dy);
                cardTiltRef.current = { dx, dy, active: dist < 2 };
            }
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        const animate = () => {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Background grid drifts down on scroll
            if (gridRef.current) {
                gridRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
            }
            // Blob drifts with mouse
            if (bgRef.current) {
                bgRef.current.style.transform = `translate(${mx * 14}px, ${my * 10}px)`;
            }
            // Orbs — different scroll speeds + tiny mouse
            orbRefs.current.forEach((el, i) => {
                if (el) {
                    const s = ORBS[i]?.speed ?? 0.2;
                    const sign = i % 2 === 0 ? 1 : -1;
                    el.style.transform = `translateY(${scrollY * -s}px) translate(${mx * sign * 7}px, ${my * 4}px)`;
                }
            });

            // 3D card tilt — super dramatic
            if (cardRef.current) {
                const { dx, dy, active } = cardTiltRef.current;
                if (active) {
                    const rotX = dy * -22;
                    const rotY = dx * 26;
                    const brightness = 1 + Math.abs(dx) * 0.15 + Math.abs(dy) * 0.15;
                    cardRef.current.style.animation = 'none';
                    cardRef.current.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(24px) scale(1.04)`;
                    cardRef.current.style.boxShadow = `
                        ${-dx * 32}px ${-dy * 32}px 80px rgba(0,0,0,0.6),
                        0 0 60px rgba(61,220,132,${0.08 + Math.abs(dx) * 0.12}),
                        inset 0 1px 0 rgba(255,255,255,0.12)
                    `;
                    cardRef.current.style.filter = `brightness(${brightness})`;
                } else {
                    cardRef.current.style.animation = '';
                    cardRef.current.style.transform = '';
                    cardRef.current.style.boxShadow = '';
                    cardRef.current.style.filter = '';
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="parallax-hero-wrap">

            {/* Background grid */}
            <div ref={gridRef} className="parallax-grid" aria-hidden="true">
                {GRID_LINES.map((_, i) => (
                    <div key={`v${i}`} className="parallax-grid-line parallax-grid-line--v"
                        style={{ left: `${i * 11}%` }} />
                ))}
                {GRID_LINES.map((_, i) => (
                    <div key={`h${i}`} className="parallax-grid-line parallax-grid-line--h"
                        style={{ top: `${i * 12}%` }} />
                ))}
            </div>

            {/* Ambient gradient blobs */}
            <div ref={bgRef} className="parallax-bg-blobs" aria-hidden="true" />

            {/* ══ 3D SCENE LAYER ══ */}
            <div className="parallax-3d-scene" aria-hidden="true">

                {/* Three concentric spinning rings */}
                <div className="shape-ring shape-ring-1" />
                <div className="shape-ring shape-ring-2" />
                <div className="shape-ring shape-ring-3" />

                {/* Vertical scan beam */}
                <div className="shape-scan-beam" />

                {/* Floating 3D cubes */}
                <div className="shape-cube shape-cube-1" />
                <div className="shape-cube shape-cube-2" />
                <div className="shape-cube shape-cube-3" />
                <div className="shape-cube shape-cube-4" />
                <div className="shape-cube shape-cube-5" />

                {/* Rotating diamonds */}
                <div className="shape-diamond shape-diamond-1" />
                <div className="shape-diamond shape-diamond-2" />
                <div className="shape-diamond shape-diamond-3" />
            </div>

            {/* Midground orbs */}
            <div className="parallax-midground" aria-hidden="true">
                {ORBS.map((orb, i) => (
                    <div
                        key={i}
                        ref={(el) => { orbRefs.current[i] = el; }}
                        className="parallax-orb"
                        style={{
                            width: orb.width, height: orb.height,
                            top: orb.top, left: orb.left, right: orb.right,
                            opacity: orb.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Foreground — hero content */}
            <div className="parallax-foreground">
                <div className="hero-split">
                    {/* Left: headline */}
                    <div className="hero-text-col">
                        <div className="hero-eyebrow">
                            <span className="hero-eyebrow-dot" />
                            Privacy Intelligence Platform
                        </div>
                        <h1 className="hero-headline">
                            Privacy<br />
                            Intelligence<br />
                            <span className="hero-headline-accent">for Android</span>
                        </h1>
                        <p className="hero-sub">
                            Audit any Android app's permissions, code-level DEX behaviors, and AI-simulated
                            privacy risks.
                        </p>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-num">200+</span>
                                <span className="hero-stat-label">Permissions</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">100%</span>
                                <span className="hero-stat-label">Local</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">AI</span>
                                <span className="hero-stat-label">ML Scoring</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: 3D upload card */}
                    <div className="hero-upload-col">
                        <div ref={cardRef} className="hero-upload-3d">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
