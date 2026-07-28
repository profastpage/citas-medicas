"""Quick verification that /dashboard fully loads after login."""
import asyncio
from playwright.async_api import async_playwright

URL = "https://citas-medicas-red.vercel.app"
EMAIL = "direct-test+1785191030692@gmail.com"
PASSWORD = "TestPassword123!"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        print("→ Login")
        await page.goto(f"{URL}/login", wait_until="networkidle", timeout=60000)
        await page.fill("#email", EMAIL)
        await page.fill("#password", PASSWORD)
        await page.click('button[type="submit"]')

        # Wait for /dashboard URL AND for the page to settle
        await page.wait_for_url(f"{URL}/dashboard**", timeout=20000)
        print(f"  URL after redirect: {page.url}")

        # Give the page 3 seconds to fully render
        await page.wait_for_timeout(4000)

        # Check for dashboard markers
        content = await page.content()
        markers = [
            "Clínica Test Direct",
            "Dashboard",
            "Pacientes",
            "Citas",
            "Plan Free",
            "Cerrar",
        ]
        found = [m for m in markers if m in content]
        missing = [m for m in markers if m not in content]
        print(f"\nFound dashboard markers: {found}")
        print(f"Missing markers: {missing}")

        await page.screenshot(path="/home/z/my-project/download/dashboard-after-login.png", full_page=True)
        print(f"\nScreenshot: /home/z/my-project/download/dashboard-after-login.png")
        print(f"Final URL: {page.url}")

        await browser.close()
        return len(found) >= 2

ok = asyncio.run(main())
print("\n=== RESULT:", "PASS ✅" if ok else "FAIL ❌", "===")
