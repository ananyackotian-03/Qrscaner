# Product Requirements Document (PRD): QR Zero-Interaction Threat Intelligence System (QR-ZITIS)

**Version:** 1.1.0  
**Status:** Implementation Complete / Production Ready  
**Role:** Senior Software Engineer Perspective

---

## 1. Executive Summary
The **QR-ZITIS** platform is an advanced cybersecurity solution designed to mitigate the risks associated with "Quishing" (QR Phishing). Unlike traditional scanners that require user interaction with potentially malicious destinations, our system implements a **Zero-Interaction Analysis Pipeline**. By utilizing structural URL DNA profiling and isolated behavioral sandboxing, the system provides comprehensive threat intelligence before a user ever engages with the target.

---

## 2. Problem Statement
The ubiquity of QR codes has created a significant security blind spot. Traditional QR scanners are "dumb" decoders that pass the extracted URL directly to the user's browser, leading to:
1.  **Direct Exposure**: Immediate interaction with phishing or malware-hosting sites.
2.  **Lack of Context**: Users have no visibility into the destination's reputation or redirect history.
3.  **Beaconing Risk**: Scanning a code can signal an active user to an attacker even if the site is not fully loaded.

---

## 3. High-Level Goals
- **P0: Zero-Interaction Intelligence**: Generate 90% of threat data without active server engagement.
- **P0: Behavioral Verification**: Use isolated environments to follow redirect chains.
- **P1: Visual Forensics**: Provide an "Attack Graph" to visualize the threat journey.
- **P1: Product-Grade UX**: Deliver a high-end, responsive dashboard that translates technical metrics into human-readable stories.

---

## 4. Technical Architecture & Component Breakdown

### 4.1 Frontend (React / Vite / Tailwind v4)
- **Architecture**: Single Page Application (SPA) with state-driven navigation.
- **Visual Stack**: Framer Motion for micro-animations, Chart.js for telemetry visualization.
- **Security**: Strict input validation and sanitization of backend reports.

### 4.2 Backend (FastAPI / Playwright / OpenCV)
- **FastAPI**: Asynchronous REST API layer for high-throughput analysis.
- **OpenCV Engine**: Self-contained QR decoding (removing external DLL dependencies).
- **Playwright Sandbox**: Headless Chromium instances for safe destination traversal.

---

## 5. Functional Requirements

### 5.1 Zero-Interaction Pre-Analysis (DNA Module)
The system must analyze the URL metadata without initiating a network request:
- **Entropy Calculation**: Implementation of Shannon Entropy to detect machine-generated/obfuscated paths.
- **TLD Risk Scoring**: Automated weighting based on historical TLD maliciousness (e.g., .xyz, .top).
- **Lexical Pattern Matching**: Heuristic scanning for credential-harvesting keywords.

### 5.2 Dynamic Decision Engine
A stateful logic layer that orchestrates the analysis depth:
- **Low Risk (<30)**: Pre-analysis only. Instant response.
- **Medium/High Risk (>30)**: Automatic escalation to the Sandbox Module.

### 5.3 Behavioral Sandbox (Playwright)
Isolated execution environment to observe:
- **Redirect Latency & Hops**: Tracking every `302/301` redirect.
- **DOM Mutation**: Monitoring script injections and form creation.
- **Visual Capture**: Generating a non-interactive snapshot of the final payload.

---

## 6. Non-Functional Requirements

### 6.1 Performance & Latency
- **Pre-Analysis**: Must complete in < 200ms.
- **Sandbox**: Targeted completion in < 15s (dependent on target site load time).

### 6.2 Security & Isolation
- **Sandbox Hardening**: Headless instances must use custom User-Agents to avoid bot detection while maintaining complete isolation from the host OS.
- **Data Privacy**: No user-identifiable data is passed to the target destination during sandbox execution.

---

## 7. The Competitive Advantage (Novelty)
Our "moat" lies in the **Zero-Interaction Philosophy**. By treating the URL as a forensic object rather than just a pointer, we provide intelligence that traditional scanners cannot. The **Attack Graph** and **Behavioral Storytelling** turn complex forensics into a user-centric security product.

---

## 8. Future Roadmap
- **ML Integration**: Training a model on the DNA metrics to improve prediction accuracy.
- **API Extensibility**: Allowing third-party SOC (Security Operations Center) integration.
- **Cloud Sandboxing**: Moving Playwright execution to a distributed lambda-style architecture for massive scale.

---
**Approved By:**  
*Senior Software Engineer - Antigravity AI*
