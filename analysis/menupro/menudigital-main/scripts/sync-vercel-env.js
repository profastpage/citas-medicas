#!/usr/bin/env node
/**
 * scripts/sync-vercel-env.js
 *
 * Sincroniza las variables de entorno de Supabase → Vercel con un solo comando.
 *
 * Uso:
 *   node scripts/sync-vercel-env.js
 *
 * Variables requeridas (en .env.local o exportadas en shell):
 *   - SUPABASE_PROJECT_REF     Ej: bkxtploibraiovgrjtwn
 *   - SUPABASE_ACCESS_TOKEN    Personal Access Token de Supabase (Dashboard → Account → Access Tokens)
 *   - VERCEL_TOKEN             Token de Vercel (https://vercel.com/account/tokens)
 *   - VERCEL_PROJECT_ID        ID del proyecto en Vercel (Dashboard → Project → Settings → General → Project ID)
 *
 * Opcionales:
 *   - SUPABASE_SERVICE_ROLE_KEY  Si ya lo tienes, se usa directo. Si no, se obtiene del API de Supabase.
 *   - MERCADOPAGO_ACCESS_TOKEN   Si está seteado, se sincroniza también.
 *   - MERCADOPAGO_CURRENCY_ID    Default: PEN
 *   - NEXT_PUBLIC_SITE_URL       Default: https://<vercel-project>.vercel.app
 *
 * El script:
 *   1. Lee SUPABASE_PROJECT_REF y SUPABASE_ACCESS_TOKEN
 *   2. Llama a https://api.supabase.com/v1/projects/{ref}/api-keys
 *      → obtiene anon key + service_role key
 *   3. Llama a https://api.supabase.com/v1/projects/{ref}/url
 *      → obtiene la URL del proyecto (https://{ref}.supabase.co)
 *   4. Construye el set completo de env vars para MenuPro
 *   5. Llama a la API de Vercel:
 *      POST https://api.vercel.com/v9/projects/{projectId}/env (una por var)
 *      → crea cada variable en production, preview y development
 *   6. Si la variable ya existe, la elimina y la vuelve a crear (idempotente)
 *
 * Documentación:
 *   - Supabase Management API: https://supabase.com/docs/reference/api/introduction
 *   - Vercel API: https://vercel.com/docs/rest-api#endpoints/projects/create-project-env
 */

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function loadEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Quitar comillas
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

// Cargar .env.local y .env en orden
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(process.cwd(), '.env'));

const REQUIRED = [
  'SUPABASE_PROJECT_REF',
  'SUPABASE_ACCESS_TOKEN',
  'VERCEL_TOKEN',
  'VERCEL_PROJECT_ID',
];

function checkRequired() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error('\n❌ Faltan variables requeridas:');
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error('\nCrea un archivo .env.local con:');
    console.error('   SUPABASE_PROJECT_REF=bkxtploibraiovgrjtwn');
    console.error('   SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxx');
    console.error('   VERCEL_TOKEN=vercel_xxxxxxxxxxxx');
    console.error('   VERCEL_PROJECT_ID=prj_xxxxxxxxxxxx');
    console.error('\nOptional pero recomendado:');
    console.error('   MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx');
    console.error('   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com');
    process.exit(1);
  }
}

async function supabaseApi(endpoint, method = 'GET') {
  const res = await fetch(`https://api.supabase.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase API ${endpoint} ${res.status}: ${text}`);
  }
  return res.json();
}

async function vercelApi(endpoint, method = 'GET', body) {
  const res = await fetch(`https://api.vercel.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, json };
}

// ────────────────────────────────────────────────────────────────
// Step 1: Obtener credenciales de Supabase via Management API
// ────────────────────────────────────────────────────────────────

async function fetchSupabaseCredentials() {
  const projectRef = process.env.SUPABASE_PROJECT_REF;
  console.log(`\n📡 Consultando Supabase project: ${projectRef}`);

  // Obtener URL del proyecto
  const project = await supabaseApi(`/v1/projects/${projectRef}`);
  const supabaseUrl = `https://${projectRef}.supabase.co`;
  console.log(`   ✓ URL: ${supabaseUrl}`);

  // Obtener API keys (anon + service_role)
  const keys = await supabaseApi(`/v1/projects/${projectRef}/api-keys`);
  const anonKey = keys.find((k) => k.name === 'anon')?.api_key;
  const serviceRoleKey = keys.find((k) => k.name === 'service_role')?.api_key;

  if (!anonKey || !serviceRoleKey) {
    throw new Error('No se pudieron obtener las API keys de Supabase');
  }
  console.log(`   ✓ anon key: ${anonKey.slice(0, 16)}…`);
  console.log(`   ✓ service_role key: ${serviceRoleKey.slice(0, 16)}…`);

  return { supabaseUrl, anonKey, serviceRoleKey };
}

// ────────────────────────────────────────────────────────────────
// Step 2: Construir el set completo de env vars
// ────────────────────────────────────────────────────────────────

function buildEnvVars(supabase) {
  const vars = [
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      value: supabase.supabaseUrl,
      type: 'encrypted',
      targets: ['production', 'preview', 'development'],
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      value: supabase.anonKey,
      type: 'encrypted',
      targets: ['production', 'preview', 'development'],
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      value: supabase.serviceRoleKey,
      type: 'encrypted',
      targets: ['production', 'preview', 'development'],
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      value: process.env.NEXT_PUBLIC_SITE_URL || 'https://menupro.vercel.app',
      type: 'encrypted',
      targets: ['production', 'preview', 'development'],
    },
  ];

  // MercadoPago (opcional)
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    vars.push({
      key: 'MERCADOPAGO_ACCESS_TOKEN',
      value: process.env.MERCADOPAGO_ACCESS_TOKEN,
      type: 'encrypted',
      targets: ['production', 'preview', 'development'],
    });
  }
  vars.push({
    key: 'MERCADOPAGO_CURRENCY_ID',
    value: process.env.MERCADOPAGO_CURRENCY_ID || 'PEN',
    type: 'encrypted',
    targets: ['production', 'preview', 'development'],
  });
  vars.push({
    key: 'MERCADOPAGO_SANDBOX',
    value: process.env.MERCADOPAGO_SANDBOX || 'false',
    type: 'encrypted',
    targets: ['production', 'preview', 'development'],
  });

  return vars;
}

// ────────────────────────────────────────────────────────────────
// Step 3: Sincronizar a Vercel
// ────────────────────────────────────────────────────────────────

async function syncToVercel(envVars) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  console.log(`\n🚀 Sincronizando a Vercel project: ${projectId}`);

  // 1. Listar variables existentes
  const listRes = await vercelApi(`/v9/projects/${projectId}/env`);
  if (listRes.status !== 200) {
    throw new Error(`Vercel API list env ${listRes.status}: ${JSON.stringify(listRes.json)}`);
  }
  const existing = listRes.json.envs || [];
  console.log(`   ℹ Encontradas ${existing.length} variables existentes`);

  let created = 0, updated = 0, skipped = 0;

  for (const envVar of envVars) {
    // Buscar si ya existe (mismo key, en cualquiera de los targets)
    const existingVar = existing.find((e) => e.key === envVar.key);
    const existingIds = existingVar ? [existingVar.id] : [];

    // Eliminar las existentes primero (idempotente)
    if (existingVar) {
      const delRes = await vercelApi(
        `/v9/projects/${projectId}/env/${existingVar.id}`,
        'DELETE'
      );
      if (delRes.status === 200) {
        console.log(`   🗑 Eliminada "${envVar.key}" (será recreada)`);
      } else {
        console.log(`   ⚠ No se pudo eliminar "${envVar.key}" (${delRes.status})`);
      }
    }

    // Crear nueva variable (un registro por target para que funcione en
    // production + preview + development)
    const createRes = await vercelApi(
      `/v9/projects/${projectId}/env`,
      'POST',
      envVar
    );

    if (createRes.status === 200 || createRes.status === 201) {
      if (existingVar) {
        updated++;
        console.log(`   ✏ Actualizada "${envVar.key}"`);
      } else {
        created++;
        console.log(`   ✓ Creada "${envVar.key}"`);
      }
    } else {
      console.log(
        `   ✗ Error creando "${envVar.key}": ${JSON.stringify(createRes.json)}`
      );
      skipped++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ${created} creadas, ${updated} actualizadas, ${skipped} saltadas`);
}

// ────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  MenuPro — Sync Supabase → Vercel env vars');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  checkRequired();

  const supabase = await fetchSupabaseCredentials();
  const envVars = buildEnvVars(supabase);

  console.log(`\n📦 Variables a sincronizar (${envVars.length}):`);
  envVars.forEach((v) => {
    const masked = v.value.length > 30
      ? v.value.slice(0, 12) + '…' + v.value.slice(-6)
      : v.value;
    console.log(`   • ${v.key} = ${masked}`);
  });

  await syncToVercel(envVars);

  console.log('\n✅ ¡Sincronización completa!');
  console.log('\nPróximos pasos:');
  console.log('  1. Ve a tu proyecto en Vercel → Settings → Environment Variables');
  console.log('  2. Verifica que todas estén presentes');
  console.log('  3. Trigger un redeploy: Vercel → Deployments → Redeploy');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
