import React from 'react';

const RISK_COLORS = {
    critical: '#ff2d55',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
    unknown: '#71717a',
};

export function Badge({ text, color = '#c084fc', textColor = '#08080f', size = 'medium' }) {
    const padding = size === 'small' ? '2px 8px' : '4px 13px';
    const fontSize = size === 'small' ? '0.68rem' : '0.72rem';
    return (
        <span style={{
            display: 'inline-block', padding, borderRadius: '99px',
            fontSize, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px',
            background: color, color: textColor, whiteSpace: 'nowrap',
            boxShadow: `0 0 12px ${color}50`,
        }}>
            {text}
        </span>
    );
}

export function RiskBadge({ risk }) {
    const color = RISK_COLORS[risk] || '#71717a';
    return <Badge text={risk} color={color} textColor="white" />;
}
