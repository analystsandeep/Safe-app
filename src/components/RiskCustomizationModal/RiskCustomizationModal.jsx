import React, { useState, useEffect } from 'react';
import { saveWeights, getAllProfiles } from '../../utils/customStore.js';
import './RiskCustomizationModal.css';

export function RiskCustomizationModal({ isOpen, onClose, currentWeights, onApply }) {
    const [weights, setWeights] = useState(currentWeights || { high: 20, medium: 10, low: 2, unknown: 5 });
    const [profileName, setProfileName] = useState('My Security Profile');

    useEffect(() => {
        if (currentWeights) setWeights(currentWeights);
    }, [currentWeights]);

    if (!isOpen) return null;

    const handleSave = async () => {
        await saveWeights(profileName, weights);
        onApply(weights);
        onClose();
    };

    const handleChange = (key, value) => {
        setWeights(prev => ({ ...prev, [key]: parseInt(value) }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>Customize Risk Weights</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    <p className="modal-desc">Adjust how much each risk level contributes to the overall score.</p>

                    <div className="weight-input-group">
                        <label>Profile Name</label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="text-input"
                        />
                    </div>

                    <div className="sliders-container">
                        {[
                            { key: 'high', label: 'High Risk Permissions', color: '#e74c3c' },
                            { key: 'medium', label: 'Medium Risk Permissions', color: '#e67e22' },
                            { key: 'low', label: 'Low Risk Permissions', color: '#27ae60' },
                            { key: 'unknown', label: 'Unknown Permissions', color: '#95a5a6' }
                        ].map(item => (
                            <div key={item.key} className="slider-item">
                                <div className="slider-label">
                                    <span style={{ color: item.color }}>{item.label}</span>
                                    <span className="weight-value">{weights[item.key]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={weights[item.key]}
                                    onChange={(e) => handleChange(item.key, e.target.value)}
                                    className="range-input"
                                    style={{ accentColor: item.color }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button onClick={handleSave} className="apply-btn">Apply & Save</button>
                </div>
            </div>
        </div>
    );
}
