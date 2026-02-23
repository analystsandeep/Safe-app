export function extractMetadata(manifestContent, fileName) {
    const metadata = { packageName: null, versionCode: null, versionName: null, appLabel: null, fileName: fileName || 'Unknown' };

    const packageMatch = manifestContent.match(/package\s*=\s*"([^"]+)"/i);
    if (packageMatch) metadata.packageName = packageMatch[1];

    const versionCodeMatch = manifestContent.match(/android:versionCode\s*=\s*"([^"]+)"/i)
        || manifestContent.match(/versionCode\s*[:=]\s*['"']?(\d+)/i);
    if (versionCodeMatch) metadata.versionCode = versionCodeMatch[1];

    const versionNameMatch = manifestContent.match(/android:versionName\s*=\s*"([^"]+)"/i)
        || manifestContent.match(/versionName\s*[:=]\s*['"']?([^'">\s]+)/i);
    if (versionNameMatch) metadata.versionName = versionNameMatch[1];

    const labelMatch = manifestContent.match(/android:label\s*=\s*"([^"@]+)"/i);
    if (labelMatch) metadata.appLabel = labelMatch[1];

    return metadata;
}
