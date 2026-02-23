/**
 * @param {string} manifestContent
 * @returns {string[]}
 */
export function extractPermissions(manifestContent) {
    const permissions = new Set();

    // Pattern 1: Standard XML uses-permission tag
    const xmlPattern = /uses-permission\s[^>]*android:name\s*=\s*"([^"]+)"/gi;
    let match;
    while ((match = xmlPattern.exec(manifestContent)) !== null) {
        permissions.add(match[1].trim());
    }

    // Pattern 2: Direct android.permission.* match (binary extracted)
    const directPattern = /android\.permission\.[A-Z_]+/g;
    while ((match = directPattern.exec(manifestContent)) !== null) {
        permissions.add(match[0].trim());
    }

    // Pattern 3: Custom/third-party permissions
    const customPattern = /com\.[a-z0-9]+(?:\.[a-z0-9]+)*\.permission\.[A-Z_]+/gi;
    while ((match = customPattern.exec(manifestContent)) !== null) {
        permissions.add(match[0].trim());
    }

    // Pattern 4: Google-specific permissions
    const googlePattern = /com\.google\.android\.[a-z0-9.]*permission\.[A-Z_]+/gi;
    while ((match = googlePattern.exec(manifestContent)) !== null) {
        permissions.add(match[0].trim());
    }

    return Array.from(permissions).sort();
}
