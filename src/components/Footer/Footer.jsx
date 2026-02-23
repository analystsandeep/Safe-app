import React from 'react';
import './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <p className="footer-brand">
                    <span style={{ background: 'linear-gradient(90deg,#c084fc,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Appranium</span>
                    {' '}— Android Privacy Analyzer
                </p>
                <p className="footer-sub">Client-side only &bull; Open for security researchers &bull; v2.0</p>

            </div>
        </footer>
    );
}
