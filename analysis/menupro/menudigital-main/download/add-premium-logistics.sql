-- ============================================================
-- MenuPro — Plan Premium + Logística de Restaurante
-- ============================================================
-- Este script es IDEMPOTENTE: se puede ejecutar múltiples veces.
-- Crea:
--   1. Nuevos valores de enum en user_plan: 'premium', 'full'
--   2. Tabla branches (sucursales) — para plan Full
--   3. Tabla tables (mesas) con estados
--   4. Tabla waiters (mozos) — vinculados a auth.users
--   5. Tabla orders (comandas) con status flow
--   6. Tabla order_items (detalles de comanda)
--   7. Tabla order_status_history (auditoría)
--   8. Tabla inventory_items (insumos)
--   9. Tabla product_recipes (receta: plato → insumos)
--  10. Tabla inventory_movements (movimientos de stock)
--  11. Tabla voucher_prints (registro de vouchers impresos)
--  12. RLS para todas las tablas
--  13. Índices para performance
--  14. Triggers para updated_at
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Extender enum user_plan
-- ============================================================
DO $$
BEGIN
  -- Añadir 'premium' si no existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'premium'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan')
  ) THEN
    ALTER TYPE user_plan ADD VALUE 'premium';
  END IF;

  -- Añadir 'full' si no existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'full'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan')
  ) THEN
    ALTER TYPE user_plan ADD VALUE 'full';
  END IF;
END
$$;

-- ============================================================
-- 2. Tabla branches (sucursales) — plan Full
-- ============================================================
CREATE TABLE IF NOT EXISTS branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  address         TEXT,
  phone           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_branches_owner ON branches(owner_id);

-- ============================================================
-- 3. Tabla tables (mesas)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE table_status AS ENUM ('libre', 'ocupada', 'reservada', 'inactiva');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS tables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  number          INT NOT NULL,
  name            TEXT, -- "Mesa 1", "Terraza 3", etc. (opcional)
  capacity        INT NOT NULL DEFAULT 4,
  status          table_status NOT NULL DEFAULT 'libre',
  qr_token        TEXT UNIQUE, -- token para QR específico de mesa
  location        TEXT, -- "Salón principal", "Terraza", "2do piso"
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, number)
);

CREATE INDEX IF NOT EXISTS idx_tables_owner ON tables(owner_id);
CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(owner_id, status);

-- ============================================================
-- 4. Tabla waiters (mozos)
-- ============================================================
CREATE TABLE IF NOT EXISTS waiters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- si el mozo tiene login
  full_name       TEXT NOT NULL,
  document_id     TEXT, -- DNI
  phone           TEXT,
  pin             TEXT, -- PIN numérico para login rápido en POS
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waiters_owner ON waiters(owner_id);

-- ============================================================
-- 5. Tabla orders (comandas)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'borrador',         -- el mozo está armando la comanda
    'enviada',          -- enviada a cocina
    'en_preparacion',   -- cocina está preparando
    'lista',            -- lista para servir
    'entregada',        -- entregada al cliente
    'facturada',        -- cuenta entregada / cobrada
    'cancelada'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_type AS ENUM ('mesa', 'para_llevar', 'delivery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  table_id        UUID REFERENCES tables(id) ON DELETE SET NULL,
  waiter_id       UUID REFERENCES waiters(id) ON DELETE SET NULL,
  order_number    TEXT NOT NULL, -- "#001", "#002" — incremental por owner
  status          order_status NOT NULL DEFAULT 'borrador',
  order_type      order_type NOT NULL DEFAULT 'mesa',
  customer_name   TEXT,
  customer_phone  TEXT,
  party_size      INT,
  notes           TEXT, -- notas generales del pedido
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax             NUMERIC(10,2) NOT NULL DEFAULT 0,
  tip             NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'S/',
  sent_at         TIMESTAMPTZ,
  ready_at        TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  invoiced_at     TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_owner ON orders(owner_id);
CREATE INDEX IF NOT EXISTS idx_orders_owner_status ON orders(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_waiter ON orders(waiter_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(owner_id, created_at DESC);

-- ============================================================
-- 6. Tabla order_items (detalles de comanda)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE order_item_status AS ENUM (
    'pendiente',
    'en_preparacion',
    'listo',
    'entregado',
    'cancelado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    TEXT, -- referencia al dish_id del menú (string, no FK)
  menu_item_name  TEXT NOT NULL,
  menu_item_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes           TEXT, -- "sin cebolla", "extra picante"
  status          order_item_status NOT NULL DEFAULT 'pendiente',
  prepared_by     UUID REFERENCES waiters(id) ON DELETE SET NULL, -- quién lo preparó
  prepared_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);

-- ============================================================
-- 7. Tabla order_status_history (auditoría)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status     order_status,
  to_status       order_status NOT NULL,
  changed_by      TEXT, -- waiter_id, system, owner
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_osh_order ON order_status_history(order_id, created_at);

-- ============================================================
-- 8. Tabla inventory_items (insumos)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE inventory_unit AS ENUM (
    'unidad', 'kg', 'g', 'litro', 'ml', 'caja', 'paquete', 'docena', 'lata'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  sku             TEXT,
  unit            inventory_unit NOT NULL DEFAULT 'unidad',
  stock_current   NUMERIC(12,3) NOT NULL DEFAULT 0,
  stock_min       NUMERIC(12,3) NOT NULL DEFAULT 0, -- alerta si baja
  stock_max       NUMERIC(12,3) NOT NULL DEFAULT 0,
  cost_per_unit   NUMERIC(10,2) NOT NULL DEFAULT 0,
  supplier        TEXT,
  category        TEXT, -- "Lácteos", "Carnes", "Verduras"
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, name)
);

CREATE INDEX IF NOT EXISTS idx_inventory_owner ON inventory_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory_items(owner_id) WHERE stock_current <= stock_min;

-- ============================================================
-- 9. Tabla product_recipes (receta: plato → insumos)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_recipes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id        TEXT NOT NULL, -- dish_id del menú
  menu_item_name      TEXT NOT NULL,
  inventory_item_id   UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity_per_dish   NUMERIC(12,3) NOT NULL DEFAULT 1 CHECK (quantity_per_dish > 0),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, menu_item_id, inventory_item_id)
);

CREATE INDEX IF NOT EXISTS idx_recipes_owner ON product_recipes(owner_id);
CREATE INDEX IF NOT EXISTS idx_recipes_menu_item ON product_recipes(owner_id, menu_item_id);

-- ============================================================
-- 10. Tabla inventory_movements (movimientos de stock)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE movement_type AS ENUM (
    'entrada',          -- compra / reposición
    'salida',           -- uso en cocina (automático al facturar comanda)
    'ajuste',           -- ajuste manual (inventario físico)
    'merma',            -- pérdida / vencimiento
    'transferencia'     -- entre sucursales (plan Full)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS inventory_movements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id           UUID REFERENCES branches(id) ON DELETE SET NULL,
  inventory_item_id   UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  movement_type       movement_type NOT NULL,
  quantity            NUMERIC(12,3) NOT NULL, -- positivo para entrada, negativo para salida
  unit_cost           NUMERIC(10,2) NOT NULL DEFAULT 0,
  reason              TEXT, -- "Compra a Distribuidora X", "Comanda #045"
  related_order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_by          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movements_owner ON inventory_movements(owner_id);
CREATE INDEX IF NOT EXISTS idx_movements_item ON inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON inventory_movements(owner_id, created_at DESC);

-- ============================================================
-- 11. Tabla voucher_prints (registro de vouchers impresos)
-- ============================================================
CREATE TABLE IF NOT EXISTS voucher_prints (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  voucher_number  TEXT NOT NULL, -- "V-001"
  printed_by      TEXT,
  print_format    TEXT NOT NULL DEFAULT 'pos_80mm', -- pos_80mm | a4 | a5
  pdf_url         TEXT, -- si se guardó PDF en storage
  printed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voucher_owner ON voucher_prints(owner_id);
CREATE INDEX IF NOT EXISTS idx_voucher_order ON voucher_prints(order_id);

-- ============================================================
-- 12. Función updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'branches','tables','waiters','orders','order_items',
      'inventory_items','product_recipes'
    ])
  LOOP
    EXECUTE format($f$
      DROP TRIGGER IF EXISTS trg_%s_updated ON %I;
      CREATE TRIGGER trg_%s_updated
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    $f$, t, t, t, t);
  END LOOP;
END $$;

-- ============================================================
-- 13. RLS Policies
-- ============================================================

-- Helper: ya todas las tablas tienen owner_id → policy simple
-- Los Super Admins pueden ver todo (vía SECURITY DEFINER functions separadas)

-- branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "branches_owner_all" ON branches;
CREATE POLICY "branches_owner_all" ON branches
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- tables
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tables_owner_all" ON tables;
CREATE POLICY "tables_owner_all" ON tables
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- waiters
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waiters_owner_all" ON waiters;
CREATE POLICY "waiters_owner_all" ON waiters
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_owner_all" ON orders;
CREATE POLICY "orders_owner_all" ON orders
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- order_items (a través de order.owner_id)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_owner_all" ON order_items;
CREATE POLICY "order_items_owner_all" ON order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.owner_id = auth.uid())
  );

-- order_status_history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "osh_owner_all" ON order_status_history;
CREATE POLICY "osh_owner_all" ON order_status_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.owner_id = auth.uid())
  );

-- inventory_items
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inv_owner_all" ON inventory_items;
CREATE POLICY "inv_owner_all" ON inventory_items
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- product_recipes
ALTER TABLE product_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipes_owner_all" ON product_recipes;
CREATE POLICY "recipes_owner_all" ON product_recipes
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- inventory_movements
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mov_owner_all" ON inventory_movements;
CREATE POLICY "mov_owner_all" ON inventory_movements
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- voucher_prints
ALTER TABLE voucher_prints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "voucher_owner_all" ON voucher_prints;
CREATE POLICY "voucher_owner_all" ON voucher_prints
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- 14. Función para obtener siguiente número de comanda
-- ============================================================
CREATE OR REPLACE FUNCTION get_next_order_number(p_owner UUID)
RETURNS TEXT AS $$
DECLARE
  max_num INT;
  next_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(REPLACE(order_number, '#', '') AS INT)), 0)
  INTO max_num
  FROM orders
  WHERE owner_id = p_owner
    AND order_number ~ '^#[0-9]+$';

  next_num := max_num + 1;
  RETURN '#' || lpad(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 15. Función para obtener siguiente número de voucher
-- ============================================================
CREATE OR REPLACE FUNCTION get_next_voucher_number(p_owner UUID)
RETURNS TEXT AS $$
DECLARE
  max_num INT;
  next_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(REPLACE(voucher_number, 'V-', '') AS INT)), 0)
  INTO max_num
  FROM voucher_prints
  WHERE owner_id = p_owner
    AND voucher_number ~ '^V-[0-9]+$';

  next_num := max_num + 1;
  RETURN 'V-' || lpad(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 16. Función: descontar inventario al facturar comanda
-- ============================================================
CREATE OR REPLACE FUNCTION consume_inventory_for_order(p_order UUID)
RETURNS VOID AS $$
DECLARE
  item_row RECORD;
  recipe_row RECORD;
  current_stock NUMERIC;
BEGIN
  -- Solo proceder si la orden está siendo facturada o entregada
  SELECT status INTO item_row FROM orders WHERE id = p_order;
  IF item_row.status NOT IN ('facturada', 'entregada') THEN
    RETURN;
  END IF;

  -- Por cada item de la comanda
  FOR item_row IN
    SELECT id, menu_item_id, menu_item_name, quantity
    FROM order_items
    WHERE order_id = p_order AND status <> 'cancelado'
  LOOP
    -- Por cada insumo de la receta
    FOR recipe_row IN
      SELECT id, inventory_item_id, quantity_per_dish
      FROM product_recipes
      WHERE owner_id = (SELECT owner_id FROM orders WHERE id = p_order)
        AND menu_item_id = item_row.menu_item_id
    LOOP
      -- Descontar stock
      UPDATE inventory_items
      SET stock_current = stock_current - (recipe_row.quantity_per_dish * item_row.quantity)
      WHERE id = recipe_row.inventory_item_id;

      -- Registrar movimiento
      INSERT INTO inventory_movements (
        owner_id, branch_id, inventory_item_id, movement_type,
        quantity, unit_cost, reason, related_order_id, created_by
      )
      SELECT
        o.owner_id, o.branch_id, recipe_row.inventory_item_id, 'salida',
        -(recipe_row.quantity_per_dish * item_row.quantity),
        ii.cost_per_unit,
        'Comanda ' || o.order_number || ' — ' || item_row.menu_item_name,
        p_order, 'system'
      FROM orders o
      JOIN inventory_items ii ON ii.id = recipe_row.inventory_item_id
      WHERE o.id = p_order;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 17. Trigger: descontar inventario automáticamente
-- ============================================================
DROP TRIGGER IF EXISTS trg_consume_inventory ON orders;
CREATE TRIGGER trg_consume_inventory
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status IN ('facturada','entregada') AND OLD.status NOT IN ('facturada','entregada'))
  EXECUTE FUNCTION consume_inventory_for_order(NEW.id);

-- ============================================================
-- 18. Comentarios informativos
-- ============================================================
COMMENT ON TABLE branches IS 'Sucursales — solo plan Full';
COMMENT ON TABLE tables IS 'Mesas del restaurante — plan Premium+';
COMMENT ON TABLE waiters IS 'Mozos/asociados — plan Premium+';
COMMENT ON TABLE orders IS 'Comandas: mesa → mozo → cocina → entrega → factura — plan Premium+';
COMMENT ON TABLE order_items IS 'Items de cada comanda';
COMMENT ON TABLE order_status_history IS 'Auditoría de cambios de estado de comanda';
COMMENT ON TABLE inventory_items IS 'Insumos con stock — plan Premium+';
COMMENT ON TABLE product_recipes IS 'Receta: qué insumos consume cada plato del menú';
COMMENT ON TABLE inventory_movements IS 'Movimientos de stock (entradas/salidas/ajustes)';
COMMENT ON TABLE voucher_prints IS 'Registro de vouchers impresos — plan Full';
COMMENT ON FUNCTION get_next_order_number IS 'Obtiene #0001, #0002... para comandas';
COMMENT ON FUNCTION consume_inventory_for_order IS 'Descuenta insumos automáticamente al facturar';

-- ============================================================
-- 19. Verificación final
-- ============================================================
DO $$
DECLARE
  plan_count INT;
BEGIN
  SELECT COUNT(*) INTO plan_count
  FROM pg_enum
  WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan');

  RAISE NOTICE '✅ user_plan enum tiene % valores (esperado: 4)', plan_count;
  RAISE NOTICE '✅ Tabla branches creada';
  RAISE NOTICE '✅ Tabla tables creada';
  RAISE NOTICE '✅ Tabla waiters creada';
  RAISE NOTICE '✅ Tabla orders creada';
  RAISE NOTICE '✅ Tabla order_items creada';
  RAISE NOTICE '✅ Tabla order_status_history creada';
  RAISE NOTICE '✅ Tabla inventory_items creada';
  RAISE NOTICE '✅ Tabla product_recipes creada';
  RAISE NOTICE '✅ Tabla inventory_movements creada';
  RAISE NOTICE '✅ Tabla voucher_prints creada';
  RAISE NOTICE '✅ RLS habilitado en todas las tablas';
  RAISE NOTICE '✅ Triggers updated_at creados';
  RAISE NOTICE '✅ Funciones get_next_order_number, get_next_voucher_number, consume_inventory_for_order creadas';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Migration completa. Ejecuta también add-carta-style.sql si no lo has hecho.';
END $$;

COMMIT;
