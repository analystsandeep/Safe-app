import React from 'react';
import { Collapsible } from '../common/Collapsible.jsx';
import { HiOutlineLightBulb } from 'react-icons/hi2';
import './SimulatedRisks.css';

export function SimulatedRisks({ simulations }) {
    if (!simulations || simulations.length === 0) return null;

    return (
        <section className="simulated-risks">
            <Collapsible
                title={
                    <div className="sim-header">
                        <HiOutlineLightBulb className="sim-icon" />
                        <span>Simulated Behavior Forecasts</span>
                        <span className="sim-count-badge">{simulations.length} Threats</span>
                    </div>
                }
                defaultOpen={true}
                accent="#e67e22"
            >
                <div className="simulations-list">
                    {simulations.map((sim, i) => (
                        <div key={i} className="simulation-item">
                            <div className="sim-item-main">
                                <div className="sim-warning-icon">⚠️</div>
                                <div className="sim-item-content">
                                    <h5>{sim.description}</h5>
                                    <p>Heuristic prediction based on combined permission vectors and code patterns.</p>
                                </div>
                                <div className="sim-risk-add">+{sim.points} pts</div>
                            </div>
                            <div className="sim-item-footer">
                                <a href="https://developer.android.com/privacy/best-practices" target="_blank" rel="noreferrer" className="sim-doc-link">
                                    Learn more in Android Docs
                                </a>
                            </div>
                        </div>
                    ))}
                    <div className="sim-disclaimer">
                        Note: These are heuristic predictions. For definitive verification, use full sandbox emulation tools.
                    </div>
                </div>
            </Collapsible>
        </section>
    );
}
