// Diagnose login flow end-to-end:
// 1. Check if user exists & is email_confirmed in Supabase Auth (admin API)
// 2. Try signInWithPassword via anon key
// 3. Confirm email if needed
// 4. Verify the user has profile + clinic in our DB

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TEST_EMAIL = 'direct-test+1785191030692@gmail.com';
const TEST_PASSWORD = 'TestPassword123!';

async function main() {
  console.log('=== Step 1: List auth users via admin API ===');
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: usersList, error: listErr } =
    await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('listUsers error:', listErr.message);
    return;
  }
  console.log(`Total auth users: ${usersList.users.length}`);
  for (const u of usersList.users) {
    console.log(
      `  - ${u.email} | confirmed: ${u.email_confirmed_at ? 'YES' : 'NO'} | created: ${u.created_at} | id: ${u.id}`
    );
  }

  console.log('\n=== Step 2: Find test user ===');
  const testUser = usersList.users.find(u => u.email === TEST_EMAIL);
  if (!testUser) {
    console.log(`Test user ${TEST_EMAIL} NOT FOUND in auth.users`);
    console.log('Creating test user via admin API...');

    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'Test Direct' },
      });
    if (createErr) {
      console.error('Create error:', createErr.message);
      return;
    }
    console.log('Created & confirmed user:', created.user.id);
  } else {
    console.log(`Test user found: id=${testUser.id}`);
    console.log(`  email_confirmed_at = ${testUser.email_confirmed_at || 'NULL'}`);

    if (!testUser.email_confirmed_at) {
      console.log('\n>>> Email NOT confirmed. Confirming now via admin API...');
      const { data: updated, error: upErr } =
        await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
          email_confirm: true,
        });
      if (upErr) {
        console.error('Update error:', upErr.message);
        return;
      }
      console.log('Email confirmed:', updated.user.email_confirmed_at);
    }
  }

  console.log('\n=== Step 3: Try signInWithPassword via anon key ===');
  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signInData, error: signInErr } =
    await supabaseAnon.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
  if (signInErr) {
    console.error('signIn error:', signInErr.message);
    return;
  }
  console.log('Sign-in OK:');
  console.log('  user.id:', signInData.user?.id);
  console.log('  session:', signInData.session ? 'YES' : 'NULL');
  console.log('  access_token:', signInData.session?.access_token?.slice(0, 30) + '...');

  console.log('\n=== Step 4: Check profile + clinic in our DB ===');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const uid = signInData.user.id;
    const user = await prisma.user.findUnique({
      where: { supabaseUid: uid },
      include: { ownedClinics: true, memberships: { include: { clinic: true } } },
    });
    if (!user) {
      console.log(`No profile in public."User" for supabaseUid=${uid}`);
      console.log('Creating profile...');
      const created = await prisma.user.create({
        data: {
          supabaseUid: uid,
          email: TEST_EMAIL,
          fullName: 'Test Direct',
        },
      });
      console.log('Profile created:', created.id);
    } else {
      console.log(`Profile: id=${user.id} email=${user.email} role=${user.role} plan=${user.plan} active=${user.isActive}`);
      console.log(`  Owned clinics: ${user.ownedClinics.length}`);
      for (const c of user.ownedClinics) {
        console.log(`    - ${c.id} ${c.name}`);
      }
      console.log(`  Memberships: ${user.memberships.length}`);
      for (const m of user.memberships) {
        console.log(`    - ${m.clinic.name} (role: ${m.role})`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n=== Diagnosis complete ===');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
