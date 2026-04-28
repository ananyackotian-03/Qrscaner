# 🛡️ QR Zero-Interaction Threat Intelligence System: Official Manual

## 1. Project Overview
The **QR Zero-Interaction Threat Intelligence System** is a high-performance cybersecurity platform designed to neutralize "Quishing" (QR-based Phishing) attacks. It uses a unique two-stage pipeline that prioritizes privacy and security by analyzing threats before any live connection is established.

---

## 2. Core Working Principle: The Two-Phase Analysis

### 🔍 Phase 1: Zero-Interaction Pre-Analysis
**Goal**: Identify 90% of threats without sending a single packet to the target.
- **DNA Profiling**: The system extracts the URL from the QR code and runs a structural analysis.
- **Entropy Check**: Detects random or obfuscated characters often used in malware delivery.
- **TLD Intelligence**: Flags high-risk top-level domains (e.g., `.xyz`, `.top`, `.ru`).
- **Pattern Matching**: Scans for "Sensitive Clusters" (e.g., `login` + `verify` + `bank`).

### 🧪 Phase 2: Autonomous Behavioral Sandbox
**Goal**: Verify suspicious predictions in a 100% isolated environment.
- **Decision Engine**: If the Pre-Analysis score is > 30, the system automatically launches a **Playwright-driven Sandbox**.
- **Human Simulation**: The sandbox simulates clicks and movements to trigger hidden redirects.
- **Redirect Chain Mapping**: Records every hop the URL takes to find the final, often malicious, destination.
- **Safe Capture**: Takes a secure screenshot for user review without exposing the user's browser.

---

## 3. The "Novelty" Factors
What makes this system unique in the cybersecurity landscape?

| Feature | Description | Why it's Novel |
| :--- | :--- | :--- |
| **Zero-Interaction** | Threat profiling without server engagement. | Prevents "Beaconing" where attackers know you've scanned the code. |
| **DNA Entropy Scoring** | Mathematical randomness detection. | Catches polymorphic URLs that bypass standard blacklists. |
| **Attack Storytelling** | Human-readable explanation of risk. | Turns complex technical metrics into actionable advice for the user. |
| **Decision Engine** | Adaptive analysis depth. | Balances speed (Pre-Analysis) with depth (Sandbox) automatically. |

---

## 4. Detailed Risk Scoring Matrix

| Rule | Score Impact | Rationale |
| :--- | :--- | :--- |
| **High Entropy (> 4.5)** | +30 | High probability of obfuscated/malicious payload. |
| **IP-Based Domain** | +40 | Used to bypass DNS-based security filters. |
| **Suspicious TLD** | +25 | Statistically high correlation with phishing sites. |
| **Redirect Chain (> 2)** | +30 | Classic technique to hide the final destination. |
| **Sensitive Keywords** | +20 | Indicates intent to capture credentials or payments. |

---

## 5. Technical Documentation

### Backend Architecture (FastAPI)
- **Modular Core**: Separate engines for analysis, sandboxing, and database management.
- **Async Execution**: Allows the system to run sandbox simulations in the background while the UI remains responsive.

### Frontend Architecture (React + Tailwind v4)
- **State Machine**: Tracks the scan through `SCAN` -> `PREDICTION` -> `DASHBOARD` states.
- **Cyber-Aesthetic**: Custom dark-mode theme designed for high-end security tools.

---

## 6. Installation & Execution Guide

### Prerequisites
1. **Python 3.10+**
2. **Node.js 18+**
3. **ZBar Library**: Required for QR matrix decoding.

### Step-by-Step Setup
```bash
# 1. Clone & Setup Backend
cd backend
pip install -r requirements.txt
python -m playwright install chromium

# 2. Setup Frontend
cd ../frontend
npm install
npm run dev

# 3. Start Analysis
# Visit http://localhost:5174 and upload your first QR code.
```

---

## 7. Verification Results
- **Safe Case**: Google.com (Score: 5-10, Verdict: SECURE)
- **Suspicious Case**: Shortened URL (Score: 35-50, Verdict: SUSPICIOUS)
- **Critical Case**: IP-based Bank Login (Score: 80+, Verdict: CRITICAL)

---
**Documentation Version: 1.0.0**
**Author: Antigravity AI Systems**
