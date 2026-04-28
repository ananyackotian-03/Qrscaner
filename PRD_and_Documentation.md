# Product Requirements Document (PRD) & Technical Documentation
## Project: QR Zero-Interaction Threat Intelligence System

---

## 1. Executive Summary
The **QR Zero-Interaction Threat Intelligence System** is a next-generation cybersecurity tool designed to bridge the gap between simple QR scanning and full-scale web forensics. Its primary mission is to protect users from "Quishing" (QR Phishing) by analyzing and predicting the risk of a destination URL **before** a single packet is exchanged with the target server.

---

## 2. The Novelty: Zero-Interaction Philosophy
Most security scanners follow a "Scan and Check" approach, which inherently requires visiting the site. This system introduces the **Zero-Interaction Module**, which provides high-confidence threat profiling using only the static "DNA" of the URL.

### Key Novelty Features:
1.  **URL DNA Profiling**: Analyzes the structural characteristics (Shannon Entropy, length, encoding patterns) to predict attack types (Phishing vs. Malware) without server engagement.
2.  **Autonomous Decision Engine**: A logic layer that determines the "Sandbox Depth" (None, Limited, or Full) based on the pre-analysis risk, saving resources and minimizing exposure.
3.  **Behavioral Storytelling**: Instead of just a score, the system generates a human-readable narrative explaining *why* a site is suspicious, bridging the gap between technical metrics and user understanding.

---

## 3. Core Pipeline & Functional Requirements

### 3.1 QR Extraction
- **Input**: Image upload (PNG, JPG, WebP).
- **Technology**: OpenCV QRCodeDetector.
- **Output**: Raw string/URL extracted from the QR matrix.

### 3.2 Pre-Analysis Module (Zero-Interaction)
- **DNA Metrics**:
    - **Entropy**: Measures the randomness of characters to detect obfuscated or machine-generated paths.
    - **Domain Intelligence**: Scores the TLD reputation (e.g., `.xyz` or `.ru` vs `.com`).
    - **Keyword Engine**: Scans for 50+ malicious patterns like `wp-admin`, `verify`, `billing`, and `secure`.
- **Confidence Scoring**: Assigns a 0-100 score based solely on these static patterns.

### 3.3 Dynamic Sandbox Module
- **Technology**: Playwright (Headless Chromium).
- **Logic**: Triggered only for Medium (30+) and High (60+) risk scores.
- **Capabilities**:
    - **Redirect Tracking**: Follows up to 10 hops to find the true destination.
    - **Behavioral Monitoring**: Counts active scripts and resource requests.
    - **Visual Capture**: Takes a secure snapshot for user preview.

### 3.4 Attack Graph Visualization
- **Visualization**: An SVG-based flow mapping the analysis journey.
- **Stages**: QR Scan → URL DNA → Behavioral Sandbox → Final Verdict.

---

## 4. Technical Architecture

### Backend (FastAPI)
- **Async Framework**: Handles concurrent sandbox runs without blocking.
- **Stateless Analysis**: Every scan is treated as a unique session with its own ephemeral sandbox context.
- **Modular Design**: Separate modules for `pre_analyzer.py`, `sandbox.py`, and `main.py`.

### Frontend (React + Tailwind + Framer Motion)
- **State Machine**: Orchestrates the 3-page flow (Scan → Prediction → Dashboard).
- **CSS-First Theme (v4)**: Modern cybersecurity aesthetic with custom neon color variables.
- **Dynamic Charting**: Chart.js implementation for the Risk Gauge.

---

## 5. Risk Scoring Algorithm (The Engine)

The final score is a weighted aggregate:
| Factor | Weight | Description |
| :--- | :--- | :--- |
| **High Entropy** | +30 | Random/Obfuscated characters |
| **IP-based Domain** | +40 | Raw IP addresses instead of DNS |
| **Sensitive Keywords** | +20 | Use of 'login', 'bank', etc. |
| **Redirect Chain** | +30 | More than 2 hops detected in sandbox |
| **Script Density** | +20 | High count of third-party scripts |

---

## 6. User Guide & Implementation

### Installation
1.  **System**: Install Python 3.10+ and Node.js 18+.
2.  **Dependencies**: Run `pip install -r requirements.txt` and `npm install`.
3.  **Sandbox**: Run `python -m playwright install chromium`.

### Running the System
- **Backend**: `python main.py` (Port 8000).
- **Frontend**: `npm run dev` (Port 5173/5174).

---

## 7. Future Roadmap
1.  **AI-Powered Narrative**: Using LLMs to generate more complex "Attack Stories".
2.  **Whitelisting Integration**: Connecting to global databases like VirusTotal or Google Safe Browsing.
3.  **Mobile Support**: Responsive mobile UI for "on-the-go" quishing protection.
