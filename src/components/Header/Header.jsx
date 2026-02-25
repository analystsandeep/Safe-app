import React from 'react';
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-logo">
                    <div className="header-shield-wrap">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span className="header-wordmark">Appranium</span>
                </div>

                <nav className="header-nav">

                    <a
                        className="header-github-link"
                        href="https://github.com/analystsandeep/Safe-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                    </a>
                </nav>
            </div>
        </header>
    );
}
