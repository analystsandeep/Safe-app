import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './RiskCharts.css';

const RISK_PIE_DATA = (breakdown) => [
    { name: 'High Risk', value: breakdown.high, color: '#DC143C' },
    { name: 'Medium', value: breakdown.medium, color: '#D4A017' },
    { name: 'Low Risk', value: breakdown.low, color: '#3DDC84' },
    { name: 'Unknown', value: breakdown.unknown, color: '#52525b' },
].filter(d => d.value > 0);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        const d = payload[0];
        const color = d.payload?.color || d.fill;
        return (
            <div className="chart-tooltip">
                <div className="ct-dot" style={{ background: color }} />
                <div>
                    <p className="ct-name">{d.name || d.payload?.name}</p>
                    <p className="ct-value">{d.value} permission{d.value !== 1 ? 's' : ''}</p>
                </div>
            </div>
        );
    }
    return null;
};

const TICK = { fill: '#8E8E9A', fontSize: 11, fontFamily: 'Plus Jakarta Sans, Inter' };

const InnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.08) return null;
    const R = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.58;
    return (
        <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
            fill="white" textAnchor="middle" dominantBaseline="central"
            fontSize={12} fontWeight={700} fontFamily="Inter">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function RiskCharts({ riskBreakdown, domainProfile }) {
    const pieData = RISK_PIE_DATA(riskBreakdown);
    const barData = Object.entries(domainProfile)
        .map(([name, d]) => ({ name, count: d.count, fill: d.color }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="charts-row">
            <Card icon={AppIcons.PieChart} title="Risk Distribution" className="chart-card">
                <ResponsiveContainer width="100%" height={270}>
                    <PieChart>
                        <defs>
                            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                <feComponentTransfer in="blur" result="dimmed">
                                    <feFuncA type="linear" slope="0.4" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode in="dimmed" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <linearGradient id="glassSheen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
                                <stop offset="30%" stopColor="#fff" stopOpacity="0" />
                                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                            </linearGradient>

                            {pieData.map((d, i) => (
                                <linearGradient key={i} id={`pg${i}`} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
                                </linearGradient>
                            ))}
                        </defs>
                        <Pie data={pieData} cx="50%" cy="50%"
                            innerRadius={62} outerRadius={100}
                            paddingAngle={5} dataKey="value"
                            label={<InnerLabel />} labelLine={false}
                            stroke="none"
                        >
                            {pieData.map((e, i) => (
                                <Cell
                                    key={i}
                                    fill={`url(#pg${i})`}
                                    style={{
                                        filter: 'url(#softGlow)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8}
                            formatter={v => <span style={{ color: '#9d9bc0', fontSize: '0.78rem' }}>{v}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card icon={AppIcons.BarChart} title="Data Domain Exposure" className="chart-card">
                <ResponsiveContainer width="100%" height={270}>
                    <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }} barCategoryGap="28%">
                        <defs>
                            {barData.map((d, i) => (
                                <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={d.fill} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={d.fill} stopOpacity={0.2} />
                                </linearGradient>
                            ))}
                        </defs>
                        <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={90} tick={TICK} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {barData.map((e, i) => (
                                <Cell
                                    key={i}
                                    fill={`url(#bg${i})`}
                                    style={{ filter: 'url(#softGlow)' }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
