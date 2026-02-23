const SUSPICIOUS_COMBOS = [
    {
        id: 'surveillance-av',
        combo: ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
        risk: 'critical',
        title: 'Audio + Video Surveillance',
        reason: 'App can record both audio and video simultaneously, enabling full surveillance capability.'
    },
    {
        id: 'otp-theft',
        combo: ['android.permission.READ_SMS', 'android.permission.INTERNET'],
        risk: 'critical',
        title: 'OTP / SMS Interception',
        reason: 'App can read SMS messages (including OTPs) and transmit them to external servers.'
    },
    {
        id: 'location-tracking',
        combo: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.INTERNET'],
        risk: 'high',
        title: 'Real-Time Location Tracking',
        reason: 'App can track precise GPS location and send it to remote servers in real time.'
    },
    {
        id: 'overlay-phishing',
        combo: ['android.permission.SYSTEM_ALERT_WINDOW', 'android.permission.READ_SMS'],
        risk: 'critical',
        title: 'Overlay Phishing + SMS Theft',
        reason: 'App can draw fake login screens over other apps while intercepting SMS verification codes.'
    },
    {
        id: 'contact-exfiltration',
        combo: ['android.permission.READ_CONTACTS', 'android.permission.INTERNET'],
        risk: 'high',
        title: 'Contact Data Exfiltration',
        reason: 'App can read entire contact list and upload it to external servers.'
    },
    {
        id: 'call-interception',
        combo: ['android.permission.PROCESS_OUTGOING_CALLS', 'android.permission.RECORD_AUDIO'],
        risk: 'critical',
        title: 'Call Monitoring + Recording',
        reason: 'App can intercept outgoing calls and record audio during calls.'
    },
    {
        id: 'file-exfiltration',
        combo: ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.INTERNET'],
        risk: 'high',
        title: 'File Data Exfiltration',
        reason: 'App can read all files on external storage and transmit them over network.'
    },
    {
        id: 'background-location',
        combo: ['android.permission.ACCESS_BACKGROUND_LOCATION', 'android.permission.INTERNET'],
        risk: 'critical',
        title: 'Background Location Surveillance',
        reason: 'App can continuously track location even when not in use and send data externally.'
    },
    {
        id: 'sms-financial',
        combo: ['android.permission.READ_SMS', 'android.permission.SEND_SMS'],
        risk: 'critical',
        title: 'Full SMS Control',
        reason: 'App can both read and send SMS messages. Can be used for premium SMS fraud or message manipulation.'
    },
    {
        id: 'silent-install',
        combo: ['android.permission.REQUEST_INSTALL_PACKAGES', 'android.permission.INTERNET'],
        risk: 'critical',
        title: 'Remote APK Installation',
        reason: 'App can download and install additional APKs from the internet.'
    },
    {
        id: 'identity-harvest',
        combo: ['android.permission.GET_ACCOUNTS', 'android.permission.READ_CONTACTS', 'android.permission.INTERNET'],
        risk: 'critical',
        title: 'Identity Harvesting',
        reason: 'App can access accounts, contacts, and transmit identity information externally.'
    },
    {
        id: 'camera-upload',
        combo: ['android.permission.CAMERA', 'android.permission.INTERNET'],
        risk: 'high',
        title: 'Photo/Video Capture & Upload',
        reason: 'App can take photos or record video and upload them to external servers.'
    }
];

export default SUSPICIOUS_COMBOS;
