import React, { useCallback, useState } from 'react';
import './FileUpload.css';

export function FileUpload({ onFileSelect, loading, error }) {
    const [dragging, setDragging] = useState(false);

    const handleFile = useCallback((file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'apk' && ext !== 'xml') {
            alert('Please upload a .apk or .xml file.');
            return;
        }
        onFileSelect(file);
    }, [onFileSelect]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onInputChange = (e) => handleFile(e.target.files[0]);
    const onKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-input').click();
    };

    return (
        <div className="upload-module">
            <div className="upload-backlight" />

            <div
                id="upload-zone"
                className={`upload-zone${dragging ? ' dragging' : ''}${loading ? ' loading' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => !loading && document.getElementById('file-input').click()}
                onKeyDown={onKeyDown}
                tabIndex={0}
                role="button"
                aria-label="Upload APK or AndroidManifest.xml file"
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".apk,.xml"
                    style={{ display: 'none' }}
                    onChange={onInputChange}
                />

                {loading ? (
                    <div className="upload-loading">
                        <div className="spinner" />
                        <p className="upload-loading-text">Analyzing manifest…</p>
                        <p className="upload-loading-sub">Classifying permissions & risks</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="upload-primary">Drop your file here</p>
                        <p className="upload-secondary">or <span className="upload-link">browse to upload</span></p>
                        <div className="upload-formats">
                            <span className="format-pill">.apk</span>
                            <span className="format-pill">.xml</span>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="upload-error" role="alert">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
