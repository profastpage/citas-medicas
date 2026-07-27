// End-to-end test: register a new clinic owner via the production API
// Verifies Supabase Auth + Prisma + DB + trigger all work together.

const PROD_URL = 'https://citas-medicas-red.vercel.app';

const timestamp = Date.now();
const testEmail = `test+${timestamp}@citaspro.test`;
const testName = 'Clínica Test Producción';
const testPassword = 'TestPassword123!';

async function main() {
  console.log('=== CitasPro end-to-end production test ===\n');
  console.log(`Target: ${PROD_URL}`);
  console.log(`Test email: ${testEmail}\n`);

  // 1. Health check
  console.log('1. Health check...');
  const health = await fetch(`${PROD_URL}/api/health`);
  const healthJson = await health.json();
  console.log(`   ${health.status} →`, healthJson);

  // 2. Register
  console.log('\n2. Registering new clinic owner...');
  const regRes = await fetch(`${PROD_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      fullName: testName,
      clinicName: 'Clínica Test S.A.C.',
      phone: '+51 999 999 999',
    }),
  });
  console.log(`   Status: ${regRes.status}`);
  const regText = await regRes.text();
  let regJson;
  try {
    regJson = JSON.parse(regText);
  } catch {
    regJson = { raw: regText.substring(0, 500) };
  }
  console.log(`   Body:`, regJson);

  if (!regRes.ok) {
    console.log('\n❌ Registration failed — check server logs');
    return;
  }

  // 3. Verify Supabase Auth created the user by calling /api/auth/me with session cookie
  console.log('\n3. Verifying session via /api/auth/me...');
  const cookies = regRes.headers.getSetCookie?.() || [];
  const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');
  console.log(`   Cookies set: ${cookies.length}`);

  const meRes = await fetch(`${PROD_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  console.log(`   Status: ${meRes.status}`);
  const meText = await meRes.text();
  try {
    const meJson = JSON.parse(meText);
    console.log(`   Body:`, meJson);
  } catch {
    console.log(`   Body (raw):`, meText.substring(0, 300));
  }

  // 4. Verify dashboard is now accessible with session
  console.log('\n4. Verifying /dashboard access with session...');
  const dashRes = await fetch(`${PROD_URL}/dashboard`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log(`   Status: ${dashRes.status} (200 = authenticated, 307 = redirect to login)`);

  console.log('\n=== Test complete ===');
  console.log(`\nYou can now login at: ${PROD_URL}/login`);
  console.log(`Email: ${testEmail}`);
  console.log(`Password: ${testPassword}`);
}

main().catch((e) => {
  console.error('💥', e);
  process.exit(1);
});
