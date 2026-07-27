// ============================================================
// apply-schema.ts
// ============================================================
// Aplica supabase/schema.sql y supabase/rls-policies.sql al
// proyecto Supabase remoto usando el connection string del
// pooler (Transaction mode, puerto 6543).
//
// Uso:
//   DATABASE_URL="postgresql://postgres.REF:PASS@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" \
//     bun run scripts/apply-schema.ts
// ============================================================

import { Client } from 'pg';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no está definida');
  process.exit(1);
}

const SCHEMA_PATH = join(process.cwd(), 'supabase/schema.sql');
const RLS_PATH = join(process.cwd(), 'supabase/rls-policies.sql');

async function runFile(client: Client, label: string, filePath: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Aplicando ${label}...`);
  console.log(`  Archivo: ${filePath}`);
  console.log('='.repeat(60));

  const sql = readFileSync(filePath, 'utf8');
  console.log(`  Tamaño: ${(sql.length / 1024).toFixed(1)} KB`);

  try {
    await client.query(sql);
    console.log(`✓ ${label} aplicado correctamente`);
  } catch (err: unknown) {
    const e = err as Error & { code?: string; position?: string };
    console.error(`✗ Error aplicando ${label}:`);
    console.error(`  Mensaje: ${e.message}`);
    if (e.code) console.error(`  Código PostgreSQL: ${e.code}`);
    if ('position' in e) console.error(`  Posición: ${e.position}`);
    throw err;
  }
}

async function verifyTables(client: Client) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Verificando tablas creadas...');
  console.log('='.repeat(60));

  const { rows } = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);

  console.log(`\nTablas en schema public (${rows.length} total):`);
  for (const row of rows) {
    console.log(`  - ${row.tablename}`);
  }

  const expected = [
    'User', 'Clinic', 'ClinicMember', 'Specialty', 'Service', 'Doctor',
    'DoctorSchedule', 'Patient', 'Appointment', 'Interconsult', 'Payment',
    'CashSession', 'CashExpense', 'Medication', 'PatientFile', 'AuditLog',
  ];

  const missing = expected.filter(t => !rows.some(r => r.tablename === t));
  if (missing.length === 0) {
    console.log('\n✓ Todas las 16 tablas esperadas están presentes');
  } else {
    console.log(`\n✗ Faltan tablas: ${missing.join(', ')}`);
  }

  // Verificar RLS habilitado
  console.log('\nVerificando RLS habilitado...');
  const { rows: rlsRows } = await client.query(`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('User','Clinic','Patient','Appointment','Payment','Medication')
    ORDER BY tablename;
  `);
  for (const row of rlsRows) {
    const status = row.rowsecurity ? '✓' : '✗';
    console.log(`  ${status} ${row.tablename}: RLS ${row.rowsecurity ? 'ON' : 'OFF'}`);
  }

  // Verificar buckets Storage
  console.log('\nVerificando buckets Storage...');
  const { rows: bucketRows } = await client.query(`
    SELECT id, name, public
    FROM storage.buckets
    ORDER BY id;
  `);
  for (const row of bucketRows) {
    console.log(`  - ${row.id} (public=${row.public})`);
  }
}

async function main() {
  console.log(`Conectando a: ${DATABASE_URL!.replace(/:[^:@]+@/, ':****@')}`);

  const client = new Client({
    connectionString: DATABASE_URL,
    // El pooler de Supabase requiere esto para conexiones directas
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✓ Conexión establecida');

    await runFile(client, 'schema.sql', SCHEMA_PATH);
    await runFile(client, 'rls-policies.sql', RLS_PATH);

    await verifyTables(client);

    console.log(`\n${'='.repeat(60)}`);
    console.log('✓ MIGRACIÓN COMPLETA');
    console.log('='.repeat(60));
  } catch (err) {
    console.error('\n✗ FALLÓ LA MIGRACIÓN');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
