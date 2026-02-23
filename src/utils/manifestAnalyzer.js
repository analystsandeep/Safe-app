export function analyzeManifest(manifestContent) {
    const result = {
        minSdkVersion: null,
        targetSdkVersion: null,
        isDebuggable: false,
        allowsBackup: false,
        warnings: []
    };

    const minSdkMatch = manifestContent.match(/android:minSdkVersion\s*=\s*"(\d+)"/i)
        || manifestContent.match(/minSdkVersion\s*[:=]\s*(\d+)/i);
    if (minSdkMatch) result.minSdkVersion = parseInt(minSdkMatch[1], 10);

    const targetSdkMatch = manifestContent.match(/android:targetSdkVersion\s*=\s*"(\d+)"/i)
        || manifestContent.match(/targetSdkVersion\s*[:=]\s*(\d+)/i);
    if (targetSdkMatch) result.targetSdkVersion = parseInt(targetSdkMatch[1], 10);

    const debugMatch = manifestContent.match(/android:debuggable\s*=\s*"(true|false)"/i);
    if (debugMatch) result.isDebuggable = debugMatch[1].toLowerCase() === 'true';
    if (!debugMatch && /debuggable.*true/i.test(manifestContent)) result.isDebuggable = true;

    const backupMatch = manifestContent.match(/android:allowBackup\s*=\s*"(true|false)"/i);
    if (backupMatch) result.allowsBackup = backupMatch[1].toLowerCase() === 'true';
    if (!backupMatch) result.allowsBackup = true;

    if (result.targetSdkVersion !== null && result.targetSdkVersion < 23) {
        result.warnings.push({ type: 'outdated-target-sdk', severity: 'high', message: `Target SDK version ${result.targetSdkVersion} uses the legacy permission model. All permissions are granted at install time without user consent. Apps should target SDK 23+.` });
    }
    if (result.targetSdkVersion !== null && result.targetSdkVersion < 30) {
        result.warnings.push({ type: 'pre-scoped-storage', severity: 'medium', message: `Target SDK version ${result.targetSdkVersion} does not enforce scoped storage restrictions. The app may have broad file access.` });
    }
    if (result.minSdkVersion !== null && result.minSdkVersion < 21) {
        result.warnings.push({ type: 'old-min-sdk', severity: 'medium', message: `Minimum SDK version ${result.minSdkVersion} supports very old Android versions (pre-Lollipop) that lack modern security features.` });
    }
    if (result.isDebuggable) {
        result.warnings.push({ type: 'debuggable', severity: 'critical', message: 'Debuggable flag is enabled. This should NEVER be enabled in production builds. Attackers can attach debuggers and inspect application memory.' });
    }
    if (result.allowsBackup) {
        result.warnings.push({ type: 'backup-enabled', severity: 'medium', message: 'App data backup is allowed. App data can be extracted via ADB backup, potentially exposing sensitive information.' });
    }

    return result;
}
