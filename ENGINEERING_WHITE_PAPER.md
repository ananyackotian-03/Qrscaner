# Engineering White Paper: QR Zero-Interaction Threat Intelligence System (QR-ZITIS)

**Version:** 1.3.0  
**Status:** Master Specification  
**Focus:** Technical Justification & Behavioral Logic  

---

## 1. System Design Philosophy
The **QR-ZITIS** platform is engineered on the principle of **Proactive Neutralization**. Unlike traditional reactive systems, we treat the URL as a forensic artifact. Our goal is to extract maximum intelligence without alerting the adversary, implemented through a strict **Zero-Interaction** model.

---

## 2. Technical Stack & Tooling Justification

### 2.1 Backend: FastAPI (Asynchronous Python)
- **Justification**: The primary challenge in behavioral analysis is the high latency of browser-based sandboxing. FastAPI’s `async/await` paradigm allows the system to initiate a sandbox run as a background task, returning the **Pre-Analysis (PEA)** report to the user in milliseconds while the deep scan continues.
- **Alternative Considered**: Flask (Rejected due to synchronous blocking nature which would freeze the API during sandbox runs).

### 2.2 Sandbox: Playwright (Chromium)
- **Justification**: Modern phishing sites use complex JavaScript to detect bots and scrapers. Playwright provides an authentic browser environment that can simulate human behavior (mouse movements, scrolls), ensuring we trigger the same malicious redirects an actual user would see.
- **Alternative Considered**: Selenium (Rejected due to slower execution and higher memory footprint).

### 2.3 Image Processing: OpenCV (cv2)
- **Justification**: To ensure a "Zero-Dependency" installation on Windows, we utilize OpenCV’s built-in `QRCodeDetector`. This removes the need for external C++ DLLs (like ZBar), making the system highly portable and resilient to OS-level library conflicts.

### 2.4 Styling: Tailwind CSS v4
- **Justification**: The CSS-first approach of v4 provides superior performance by eliminating the overhead of standard JavaScript-based theme engines. It allows for highly customized "Cyber-Aesthetics" with zero impact on runtime performance.

---

## 3. The Pre-Analysis (PEA) Engine: Technical Deep Dive

The **PEA Engine** is the unique core of the system. It uses three primary vectors to predict threat profiles without making a network request.

### 3.1 Shannon Entropy Calculation
We apply the Shannon entropy formula to the URL string:
$$H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)$$
- **Logic**: Malicious URLs often use obfuscated paths (e.g., `/a1b2c3d4...`). High entropy (> 4.5) indicates machine-generated paths used to bypass signature-based filters.

### 3.2 Lexical & Pattern Weighting
Our heuristic engine assigns weights based on lexical markers:
- **Sensitive Clusters**: Presence of `login` + `secure` + `account` results in a +20 risk boost.
- **TLD Risk Index**: We maintain a weighted index of high-risk TLDs (e.g., `.xyz` = +25, `.ru` = +30).
- **IP Hosting**: Direct IP URLs receive an automatic +40 boost as they bypass standard DNS-based security reputation checks.

---

## 4. Full Traversal Logic & Flow

1.  **Extraction**: Image bytes are decoded into a raw string using OpenCV.
2.  **DNA Profiling (PEA)**: The string is passed to the Pre-Analyzer. Confidence scores are calculated instantly.
3.  **The Branching Decision**:
    - If `Score < 30`: System terminates at Phase 1.
    - If `Score >= 30`: System spawns a headless Chromium instance via Playwright.
4.  **Sandbox Execution**:
    - **Hop Tracking**: Playwright listens for `framenavigated` events to map the redirect chain.
    - **Heuristic Monitoring**: Real-time counting of `<script>` tags and `<form>` elements.
    - **Evidence Capture**: High-res screenshot is taken of the final landing page.
5.  **Synthesis**: Results from both phases are merged into a single JSON response, providing a unified "Threat Story".

---

## 5. Resource Allocation & Team Strategy (4-Member Team)

| Role | Domain Focus | Toolset |
| :--- | :--- | :--- |
| **Backend Architect** | PEA Engine & FastAPI Optimization | Python, math, regex |
| **Automation Engineer** | Sandbox Hardening & Monitoring | Playwright, Chromium |
| **UX/UI Engineer** | Telemetry & Visual Narrative | React, Tailwind v4, Framer |
| **Data/QA Specialist** | Synthesis Logic & Integration Testing | SQLAlchemy, Git, Pytest |

---
**Approved & Verified by:**  
*Lead Systems Architect - QR-ZITIS Engineering Group*
