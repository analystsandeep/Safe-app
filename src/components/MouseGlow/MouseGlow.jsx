import React, { useEffect, useRef } from 'react';
import './MouseGlow.css';

/**
 * MouseGlow — a soft radial "torchlight" that follows the cursor.
 * Fixed position, pointer-events: none, sits below all UI content.
 */
export function MouseGlow() {
    const glowRef = useRef(null);

    useEffect(() => {
        const el = glowRef.current;
        if (!el) return;

        let raf;
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        const onMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };

        const animate = () => {
            // Lerp for smooth trailing effect
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            el.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMove);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="mouse-glow-container" aria-hidden="true">
            <div ref={glowRef} className="mouse-glow-orb" />
        </div>
    );
}
