# 🔐 Appranium — Android Privacy Analyzer

> **100% client-side APK & XML privacy analyzer. No uploads. No servers. No tracking.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20local-brightgreen?style=flat)](#privacy)

Appranium is an open-source, browser-based tool that analyzes Android APK files and `AndroidManifest.xml` files for privacy risks, dangerous permission combinations, exposed components, and security misconfigurations — all without ever sending your file to a server.

---

## ✨ Features

### 🔍 File Analysis
- **APK files** — unzips the APK, parses the binary AXML manifest, and falls back to string extraction if needed
- **Raw XML files** — directly parses plain-text `AndroidManifest.xml` files
- Drag-and-drop or click-to-upload interface

### 📊 Risk Scoring
- Weighted risk score (0–100) based on permission danger level:
  - **High-risk** permissions → 20 pts each
  - **Medium-risk** → 10 pts each
  - **Low-risk** → 2 pts each
  - **Unknown** → 5 pts each
- Letter grades: **A** (Low) · **B** (Moderate) · **C** (Elevated) · **D** (High) · **F** (Critical)

### 🛡️ Permission Analysis
- Categorized permission list (High / Medium / Low / Unknown risk)
- Search and filter permissions by name or category
- Per-permission descriptions and risk explanations
- Domain-based exposure profile (Location, Identity, Storage, Network, Device, etc.)

### ⚠️ Suspicious Permission Combinations
- Detects dangerous permission pairings (e.g. location + background execution, camera + internet)
- Flags combinations commonly abused by malware or spyware

### 🧩 Component Exposure Analysis
- Identifies exported Activities, Services, Broadcast Receivers, and Content Providers
- Flags unprotected exported components (missing `android:permission` guard)
- Highlights components reachable by other apps without authentication

### 📋 Manifest Security Warnings
- Detects `debuggable=true`, `allowBackup=true`, `usesCleartextTraffic=true`, and other risky flags
- Checks target SDK version and minimum SDK for known vulnerability ranges

### 📈 Visual Charts
- Risk distribution donut/bar chart (High / Medium / Low / Unknown split)
- Domain exposure breakdown chart

### 🎓 Educational Insights
- Inline explanations of what each permission does and why it may be risky
- Beginner-friendly context for non-technical users

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/appranium.git
cd appranium

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output is placed in the `dist/` folder. You can serve it with any static file host.

```bash
# Preview the production build locally
npm run preview
```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AppOverview/          # App name, package, SDK versions
│   ├── ComponentExposure/    # Exported Activities / Services / Receivers / Providers
│   ├── DataExposureProfile/  # Domain-based permission categorization
│   ├── EducationalInsights/  # Beginner-friendly permission explanations
│   ├── FileUpload/           # Drag-and-drop file input
│   ├── Footer/
│   ├── Header/
│   ├── ManifestWarnings/     # Debuggable, cleartext, backup flags
│   ├── PermissionBreakdown/  # Per-permission detail cards
│   ├── PrivacyBadge/         # Embeddable risk badge
│   ├── RiskCharts/           # Recharts-based visualizations
│   ├── RiskScore/            # Weighted score + letter grade
│   ├── SearchFilter/         # Client-side permission search/filter
│   ├── SuspiciousCombos/     # Dangerous permission pair detection
│   └── common/               # Shared UI primitives
├── data/
│   └── permissionDatabase.js # Risk metadata for all known Android permissions
├── hooks/
│   └── useAnalysis.js        # Core analysis state management
└── utils/
    ├── axmlParser.js          # Binary AXML → XML string parser
    ├── comboDetector.js       # Suspicious permission combo rules
    ├── componentAnalyzer.js   # Exported component scanner
    ├── domainCategorizer.js   # Groups permissions by data domain
    ├── fileHandler.js         # APK unzip + manifest extraction
    ├── manifestAnalyzer.js    # Security flag detection
    ├── manifestParser.js      # Orchestrates the full analysis pipeline
    ├── metadataExtractor.js   # App name, package, SDK info
    ├── permissionExtractor.js # Pulls permission strings from XML
    └── riskScorer.js          # Weighted risk score calculator
```

---

## 🔒 Privacy

Appranium runs **entirely in your browser**. Your APK file is:

- **Never uploaded** to any server
- **Never stored** on disk or in the cloud
- **Never transmitted** over the network
- Processed purely in-memory using the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) and [JSZip](https://stuk.github.io/jszip/)

You can verify this by running the app offline — it works with no internet connection after the initial page load.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [JSZip](https://stuk.github.io/jszip/) | APK (ZIP) extraction in-browser |
| [Recharts](https://recharts.org/) | Permission risk charts |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |
| [Inter + Fira Code](https://fonts.google.com/) | Typography |

---

## 📄 Supported File Types

| File | Support |
|---|---|
| `.apk` | ✅ Full support — binary AXML parsed automatically |
| `.xml` | ✅ Full support — plain-text `AndroidManifest.xml` |

---

## 🤝 Contributing

Contributions are welcome! Here are some good starting points:

- Expanding the **permission database** with more entries or updated risk levels
- Adding new **suspicious combo rules** for emerging malware patterns
- Improving **AXML parser** compatibility with edge-case APK formats
- Translating the UI for international users

Please open an issue before submitting large PRs.

---

## 📃 License

MIT © Appranium Contributors
