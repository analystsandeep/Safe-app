# 🔐 Appranium — Security Intelligence Engine

> **100% Client-Side Android Security Intelligence. No uploads. No servers. Zero-Knowledge Analysis.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=flat&logo=three.js)](https://threejs.org/)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20local-brightgreen?style=flat)](#-privacy-first-architecture)

Appranium is a premium, browser-based **Security Intelligence Engine** designed to deconstruct Android APKs and manifests. It employs advanced static analysis, DEX byte-code inspection, and AI-driven risk scoring to expose hidden threats—all within the safety of your local browser environment.

---

## ✨ Core Intelligence Features

### 🎬 Cinematic Analysis Pipeline
- **3D Battle Scene**: An immersive Three.js-powered landing experience.
- **Final Result Animation**: A high-impact cinematic reveal of the application's security grade.
- **Parallax Interface**: A modern, editorial-grade UI with smooth scroll dynamics and glassmorphism.

### 🔍 Deep Static Analysis
- **DEX Byte-Code Insights**: Automatic scanning of `classes.dex` for runtime permission requests, dynamic code loading, and sensitive data sinks.
- **Binary AXML Parsing**: Professional-grade extraction of manifest data from compiled APKs.
- **Simulation Layer**: Predictive risk modeling that simulates potential attack vectors based on observed patterns.

### 📊 Advanced Risk Scoring
- **Weighted Intelligence**: Dynamic risk calculation that weighs permissions, suspicious combinations, and code-level findings.
- **Customizable Weights**: A dedicated modal allowing security professionals to adjust risk sensitivity per category.
- **Sticky Intelligence Panel**: A persistent HUD providing real-time risk context as you explore the report.

### 🛡️ Privacy & Permissions
- **Suspicious Combinations**: Detects dangerous pairings (e.g., Camera + Internet) used by advanced persistent threats.
- **Domain-Based Profile**: Categorizes exposure across Location, Identity, Storage, and more.
- **Educational Context**: Deep-dives into *why* specific permissions are flagged, bridging the gap between raw data and actionable intelligence.

---

## 🚀 Deployment

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
# The 'dist/' directory is ready for static hosting (Vercel, Netlify, Cloudflare Pages)
```

---

## 🏗️ Architecture & Structure

```
src/
├── components/
│   ├── BattleScene/          # Three.js 3D landing environment
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

## 🔒 Privacy-First Architecture

Appranium is built on the principle of **Zero-Knowledge Analysis**. 

1. **Local Execution**: Analysis happens in your browser's V8 engine.
2. **No Data Transit**: Your files never touch a network socket.
3. **In-Memory Processing**: Data is processed in-RAM and cleared on session reset.
4. **Offline Capable**: Once loaded, the engine requires zero internet connectivity.

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **React 18** | Orchestration & UI |
| **Vite 5** | High-performance Build Pipeline |
| **Three.js / @react-three/fiber** | 3D Visualization & Cinematic FX |
| **Framer Motion** | High-fidelity Animations |
| **Recharts** | Data Visualizations |
| **JSZip** | Browser-side APK Deconstruction |
| **TensorFlow.js** | Security Intelligence (Experimental) |
| **Dexie** | Client-side Persistance (IndexedDB) |

---

## 📃 License

MIT © Appranium Contributors
