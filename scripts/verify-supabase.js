// Verify Supabase schema (functions, triggers, buckets)
const { Client } = require('pg');

// Parse DIRECT_URL from env (loaded from .env automatically by Node 20+)
const DIRECT_URL = process.env.DIRECT_URL || '';
if (!DIRECT_URL) {
  console.error('❌ DIRECT_URL env var required');
  process.exit(1);
}
const m = DIRECT_URL.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (!m) {
  console.error('❌ Could not parse DIRECT_URL');
  process.exit(1);
}
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

  // Functions in public schema
  const funcs = await client.query(`
    SELECT p.proname, l.lanname
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    JOIN pg_language l ON p.prolang = l.oid
    WHERE n.nspname = 'public'
    ORDER BY p.proname;
  `);
  console.log(`Functions in public schema (${funcs.rows.length}):`);
  funcs.rows.forEach((r) => console.log(`  • ${r.proname} (${r.lanname})`));

  // Triggers
  const triggers = await client.query(`
    SELECT event_object_table, trigger_name, action_timing, event_manipulation
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name;
  `);
  console.log(`\nTriggers (${triggers.rows.length}):`);
  triggers.rows.forEach((r) =>
    console.log(`  • ${r.event_object_table}.${r.trigger_name} — ${r.action_timing} ${r.event_manipulation}`),
  );

  // RLS policies count per table
  const policies = await client.query(`
    SELECT schemaname, tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, cmd, policyname;
  `);
  console.log(`\nRLS policies (${policies.rows.length}):`);
  const byTable = {};
  policies.rows.forEach((p) => {
    byTable[p.tablename] = byTable[p.tablename] || [];
    byTable[p.tablename].push(`${p.cmd}:${p.policyname}`);
  });
  Object.keys(byTable)
    .sort()
    .forEach((t) => {
      console.log(`  ${t} (${byTable[t].length}):`);
      byTable[t].forEach((p) => console.log(`      - ${p}`));
    });

  // Storage buckets
  const buckets = await client.query(`
    SELECT id, name, public, allowed_mime_types, file_size_limit
    FROM storage.buckets
    ORDER BY name;
  `);
  console.log(`\nStorage buckets (${buckets.rows.length}):`);
  buckets.rows.forEach((r) => {
    console.log(
      `  • ${r.name} — public=${r.public} size_limit=${r.file_size_limit || 'default'} mimes=${(r.allowed_mime_types || []).length || 'all'}`,
    );
  });

  // Storage policies
  const storagePolicies = await client.query(`
    SELECT schemaname, tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'storage'
    ORDER BY tablename, policyname;
  `);
  console.log(`\nStorage policies (${storagePolicies.rows.length}):`);
  storagePolicies.rows.forEach((r) => console.log(`  • ${r.tablename}.${r.policyname} [${r.cmd}]`));

  await client.end();
  console.log('\n✅ Verification complete.');
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
