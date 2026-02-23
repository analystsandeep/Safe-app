import React from 'react';
import { Card } from '../common/Card.jsx';
import { AppIcons } from '../common/icons.jsx';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './RiskCharts.css';

const RISK_PIE_DATA = (breakdown) => [
    { name: 'High Risk', value: breakdown.high, color: '#ef4444' },
    { name: 'Medium', value: breakdown.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: breakdown.low, color: '#22c55e' },
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

const TICK = { fill: '#9d9bc0', fontSize: 11, fontFamily: 'Inter' };

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
                            {pieData.map((d, i) => (
                                <radialGradient key={i} id={`pg${i}`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor={d.color} stopOpacity={0.95} />
                                    <stop offset="100%" stopColor={d.color} stopOpacity={0.55} />
                                </radialGradient>
                            ))}
                        </defs>
                        <Pie data={pieData} cx="50%" cy="50%"
                            innerRadius={62} outerRadius={100}
                            paddingAngle={4} dataKey="value"
                            label={<InnerLabel />} labelLine={false}>
                            {pieData.map((e, i) => <Cell key={i} fill={`url(#pg${i})`} stroke={e.color} strokeWidth={1} />)}
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
                                    <stop offset="0%" stopColor={d.fill} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={d.fill} stopOpacity={0.3} />
                                </linearGradient>
                            ))}
                        </defs>
                        <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={90} tick={TICK} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}
                            label={{ position: 'right', fill: '#9d9bc0', fontSize: 10, fontWeight: 700 }}>
                            {barData.map((e, i) => <Cell key={i} fill={`url(#bg${i})`} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
