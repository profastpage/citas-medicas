#!/usr/bin/env bash
# ============================================================
# set-vercel-env.sh — Configura todas las variables de entorno
# en Vercel para el proyecto citas-medicas.
# ============================================================
# Uso:
#   VERCEL_TOKEN="vcp_xxx" ./scripts/set-vercel-env.sh
# ============================================================
# Las variables se configuran para los 3 entornos: production,
# preview, development.
# ============================================================

set -e

TOKEN="${VERCEL_TOKEN:?Falta VERCEL_TOKEN}"
PROJ="citas-medicas"

# Función helper: setea var en los 3 entornos
set_env() {
  local name="$1"
  local value="$2"
  local envs=("production" "preview" "development")

  echo "→ Configurando $name..."
  for env in "${envs[@]}"; do
    # Borrar si ya existe (ignorar error si no existe)
    echo "y" | vercel env rm "$name" "$env" --token "$TOKEN" 2>/dev/null || true
    # Crear nueva
    echo "$value" | vercel env add "$name" "$env" --token "$TOKEN" 2>/dev/null
  done
}

# ============================================================
# Variables con valores conocidos
# ============================================================

# Supabase URL (la sacamos del project ref)
SUPABASE_URL="https://apqdlenrggqvvrkgwibl.supabase.co"
set_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"

# Database URLs (Pooler + Direct)
DB_PASSWORD="Wafla0523129500"
DB_USER="postgres.apqdlenrggqvvrkgwibl"
DB_HOST="aws-0-sa-east-1.pooler.supabase.com"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/postgres"

set_env "DATABASE_URL" "$DATABASE_URL"
set_env "DIRECT_URL" "$DIRECT_URL"

# App URL (Vercel)
set_env "NEXT_PUBLIC_APP_URL" "https://citas-medicas-red.vercel.app"

# JWT secret (legacy pero referenciado en código)
JWT_SECRET="$(openssl rand -hex 32)"
set_env "JWT_SECRET" "$JWT_SECRET"

echo ""
echo "============================================================"
echo "✓ Variables configuradas (sin API keys Supabase)"
echo "============================================================"
echo ""
echo "PENDIENTE — necesitas configurar manualmente estas 2 vars:"
echo ""
echo "1. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   Origen: Supabase Dashboard → Settings → API → Project API keys → 'anon public'"
echo ""
echo "2. SUPABASE_SERVICE_ROLE_KEY"  
echo "   Origen: Supabase Dashboard → Settings → API → Project API keys → 'service_role'"
echo "   (¡Trátala como contraseña! No exponer al cliente)"
echo ""
echo "Comandos para configurarlas:"
echo ""
echo '  echo "PONER_ANON_KEY_AQUI" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token "vcp_..."'
echo '  echo "PONER_ANON_KEY_AQUI" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --token "vcp_..."'
echo '  echo "PONER_ANON_KEY_AQUI" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --token "vcp_..."'
echo ""
echo '  echo "PONER_SERVICE_ROLE_KEY_AQUI" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --token "vcp_..."'
echo '  echo "PONER_SERVICE_ROLE_KEY_AQUI" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview --token "vcp_..."'
echo '  echo "PONER_SERVICE_ROLE_KEY_AQUI" | vercel env add SUPABASE_SERVICE_ROLE_KEY development --token "vcp_..."'
echo ""
echo "Después: vercel --prod --token \"vcp_...\""
