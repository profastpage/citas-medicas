#!/usr/bin/env bash
#
# scripts/supabase-migrate.sh
#
# Flujo recomendado de migraciones con Supabase CLI para MenuPro.
# Project ref: bkxtploibraiovgrjtwn
#
# Requisitos:
#   - supabase CLI instalada: https://supabase.com/docs/guides/cli
#   - Supabase access token: https://supabase.com/dashboard/account/tokens
#   - Setear variable SUPABASE_ACCESS_TOKEN antes de ejecutar
#
# Uso:
#   SUPABASE_ACCESS_TOKEN=sbp_xxx ./scripts/supabase-migrate.sh
#
# Esto ejecuta:
#   1. supabase link --project-ref bkxtploibraiovgrjtwn
#   2. supabase db push (aplica todas las migraciones nuevas en supabase/migrations/)
#
# Para crear una nueva migración:
#   supabase migration new nombre_descriptivo
#   (crea un archivo supabase/migrations/<timestamp>_nombre_descriptivo.sql)
#

set -e

PROJECT_REF="bkxtploibraiovgrjtwn"

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ Falta SUPABASE_ACCESS_TOKEN"
  echo "   Obtén uno en: https://supabase.com/dashboard/account/tokens"
  echo "   Uso: SUPABASE_ACCESS_TOKEN=sbp_xxx ./scripts/supabase-migrate.sh"
  exit 1
fi

cd "$(dirname "$0")/.."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MenuPro — Supabase Migration Workflow"
echo "  Project ref: $PROJECT_REF"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Login + link
echo ""
echo "🔗 Linkeando proyecto…"
export SUPABASE_ACCESS_TOKEN
npx supabase link --project-ref "$PROJECT_REF"

# Step 2: Push migrations
echo ""
echo "🚀 Aplicando migraciones…"
npx supabase db push

echo ""
echo "✅ ¡Migraciones aplicadas!"
echo ""
echo "Verifica en: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
echo ""
echo "Tablas esperadas:"
echo "  - profiles (con columnas bg_removals_used, bg_removals_reset_at)"
echo "  - menus"
echo "  - categories"
echo "  - dishes"
echo "  - menu_views"
echo ""
echo "Funciones RPC:"
echo "  - increment_menu_views(menu_uuid)"
echo "  - increment_bg_removals(user_uuid)"
echo "  - get_bg_removals_quota(user_uuid, monthly_limit)"
echo ""
echo "Storage bucket:"
echo "  - menus (public)"
