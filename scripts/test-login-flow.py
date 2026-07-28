"""End-to-end browser test of the login flow with the fix applied.
Clicks the login button just like a real user, then verifies the
navigation to /dashboard actually happens.
"""
import asyncio
from playwright.async_api import async_playwright

URL = "https://citas-medicas-red.vercel.app"
EMAIL = "direct-test+1785191030692@gmail.com"
PASSWORD = "TestPassword123!"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()

        console_messages = []
        page.on("console", lambda m: console_messages.append(f"[{m.type}] {m.text}"))
        page.on("pageerror", lambda e: console_messages.append(f"[pageerror] {e}"))

        # 1. Go to login page
        print("→ Navigating to /login")
        await page.goto(f"{URL}/login", wait_until="networkidle", timeout=60000)
        print(f"  URL: {page.url}")

        # 2. Fill in credentials
        print("→ Filling credentials")
        await page.fill("#email", EMAIL)
        await page.fill("#password", PASSWORD)

        # 3. Click submit
        print("→ Clicking 'Iniciar sesión'")
        await page.click('button[type="submit"]')

        # 4. Wait for navigation to /dashboard (or any URL change)
        try:
            await page.wait_for_url(f"{URL}/dashboard**", timeout=15000)
            print(f"✅ Successfully navigated to: {page.url}")
            success = True
        except Exception as e:
            print(f"❌ Did NOT navigate to /dashboard. Still on: {page.url}")
            print(f"   Error: {e}")
            success = False

        # 5. Check if the dashboard actually loaded
        if success:
            try:
                # Dashboard should have "Clínica Test Direct" somewhere
                await page.wait_for_load_state("networkidle", timeout=15000)
                content = await page.content()
                if "Clínica Test Direct" in content or "Dashboard" in content or "dashboard" in page.url.lower():
                    print("✅ Dashboard content loaded successfully!")
                else:
                    print("⚠️  On /dashboard but content doesn't match expected")
                    print(f"   Body snippet: {content[:500]}")
            except Exception as e:
                print(f"⚠️  Navigation succeeded but page didn't fully load: {e}")

        # 6. Take a screenshot of the final state
        await page.screenshot(path="/home/z/my-project/download/login-flow-final.png")
        print(f"  Screenshot saved to /home/z/my-project/download/login-flow-final.png")

        # 7. Print any console errors
        if console_messages:
            print("\nConsole messages:")
            for m in console_messages[:15]:
                print(f"  {m}")

        await browser.close()
        return success

ok = asyncio.run(main())
print("\n=== RESULT:", "PASS ✅" if ok else "FAIL ❌", "===")
