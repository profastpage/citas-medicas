// Debug the fn_handle_new_auth_user trigger
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

  // 1. Check the function definition
  console.log('=== fn_handle_new_auth_user definition ===');
  const fn = await client.query(`
    SELECT pg_get_functiondef(oid) AS definition
    FROM pg_proc
    WHERE proname = 'fn_handle_new_auth_user';
  `);
  console.log(fn.rows[0]?.definition || 'NOT FOUND');

  // 2. Check the trigger
  console.log('\n=== trg_on_auth_user_created trigger ===');
  const trg = await client.query(`
    SELECT event_object_table, trigger_name, action_timing, event_manipulation, action_statement
    FROM information_schema.triggers
    WHERE trigger_name = 'trg_on_auth_user_created';
  `);
  console.log(trg.rows);

  // 3. Check the User table structure
  console.log('\n=== "User" table columns ===');
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User'
    ORDER BY ordinal_position;
  `);
  cols.rows.forEach((r) =>
    console.log(`  ${r.column_name} | ${r.data_type} | nullable=${r.is_nullable} | default=${r.column_default || 'none'}`),
  );

  // 4. Try inserting a test user directly to see what fails
  console.log('\n=== Manual INSERT test into "User" ===');
  try {
    const result = await client.query(`
      INSERT INTO "User" (supabase_uid, email, full_name)
      VALUES ('11111111-1111-1111-1111-111111111111', 'manual-test@example.com', 'Manual Test')
      ON CONFLICT (supabase_uid) DO NOTHING
      RETURNING id, email, full_name;
    `);
    console.log('Insert OK:', result.rows);
  } catch (err) {
    console.log('Insert FAILED:', err.message);
  }

  // 5. Try calling the trigger function manually with a fake NEW record
  console.log('\n=== Try calling fn_handle_new_auth_user directly ===');
  try {
    // Simulate calling the function
    const result = await client.query(`
      SELECT fn_handle_new_auth_user();
    `);
    console.log('Call OK:', result.rows);
  } catch (err) {
    console.log('Call FAILED:', err.message);
  }

  // 6. Check the auth.users table structure
  console.log('\n=== auth.users table (just check it exists) ===');
  try {
    const authCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'auth' AND table_name = 'users'
      ORDER BY ordinal_position
      LIMIT 10;
    `);
    authCols.rows.forEach((r) => console.log(`  ${r.column_name} | ${r.data_type}`));
  } catch (err) {
    console.log('Cannot read auth.users:', err.message);
  }

  // 7. Check recent error logs from the trigger
  console.log('\n=== Recent Postgres errors (last 5 minutes) ===');
  // Try the insert as if from the trigger context
  try {
    await client.query('BEGIN');
    // Simulate what the trigger does
    const testUid = '22222222-2222-2222-2222-222222222222';
    await client.query(`
      INSERT INTO "User" (supabase_uid, email, full_name)
      VALUES ($1, 'trigger-sim@example.com', 'Trigger Sim')
      ON CONFLICT (supabase_uid) DO NOTHING
    `, [testUid]);
    console.log('✅ Trigger simulation succeeded');
    await client.query('ROLLBACK');
  } catch (err) {
    console.log('❌ Trigger simulation FAILED:', err.message);
    await client.query('ROLLBACK');
  }

  await client.end();
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
