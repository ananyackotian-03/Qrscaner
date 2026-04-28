from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import cv2
import numpy as np
import os
import uuid

from pre_analyzer import PreAnalyzer
from sandbox import SandboxModule

app = FastAPI(title="QR Zero-Interaction Threat Intelligence System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for screenshots
if not os.path.exists("static/screenshots"):
    os.makedirs("static/screenshots")
app.mount("/static", StaticFiles(directory="static"), name="static")

pre_analyzer = PreAnalyzer()
sandbox = SandboxModule()

@app.post("/scan")
async def scan_qr(file: UploadFile = File(...)):
    # 1. Read QR using OpenCV
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    detector = cv2.QRCodeDetector()
    val, points, qrcode = detector.detectAndDecode(img)
    
    if not val:
        raise HTTPException(status_code=400, detail="No QR code found in image")
    
    url = val
    
    # 2. Pre-Analysis (Instant)
    pre_report = pre_analyzer.analyze(url)
    
    # 3. Decision Engine
    risk_level = "LOW"
    if pre_report["confidence"] > 60:
        risk_level = "HIGH"
    elif pre_report["confidence"] > 30:
        risk_level = "MEDIUM"
    
    # 4. Return initial prediction (Frontend can show this while sandbox runs)
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "risk_level": risk_level,
        "pre_report": pre_report
    }

@app.post("/sandbox")
async def run_sandbox(url: str, risk_level: str):
    # Only run sandbox for Medium/High risk or if requested
    if risk_level == "LOW":
        return {"message": "Sandbox skipped for low risk URL", "behaviors": None}
    
    # level mapping
    level = "full" if risk_level == "HIGH" else "limited"
    
    behaviors = await sandbox.run_analysis(url, level=level)
    
    # Combine into final verdict
    score = 0
    if behaviors.get("redirects") and len(behaviors["redirects"]) > 2: score += 30
    if behaviors.get("scripts_detected", 0) > 10: score += 20
    if behaviors.get("forms_found", 0) > 0: score += 10
    
    # Map to level
    final_score = min(score + 10, 100) # placeholder logic
    
    return {
        "behaviors": behaviors,
        "final_score": final_score,
        "explanation_story": f"The system detected a {risk_level.lower()} risk profile. Sandbox analysis revealed {len(behaviors.get('redirects', []))} redirects and {behaviors.get('scripts_detected', 0)} active scripts."
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
