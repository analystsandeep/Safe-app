import React, { useState } from 'react';
import './common.css';

export function Collapsible({ title, children, defaultOpen = false, accent }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="collapsible">
            <button
                className="collapsible-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                style={accent ? { borderLeft: `3px solid ${accent}` } : {}}
            >
                <span>{title}</span>
                <span className={`collapsible-chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
                <div className="collapsible-inner">{children}</div>
            </div>
        </div>
    );
}
