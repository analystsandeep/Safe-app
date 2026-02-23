import { useState, useCallback } from 'react';
import { analyzeFile } from '../utils/manifestParser.js';

export function useAnalysis() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyze = useCallback(async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysisResult = await analyzeFile(file);
            setResult(analysisResult);
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try a valid file.');
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResult(null);
        setError(null);
        setLoading(false);
    }, []);

    return { result, loading, error, analyze, reset };
}
