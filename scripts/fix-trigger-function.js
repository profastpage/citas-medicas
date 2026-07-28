// Fix the fn_handle_new_auth_user trigger function:
// - Add `SET search_path = public` (Supabase requires this for SECURITY DEFINER)
// - Use fully-qualified `public."User"` to be extra safe

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

const FIXED_FUNCTION = `
CREATE OR REPLACE FUNCTION public.fn_handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (supabase_uid, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (supabase_uid) DO NOTHING;
  RETURN NEW;
END;
$$;
`;

async function main() {
  await client.connect();
  console.log('✅ Connected');

  console.log('\n=== Recreating fn_handle_new_auth_user with search_path ===');
  await client.query(FIXED_FUNCTION);
  console.log('✅ Function recreated');

  // Verify
  const fn = await client.query(`
    SELECT pg_get_functiondef(oid) AS definition
    FROM pg_proc
    WHERE proname = 'fn_handle_new_auth_user';
  `);
  console.log('\nNew definition:');
  console.log(fn.rows[0]?.definition);

  // Also clean up the test user from auth.users we created during debugging
  console.log('\n=== Cleaning up test auth.users entries ===');
  try {
    const cleanup = await client.query(`
      DELETE FROM auth.users WHERE email IN
      ('auth-test@example.com', 'manual-test@example.com', 'trigger-sim@example.com')
      RETURNING id, email;
    `);
    console.log(`Deleted ${cleanup.rowCount} test users from auth.users`);
  } catch (err) {
    console.log('Cleanup failed (may not have permission):', err.message);
  }

  // Also clean from public.User
  const cleanupPub = await client.query(`
    DELETE FROM public."User" WHERE email IN
    ('auth-test@example.com', 'manual-test@example.com', 'trigger-sim@example.com',
     'direct-test@gmail.com', 'curl-test@gmail.com')
    RETURNING id, email;
  `);
  console.log(`Deleted ${cleanupPub.rowCount} test rows from public."User"`);

  await client.end();
  console.log('\n✅ Done — try registering again');
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
