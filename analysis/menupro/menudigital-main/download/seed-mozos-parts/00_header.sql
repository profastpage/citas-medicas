-- ============================================================
-- MENU PRO — ORGANIZACIÓN DE MOZOS PARA CUENTA DEMO
-- ============================================================
-- Puebla la organización completa de mozos para la cuenta demo:
--   demo@menudigital.pro (plan FULL)
--
-- Para cada uno de los 5 restaurantes:
--   ✓ 1 sucursal (branch) con dirección real
--   ✓ 8-12 mesas por sucursal distribuidas por zonas
--   ✓ 4-5 mozos con PIN, teléfono, DNI y qr_token
--   ✓ 8-14 insumos típicos del rubro
--   ✓ 5-17 recetas (plato → insumos)
--   ✓ 5-6 comandas de ejemplo en distintos estados
--   ✓ 2-4 ítems por comanda
--   ✓ Movimientos de inventario (entradas por compra)
--   ✓ Vouchers impresos para comandas facturadas
--
-- REQUIERE haber ejecutado previamente:
--   1. supabase/schema.sql
--   2. supabase/consolidated-migrations.sql
--   3. supabase/add-premium-logistics.sql
--   4. supabase/mozos-mesas-migration.sql
--   5. supabase/seed-demo-account.sql (crea el usuario demo + 5 menús)
--
-- IDEMPOTENTE: puede ejecutarse cuantas veces quieras.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PASO 0: Verificar que el usuario demo existe
-- ────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid) INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'Usuario demo no encontrado. Ejecuta primero seed-demo-account.sql. ID esperado: 2f2a30d8-bea6-5a5c-9787-040fe0ba1f15';
  ELSE
    RAISE NOTICE '✅ Usuario demo encontrado: 2f2a30d8-bea6-5a5c-9787-040fe0ba1f15';
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════
