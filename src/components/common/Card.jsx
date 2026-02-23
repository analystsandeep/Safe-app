import React from 'react';
import './common.css';
import './icon-box.css';

export function Card({ title, icon: Icon, children, borderColor, className = '' }) {
    return (
        <div
            className={`card ${className}`}
            style={borderColor ? { borderLeft: `3px solid ${borderColor}` } : {}}
        >
            {(title || Icon) && (
                <div className="card-header">
                    {Icon && (
                        <span className="card-icon-wrap">
                            {typeof Icon === 'string' ? Icon : <Icon size={18} />}
                        </span>
                    )}
                    {title && <h2 className="card-title">{title}</h2>}
                </div>
            )}
            <div className="card-body">{children}</div>
        </div>
    );
}
