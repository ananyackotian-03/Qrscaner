# QR Zero-Interaction Threat Intelligence System

An advanced cybersecurity tool designed to predict and analyze QR code threats using a zero-interaction pre-analysis pipeline followed by an isolated browser sandbox.

## Key Features
- **URL DNA Analysis**: Pre-engagement metrics including Shannon Entropy, TLD risk, and pattern matching.
- **Decision Engine**: Automatically determines sandbox depth based on pre-analysis risk levels.
- **Isolated Sandbox**: Uses Playwright to simulate human behavior, follow redirect chains, and monitor DOM mutations.
- **Attack Graph**: SVG-based visualization of the threat progression from QR to final behavior.
- **Safe Preview**: Behavioral snapshots and metric extraction without user engagement.

---

## Prerequisites

### Playwright Installation
The sandbox module requires browser binaries to run.
```bash
# From the backend directory
pip install playwright
playwright install chromium
```

---

## Setup Instructions

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Backend runs at `http://localhost:8000`.*

### 2. Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## Project Structure
```text
qr-zero-interaction-system/
├── backend/
│   ├── main.py            # FastAPI Entry Point
│   ├── pre_analyzer.py    # URL DNA & Metrics
│   ├── sandbox.py         # Playwright Logic
│   └── static/            # Sandbox Screenshots
└── frontend/
    ├── src/
    │   ├── pages/         # Scan, Prediction, Dashboard
    │   ├── components/    # AttackGraph, etc.
    │   └── App.jsx        # Orchestration Logic
    └── tailwind.config.js # Cyber Theme Config
```

---

## Security Philosophy
This system operates on the principle of **Zero-Interaction**. The goal is to provide 90% of the threat intelligence (Pre-Analysis) before a single packet is ever sent to the target destination. The **Sandbox** is only utilized when high-confidence prediction requires dynamic verification.
