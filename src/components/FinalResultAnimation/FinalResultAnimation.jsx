import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FinalResultAnimation.css';

/* ── Premium Danger State (Cyber-Devil) ── */
function DangerSequence({ onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 1000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            className="anim-overlay scanlines vignette-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="noise-overlay" />
            <div className="scanner-danger" />

            <div className="anim-center-stage shake-intense">
                <motion.div
                    className="premium-glow-crimson glitch-active"
                    initial={{ scale: 2, opacity: 0, rotate: 10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                    <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
                        {/* Horns */}
                        <path d="M25 40C15 20 10 10 5 15C0 20 15 45 25 45H35" stroke="#ff2d55" strokeWidth="4" strokeLinecap="round" />
                        <path d="M95 40C105 20 110 10 115 15C120 20 105 45 95 45H85" stroke="#ff2d55" strokeWidth="4" strokeLinecap="round" />

                        {/* Skull Main Body */}
                        <path d="M60 25C40 25 25 40 25 60C25 75 35 90 45 95V105H75V95C85 90 95 75 95 60C95 40 80 25 60 25Z" fill="rgba(20, 0, 0, 0.8)" stroke="#ff2d55" strokeWidth="2.5" />

                        {/* Broken Glitched Jaw */}
                        <motion.path
                            d="M45 105C45 105 50 115 60 115C70 115 75 105 75 105"
                            stroke="#ff2d55"
                            strokeWidth="3"
                            initial={{ y: 0 }}
                            animate={{ y: [0, 5, 0], x: [0, -2, 2, 0] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                        />

                        {/* Malicious Glowing Eyes */}
                        <motion.g animate={{ filter: ["brightness(1)", "brightness(2)", "brightness(1)"] }} transition={{ duration: 0.1, repeat: Infinity }}>
                            <path d="M40 55L50 65M50 55L40 65" stroke="#ff2d55" strokeWidth="4" strokeLinecap="round" />
                            <path d="M70 55L80 65M80 55L70 65" stroke="#ff2d55" strokeWidth="4" strokeLinecap="round" />
                        </motion.g>

                        {/* Internal Digital Circuits */}
                        <path d="M55 30V45M65 30V45M40 80H80" stroke="#ff2d55" strokeWidth="0.5" strokeOpacity="0.4" />
                    </svg>
                </motion.div>

                <motion.div
                    className="anim-label label-danger chromatic-text"
                    data-text="CRITICAL SYSTEM BREACH"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1.2, 1], opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    style={{ fontSize: '20px', letterSpacing: '0.4em' }}
                >
                    CRITICAL SYSTEM BREACH
                </motion.div>
            </div>

        </motion.div>
    );
}

/* ── Premium Safe State (Crystalline Shield) ── */
function SafeSequence({ onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 1000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            className="anim-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="anim-center-stage">
                <motion.div
                    className="premium-glow-emerald crystal-pulse"
                    initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                        {/* Crystalline Shield */}
                        <path d="M70 20L110 35V75C110 100 70 120 70 120C70 120 30 100 30 75V35L70 20Z" fill="rgba(61, 220, 132, 0.1)" stroke="#3DDC84" strokeWidth="2" />
                        <path d="M70 30L100 42V72C100 92 70 110 70 110C70 110 40 92 40 72V42L70 30Z" fill="rgba(61, 220, 132, 0.05)" />
                        {/* Verified Check */}
                        <motion.path
                            d="M55 70L65 80L85 60"
                            stroke="#3DDC84"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        />
                        {/* Geometric "Crystal" Lines */}
                        <path d="M70 20V120M30 75H110" stroke="#3DDC84" strokeWidth="0.5" strokeOpacity="0.2" />
                    </svg>
                </motion.div>

                <motion.div
                    className="anim-label label-safe"
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    animate={{ opacity: 1, letterSpacing: "0.25em" }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    VERIFIED SECURE
                </motion.div>
            </div>

            {/* Ethereal Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#3DDC84',
                        boxShadow: '0 0 10px #3DDC84'
                    }}
                    initial={{
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: (Math.random() - 0.5) * 300 - 100,
                        opacity: [0, 0.6, 0],
                        scale: [0, 1.2, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </motion.div>
    );
}

export function FinalResultAnimation({ grade, onComplete }) {
    const isSafe = ['A', 'B'].includes(grade);
    const isCritical = ['C', 'D', 'F'].includes(grade);

    if (!isSafe && !isCritical) return null;

    return (
        <AnimatePresence>
            {isSafe && <SafeSequence key="safe" onDone={onComplete} />}
            {isCritical && <DangerSequence key="danger" onDone={onComplete} />}
        </AnimatePresence>
    );
}
