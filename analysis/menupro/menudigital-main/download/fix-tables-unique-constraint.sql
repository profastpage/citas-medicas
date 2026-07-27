-- ============================================================
-- MenuPro — FIX: restricción UNIQUE de tables multi-sucursal
-- ============================================================
-- PROBLEMA:
--   El esquema actual tiene UNIQUE(owner_id, number) en la tabla `tables`.
--   Eso impide que dos sucursales del mismo owner tengan su propia "Mesa 1".
--   Para cuentas con plan FULL (multi-sucursal, como la demo), esto revienta
--   el seed: ERROR 23505 duplicate key (owner_id, number)=(..., 1).
--
-- SOLUCIÓN:
--   Reemplazar la restricción por UNIQUE(owner_id, branch_id, number).
--   Así cada sucursal tiene su propia numeración 1, 2, 3... independientemente.
--
-- IDEMPOTENTE: puede ejecutarse cuantas veces quieras.
-- ============================================================

-- 1. Eliminar la restricción vieja (si existe)
ALTER TABLE tables DROP CONSTRAINT IF EXISTS tables_owner_id_number_key;

-- 2. Crear la nueva restricción (owner + branch + number)
--    Si branch_id es NULL (mesa sin sucursal), se permite duplicar number
--    porque NULL no se considera igual en UNIQUE de Postgres.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tables_owner_branch_number_key'
      AND conrelid = 'tables'::regclass
  ) THEN
    ALTER TABLE tables
      ADD CONSTRAINT tables_owner_branch_number_key
      UNIQUE (owner_id, branch_id, number);
    RAISE NOTICE '✅ Nueva restricción UNIQUE(owner_id, branch_id, number) creada';
  ELSE
    RAISE NOTICE 'ℹ️  Restricción tables_owner_branch_number_key ya existe';
  END IF;
END $$;

-- 3. Verificación final
DO $$
DECLARE
  v_old_exists BOOLEAN;
  v_new_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tables_owner_id_number_key'
      AND conrelid = 'tables'::regclass
  ) INTO v_old_exists;

  SELECT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tables_owner_branch_number_key'
      AND conrelid = 'tables'::regclass
  ) INTO v_new_exists;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE 'Estado final:';
  RAISE NOTICE '  tables_owner_id_number_key (vieja, incorrecta): %', v_old_exists;
  RAISE NOTICE '  tables_owner_branch_number_key (nueva, correcta): %', v_new_exists;
  IF NOT v_old_exists AND v_new_exists THEN
    RAISE NOTICE '✅ Fix aplicado correctamente. Ahora puedes re-ejecutar seed-demo-mozos-org.sql';
  ELSE
    RAISE NOTICE '⚠️  Algo no salió como esperábamos — revisa permisos';
  END IF;
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
