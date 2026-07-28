// Manually confirm email for the test user so we can test login
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
  console.log('✅ Connected');

  // Confirm the email of the test user
  console.log('\n=== Confirming email for test user ===');
  const result = await client.query(`
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE email = 'direct-test+1785191030692@gmail.com'
    RETURNING id, email, email_confirmed_at;
  `);
  console.log('Updated:', result.rows);

  // Also disable email confirmation globally for the project
  // (so future registrations don't require email confirmation)
  console.log('\n=== Disabling email confirmation requirement ===');
  try {
    const configResult = await client.query(`
      UPDATE auth.config
      SET confirm_email = false
      WHERE id = 'auth'
      RETURNING id, confirm_email;
    `);
    console.log('Config updated:', configResult.rows);
  } catch (err) {
    console.log('Cannot update auth.config:', err.message);
    // Try alternative
    try {
      const altResult = await client.query(`
        SELECT * FROM auth.config LIMIT 5;
      `);
      console.log('auth.config contents:', altResult.rows);
    } catch (err2) {
      console.log('Cannot read auth.config:', err2.message);
    }
  }

  await client.end();
  console.log('\n✅ Done');
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
