// ============================================================
// Bootstrap super admin user
// ============================================================
// Run this ONCE to:
//   1. Create auth.users entry for profastpage@gmail.com (if missing)
//   2. Set email_confirmed_at so they can log in immediately
//   3. Set role = 'super_admin' in public."User"
//
// Usage:
//   node scripts/bootstrap-superadmin.js
//
// Note: this requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
// The password for this account must be set by the user via
// "Forgot password" flow OR you can set a known password here.
// ============================================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const SUPER_ADMIN_EMAIL = 'profastpage@gmail.com';
const SUPER_ADMIN_PASSWORD = 'CitasProAdmin2026!'; // Change after first login

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing Supabase env vars');
    process.exit(1);
  }
  if (!DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. List existing users to check if super admin already exists
  console.log('=== 1. Looking for existing super admin in auth.users ===');
  const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('listUsers error:', listErr.message);
    process.exit(1);
  }

  const existing = listData.users.find(u => u.email === SUPER_ADMIN_EMAIL);
  let authUid;

  if (existing) {
    console.log(`✓ Found existing auth user: ${existing.id}`);
    authUid = existing.id;
    // Ensure email is confirmed
    if (!existing.email_confirmed_at) {
      console.log('  Confirming email...');
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        email_confirm: true,
      });
      if (error) console.error('  Confirm error:', error.message);
      else console.log('  ✓ Email confirmed');
    }
    // Update password so the user can actually log in
    console.log('  Setting password...');
    const { error: pwErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: SUPER_ADMIN_PASSWORD,
    });
    if (pwErr) console.error('  Password error:', pwErr.message);
    else console.log('  ✓ Password set');
  } else {
    console.log(`Creating auth user for ${SUPER_ADMIN_EMAIL}...`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Super Admin' },
    });
    if (error) {
      console.error('Create error:', error.message);
      process.exit(1);
    }
    authUid = data.user.id;
    console.log(`✓ Created auth user: ${authUid}`);
  }

  // 2. Upsert business profile as super_admin
  console.log('\n=== 2. Upserting super_admin profile in public."User" ===');
  // Strip quotes from DATABASE_URL if present (shell-style env files often have them)
  const dbUrl = (DATABASE_URL || '').replace(/^["']|["']$/g, '');
  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  try {
    const existingProfile = await prisma.user.findUnique({
      where: { supabaseUid: authUid },
    });

    if (existingProfile) {
      const updated = await prisma.user.update({
        where: { supabaseUid: authUid },
        data: {
          role: 'super_admin',
          isActive: true,
          email: SUPER_ADMIN_EMAIL,
          fullName: existingProfile.fullName || 'Super Admin',
        },
      });
      console.log(`✓ Updated profile: ${updated.id} | role=${updated.role}`);
    } else {
      const created = await prisma.user.create({
        data: {
          supabaseUid: authUid,
          email: SUPER_ADMIN_EMAIL,
          fullName: 'Super Admin',
          role: 'super_admin',
          isActive: true,
          plan: 'full', // super admin gets full plan
        },
      });
      console.log(`✓ Created profile: ${created.id} | role=${created.role}`);
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n=== Super admin ready ===');
  console.log(`Email:    ${SUPER_ADMIN_EMAIL}`);
  console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Auth UID: ${authUid}`);
  console.log('\nLogin URL: https://citas-medicas-red.vercel.app/login');
  console.log('After login, you will be redirected to /superadmin');
  console.log('\n⚠️  CHANGE THIS PASSWORD after first login via "Forgot password".');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
