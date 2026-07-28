// Test rate limiting + super admin login + super admin API access
const BASE = 'https://citas-medicas-red.vercel.app';
const SUPER_ADMIN_EMAIL = 'profastpage@gmail.com';
const SUPER_ADMIN_PASSWORD = 'CitasProAdmin2026!';

async function main() {
  console.log('=== 1. Rate limit test on /api/auth/login (should fail after 10) ===');
  for (let i = 1; i <= 12; i++) {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fake@example.com', password: 'wrong' }),
    });
    const body = await res.text();
    console.log(`  Attempt ${i}: HTTP ${res.status}${res.status === 429 ? ' (RATE LIMITED ✓)' : ''} ${body.slice(0, 80)}`);
    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      console.log(`  Retry-After: ${retryAfter}s`);
      break;
    }
  }

  console.log('\n=== 2. Super admin login ===');
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD }),
    redirect: 'manual',
  });
  console.log('Status:', loginRes.status);
  const loginBody = await loginRes.json();
  console.log('Body:', JSON.stringify(loginBody, null, 2));

  // Extract cookies
  const setCookies = loginRes.headers.get('set-cookie') || '';
  const cookiePairs = setCookies
    .split(/,(?=[^;]+;|[^;]+$)/i)
    .map(c => c.split(';')[0].trim())
    .filter(Boolean);
  const cookieHeader = cookiePairs.join('; ');

  console.log('\n=== 3. GET /api/superadmin/users (with admin cookies) ===');
  const usersRes = await fetch(`${BASE}/api/superadmin/users`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Status:', usersRes.status);
  const usersBody = await usersRes.json();
  if (usersRes.ok) {
    console.log(`Users count: ${usersBody.users?.length ?? 0}`);
    for (const u of (usersBody.users || []).slice(0, 5)) {
      console.log(`  - ${u.email} | role=${u.role} | plan=${u.plan} | active=${u.isActive}`);
    }
  } else {
    console.log('Body:', JSON.stringify(usersBody).slice(0, 200));
  }

  console.log('\n=== 4. GET /api/superadmin/clinics (with admin cookies) ===');
  const clinicsRes = await fetch(`${BASE}/api/superadmin/clinics`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Status:', clinicsRes.status);
  const clinicsBody = await clinicsRes.json();
  if (clinicsRes.ok) {
    console.log(`Clinics count: ${clinicsBody.clinics?.length ?? 0}`);
    for (const c of (clinicsBody.clinics || []).slice(0, 5)) {
      console.log(`  - ${c.name} | owner=${c.owner?.email} | patients=${c.patients} appts=${c.appointments}`);
    }
  } else {
    console.log('Body:', JSON.stringify(clinicsBody).slice(0, 200));
  }

  console.log('\n=== 5. GET /superadmin page (with admin cookies) ===');
  const pageRes = await fetch(`${BASE}/superadmin`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log('Status:', pageRes.status);
  console.log('Location:', pageRes.headers.get('location') || '(no redirect — page served)');

  console.log('\n=== 6. Rate limit on /api/health (should NOT rate limit for normal use) ===');
  for (let i = 1; i <= 3; i++) {
    const res = await fetch(`${BASE}/api/health`);
    console.log(`  Attempt ${i}: HTTP ${res.status}`);
  }

  console.log('\n=== 7. Regular user cannot access super admin ===');
  // Log in as the regular test user
  const regularLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'direct-test+1785191030692@gmail.com',
      password: 'TestPassword123!',
    }),
    redirect: 'manual',
  });
  const regularCookies = (regularLogin.headers.get('set-cookie') || '')
    .split(/,(?=[^;]+;|[^;]+$)/i)
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
  const forbiddenRes = await fetch(`${BASE}/api/superadmin/users`, {
    headers: { Cookie: regularCookies },
  });
  console.log(`Regular user accessing /api/superadmin/users: HTTP ${forbiddenRes.status} ${forbiddenRes.status === 403 ? '(BLOCKED ✓)' : '(LEAK!)'}`);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
