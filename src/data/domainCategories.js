const DOMAIN_CATEGORIES = {
    'Location': { icon: '📍', color: '#e74c3c', description: 'Permissions that access device location data.' },
    'Communication': { icon: '📞', color: '#e67e22', description: 'Permissions related to calls, SMS, and messaging.' },
    'Identity': { icon: '👤', color: '#9b59b6', description: 'Permissions accessing personal identity information.' },
    'Device Control': { icon: '⚙️', color: '#3498db', description: 'Permissions controlling device hardware and features.' },
    'Storage': { icon: '📁', color: '#f39c12', description: 'Permissions accessing files and media storage.' },
    'Network': { icon: '🌐', color: '#1abc9c', description: 'Permissions related to internet and network access.' },
    'Financial': { icon: '💳', color: '#e74c3c', description: 'Permissions related to billing and financial transactions.' },
    'Health': { icon: '❤️', color: '#e84393', description: 'Permissions accessing health and fitness sensors.' },
    'Unknown': { icon: '❓', color: '#95a5a6', description: 'Permissions not in our categorization database.' }
};

export default DOMAIN_CATEGORIES;
