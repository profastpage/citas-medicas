// ============================================================
// CitasPro — Apply schema.sql + rls-policies.sql to Supabase
// ============================================================
// Uses the direct Postgres connection (port 5432) for DDL ops.
// ============================================================

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// ============================================================
// CONFIG — read from env vars, fall back to process.env set by .env
// ============================================================
const DATABASE_URL = process.env.DATABASE_URL || '';
const DIRECT_URL = process.env.DIRECT_URL || '';

if (!DIRECT_URL) {
  console.error('❌ DIRECT_URL env var required (uses direct connection port 5432 for DDL)');
  process.exit(1);
}

// Parse DIRECT_URL: postgresql://postgres.REF:PASSWORD@HOST:5432/postgres
const m = DIRECT_URL.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (!m) {
  console.error('❌ Could not parse DIRECT_URL');
  process.exit(1);
}
const [, USER, PASSWORD, HOST, PORT_STR, DB] = m;
const PORT = parseInt(PORT_STR, 10);

const connectionConfig = {
  host: HOST,
  port: PORT,
  database: DB,
  user: USER,
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
  query_timeout: 120000,
};

async function runFile(client, label, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`\n────────────────────────────────────────────────────────`);
  console.log(`▶ Applying ${label}`);
  console.log(`  File: ${filePath}`);
  console.log(`  Size: ${sql.length} bytes`);
  console.log(`────────────────────────────────────────────────────────`);

  // Split by semicolon-aware statement boundaries, but be careful with functions.
  // Easiest robust approach: send entire file in one query — Postgres accepts multiple statements.
  try {
    await client.query(sql);
    console.log(`✅ ${label} applied successfully`);
  } catch (err) {
    console.error(`❌ ${label} failed:`, err.message);
    if (err.position) {
      const pos = parseInt(err.position, 10);
      const before = sql.substring(Math.max(0, pos - 200), pos);
      const after = sql.substring(pos, pos + 200);
      console.error(`\n— Context around error position ${pos} —`);
      console.error(`...${before}⟦HERE⟧${after}...`);
    }
    throw err;
  }
}

async function verifySchema(client) {
  console.log(`\n────────────────────────────────────────────────────────`);
  console.log(`▶ Verifying schema`);
  console.log(`────────────────────────────────────────────────────────`);
  const tables = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  console.log(`\nTables in public schema (${tables.rows.length}):`);
  tables.rows.forEach((r, i) => console.log(`  ${i + 1}. ${r.tablename}`));

  const rls = await client.query(`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  console.log(`\nRLS status per table:`);
  rls.rows.forEach((r) => {
    const mark = r.rowsecurity ? '✅' : '❌';
    console.log(`  ${mark} ${r.tablename}: ${r.rowsecurity ? 'enabled' : 'disabled'}`);
  });

  const funcs = await client.query(`
    SELECT proname
    FROM pg_proc
    WHERE schemaname = 'public'
    ORDER BY proname;
  `);
  console.log(`\nFunctions in public schema (${funcs.rows.length}):`);
  funcs.rows.forEach((r) => console.log(`  • ${r.proname}`));

  const triggers = await client.query(`
    SELECT event_object_table, trigger_name
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name;
  `);
  console.log(`\nTriggers (${triggers.rows.length}):`);
  triggers.rows.forEach((r) => console.log(`  • ${r.event_object_table}.${r.trigger_name}`));

  const buckets = await client.query(`
    SELECT id, name, public
    FROM storage.buckets
    ORDER BY name;
  `);
  console.log(`\nStorage buckets (${buckets.rows.length}):`);
  buckets.rows.forEach((r) => console.log(`  • ${r.name} (public=${r.public})`));
}

async function main() {
  console.log('CitasPro → Supabase migration starting...');
  console.log(`Host: ${connectionConfig.host}:${connectionConfig.port}`);
  console.log(`User: ${connectionConfig.user}`);

  const client = new Client(connectionConfig);
  await client.connect();
  console.log('✅ Connected to Supabase Postgres');

  try {
    await runFile(client, 'schema.sql', path.join(__dirname, '..', 'supabase', 'schema.sql'));
    await runFile(client, 'rls-policies.sql', path.join(__dirname, '..', 'supabase', 'rls-policies.sql'));
    await verifySchema(client);
    console.log('\n🎉 ALL DONE — schema + RLS applied & verified.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\n💥 FATAL:', err.message);
  process.exit(1);
});
