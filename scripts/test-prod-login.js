// Test production login endpoint and verify cookies + redirect behavior
const TEST_EMAIL = 'direct-test+1785191030692@gmail.com';
const TEST_PASSWORD = 'TestPassword123!';
const BASE = 'https://citas-medicas-red.vercel.app';

async function main() {
  console.log('=== 1. POST /api/auth/login ===');
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    redirect: 'manual',
  });
  console.log('Status:', loginRes.status);
  console.log('Headers:');
  loginRes.headers.forEach((v, k) => console.log(`  ${k}: ${v}`));

  const setCookies = loginRes.headers.get('set-cookie');
  console.log('\nSet-Cookie header:');
  if (setCookies) {
    // Split on comma not followed by space (cookie separator)
    const cookies = setCookies.split(/,(?=[^;]+;|[^;]+$)/i);
    cookies.forEach((c, i) => console.log(`  [${i}] ${c.trim().slice(0, 120)}...`));
  } else {
    console.log('  (none)');
  }

  const body = await loginRes.text();
  console.log('\nBody:', body);

  // Extract cookie values for sb-access-token etc.
  const cookiePairs = (setCookies || '')
    .split(/,(?=[^;]+;|[^;]+$)/i)
    .map(c => c.split(';')[0].trim())
    .filter(Boolean);
  const cookieHeader = cookiePairs.join('; ');
  console.log('\nCookie header for next request:', cookieHeader.slice(0, 100) + '...');

  console.log('\n=== 2. GET /dashboard with session cookie ===');
  const dashRes = await fetch(`${BASE}/dashboard`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log('Status:', dashRes.status);
  console.log('Location:', dashRes.headers.get('location') || '(none)');
  dashRes.headers.forEach((v, k) => {
    if (k.toLowerCase().startsWith('x-') || k.toLowerCase() === 'location' || k.toLowerCase() === 'set-cookie') {
      console.log(`  ${k}: ${v.slice(0, 100)}`);
    }
  });

  console.log('\n=== 3. GET /api/auth/me with session cookie ===');
  const meRes = await fetch(`${BASE}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log('Status:', meRes.status);
  const meBody = await meRes.text();
  console.log('Body:', meBody.slice(0, 500));

  console.log('\n=== 4. GET /api/patients with session cookie ===');
  const patRes = await fetch(`${BASE}/api/patients`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log('Status:', patRes.status);
  const patBody = await patRes.text();
  console.log('Body:', patBody.slice(0, 500));
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
