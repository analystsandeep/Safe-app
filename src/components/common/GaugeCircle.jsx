import React, { useEffect, useState } from 'react';

export function GaugeCircle({ value = 0, color = '#c084fc', size = 200, strokeWidth = 14 }) {
    const [animated, setAnimated] = useState(0);
    const radius = (size - strokeWidth * 2) / 2;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (animated / 100) * circ;

    useEffect(() => {
        const t = setTimeout(() => setAnimated(value), 120);
        return () => clearTimeout(t);
    }, [value]);

    // Center text rotation trick
    const cx = size / 2;
    const cy = size / 2;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Risk score: ${value} out of 100`}>
            {/* Glow def */}
            <defs>
                <filter id="gaugeGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {/* Track */}
            <circle cx={cx} cy={cy} r={radius}
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
            {/* Progress */}
            <circle cx={cx} cy={cy} r={radius}
                fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                filter="url(#gaugeGlow)"
                style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)', stroke: color }}
            />
            {/* Score text */}
            <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle"
                fill="#f0eeff" fontSize={size * 0.19} fontWeight="900"
                fontFamily="Inter, sans-serif" letterSpacing="-2">
                {Math.round(animated)}
            </text>
            <text x={cx} y={cy + size * 0.12} textAnchor="middle"
                fill="rgba(157,155,192,0.8)" fontSize={size * 0.09}
                fontFamily="Inter, sans-serif" fontWeight="600">
                /100
            </text>
        </svg>
    );
}
