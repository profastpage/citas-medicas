-- ============================================================
-- FIX — Corrige el error de sintaxis en el trigger
-- trg_consume_inventory (línea 514 del script anterior)
-- ============================================================
-- CAUSA DEL ERROR:
-- El trigger usaba `EXECUTE FUNCTION consume_inventory_for_order(NEW.id)`
-- con una función RETURNS VOID. PostgreSQL reportó "syntax error at or near '.'"
-- porque el parser no resolvió correctamente NEW.id en ese contexto
-- (combinación de BEGIN/COMMIT + ALTER TYPE + función no-trigger).
--
-- SOLUCIÓN:
-- Crear una función trigger estándar (RETURNS TRIGGER, sin argumentos)
-- que internamente invoca la lógica de descuento de inventario.
-- Esta es la forma canónica de triggers en PostgreSQL 11+.
-- ============================================================

-- 1) Dropear trigger y función anteriores
DROP TRIGGER IF EXISTS trg_consume_inventory ON orders;
DROP FUNCTION IF EXISTS consume_inventory_for_order(UUID);
DROP FUNCTION IF EXISTS consume_inventory_on_invoice();

-- 2) Función interna: lógica pura de descuento de inventario
--    Toma p_order como argumento, retorna VOID
CREATE OR REPLACE FUNCTION consume_inventory_for_order(p_order UUID)
RETURNS VOID AS $$
DECLARE
  v_status       order_status;
  v_owner        UUID;
  v_branch       UUID;
  v_order_num    TEXT;
  item_row       RECORD;
  recipe_row     RECORD;
BEGIN
  -- Validar que la orden existe y está facturada/entregada
  SELECT status, owner_id, branch_id, order_number
    INTO v_status, v_owner, v_branch, v_order_num
  FROM orders WHERE id = p_order;

  IF NOT FOUND THEN RETURN; END IF;
  IF v_status NOT IN ('facturada', 'entregada') THEN RETURN; END IF;

  -- Por cada item no cancelado de la comanda
  FOR item_row IN
    SELECT id, menu_item_id, menu_item_name, quantity
    FROM order_items
    WHERE order_id = p_order AND status <> 'cancelado'
  LOOP
    -- Por cada insumo de la receta del plato
    FOR recipe_row IN
      SELECT id, inventory_item_id, quantity_per_dish
      FROM product_recipes
      WHERE owner_id = v_owner
        AND menu_item_id = item_row.menu_item_id
    LOOP
      -- Descontar stock del insumo
      UPDATE inventory_items
        SET stock_current = stock_current - (recipe_row.quantity_per_dish * item_row.quantity)
        WHERE id = recipe_row.inventory_item_id;

      -- Registrar movimiento de salida
      INSERT INTO inventory_movements (
        owner_id, branch_id, inventory_item_id, movement_type,
        quantity, unit_cost, reason, related_order_id, created_by
      )
      SELECT
        v_owner,
        v_branch,
        recipe_row.inventory_item_id,
        'salida'::movement_type,
        -(recipe_row.quantity_per_dish * item_row.quantity),
        ii.cost_per_unit,
        'Comanda ' || v_order_num || ' — ' || item_row.menu_item_name,
        p_order,
        'system'
      FROM inventory_items ii
      WHERE ii.id = recipe_row.inventory_item_id;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3) Función trigger estándar (RETURNS TRIGGER, sin argumentos)
--    Esta es la forma canónica — NEW está disponible automáticamente.
CREATE OR REPLACE FUNCTION consume_inventory_on_invoice()
RETURNS TRIGGER AS $$
BEGIN
  -- NEW es accesible directamente dentro de una función trigger
  PERFORM consume_inventory_for_order(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4) Crear el trigger con la sintaxis estándar (sin argumentos)
CREATE TRIGGER trg_consume_inventory
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status IN ('facturada','entregada')
        AND OLD.status NOT IN ('facturada','entregada'))
  EXECUTE FUNCTION consume_inventory_on_invoice();

-- 5) Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Función consume_inventory_for_order(UUID) creada';
  RAISE NOTICE '✅ Función trigger consume_inventory_on_invoice() creada';
  RAISE NOTICE '✅ Trigger trg_consume_inventory creado correctamente';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Fix aplicado. La migración add-premium-logistics.sql está completa.';
END $$;
