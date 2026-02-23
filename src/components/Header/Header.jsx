import React from 'react';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-logo">
                    <span className="header-shield-icon">
                        <HiOutlineShieldCheck size={28} />
                    </span>
                    <h1 className="header-title">Appranium</h1>
                </div>
                <div className="header-badge">
                    <span className="header-privacy-chip">100% Local</span>
                </div>
            </div>
        </header>
    );
}
