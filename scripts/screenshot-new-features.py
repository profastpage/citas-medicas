"""Capture mobile + desktop screenshots of the new login page and super admin panel."""
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

OUT = Path("/home/z/my-project/download")
OUT.mkdir(exist_ok=True, parents=True)

BASE = "https://citas-medicas-red.vercel.app"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # === Mobile screenshots (iPhone 14 Pro Max: 430x932) ===
        m_ctx = await browser.new_context(
            viewport={"width": 430, "height": 932},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        )
        m_page = await m_ctx.new_page()

        print("→ Mobile login page")
        await m_page.goto(f"{BASE}/login", wait_until="networkidle", timeout=60000)
        await m_page.wait_for_timeout(1500)
        await m_page.screenshot(path=str(OUT / "login-mobile.png"), full_page=False)
        print(f"  saved {OUT/'login-mobile.png'}")

        # Fill password to show eye toggle
        print("→ Mobile login with password filled (eye toggle visible)")
        await m_page.fill("#email", "profastpage@gmail.com")
        await m_page.fill("#password", "TestPassword123!")
        await m_page.wait_for_timeout(500)
        await m_page.screenshot(path=str(OUT / "login-mobile-filled.png"), full_page=False)
        print(f"  saved {OUT/'login-mobile-filled.png'}")

        # Show password (eye toggle clicked)
        print("→ Mobile login with password shown (eye toggle clicked)")
        eye_btn = await m_page.query_selector('button[aria-label*="contraseña"]')
        if eye_btn:
            await eye_btn.click()
            await m_page.wait_for_timeout(500)
            await m_page.screenshot(path=str(OUT / "login-mobile-show-password.png"), full_page=False)
            print(f"  saved {OUT/'login-mobile-show-password.png'}")

        # Open forgot password modal
        print("→ Mobile forgot password modal")
        forgot_link = await m_page.query_selector('text=¿Olvidaste tu contraseña?')
        if forgot_link:
            await forgot_link.click()
            await m_page.wait_for_timeout(500)
            await m_page.screenshot(path=str(OUT / "login-mobile-forgot.png"), full_page=False)
            print(f"  saved {OUT/'login-mobile-forgot.png'}")

        await m_ctx.close()

        # === Desktop screenshots ===
        d_ctx = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,
        )
        d_page = await d_ctx.new_page()

        print("→ Desktop login page")
        await d_page.goto(f"{BASE}/login", wait_until="networkidle", timeout=60000)
        await d_page.wait_for_timeout(1500)
        await d_page.screenshot(path=str(OUT / "login-desktop.png"), full_page=False)
        print(f"  saved {OUT/'login-desktop.png'}")

        # Login as super admin
        print("→ Desktop: log in as super admin")
        await d_page.fill("#email", "profastpage@gmail.com")
        await d_page.fill("#password", "CitasProAdmin2026!")
        await d_page.click('button[type="submit"]')
        try:
            await d_page.wait_for_url(f"{BASE}/superadmin**", timeout=20000)
            print(f"  Redirected to: {d_page.url}")
            await d_page.wait_for_timeout(3000)
            await d_page.screenshot(path=str(OUT / "superadmin-desktop.png"), full_page=False)
            print(f"  saved {OUT/'superadmin-desktop.png'}")
        except Exception as e:
            print(f"  ERROR: didn't reach /superadmin: {e}")
            print(f"  Current URL: {d_page.url}")
            await d_page.screenshot(path=str(OUT / "superadmin-error.png"), full_page=False)

        # Click 'Usuarios' tab
        print("→ Desktop: super admin Users tab")
        try:
            users_tab = await d_page.query_selector('button:has-text("Usuarios")')
            if users_tab:
                await users_tab.click()
                await d_page.wait_for_timeout(1500)
                await d_page.screenshot(path=str(OUT / "superadmin-users.png"), full_page=False)
                print(f"  saved {OUT/'superadmin-users.png'}")
        except Exception as e:
            print(f"  Could not click Users tab: {e}")

        # === Mobile super admin (need to log in fresh on mobile) ===
        m2_ctx = await browser.new_context(
            viewport={"width": 430, "height": 932},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        )
        m2_page = await m2_ctx.new_page()
        print("→ Mobile: log in as super admin")
        await m2_page.goto(f"{BASE}/login", wait_until="networkidle", timeout=60000)
        await m2_page.fill("#email", "profastpage@gmail.com")
        await m2_page.fill("#password", "CitasProAdmin2026!")
        await m2_page.click('button[type="submit"]')
        try:
            await m2_page.wait_for_url(f"{BASE}/superadmin**", timeout=20000)
            await m2_page.wait_for_timeout(3000)
            await m2_page.screenshot(path=str(OUT / "superadmin-mobile.png"), full_page=False)
            print(f"  saved {OUT/'superadmin-mobile.png'}")
            # Scroll to show more
            await m2_page.evaluate("window.scrollBy(0, 600)")
            await m2_page.wait_for_timeout(500)
            await m2_page.screenshot(path=str(OUT / "superadmin-mobile-scroll.png"), full_page=False)
            print(f"  saved {OUT/'superadmin-mobile-scroll.png'}")
        except Exception as e:
            print(f"  ERROR: {e}")

        await browser.close()
        print("Done.")

asyncio.run(main())
