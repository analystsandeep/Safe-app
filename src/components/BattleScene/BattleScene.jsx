import React, { useEffect, useRef } from 'react';
import './BattleScene.css';

/* ── Heroic Google Android (Left) ── */
function HeroAndroid() {
    return (
        <div className="android-figure hero-android" aria-hidden="true">
            {/* Body */}
            <div className="and-body">
                {/* Head */}
                <div className="and-head">
                    <div className="and-antenna and-antenna-l" />
                    <div className="and-antenna and-antenna-r" />
                    <div className="and-eye and-eye-l" />
                    <div className="and-eye and-eye-r" />
                </div>
                {/* Torso */}
                <div className="and-torso">
                    <div className="and-arm and-arm-l" />
                    <div className="and-arm and-arm-r" />
                    <div className="and-torso-body">
                        <div className="and-badge">✓</div>
                    </div>
                    <div className="and-leg and-leg-l" />
                    <div className="and-leg and-leg-r" />
                </div>
            </div>
            {/* Aura */}
            <div className="android-aura hero-aura" />
            <div className="android-shadow hero-shadow" />
            {/* Halo ring */}
            <div className="hero-halo" />
        </div>
    );
}

/* ── Evil Devil Android (Right) ── */
function DevilAndroid() {
    return (
        <div className="android-figure devil-android" aria-hidden="true">
            {/* Aura */}
            <div className="android-aura devil-aura" />
            {/* Body */}
            <div className="and-body">
                {/* Devil Head with horns */}
                <div className="and-head devil-head">
                    <div className="devil-horn devil-horn-l" />
                    <div className="devil-horn devil-horn-r" />
                    <div className="and-eye devil-eye and-eye-l" />
                    <div className="and-eye devil-eye and-eye-r" />
                    <div className="devil-mouth" />
                </div>
                {/* Torso */}
                <div className="and-torso">
                    <div className="and-arm and-arm-l devil-arm" />
                    <div className="and-arm and-arm-r devil-arm" />
                    <div className="and-torso-body devil-torso-body">
                        <div className="and-badge devil-badge">☠</div>
                        {/* Spikes on torso */}
                        <div className="torso-spike ts-1" />
                        <div className="torso-spike ts-2" />
                        <div className="torso-spike ts-3" />
                    </div>
                    <div className="and-leg and-leg-l devil-leg" />
                    <div className="and-leg and-leg-r devil-leg" />
                    {/* Devil tail */}
                    <div className="devil-tail" />
                </div>
            </div>
            <div className="android-shadow devil-shadow" />
        </div>
    );
}

/* ── Clash Energy Center ── */
function ClashCenter() {
    return (
        <div className="clash-center" aria-hidden="true">
            <div className="clash-ring clash-ring-1" />
            <div className="clash-ring clash-ring-2" />
            <div className="clash-ring clash-ring-3" />
            <div className="clash-core" />
            <div className="clash-spark cs-1" />
            <div className="clash-spark cs-2" />
            <div className="clash-spark cs-3" />
            <div className="clash-spark cs-4" />
            <div className="clash-spark cs-5" />
            <div className="clash-spark cs-6" />
        </div>
    );
}

export function BattleScene() {
    const heroRef = useRef(null);
    const devilRef = useRef(null);
    const bgRef = useRef(null);
    const clashRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        let scrollY = 0;
        const onScroll = () => { scrollY = window.scrollY; };
        window.addEventListener('scroll', onScroll, { passive: true });

        const animate = () => {
            // Deep background parallax (slowest)
            if (bgRef.current) {
                bgRef.current.style.transform = `translateY(${scrollY * 0.12}px)`;
            }
            // Characters — mid layer
            if (heroRef.current) {
                heroRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
            }
            if (devilRef.current) {
                devilRef.current.style.transform = `translateY(${scrollY * 0.22}px)`;
            }
            // Clash center — slightly faster
            if (clashRef.current) {
                clashRef.current.style.transform = `translateY(${scrollY * 0.3}px) translateX(-50%)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="battle-scene-wrap" aria-hidden="true">
            {/* Deep background layer */}
            <div ref={bgRef} className="battle-bg-layer">
                <div className="battle-bg-glow battle-bg-glow-green" />
                <div className="battle-bg-glow battle-bg-glow-red" />
                <div className="battle-stars" />
            </div>

            {/* Android characters */}
            <div ref={heroRef} className="battle-character-slot battle-left">
                <HeroAndroid />
            </div>
            <div ref={devilRef} className="battle-character-slot battle-right">
                <DevilAndroid />
            </div>

            {/* Clash energy in the center */}
            <div ref={clashRef} className="battle-clash-slot">
                <ClashCenter />
            </div>

            {/* VS Label */}


            {/* Ground line */}
            <div className="battle-ground" />
        </div>
    );
}
