import React from 'react';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import './PrivacyBadge.css';
import '../common/icon-box.css';

export function PrivacyBadge() {
    return (
        <div className="privacy-badge">
            <div className="pb-inner">
                <span className="pb-icon-wrap">
                    <HiOutlineLockClosed size={22} />
                </span>
                <div>
                    <p className="pb-headline">100% Local Processing</p>
                    <p className="pb-details">
                        No files are uploaded to any server &bull; No API calls are made with your data &bull; All analysis runs in-memory in your browser
                    </p>
                </div>
            </div>
        </div>
    );
}
