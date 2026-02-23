import PERMISSION_DATABASE from '../data/permissionDatabase.js';
import DOMAIN_CATEGORIES from '../data/domainCategories.js';

export function categorizeByDomain(permissions) {
    const categories = {};

    Object.keys(DOMAIN_CATEGORIES).forEach(cat => {
        categories[cat] = {
            permissions: [],
            count: 0,
            icon: DOMAIN_CATEGORIES[cat].icon,
            color: DOMAIN_CATEGORIES[cat].color,
            description: DOMAIN_CATEGORIES[cat].description
        };
    });

    permissions.forEach(perm => {
        const entry = PERMISSION_DATABASE[perm];
        const category = entry ? entry.category : 'Unknown';

        if (!categories[category]) {
            categories[category] = { permissions: [], count: 0, icon: '❓', color: '#95a5a6', description: 'Uncategorized permissions.' };
        }

        categories[category].permissions.push(perm);
        categories[category].count++;
    });

    const filtered = {};
    Object.entries(categories).forEach(([key, val]) => {
        if (val.count > 0) filtered[key] = val;
    });

    return filtered;
}
