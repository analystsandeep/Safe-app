import React from 'react';
import { Collapsible } from '../common/Collapsible.jsx';
import { HiOutlineCodeBracket } from 'react-icons/hi2';
import './CodeLevelInsights.css';

export function CodeLevelInsights({ dexAnalysis }) {
    if (!dexAnalysis) return null;

    const hasFindings = Object.values(dexAnalysis).some(arr => arr && arr.length > 0);

    return (
        <section className="code-level-insights">
            <Collapsible
                title={
                    <div className="insight-header">
                        <HiOutlineCodeBracket className="insight-icon" />
                        <span>Code-Level Insights</span>
                        {!hasFindings && <span className="no-findings-badge">No suspicious patterns found</span>}
                    </div>
                }
                defaultOpen={hasFindings}
                accent="#3498db"
            >
                {!hasFindings ? (
                    <p className="no-findings-text">
                        The basic decompilation of <code>classes.dex</code> did not reveal any obvious runtime permission requests, dynamic loading, or known data sinks.
                    </p>
                ) : (
                    <div className="findings-grid">
                        {dexAnalysis.runtimePerms.length > 0 && (
                            <div className="finding-category">
                                <h4>Runtime Permissions</h4>
                                <ul>
                                    {dexAnalysis.runtimePerms.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <small>Potentially bypassing manifest checks via dynamic requests.</small>
                            </div>
                        )}
                        {dexAnalysis.dynamicLoads.length > 0 && (
                            <div className="finding-category">
                                <h4>Dynamic Code Loading</h4>
                                <ul>
                                    {dexAnalysis.dynamicLoads.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <small>Risk of executing hidden or non-audited code logic.</small>
                            </div>
                        )}
                        {dexAnalysis.dataSinks.length > 0 && (
                            <div className="finding-category">
                                <h4>Data Sinks (Network/Storage)</h4>
                                <ul>
                                    {dexAnalysis.dataSinks.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <small>Points in the code where data is transmitted or persisted.</small>
                            </div>
                        )}
                        {dexAnalysis.suspiciousStrings.length > 0 && (
                            <div className="finding-category">
                                <h4>Suspicious API Usages</h4>
                                <ul>
                                    {dexAnalysis.suspiciousStrings.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <small>Detected access to sensitive device identifiers or state.</small>
                            </div>
                        )}
                    </div>
                )}
            </Collapsible>
        </section>
    );
}
