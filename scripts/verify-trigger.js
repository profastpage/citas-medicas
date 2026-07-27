// Verify the test user created earlier via direct supabase.auth.signUp
// made it into both auth.users AND public."User" (proving the trigger works)
const { Client } = require('pg');

const DIRECT_URL = process.env.DIRECT_URL || '';
const m = DIRECT_URL.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
const [, USER, PASSWORD, HOST, PORT_STR, DB] = m;

const client = new Client({
  host: HOST,
  port: parseInt(PORT_STR, 10),
  database: DB,
  user: USER,
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('✅ Connected\n');

  console.log('=== auth.users entries ===');
  const authUsers = await client.query(`
    SELECT id, email, created_at, email_confirmed_at, raw_user_meta_data
    FROM auth.users
    ORDER BY created_at DESC
    LIMIT 10;
  `);
  console.log(`Found ${authUsers.rows.length} users in auth.users:`);
  authUsers.rows.forEach((u) => {
    console.log(`  • ${u.email} (id=${u.id})`);
    console.log(`    created=${u.created_at} confirmed=${u.email_confirmed_at || 'pending'}`);
    console.log(`    meta=${JSON.stringify(u.raw_user_meta_data)}`);
  });

  console.log('\n=== public."User" entries ===');
  const pubUsers = await client.query(`
    SELECT id, supabase_uid, email, full_name, role, plan, is_active, created_at
    FROM public."User"
    ORDER BY created_at DESC
    LIMIT 10;
  `);
  console.log(`Found ${pubUsers.rows.length} rows in public."User":`);
  pubUsers.rows.forEach((u) => {
    console.log(`  • ${u.email} (uid=${u.supabase_uid})`);
    console.log(`    name=${u.full_name} role=${u.role} plan=${u.plan} active=${u.is_active}`);
    console.log(`    created=${u.created_at}`);
  });

  console.log('\n=== Trigger verification ===');
  if (authUsers.rows.length === pubUsers.rows.length) {
    console.log('✅ Trigger is working — every auth.user has a matching public."User" profile');
  } else {
    console.log('⚠️ Count mismatch — trigger may have missed some users');
  }

  // Cross-check: for each auth user, verify there's a public.User with matching supabase_uid
  console.log('\n=== Cross-check (auth.users → public.User) ===');
  for (const auth of authUsers.rows) {
    const match = await client.query(`SELECT id, email FROM public."User" WHERE supabase_uid = $1`, [auth.id]);
    if (match.rows.length > 0) {
      console.log(`  ✅ ${auth.email} → profile found (id=${match.rows[0].id})`);
    } else {
      console.log(`  ❌ ${auth.email} → NO profile (trigger failed for this user)`);
    }
  }

  await client.end();
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
