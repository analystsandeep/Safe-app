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
    HiOutlineFingerPrint,
    HiOutlineMusicalNote,
    HiOutlineGlobeAlt,
    HiOutlineDevicePhoneMobile,
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

export function IconBox({ Icon, size = 18, color = 'var(--accent-primary)' }) {
    return (
        <span className="icon-box" style={{ '--icon-color': color }}>
            <Icon size={size} />
        </span>
    );
}
