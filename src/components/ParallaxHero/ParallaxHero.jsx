import React, { useEffect, useRef } from 'react';
import './ParallaxHero.css';

/* Floating glass orb for midground layer */
function FloatingOrb({ style }) {
    return <div className="parallax-orb" style={style} />;
}

const ORBS = [
    { width: 80, height: 80, top: '15%', left: '8%', opacity: 0.35, speed: 0.25 },
    { width: 50, height: 50, top: '35%', left: '88%', opacity: 0.25, speed: 0.3 },
    { width: 120, height: 120, top: '60%', left: '75%', opacity: 0.2, speed: 0.2 },
    { width: 40, height: 40, top: '70%', left: '15%', opacity: 0.3, speed: 0.35 },
    { width: 65, height: 65, top: '20%', left: '55%', opacity: 0.2, speed: 0.18 },
    { width: 30, height: 30, top: '80%', left: '45%', opacity: 0.28, speed: 0.4 },
    { width: 90, height: 90, top: '50%', left: '30%', opacity: 0.15, speed: 0.22 },
    { width: 45, height: 45, top: '10%', left: '70%', opacity: 0.22, speed: 0.28 },
];

export function ParallaxHero({ children }) {
    const containerRef = useRef(null);
    const orbRefs = useRef([]);
    const fgRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        let scrollY = 0;

        const onScroll = () => { scrollY = window.scrollY; };
        window.addEventListener('scroll', onScroll, { passive: true });

        const animate = () => {
            // Foreground (hero content) — fastest
            if (fgRef.current) {
                fgRef.current.style.transform = `translateY(${scrollY * -0.04}px)`;
            }
            // Midground orbs — medium speed, each slightly different
            orbRefs.current.forEach((el, i) => {
                if (el) {
                    const speed = (ORBS[i]?.speed ?? 0.25) * 1.5;
                    el.style.transform = `translateY(${scrollY * -speed}px)`;
                }
            });
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="parallax-hero-wrap">
            {/* Midground — floating glass orbs */}
            <div className="parallax-midground" aria-hidden="true">
                {ORBS.map((orb, i) => (
                    <div
                        key={i}
                        ref={(el) => { orbRefs.current[i] = el; }}
                        className="parallax-orb"
                        style={{
                            width: orb.width,
                            height: orb.height,
                            top: orb.top,
                            left: orb.left,
                            opacity: orb.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Foreground — actual hero content */}
            <div ref={fgRef} className="parallax-foreground">
                {children}
            </div>
        </div>
    );
}
