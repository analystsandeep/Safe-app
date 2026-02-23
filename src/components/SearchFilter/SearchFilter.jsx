import React, { useState, useMemo } from 'react';
import './SearchFilter.css';

const RISK_FILTERS = [
    { value: 'all', label: 'All', dot: null },
    { value: 'high', label: 'High', dot: '#ef4444' },
    { value: 'medium', label: 'Medium', dot: '#f59e0b' },
    { value: 'low', label: 'Low', dot: '#22c55e' },
    { value: 'unknown', label: 'Unknown', dot: '#71717a' },
];

export function SearchFilter({ permissions, children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [sortBy, setSortBy] = useState('risk');

    const filtered = useMemo(() => {
        const RISK_ORDER = { high: 0, medium: 1, low: 2, unknown: 3 };
        let result = permissions;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.shortName.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }
        if (riskFilter !== 'all') result = result.filter(p => p.risk === riskFilter);
        return [...result].sort((a, b) => {
            if (sortBy === 'risk') return (RISK_ORDER[a.risk] ?? 99) - (RISK_ORDER[b.risk] ?? 99);
            if (sortBy === 'name') return a.shortName.localeCompare(b.shortName);
            if (sortBy === 'category') return a.category.localeCompare(b.category) || a.shortName.localeCompare(b.shortName);
            return 0;
        });
    }, [permissions, searchQuery, riskFilter, sortBy]);

    return (
        <div>
            <div className="search-filter-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search permissions"
                />
                <div className="risk-filter-btns">
                    {RISK_FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`rf-btn ${riskFilter === f.value ? 'active' : ''}`}
                            onClick={() => setRiskFilter(f.value)}
                        >
                            {f.dot && (
                                <span className="rf-dot" style={{ background: f.dot, boxShadow: `0 0 6px ${f.dot}` }} />
                            )}
                            {f.label}
                        </button>
                    ))}
                </div>
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    aria-label="Sort permissions"
                >
                    <option value="risk">By Risk</option>
                    <option value="name">Alphabetical</option>
                    <option value="category">By Category</option>
                </select>
            </div>
            <div className="filter-count">
                Showing <strong>{filtered.length}</strong> of <strong>{permissions.length}</strong> permissions
            </div>
            {children(filtered)}
        </div>
    );
}
