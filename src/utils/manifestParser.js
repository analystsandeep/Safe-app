import { handleFile } from './fileHandler.js';
import { extractPermissions } from './permissionExtractor.js';
import { calculateRiskScore } from './riskScorer.js';
import { detectSuspiciousCombos } from './comboDetector.js';
import { analyzeManifest } from './manifestAnalyzer.js';
import { analyzeComponents } from './componentAnalyzer.js';
import { extractMetadata } from './metadataExtractor.js';
import { categorizeByDomain } from './domainCategorizer.js';
import PERMISSION_DATABASE from '../data/permissionDatabase.js';

import { scanDexWorkerFriendly } from './dexScanner.js';
import { simulateBehaviors } from './simulationEngine.js';
import { adjustScore } from './mlRiskModel.js';
import { ENABLE_DEX_ANALYSIS, ENABLE_BEHAVIOR_SIMULATION, ENABLE_ML_SCORING } from '../config.js';

export async function analyzeFile(file, customWeights = null) {
    const { manifestContent, fileType, fileName, dexBuffer } = await handleFile(file);

    const permissions = extractPermissions(manifestContent);

    const permissionDetails = permissions.map(perm => {
        const entry = PERMISSION_DATABASE[perm] || {
            risk: 'unknown',
            description: 'This permission is not in our database. Review manually.',
            category: 'Unknown'
        };
        // Rule-based permissions have 90% confidence
        return { name: perm, shortName: perm.split('.').pop(), ...entry, confidence: 0.9 };
    });

    // Code-level analysis (DEX)
    let dexAnalysis = null;
    if (ENABLE_DEX_ANALYSIS && dexBuffer) {
        // Run DEX analysis in a background Web Worker
        dexAnalysis = await new Promise((resolve) => {
            try {
                // Determine path based on environment (Vite handles new URL)
                const workerUrl = new URL('../workers/dexWorker.js', import.meta.url).href;

                // Workaround for some Vite/Vitest environments where Worker might not exist
                if (typeof Worker === 'undefined') {
                    import('./dexScanner.js').then(({ scanDexWorkerFriendly }) => {
                        resolve(scanDexWorkerFriendly(dexBuffer));
                    }).catch(err => {
                        console.error("DEX fallback failed", err);
                        resolve(null);
                    });
                    return;
                }

                const worker = new Worker(workerUrl, { type: 'module' });
                worker.onmessage = (e) => {
                    const { status, findings, error } = e.data;
                    if (status === 'SUCCESS') {
                        resolve(findings);
                    } else {
                        console.error('DEX Worker Error:', error);
                        resolve(null);
                    }
                    worker.terminate();
                };
                worker.onerror = (err) => {
                    console.error('DEX Worker caught standard error:', err);
                    resolve(null);
                    worker.terminate();
                };
                worker.postMessage({ type: 'SCAN_DEX', dexBuffer });
            } catch (err) {
                console.error('Failed to spawn DEX worker fallback:', err);

                // Fallback for tests or unsupported environments
                import('./dexScanner.js').then(({ scanDexWorkerFriendly }) => {
                    resolve(scanDexWorkerFriendly(dexBuffer));
                }).catch(() => resolve(null));
            }
        });
    }

    const manifestAnalysis = analyzeManifest(manifestContent);

    // Behavior Simulation
    let simulations = [];
    if (ENABLE_BEHAVIOR_SIMULATION) {
        simulations = simulateBehaviors({
            permissions: permissionDetails,
            dexAnalysis,
            manifestAnalysis,
            rawManifest: manifestContent
        });
    }

    // ML Analysis
    let mlResult = null;
    if (ENABLE_ML_SCORING) {
        mlResult = await adjustScore(permissions);
    }

    const riskScore = calculateRiskScore(permissions, dexAnalysis, simulations, mlResult, customWeights);
    const suspiciousCombos = detectSuspiciousCombos(permissions);
    const componentAnalysis = analyzeComponents(manifestContent);
    const metadata = extractMetadata(manifestContent, fileName);
    const domainProfile = categorizeByDomain(permissions);

    return {
        success: true,
        fileName,
        fileType,
        timestamp: new Date().toISOString(),
        metadata,
        permissions: permissionDetails,
        totalPermissions: permissions.length,
        riskScore,
        suspiciousCombos,
        manifestAnalysis,
        componentAnalysis,
        domainProfile,
        dexAnalysis,
        simulations,
        rawManifest: manifestContent
    };
}
