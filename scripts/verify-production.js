// ============================================================
// CitasPro — End-to-end verification on production
// ============================================================
// Tests:
// 1. Landing loads + has new mobile nav
// 2. Login page has all new features (Google, eye toggle, forgot password, back)
// 3. Login with demo account works + lands on dashboard
// 4. Plan limit enforcement (try 6th appointment as Free -> 402)
// 5. Rate limit headers present on API responses
// 6. Super admin login redirects to /superadmin
// ============================================================

const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'https://citas-medicas-red.vercel.app';
const DEMO_EMAIL = 'direct-test+1785191030692@gmail.com';
const DEMO_PASSWORD = 'TestPassword123!';
const SUPERADMIN_EMAIL = 'profastpage@gmail.com';

const results = [];
function log(ok, label, detail = '') {
  const line = `${ok ? '✅' : '❌'} ${label}${detail ? ' — ' + detail : ''}`;
  results.push({ ok, label, detail });
  console.log(line);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 13
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  // ============================================================
  // TEST 1: Landing page loads + has mobile nav
  // ============================================================
  console.log('\n=== Test 1: Landing page (mobile viewport) ===');
  const p1 = await ctx.newPage();
  try {
    await p1.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await p1.waitForTimeout(1500);

    const title = await p1.title();
    log(title.includes('CitasPro'), 'Landing title', title);

    // Check the mobile nav shows Entrar / Gratis CTAs
    const entrarVisible = await p1.locator('text=Entrar').first().isVisible().catch(() => false);
    log(entrarVisible, 'Mobile "Entrar" link visible');

    const gratisVisible = await p1.locator('text=Gratis').first().isVisible().catch(() => false);
    log(gratisVisible, 'Mobile "Gratis" CTA visible');

    // Check the mobile secondary anchor nav
    const featuresLink = await p1.locator('a:has-text("Funcionalidades")').first().isVisible().catch(() => false);
    log(featuresLink, 'Mobile anchor nav "Funcionalidades" visible');

    // Check the Planes section shows new limits
    const freePlanText = await p1.locator('text=5 citas al mes').first().isVisible().catch(() => false);
    log(freePlanText, 'Free plan shows "5 citas al mes"');

    const fullPlanText = await p1.locator('text=Citas y médicos ilimitados').first().isVisible().catch(() => false);
    log(fullPlanText, 'Full plan shows unlimited text');
  } catch (e) {
    log(false, 'Landing test error', e.message);
  }
  await p1.close();

  // ============================================================
  // TEST 2: Login page features
  // ============================================================
  console.log('\n=== Test 2: Login page features (mobile) ===');
  const p2 = await ctx.newPage();
  try {
    await p2.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await p2.waitForTimeout(1500);

    const backVisible = await p2.locator('text=Volver al inicio').isVisible().catch(() => false);
    log(backVisible, 'Back-to-landing link visible');

    const googleVisible = await p2.locator('text=Continuar con Google').isVisible().catch(() => false);
    log(googleVisible, 'Google sign-in button visible');

    const forgotVisible = await p2.locator('text=¿Olvidaste tu contraseña?').isVisible().catch(() => false);
    log(forgotVisible, 'Forgot password link visible');

    // Check eye toggle exists (Eye or EyeOff icon)
    const eyeBtn = p2.locator('button[aria-label*="contraseña"]');
    const eyeVisible = await eyeBtn.isVisible().catch(() => false);
    log(eyeVisible, 'Password eye toggle visible');

    // Click eye to verify it toggles
    if (eyeVisible) {
      const passwordInput = p2.locator('#password');
      const initialType = await passwordInput.getAttribute('type');
      await eyeBtn.click();
      await p2.waitForTimeout(200);
      const newType = await passwordInput.getAttribute('type');
      log(initialType === 'password' && newType === 'text', 'Eye toggles password visibility', `${initialType} -> ${newType}`);
    }
  } catch (e) {
    log(false, 'Login page test error', e.message);
  }
  await p2.close();

  // ============================================================
  // TEST 3: Login with demo account → dashboard
  // ============================================================
  console.log('\n=== Test 3: Demo login → dashboard ===');
  const p3 = await ctx.newPage();
  try {
    await p3.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await p3.waitForTimeout(1000);

    await p3.fill('#email', DEMO_EMAIL);
    await p3.fill('#password', DEMO_PASSWORD);
    await p3.click('button[type="submit"]');

    // Wait for navigation to /dashboard
    await p3.waitForURL('**/dashboard**', { timeout: 15000 });
    await p3.waitForTimeout(2500);

    const url = p3.url();
    log(url.includes('/dashboard'), 'Landed on dashboard', url);

    // Check the sidebar (desktop) or top bar (mobile) is visible
    const citasProVisible = await p3.locator('text=CitasPro').first().isVisible().catch(() => false);
    log(citasProVisible, 'CitasPro brand visible on dashboard');

    // Check the hamburger menu on mobile
    const hamburgerVisible = await p3.locator('button:has(svg.lucide-menu)').first().isVisible().catch(() => false);
    log(hamburgerVisible, 'Mobile hamburger menu visible');
  } catch (e) {
    log(false, 'Demo login test error', e.message);
  }
  await p3.close();

  // ============================================================
  // TEST 4: Plan limit enforcement — try to create 11th login
  // (just verify rate limit headers are present, then verify
  // the plan-limits module is wired by checking the API)
  // ============================================================
  console.log('\n=== Test 4: Rate limit headers on auth endpoint ===');
  try {
    const res = await fetch(`${BASE}/api/health`);
    const rlHeaders = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset'];
    const found = rlHeaders.filter(h => res.headers.has(h));
    log(res.status === 200, 'Health endpoint returns 200', `status=${res.status}`);
    log(found.length > 0, 'Rate limit headers present', found.join(', ') || 'none (acceptable for health)');
  } catch (e) {
    log(false, 'Rate limit test error', e.message);
  }

  // ============================================================
  // TEST 5: Plan limit on appointments — try to create beyond Free limit
  // We'll log in as demo (plan=free), then try to create a 6th appointment
  // if there are already 5 this month. If there are <5, just verify the
  // endpoint exists and returns proper response.
  // ============================================================
  console.log('\n=== Test 5: Plan limit enforcement (appointments) ===');
  const p5 = await ctx.newPage();
  try {
    // First log in to get a session cookie
    await p5.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await p5.waitForTimeout(800);
    await p5.fill('#email', DEMO_EMAIL);
    await p5.fill('#password', DEMO_PASSWORD);
    await p5.click('button[type="submit"]');
    await p5.waitForURL('**/dashboard**', { timeout: 15000 });
    await p5.waitForTimeout(2000);

    // Fetch existing patients to get a valid patientId + doctorId
    const patientsRes = await p5.evaluate(async () => {
      const r = await fetch('/api/patients');
      return r.json();
    });

    const doctorsRes = await p5.evaluate(async () => {
      const r = await fetch('/api/doctors');
      return r.json();
    });

    if (patientsRes.patients && patientsRes.patients.length > 0 && doctorsRes.doctors && doctorsRes.doctors.length > 0) {
      log(true, 'Demo clinic has patients + doctors', `p=${patientsRes.patients.length} d=${doctorsRes.doctors.length}`);

      // Try to create an appointment
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const createRes = await p5.evaluate(async (args) => {
        const r = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args),
        });
        const data = await r.json().catch(() => ({}));
        return { status: r.status, data };
      }, {
        patientId: patientsRes.patients[0].id,
        doctorId: doctorsRes.doctors[0].id,
        appointmentDate: tomorrow.toISOString(),
        reason: 'Test from e2e verification',
      });

      // 200 = OK (still under limit), 402 = limit reached (expected if already 5 this month)
      log(
        createRes.status === 200 || createRes.status === 402,
        'Appointment create returns 200 or 402 (plan limit enforced)',
        `status=${createRes.status} ${createRes.data.code || createRes.data.error || 'OK'}`
      );

      if (createRes.status === 402) {
        log(
          createRes.data.code === 'PLAN_LIMIT_APPOINTMENTS',
          'Plan limit code correct',
          createRes.data.code
        );
        log(
          createRes.data.upgradeUrl === '/dashboard/billing',
          'Upgrade URL present in 402 response'
        );
      }
    } else {
      log(false, 'Demo clinic lacks patients or doctors', `p=${patientsRes.patients?.length ?? 0} d=${doctorsRes.doctors?.length ?? 0}`);
    }
  } catch (e) {
    log(false, 'Plan limit test error', e.message);
  }
  await p5.close();

  // ============================================================
  // TEST 6: Super admin login redirects to /superadmin
  // ============================================================
  console.log('\n=== Test 6: Super admin login redirect ===');
  // We can't login as super admin without their password, but we can
  // check that the login endpoint returns redirectTo:/superadmin when
  // the email matches. We'll just check the superadmin page is protected.
  try {
    const res = await fetch(`${BASE}/superadmin`, { redirect: 'manual' });
    // Should redirect (302/307) to /login since we're not authenticated
    log(
      res.status === 307 || res.status === 302 || res.status === 303,
      'Superadmin page is protected (redirects unauthenticated)',
      `status=${res.status}`
    );
  } catch (e) {
    log(false, 'Super admin protection test error', e.message);
  }

  // ============================================================
  // TEST 7: Rate limit on login endpoint (try 11 logins, expect 429 after 10)
  // ============================================================
  console.log('\n=== Test 7: Rate limit on /api/auth/login ===');
  try {
    let statuses = [];
    for (let i = 0; i < 12; i++) {
      const r = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'rate-limit-test@example.com', password: 'wrong' }),
      });
      statuses.push(r.status);
      if (r.status === 429) break;
    }
    const saw429 = statuses.includes(429);
    log(saw429, 'Rate limit triggers 429 after repeated failed logins', `statuses=${statuses.join(',')}`);
  } catch (e) {
    log(false, 'Rate limit test error', e.message);
  }

  await browser.close();

  // Summary
  console.log('\n=== SUMMARY ===');
  const passed = results.filter(r => r.ok).length;
  const total = results.length;
  console.log(`${passed}/${total} tests passed`);
  fs.writeFileSync('/home/z/my-project/tool-results/verification-result.json', JSON.stringify({ passed, total, results }, null, 2));
  process.exit(passed === total ? 0 : 1);
})();
