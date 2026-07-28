-- ============================================================
-- MenuPro — FIX: restricción UNIQUE de inventory_items multi-sucursal
-- ============================================================
-- PROBLEMA:
--   El esquema tiene UNIQUE(owner_id, name) en inventory_items.
--   Para cuentas multi-sucursal (plan FULL, como la demo), esto impide
--   que dos sucursales tengan el mismo insumo (ej: "Aceite vegetal"):
--   ERROR 23505 duplicate key (owner_id, name)=(..., 'Aceite vegetal')
--
-- SOLUCIÓN:
--   Reemplazar por UNIQUE(owner_id, branch_id, name).
--   Cada sucursal gestiona su propio inventario independientemente.
--   Si branch_id es NULL, Postgres permite duplicados.
--
-- IDEMPOTENTE.
-- ============================================================

ALTER TABLE inventory_items DROP CONSTRAINT IF EXISTS inventory_items_owner_id_name_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'inventory_items_owner_branch_name_key'
      AND conrelid = 'inventory_items'::regclass
  ) THEN
    ALTER TABLE inventory_items
      ADD CONSTRAINT inventory_items_owner_branch_name_key
      UNIQUE (owner_id, branch_id, name);
    RAISE NOTICE '✅ Nueva restricción UNIQUE(owner_id, branch_id, name) creada';
  ELSE
    RAISE NOTICE 'ℹ️  Restricción inventory_items_owner_branch_name_key ya existe';
  END IF;
END $$;

-- Verificación
DO $$
DECLARE
  v_old BOOLEAN;
  v_new BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'inventory_items_owner_id_name_key'
      AND conrelid = 'inventory_items'::regclass
  ) INTO v_old;
  SELECT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'inventory_items_owner_branch_name_key'
      AND conrelid = 'inventory_items'::regclass
  ) INTO v_new;
  RAISE NOTICE 'inventory_items_owner_id_name_key (vieja): %', v_old;
  RAISE NOTICE 'inventory_items_owner_branch_name_key (nueva): %', v_new;
END $$;
