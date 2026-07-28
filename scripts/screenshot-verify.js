// ============================================================
// CitasPro — Visual verification via screenshots
// ============================================================
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'https://citas-medicas-red.vercel.app';
const OUT = '/home/z/my-project/download';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Mobile viewport
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const mp = await mobile.newPage();

  // 1. Landing on mobile
  await mp.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(1500);
  await mp.screenshot({ path: `${OUT}/01-landing-mobile.png`, fullPage: false });
  console.log('01-landing-mobile.png');

  // 2. Plans section on mobile (scroll to it)
  await mp.locator('#planes').scrollIntoViewIfNeeded();
  await mp.waitForTimeout(500);
  await mp.screenshot({ path: `${OUT}/02-landing-planes-mobile.png`, fullPage: false });
  console.log('02-landing-planes-mobile.png');

  // 3. Login page on mobile
  await mp.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(1000);
  await mp.screenshot({ path: `${OUT}/03-login-mobile.png`, fullPage: false });
  console.log('03-login-mobile.png');

  // 4. Click into password field + check the eye button
  await mp.fill('#password', 'test123');
  await mp.waitForTimeout(300);
  await mp.screenshot({ path: `${OUT}/04-login-with-password.png`, fullPage: false });
  console.log('04-login-with-password.png');

  // 5. Click the eye icon to show password
  await mp.locator('button[aria-label*="contraseña"]').click();
  await mp.waitForTimeout(300);
  await mp.screenshot({ path: `${OUT}/05-login-eye-toggled.png`, fullPage: false });
  console.log('05-login-eye-toggled.png');

  // 6. Click "¿Olvidaste tu contraseña?" to open forgot-password modal
  await mp.locator('text=¿Olvidaste tu contraseña?').click();
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: `${OUT}/06-forgot-modal.png`, fullPage: false });
  console.log('06-forgot-modal.png');

  await mp.close();
  await mobile.close();

  // Desktop viewport for comparison
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const dp = await desktop.newPage();

  // 7. Landing on desktop
  await dp.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(1500);
  await dp.screenshot({ path: `${OUT}/07-landing-desktop.png`, fullPage: false });
  console.log('07-landing-desktop.png');

  // 8. Login with demo + screenshot dashboard
  await dp.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(800);
  await dp.fill('#email', 'direct-test+1785191030692@gmail.com');
  await dp.fill('#password', 'TestPassword123!');
  await dp.click('button[type="submit"]');
  await dp.waitForURL('**/dashboard**', { timeout: 15000 });
  await dp.waitForTimeout(2500);
  await dp.screenshot({ path: `${OUT}/08-dashboard-desktop.png`, fullPage: false });
  console.log('08-dashboard-desktop.png');

  // 9. Click on Citas page in sidebar
  await dp.locator('a[href="/dashboard/citas"]').first().click();
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: `${OUT}/09-citas-desktop.png`, fullPage: false });
  console.log('09-citas-desktop.png');

  // 10. Verify button click state — go to billing page (has many buttons)
  await dp.locator('a[href="/dashboard/billing"]').first().click();
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: `${OUT}/10-billing-desktop.png`, fullPage: false });
  console.log('10-billing-desktop.png');

  await dp.close();
  await desktop.close();
  await browser.close();

  console.log('\n✅ All screenshots saved to:', OUT);
  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.png'));
  console.log('Files:', files.join(', '));
})();
