import React, { useState, useEffect } from 'react';
import { useAnalysis } from './hooks/useAnalysis.js';

// Core FX
import { MouseGlow } from './components/MouseGlow/MouseGlow.jsx';
import { BattleScene } from './components/BattleScene/BattleScene.jsx';
import { ParallaxHero } from './components/ParallaxHero/ParallaxHero.jsx';
import { FinalResultAnimation } from './components/FinalResultAnimation/FinalResultAnimation.jsx';

// Landing components
import { Header } from './components/Header/Header.jsx';
import { FileUpload } from './components/FileUpload/FileUpload.jsx';
import { HowItWorks } from './components/HowItWorks/HowItWorks.jsx';
import { TerminalDemo } from './components/TerminalDemo/TerminalDemo.jsx';
import { EducationalInsights } from './components/EducationalInsights/EducationalInsights.jsx';
import { WhyAppranium } from './components/WhyAppranium/WhyAppranium.jsx';
import { Footer } from './components/Footer/Footer.jsx';

// Report page
import { ReportPage } from './components/ReportPage/ReportPage.jsx';

// Modals / overlays
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
                    <ReportPage
                        result={result}
                        onReset={reset}
                        onOpenCustomization={() => setIsCustomOpen(true)}
                    />
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
