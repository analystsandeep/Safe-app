import React, { useState, useEffect } from 'react';
import { useAnalysis } from './hooks/useAnalysis.js';

// Core FX
import { MouseGlow } from './components/MouseGlow/MouseGlow.jsx';
import { BattleScene } from './components/BattleScene/BattleScene.jsx';
import { ParallaxHero } from './components/ParallaxHero/ParallaxHero.jsx';
import { FinalResultAnimation } from './components/FinalResultAnimation/FinalResultAnimation.jsx';

// Components
import { Header } from './components/Header/Header.jsx';
import { FileUpload } from './components/FileUpload/FileUpload.jsx';
import { HowItWorks } from './components/HowItWorks/HowItWorks.jsx';
import { TerminalDemo } from './components/TerminalDemo/TerminalDemo.jsx';
import { EducationalInsights } from './components/EducationalInsights/EducationalInsights.jsx';
import { AppOverview } from './components/AppOverview/AppOverview.jsx';
import { RiskScore } from './components/RiskScore/RiskScore.jsx';
import { SuspiciousCombos } from './components/SuspiciousCombos/SuspiciousCombos.jsx';

import { RiskCharts } from './components/RiskCharts/RiskCharts.jsx';
import { SearchFilter } from './components/SearchFilter/SearchFilter.jsx';
import { PermissionBreakdown } from './components/PermissionBreakdown/PermissionBreakdown.jsx';
import { DataExposureProfile } from './components/DataExposureProfile/DataExposureProfile.jsx';
import { StickyRiskPanel } from './components/StickyRiskPanel/StickyRiskPanel.jsx';
import { WhyAppranium } from './components/WhyAppranium/WhyAppranium.jsx';
import { Footer } from './components/Footer/Footer.jsx';

// Advanced Features
import { CodeLevelInsights } from './components/CodeLevelInsights/CodeLevelInsights.jsx';
import { SimulatedRisks } from './components/SimulatedRisks/SimulatedRisks.jsx';
import { RiskCustomizationModal } from './components/RiskCustomizationModal/RiskCustomizationModal.jsx';

import './App.css';

function App() {
    const { result, loading, error, analyze, reset } = useAnalysis();
    const [showAnimation, setShowAnimation] = useState(false);
    const [animPlayed, setAnimPlayed] = useState(false);
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customWeights, setCustomWeights] = useState(null);

    const handleAnalyze = (file) => analyze(file, customWeights);

    // Trigger cinematic animation when a new result arrives
    useEffect(() => {
        if (result && !animPlayed) {
            setShowAnimation(true);
            setAnimPlayed(true);
        }
        if (!result) {
            setAnimPlayed(false);
            setShowAnimation(false);
        }
    }, [result, animPlayed]);

    const handleAnimComplete = () => setShowAnimation(false);

    return (
        <div className="app-root">
            {/* ── Global immersive FX ── */}
            <MouseGlow />

            {/* ── 3D Battle Scene — only on landing ── */}
            {!result && <BattleScene />}

            {/* ── Cinematic result animation ── */}
            {showAnimation && result && (
                <FinalResultAnimation
                    grade={result.riskScore.grade}
                    onComplete={handleAnimComplete}
                />
            )}

            <Header />

            {/* Sticky risk panel — shows when user scrolls past the risk score card */}
            {result && (
                <StickyRiskPanel
                    riskScore={result.riskScore}
                    suspiciousCombos={result.suspiciousCombos}
                    onReset={reset}
                />
            )}

            <main className="app-main">
                {/* ── LANDING PAGE (no file yet) ── */}
                {!result && (
                    <>
                        <ParallaxHero>
                            <FileUpload onFileSelect={handleAnalyze} loading={loading} error={error} />
                        </ParallaxHero>
                        <HowItWorks />
                        <TerminalDemo />
                        <EducationalInsights />
                        <WhyAppranium />
                    </>
                )}

                {/* ── REPORT PAGE (file analyzed) ── */}
                {result && !showAnimation && (
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

                        {/* Sentinel element — StickyRiskPanel watches this */}
                        <div id="risk-score-sentinel" />

                        {/* Row 1: Overview + Risk score side by side */}
                        <div className="split-row">
                            <AppOverview metadata={result.metadata} fileType={result.fileType} />
                            <RiskScore
                                data={result.riskScore}
                                totalPermissions={result.totalPermissions}
                                permissions={result.permissions}
                                onOpenCustomization={() => setIsCustomOpen(true)}
                            />
                        </div>

                        {/* Advanced Security Insights */}
                        <CodeLevelInsights dexAnalysis={result.dexAnalysis} />
                        <SimulatedRisks simulations={result.simulations} />

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
                        <DataExposureProfile domains={result.domainProfile} />
                    </>
                )}
            </main>

            <RiskCustomizationModal
                isOpen={isCustomOpen}
                onClose={() => setIsCustomOpen(false)}
                currentWeights={customWeights}
                onApply={(weights) => {
                    setCustomWeights(weights);
                    // Re-analyze if there's already a result
                    // This is a bit tricky since we don't have the file object anymore
                    // But in a real app, analyze might take data instead of just file
                    // For now, it will apply to the NEXT scan.
                }}
            />

            <Footer />
        </div>
    );
}

export default App;
