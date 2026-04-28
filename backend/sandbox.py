import asyncio
from playwright.async_api import async_playwright
import time
import os

class SandboxModule:
    def __init__(self, output_dir="static/screenshots"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    async def run_analysis(self, url, level="full"):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            
            # Track behaviors
            behaviors = {
                "redirects": [],
                "scripts_detected": 0,
                "downloads_triggered": False,
                "forms_found": 0,
                "final_url": "",
                "screenshot_path": ""
            }

            # Listen for redirects
            page.on("framenavigated", lambda frame: behaviors["redirects"].append(frame.url))
            
            try:
                # Navigate
                await page.goto(url, wait_until="networkidle", timeout=15000)
                
                # Monitor DOM
                behaviors["final_url"] = page.url
                behaviors["forms_found"] = await page.locator("form").count()
                
                # Check for scripts
                scripts = await page.locator("script").count()
                behaviors["scripts_detected"] = scripts
                
                # Screenshot
                screenshot_name = f"scan_{int(time.time())}.png"
                screenshot_path = os.path.join(self.output_dir, screenshot_name)
                await page.screenshot(path=screenshot_path)
                behaviors["screenshot_path"] = f"/static/screenshots/{screenshot_name}"
                
                # Safe Preview (Strip JS)
                # In a real app, we'd return stripped HTML. For now, we'll return the screenshot.
                
            except Exception as e:
                behaviors["error"] = str(e)
            
            await browser.close()
            return behaviors
