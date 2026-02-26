# Appranium — Security Intelligence Engine

> **The first 100% Local Android App Security Analyzer**
> Audit any Android `.apk` file for dangerous permissions, suspicious combinations, and code-level behaviours without ever uploading it. The analysis runs entirely within your browser using a high-performance, zero-knowledge pipeline.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=flat&logo=three.js)](https://threejs.org/)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20local-brightgreen?style=flat)](#-privacy-first-architecture)


## How the Analysis Works (Under the Hood)

Appranium performs true binary analysis **entirely in your browser**. It is not a wrapper for a backend API.

1. **File Ingestion:** When an APK is dragged into the app, the HTML5 File API reads it directly into the local memory of the browser instance. No external network request is established.
2. **In-Memory Extraction:** Utilizing `jszip`, the engine decompresses the APK archive to isolate critical components, specifically `AndroidManifest.xml` and `classes.dex`.
3. **Binary AXML Decompilation:** Android apps compile XML into binary formats (AXML). Appranium features a custom JavaScript `axmlParser` that reconstructs the binary string pool and XML tree structure to extract declared permissions, application metadata, and manifest configurations.
4. **True-Binary DEX Byte-Code Parsing:** The system performs structural binary parsing on the Dalvik Executable (`classes.dex`). Utilizing a custom `DataView` engine, it deserializes the DEX header, decodes ULEB128 strings, and maps exact `ClassName->methodName` invocations. It actively flags dynamic code loading (`DexClassLoader`), reflection abuse (`Method.invoke`), shell commands (`Runtime.exec`), and deep hardware invocations (e.g. `AudioRecord`).
5. **Contextual Risk Intelligence:** Extracted datasets are fed into a weighted scoring matrix. The engine correlates declared permissions against DEX findings and flags **suspicious combinations** (e.g., recording audio alongside hidden network access) to produce a precise, transparent security grade.

---

## Core Intelligence Features

### Cinematic Analysis Pipeline
- **Parallax Interface**: A modern, editorial-grade UI with smooth scroll dynamics and glassmorphism.
- **Final Result Animation**: A high-impact cinematic reveal of the underlying application's security grade.
- **3D Interactive Elements**: Highly polished WebGL and CSS3D elements for a premium feel.

### Deep Static Analysis
- **DEX Byte-Code Insights**: Automatic scanning for runtime permission requests and sensitive data sinks.
- **Binary AXML Parsing**: Professional-grade extraction of manifest data directly from the compiled APK container.
- **Simulation Layer**: Predictive modeling that flags potential attack vectors based on observed structural patterns.

### Advanced Risk Scoring
- **Weighted Intelligence**: Dynamic calculation weighting individual permissions, combinations, and code-level strings.
- **Customizable Tuning**: A dedicated configuration modal allowing security professionals to adjust risk sensitivity multipliers.
- **Sticky Intelligence Panel**: A persistent HUD tracking the running risk score and top threat drivers as you traverse the report.

### Privacy & Permissions
- **Suspicious Combinations**: Specific threat intelligence modeling for dangerous pairings (e.g., Camera + Network) often used by APTs or spyware.
- **Domain-Based Profile**: Visual categorization mapping the app's exposure across Location, Identity, Storage, and Hardware domains.
- **Educational Context**: "Why it matters" deep-dives for every flagged permission, translating raw data into actionable security intelligence.

---

## Deployment

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Quick Start
```bash
git clone https://github.com/your-username/appranium.git
cd appranium
npm install
npm run dev
```

### Production
```bash
npm run build
# The 'dist/' directory is ready for static web hosting (Vercel, Netlify, Github Pages)
```

---

## Architecture & Structure

```
src/
├── components/
│   ├── ParallaxHero/         # Glassmorphic landing hero
│   ├── FinalResultAnimation/ # Cinematic result reveal
│   ├── StickyRiskPanel/      # Persistent risk HUD
│   ├── CodeLevelInsights/    # DEX byte-code analysis view
│   ├── SimulatedRisks/       # Privacy threat simulations
│   ├── RiskScore/            # Weighted intelligence engine UI
│   ├── RiskCharts/           # Recharts visualizations
│   ├── SuspiciousCombos/     # Pattern-match alert system
│   └── common/               # Premium atomic UI primitives
├── hooks/
│   └── useAnalysis.js        # Core orchestration & state management
└── utils/
    ├── axmlParser.js         # Binary manifest deconstruction
    ├── comboDetector.js      # Threat pattern matching
    ├── fileHandler.js        # APK structure handling (JSZip)
    ├── manifestParser.js     # Analysis pipeline orchestrator
    └── riskScorer.js         # Weighted risk logic
```

---

## Privacy-First Architecture

Appranium is built on the principle of **Zero-Knowledge Analysis**. 

1. **Local Execution**: All analysis algorithms happen in your browser's V8 Javascript engine.
2. **No Data Transit**: Your `.apk` files never leave your machine; they don't touch any API.
3. **In-Memory Processing**: Decompiled data is held in-RAM and forcefully cleared on session reset.
4. **Offline Capable**: Once the app dashboard loads, the core engine functions 100% offline.

---

## License

MIT © Appranium Contributors
