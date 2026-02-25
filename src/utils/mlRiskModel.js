import * as tf from '@tensorflow/tfjs';
import { ENABLE_ML_SCORING } from '../config.js';

let model = null;

/**
 * Initializes the ML model for risk scoring.
 * In a production environment, this would load weights from a hosted JSON file.
 */
export async function initModel() {
    if (!ENABLE_ML_SCORING) return;
    if (model) return;

    try {
        // Attempt to load the model from the public folder
        // For development, we'll fallback to a simple mock if it doesn't exist
        model = await tf.loadLayersModel('/models/privacyModel.json');
        console.log('ML Model loaded successfully.');
    } catch (e) {
        console.warn('ML Model could not be loaded, using rule-based fallback.', e);
        model = null;
    }
}

/**
 * Adjusts the risk score based on the permission vector using the ML model.
 * @param {Array<string>} permissions List of permission strings
 * @returns {Promise<{adjustedScore: number, confidence: number}|null>}
 */
export async function adjustScore(permissions) {
    if (!ENABLE_ML_SCORING) return null;

    // Ensure model is initialized (even if fallback)
    await initModel();

    if (!model) {
        // Simulated ML logic for fallback/mocking
        // This simulates a model that reduces risk for "common" permission sets
        return simulateMLPrediction(permissions);
    }

    try {
        const permVector = createPermissionVector(permissions);
        const tensor = tf.tensor2d([permVector]);
        const prediction = model.predict(tensor);
        const data = await prediction.data();

        return {
            adjustedScore: data[0], // Predicted score adjustment (e.g. 0 to 100)
            confidence: data[1] || 0.85 // Predicted confidence
        };
    } catch (e) {
        console.error('Error during ML inference:', e);
        return null;
    }
}

/**
 * Creates a one-hot or normalized vector from permissions.
 * This is a placeholder for actual feature engineering.
 */
function createPermissionVector(permissions) {
    // Simplified: count high/medium/low risk permissions
    // In a real model, this would be a fixed-length array mapping to all possible permissions
    return [
        permissions.length / 50, // total count
        0.5, // placeholder for categories
        0.2
    ];
}

/**
 * Fallback simulation for ML when the actual model isn't available.
 */
function simulateMLPrediction(permissions) {
    // Example: if app has CAMERA but is a "camera app" (e.g. has QR in name or many UI components)
    // we would reduce the score. Since we don't have app type here, we use a simple heuristic.

    // Use a hash-like value from permissions to add some "uniqueness" to the simulated score
    const permHash = permissions.join('').length % 10;

    let adjustment = 15; // Base adjustment
    let confidence = 0.65 + (permHash / 100);

    // Simulate "Context Awareness"
    const hasCamera = permissions.includes('android.permission.CAMERA');
    const hasInternet = permissions.includes('android.permission.INTERNET');
    const hasLocation = permissions.includes('android.permission.ACCESS_FINE_LOCATION');

    if (hasCamera && hasInternet) adjustment += 10;
    if (hasLocation && hasInternet) adjustment += 8;

    // Dampen adjustment based on total count to prevent runaway scores
    adjustment = Math.min(95, adjustment + (permissions.length * 0.5));

    return {
        adjustedScore: Math.round(adjustment),
        confidence: parseFloat(confidence.toFixed(2))
    };
}
