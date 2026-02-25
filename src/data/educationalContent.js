const EDUCATIONAL_CONTENT = [
    {
        id: 'runtime-permissions',
        title: 'Runtime Permissions (Android 6.0+)',
        content: `Starting with Android 6.0 (API level 23), dangerous permissions must be requested at runtime, not just declared in the manifest. This means the user sees a dialog before granting sensitive permissions like Camera or Location. Apps targeting SDK 22 or below bypass this protection entirely and receive all permissions at install time.`
    },
    {
        id: 'scoped-storage',
        title: 'Scoped Storage (Android 10+)',
        content: `Android 10 introduced scoped storage, restricting apps from freely accessing shared external storage. Apps can only access their own app-specific directory and specific media files they created. Apps requesting MANAGE_EXTERNAL_STORAGE bypass this restriction and gain full file system access — a significant privacy concern.`
    },
    {
        id: 'background-location',
        title: 'Background Location Restrictions (Android 10+)',
        content: `Android 10+ requires a separate permission (ACCESS_BACKGROUND_LOCATION) for apps to access location while running in the background. Users must explicitly grant this through Settings, not just a dialog. Apps with this permission can continuously track your location even when you're not actively using them.`
    },
    {
        id: 'overlay-attacks',
        title: 'Overlay Attacks (SYSTEM_ALERT_WINDOW)',
        content: `The SYSTEM_ALERT_WINDOW permission allows an app to draw on top of other apps. While legitimate uses exist (chat bubbles, screen tools), malicious apps can use this to create fake login screens that capture credentials. This is known as a "tapjacking" or "overlay" attack.`
    },
    {
        id: 'exported-components',
        title: 'Exported Components Risk',
        content: `When an Android component (Activity, Service, Receiver, Provider) is marked as exported="true", other apps on the device can interact with it. Without proper permission checks, this can allow unauthorized apps to trigger functionality, access data, or exploit the component.`
    },
    {
        id: 'debug-builds',
        title: 'Debug Builds in Production',
        content: `If an APK has android:debuggable="true" in its manifest, it means the app was built in debug mode. This allows anyone to attach a debugger, inspect memory, and bypass security checks. Production apps should never have this flag enabled.`
    },
    {
        id: 'dex-analysis',
        title: 'Code-Level Security Analysis (DEX)',
        content: `Standard manifest analysis only checks what an app *claims* to do. Code-level analysis (DEX) goes deeper by scanning the actual executable logic for runtime permission requests, dynamic code loading, and data transmission sinks. This reveals hidden behaviors that don't appear in the manifest.`
    },
    {
        id: 'ai-risk-scoring',
        title: 'AI-Enhanced Risk Assessment',
        content: `Appranium uses TensorFlow.js to run local ML inference on your device. By analyzing permission vectors and API usage patterns within the code, our AI model can adjust risk scores based on context — distinguishing between a legitimate camera app and a utility app secretly requesting recording privileges.`
    }
];

export default EDUCATIONAL_CONTENT;
