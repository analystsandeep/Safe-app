import React from 'react';
import {
    HiOutlineShieldCheck,
    HiOutlineCube,
    HiOutlineFire,
    HiOutlineExclamationTriangle,
    HiOutlineDocumentMagnifyingGlass,
    HiOutlineLockOpen,
    HiOutlineChartPie,
    HiOutlinePresentationChartBar,
    HiOutlineMagnifyingGlass,
    HiOutlineCpuChip,
    HiOutlineBookOpen,
    HiOutlineLockClosed,
    HiOutlineCpuChip as HiBrain,
    HiOutlineFingerPrint,
    HiOutlineBellAlert,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineShieldExclamation
} from 'react-icons/hi2';

// Re-export all icons for use across the app as a central registry
export const AppIcons = {
    Shield: HiOutlineShieldCheck,
    Package: HiOutlineCube,
    Risk: HiOutlineFire,
    Warning: HiOutlineExclamationTriangle,
    Manifest: HiOutlineDocumentMagnifyingGlass,
    Exposure: HiOutlineLockOpen,
    PieChart: HiOutlineChartPie,
    BarChart: HiOutlinePresentationChartBar,
    Search: HiOutlineMagnifyingGlass,
    DataMap: HiOutlineCpuChip,
    BookOpen: HiOutlineBookOpen,
    Lock: HiOutlineLockClosed,
    Brain: HiBrain,
    Critical: HiOutlineBellAlert,
    Success: HiOutlineCheckCircle,
    Info: HiOutlineExclamationCircle,
    Security: HiOutlineShieldExclamation
};

// Domain category icons
import {
    HiOutlineMapPin,
    HiOutlineChatBubbleLeftRight,
    HiOutlineUsers,
    HiOutlineCamera,
    HiOutlineCircleStack,
    HiOutlinePhone,
    HiOutlineCalendarDays,
    HiOutlineSignalSlash,
    HiOutlineWifi,
    HiOutlineCog6Tooth,
    HiOutlineCreditCard,
    HiOutlineMusicalNote,
    HiOutlineGlobeAlt,
    HiOutlineDevicePhoneMobile,
    HiOutlineMicrophone,
    HiOutlineEnvelope,
    HiOutlineWindow,
} from 'react-icons/hi2';

export const DomainIcons = {
    'Location': HiOutlineMapPin,
    'Communication': HiOutlineChatBubbleLeftRight,
    'Contacts': HiOutlineUsers,
    'Camera': HiOutlineCamera,
    'Storage': HiOutlineCircleStack,
    'Phone': HiOutlinePhone,
    'Calendar': HiOutlineCalendarDays,
    'Sensors': HiOutlineSignalSlash,
    'Network': HiOutlineWifi,
    'System': HiOutlineCog6Tooth,
    'Financial': HiOutlineCreditCard,
    'Identity': HiOutlineFingerPrint,
    'Media': HiOutlineMusicalNote,
    'Internet': HiOutlineGlobeAlt,
    'Device': HiOutlineDevicePhoneMobile,
    'Default': HiOutlineShieldCheck,
};

// Specific Permission Icons for RiskScore and Breakdown
export const PermissionIcons = {
    CAMERA: HiOutlineCamera,
    RECORD_AUDIO: HiOutlineMicrophone,
    ACCESS_FINE_LOCATION: HiOutlineMapPin,
    ACCESS_COARSE_LOCATION: HiOutlineMapPin,
    READ_CONTACTS: HiOutlineUsers,
    READ_EXTERNAL_STORAGE: HiOutlineCircleStack,
    WRITE_EXTERNAL_STORAGE: HiOutlineCircleStack,
    INTERNET: HiOutlineGlobeAlt,
    RECEIVE_SMS: HiOutlineEnvelope,
    SEND_SMS: HiOutlineEnvelope,
    READ_CALL_LOG: HiOutlinePhone,
    PROCESS_OUTGOING_CALLS: HiOutlinePhone,
    SYSTEM_ALERT_WINDOW: HiOutlineWindow,
    DEFAULT: HiOutlineLockClosed,
};

export function IconBox({ Icon, size = 18, color = 'var(--accent-primary)' }) {
    if (!Icon) return null;
    return (
        <span className="icon-box" style={{ '--icon-color': color }}>
            <Icon size={size} />
        </span>
    );
}
