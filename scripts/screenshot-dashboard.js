// Quick screenshot of dashboard + superadmin page on desktop
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'https://citas-medicas-red.vercel.app';
const OUT = '/home/z/my-project/download';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();

  // Login
  console.log('Logging in...');
  await p.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(1500);
  await p.fill('#email', 'direct-test+1785191030692@gmail.com');
  await p.fill('#password', 'TestPassword123!');
  await p.click('button[type="submit"]');

  // Wait longer for navigation
  try {
    await p.waitForURL('**/dashboard**', { timeout: 30000 });
    console.log('Landed on dashboard');
  } catch (e) {
    console.log('Dashboard nav timeout, taking screenshot anyway at', p.url());
  }
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${OUT}/08-dashboard-desktop.png`, fullPage: false });
  console.log('08-dashboard-desktop.png');

  // Try the citas page
  try {
    await p.locator('a[href="/dashboard/citas"]').first().click();
    await p.waitForTimeout(3000);
    await p.screenshot({ path: `${OUT}/09-citas-desktop.png`, fullPage: false });
    console.log('09-citas-desktop.png');
  } catch (e) {
    console.log('Citas page nav failed:', e.message);
  }

  // Billing page
  try {
    await p.goto(`${BASE}/dashboard/billing`, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${OUT}/10-billing-desktop.png`, fullPage: false });
    console.log('10-billing-desktop.png');
  } catch (e) {
    console.log('Billing page failed:', e.message);
  }

  await p.close();
  await ctx.close();
  await browser.close();
  console.log('Done');
})();
