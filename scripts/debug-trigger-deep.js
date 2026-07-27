// Deep debug: check function owner, RLS, and try simulating the trigger
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

  // 1. Check function owner
  console.log('=== Function owner ===');
  const owner = await client.query(`
    SELECT proname, proowner::regrole AS owner, prosecdef
    FROM pg_proc
    WHERE proname = 'fn_handle_new_auth_user';
  `);
  console.log(owner.rows);

  // 2. Check User table owner and RLS
  console.log('\n=== User table owner & RLS ===');
  const tbl = await client.query(`
    SELECT tableowner, rowsecurity
    FROM pg_tables
    WHERE tablename = 'User';
  `);
  console.log(tbl.rows);

  // Check relrowsecurity from pg_class (more accurate)
  const rls = await client.query(`
    SELECT relname, relrowsecurity, relforcerowsecurity
    FROM pg_class
    WHERE relname = 'User';
  `);
  console.log('pg_class RLS:', rls.rows);

  // 3. Check who I am
  console.log('\n=== Current user ===');
  const me = await client.query('SELECT current_user, session_user, current_database();');
  console.log(me.rows);

  // 4. Clean up manual test data
  console.log('\n=== Cleanup manual test data ===');
  const cleanup = await client.query(`
    DELETE FROM "User" WHERE email IN ('manual-test@example.com', 'trigger-sim@example.com');
  `);
  console.log(`Deleted ${cleanup.rowCount} rows`);

  // 5. Try to insert into auth.users to trigger the trigger (this might fail due to permissions)
  console.log('\n=== Try simulating an auth.users INSERT ===');
  try {
    const testUid = '33333333-3333-3333-3333-333333333333';
    // The auth schema is protected, but try anyway
    await client.query('BEGIN');
    await client.query(`
      INSERT INTO auth.users (id, aud, role, email, encrypted_password, raw_user_meta_data)
      VALUES ($1, 'authenticated', 'authenticated', 'auth-test@example.com',
              'fake_hash',
              '{"full_name":"Auth Test","phone":"+51 999"}'::jsonb)
    `, [testUid]);
    console.log('✅ auth.users INSERT succeeded — trigger should have fired');

    // Check if the trigger created the User profile
    const profile = await client.query(`
      SELECT * FROM "User" WHERE supabase_uid = $1;
    `, [testUid]);
    console.log('Profile created:', profile.rows);

    await client.query('ROLLBACK');
  } catch (err) {
    console.log('❌ auth.users INSERT FAILED:', err.message);
    await client.query('ROLLBACK');
  }

  // 6. Check Supabase error logs (if accessible)
  console.log('\n=== Try to read Supabase logs ===');
  try {
    const logs = await client.query(`
      SELECT log_time, level, message
      FROM postgres_log
      WHERE log_time > now() - interval '15 minutes'
      ORDER BY log_time DESC
      LIMIT 20;
    `);
    console.log('Recent logs:');
    logs.rows.forEach((r) => console.log(`  ${r.log_time} [${r.level}] ${r.message?.substring(0, 200)}`));
  } catch (err) {
    console.log('Cannot read postgres_log:', err.message);
    // Try alternative
    try {
      const alt = await client.query(`
        SELECT * FROM pg_stat_activity WHERE state != 'idle' LIMIT 5;
      `);
      console.log('Active queries:', alt.rows);
    } catch (err2) {
      console.log('Cannot read pg_stat_activity either:', err2.message);
    }
  }

  await client.end();
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
