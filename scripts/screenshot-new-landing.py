"""Capture screenshots of the landing page and login page after fixes."""
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

OUT = Path("/home/z/my-project/download")
OUT.mkdir(exist_ok=True, parents=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,
        )
        page = await ctx.new_page()

        # Landing page (top of page)
        print("→ Landing page top")
        await page.goto("https://citas-medicas-red.vercel.app/", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT / "landing-new-top.png"), full_page=False)
        print(f"  saved {OUT / 'landing-new-top.png'}")

        # Landing page (pricing section)
        print("→ Landing pricing section")
        # Scroll to the planes section
        await page.evaluate("document.getElementById('planes').scrollIntoView({block:'start'})")
        await page.wait_for_timeout(800)
        await page.screenshot(path=str(OUT / "landing-new-planes.png"), full_page=False)
        print(f"  saved {OUT / 'landing-new-planes.png'}")

        # Full landing page
        print("→ Full landing page")
        await page.evaluate("window.scrollTo(0,0)")
        await page.wait_for_timeout(500)
        await page.screenshot(path=str(OUT / "landing-new-full.png"), full_page=True)
        print(f"  saved {OUT / 'landing-new-full.png'}")

        # Login page
        print("→ Login page")
        await page.goto("https://citas-medicas-red.vercel.app/login", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT / "login-new.png"), full_page=False)
        print(f"  saved {OUT / 'login-new.png'}")

        # Login page in dark mode (test that the dark toggle still works)
        print("→ Login page dark mode")
        await page.goto("https://citas-medicas-red.vercel.app/", wait_until="networkidle", timeout=60000)
        # Inject dark mode by setting localStorage and reloading
        await page.evaluate("localStorage.setItem('theme', 'dark')")
        await page.goto("https://citas-medicas-red.vercel.app/", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(800)
        await page.screenshot(path=str(OUT / "landing-new-dark.png"), full_page=False)
        print(f"  saved {OUT / 'landing-new-dark.png'}")

        await browser.close()
        print("Done.")

asyncio.run(main())
