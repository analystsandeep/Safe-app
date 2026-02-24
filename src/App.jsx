import React from 'react';
import { useAnalysis } from './hooks/useAnalysis.js';

// Components
import { Header } from './components/Header/Header.jsx';
import { FileUpload } from './components/FileUpload/FileUpload.jsx';
import { HowItWorks } from './components/HowItWorks/HowItWorks.jsx';
import { TerminalDemo } from './components/TerminalDemo/TerminalDemo.jsx';
import { EducationalInsights } from './components/EducationalInsights/EducationalInsights.jsx';
import { AppOverview } from './components/AppOverview/AppOverview.jsx';
import { RiskScore } from './components/RiskScore/RiskScore.jsx';
import { SuspiciousCombos } from './components/SuspiciousCombos/SuspiciousCombos.jsx';
import { ManifestWarnings } from './components/ManifestWarnings/ManifestWarnings.jsx';
import { ComponentExposure } from './components/ComponentExposure/ComponentExposure.jsx';
import { RiskCharts } from './components/RiskCharts/RiskCharts.jsx';
import { SearchFilter } from './components/SearchFilter/SearchFilter.jsx';
import { PermissionBreakdown } from './components/PermissionBreakdown/PermissionBreakdown.jsx';
import { DataExposureProfile } from './components/DataExposureProfile/DataExposureProfile.jsx';
import { Footer } from './components/Footer/Footer.jsx';

import './App.css';

function App() {
    const { result, loading, error, analyze, reset } = useAnalysis();

    return (
        <div className="app-root">
            <Header />
            <main className="app-main">
                {/* ── LANDING PAGE (no file yet) ── */}
                {!result && (
                    <>
                        <FileUpload onFileSelect={analyze} loading={loading} error={error} />
                        <HowItWorks />
                        <TerminalDemo />
                        <EducationalInsights />
                    </>
                )}

                {/* ── REPORT PAGE (file analyzed) ── */}
                {result && (
                    <>
                        <div className="scan-another-bar">
                            <button className="scan-another-btn" onClick={reset}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                                </svg>
                                Scan Another File
                            </button>
                            <span className="scan-file-info">
                                <strong>{result.fileName}</strong>
                            </span>
                        </div>

                        {/* Row 1: Overview + Risk score side by side */}
                        <div className="split-row">
                            <AppOverview metadata={result.metadata} fileType={result.fileType} />
                            <RiskScore data={result.riskScore} totalPermissions={result.totalPermissions} />
                        </div>

                        {/* Row 2: Charts */}
                        {Object.keys(result.domainProfile).length > 0 && (
                            <RiskCharts
                                riskBreakdown={result.riskScore.breakdown}
                                domainProfile={result.domainProfile}
                            />
                        )}

                        {/* Row 3: Permission search + breakdown */}
                        <div style={{ marginTop: '8px' }}>
                            <SearchFilter permissions={result.permissions}>
                                {(filtered) => <PermissionBreakdown permissions={filtered} />}
                            </SearchFilter>
                        </div>

                        {/* Remaining detail sections */}
                        <SuspiciousCombos combos={result.suspiciousCombos} />
                        <ManifestWarnings analysis={result.manifestAnalysis} />
                        <ComponentExposure data={result.componentAnalysis} />
                        <DataExposureProfile domains={result.domainProfile} />
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;
