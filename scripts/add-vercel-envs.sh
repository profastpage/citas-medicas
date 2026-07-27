#!/bin/bash
# ============================================================
# CitasPro — Configure all environment variables on Vercel
# ============================================================
# Adds the missing Supabase anon + service_role keys to all
# Vercel environments (Production, Preview, Development).
# ============================================================

set -e

# ============================================================
# CONFIGURATION — provide via env vars or hardcode for local use.
# WARNING: Do NOT commit real secrets. Use env vars instead.
# ============================================================
VERCEL_TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN env var}"
cd /home/z/my-project

ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:?Set NEXT_PUBLIC_SUPABASE_ANON_KEY env var}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY env var}"
DATABASE_URL_VAL="${DATABASE_URL:?Set DATABASE_URL env var}"
DIRECT_URL_VAL="${DIRECT_URL:?Set DIRECT_URL env var}"
SUPABASE_URL_VAL="${NEXT_PUBLIC_SUPABASE_URL:?Set NEXT_PUBLIC_SUPABASE_URL env var}"
APP_URL_VAL="${NEXT_PUBLIC_APP_URL:-https://citas-medicas-red.vercel.app}"

# Helper: add env var to all 3 environments (after removing existing)
add_env() {
  local name="$1"
  local value="$2"
  local targets=("production" "preview" "development")
  echo ""
  echo "▶ ${name}"

  # Remove existing (ignore errors if not found)
  for t in "${targets[@]}"; do
    vercel env rm "$name" "$t" --yes --token "$VERCEL_TOKEN" 2>/dev/null || true
  done

  # Add fresh
  for t in "${targets[@]}"; do
    printf "%s" "$value" | vercel env add "$name" "$t" --token "$VERCEL_TOKEN" 2>&1 | grep -E "(✓|Added|Success|Encrypted)" | head -1
  done
  echo "  ✓ ${name} added to production + preview + development"
}

echo "=== Configuring Vercel env vars for citas-medicas ==="
add_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL_VAL"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$ANON_KEY"
add_env "SUPABASE_SERVICE_ROLE_KEY" "$SERVICE_KEY"
add_env "DATABASE_URL" "$DATABASE_URL_VAL"
add_env "DIRECT_URL" "$DIRECT_URL_VAL"
add_env "NEXT_PUBLIC_APP_URL" "$APP_URL_VAL"
add_env "JWT_SECRET" "citaspro-prod-jwt-secret-$(date +%s)"

echo ""
echo "=== Final env var list on Vercel ==="
vercel env ls --token "$VERCEL_TOKEN" 2>&1 | tail -40
