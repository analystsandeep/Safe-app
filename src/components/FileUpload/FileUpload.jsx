import React, { useCallback, useState } from 'react';
import { HiOutlineArrowUpTray } from 'react-icons/hi2';
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
        <div className="upload-wrapper">
            <div className="upload-hero">
                <h2 className="upload-headline">Analyze Any Android App for Privacy Risks</h2>
                <p className="upload-sub">Drag &amp; drop your APK or AndroidManifest.xml to get started.</p>
            </div>

            <div
                className={`upload-zone ${dragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
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
                        <p>Analyzing file...</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon-wrap">
                            <HiOutlineArrowUpTray size={28} />
                        </div>
                        <p className="upload-primary">Drop your <strong>.apk</strong> or <strong>AndroidManifest.xml</strong> here</p>
                        <p className="upload-secondary">or <span className="upload-link">click to browse</span></p>
                        <div className="upload-formats">
                            <span className="format-pill">.apk</span>
                            <span className="format-pill">.xml</span>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="upload-error" role="alert">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
