import {
    HiOutlineBeaker,
    HiOutlineDevicePhoneMobile,
    HiOutlineLockClosed
} from 'react-icons/hi2';

const AUDIENCES = [
    {
        icon: HiOutlineBeaker,
        title: 'Security Researchers',
        desc: 'Quickly surface suspicious permission combos, manifest misconfigurations, and potential data exfiltration vectors in any APK.',
        tags: ['Threat Analysis', 'Combo Detection'],
        color: '#3DDC84'
    },
    {
        icon: HiOutlineDevicePhoneMobile,
        title: 'Android Developers',
        desc: 'Audit your own app before release. Catch dangerous permission over-requests, debug flags left on, and backup risks before your users do.',
        tags: ['Pre-release Audit', 'Manifest Review'],
        color: '#3498db'
    },
    {
        icon: HiOutlineLockClosed,
        title: 'Privacy-Conscious Users',
        desc: 'Drop any APK you downloaded and instantly understand what it can access — camera, mic, location, contacts — before installing.',
        tags: ['Privacy Scan', '100% Local'],
        color: '#f1c40f'
    },
];

export function WhoIsItFor() {
    return (
        <section className="witf-section">
            <div className="witf-header">
                <span className="witf-label">BUILT FOR</span>
                <h2 className="witf-title">Who is Appranium for?</h2>
                <p className="witf-sub">From seasoned security engineers to curious privacy advocates — anyone who believes trust must be earned.</p>
            </div>
            <div className="witf-grid">
                {AUDIENCES.map((a) => (
                    <div key={a.title} className="witf-card">
                        <div className="witf-icon-wrap" style={{ '--icon-color': a.color }}>
                            <a.icon className="witf-premium-icon" />
                        </div>
                        <h3 className="witf-card-title">{a.title}</h3>
                        <p className="witf-card-desc">{a.desc}</p>
                        <div className="witf-tags">
                            {a.tags.map(t => (
                                <span key={t} className="witf-tag">{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
