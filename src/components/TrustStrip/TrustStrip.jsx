import React from 'react';
import './TrustStrip.css';

export function TrustStrip() {
    return (
        <section className="trust-strip-section">
            <div className="trust-strip-label">How your data stays private</div>

            <div className="trust-strip-diagram">
                {/* Node 1 */}
                <div className="trust-node">
                    <div className="trust-node-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <span className="trust-node-label">Your Browser</span>
                </div>

                {/* Connector */}
                <div className="trust-connector">
                    <div className="trust-line">
                        <div className="trust-pulse" />
                    </div>
                    <span className="trust-connector-label">parses locally</span>
                </div>

                {/* Node 2 */}
                <div className="trust-node active">
                    <div className="trust-node-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="2" x2="9" y2="4" /><line x1="15" y1="2" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="22" /><line x1="15" y1="20" x2="15" y2="22" />
                        </svg>
                    </div>
                    <span className="trust-node-label">Local Engine</span>
                </div>

                {/* Connector */}
                <div className="trust-connector">
                    <div className="trust-line">
                        <div className="trust-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="trust-connector-label">zero network</span>
                </div>

                {/* Node 3 */}
                <div className="trust-node">
                    <div className="trust-node-icon blocked">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                    </div>
                    <span className="trust-node-label">No Server</span>
                </div>
            </div>
        </section>
    );
}
