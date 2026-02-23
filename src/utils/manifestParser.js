import { handleFile } from './fileHandler.js';
import { extractPermissions } from './permissionExtractor.js';
import { calculateRiskScore } from './riskScorer.js';
import { detectSuspiciousCombos } from './comboDetector.js';
import { analyzeManifest } from './manifestAnalyzer.js';
import { analyzeComponents } from './componentAnalyzer.js';
import { extractMetadata } from './metadataExtractor.js';
import { categorizeByDomain } from './domainCategorizer.js';
import PERMISSION_DATABASE from '../data/permissionDatabase.js';

export async function analyzeFile(file) {
    const { manifestContent, fileType, fileName } = await handleFile(file);

    const permissions = extractPermissions(manifestContent);

    const permissionDetails = permissions.map(perm => {
        const entry = PERMISSION_DATABASE[perm] || {
            risk: 'unknown',
            description: 'This permission is not in our database. Review manually.',
            category: 'Unknown'
        };
        return { name: perm, shortName: perm.split('.').pop(), ...entry };
    });

    const riskScore = calculateRiskScore(permissions);
    const suspiciousCombos = detectSuspiciousCombos(permissions);
    const manifestAnalysis = analyzeManifest(manifestContent);
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
        rawManifest: manifestContent
    };
}
