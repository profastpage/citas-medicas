-- ============================================================
-- MenuPro — MIGRACIÓN COMPLETA (TODO EN UNO)
-- ============================================================
-- Este script crea TODAS las tablas del sistema logístico +
-- qr_token para waiters + triggers corregidos.
-- Es IDEMPOTENTE: se puede ejecutar múltiples veces.
--
-- INCLUYE:
--   ✅ 11 tablas (branches, tables, waiters, orders, order_items,
--      order_status_history, inventory_items, product_recipes,
--      inventory_movements, voucher_prints)
--   ✅ Enum user_plan extendido con 'premium' y 'full'
--   ✅ qr_token en waiters (para vista móvil /mozo/[token])
--   ✅ Trigger auto-generador de qr_token
--   ✅ Función consume_inventory_for_order (RETURNS VOID)
--   ✅ Función consume_inventory_on_invoice (RETURNS TRIGGER)
--   ✅ Trigger trg_consume_inventory con sintaxis canónica
--   ✅ RLS + índices + comentarios
--
-- CÓMO EJECUTAR:
--   1. Supabase Dashboard → SQL Editor → + New query
--   2. Pega TODO este archivo
--   3. Click en "Run" (Ctrl+Enter)
--   4. Deberías ver "🎉 Migration completa" en Output
-- ============================================================

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
    ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'premium';
  END IF;

  -- Añadir 'full' si no existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'full'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan')
  ) THEN
    ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'full';
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
  name            TEXT,
  capacity        INT NOT NULL DEFAULT 4,
  status          table_status NOT NULL DEFAULT 'libre',
  qr_token        TEXT UNIQUE,
  location        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, number)
);

CREATE INDEX IF NOT EXISTS idx_tables_owner ON tables(owner_id);
CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(owner_id, status);

-- ============================================================
-- 4. Tabla waiters (mozos) — INCLUYE qr_token
-- ============================================================
CREATE TABLE IF NOT EXISTS waiters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name       TEXT NOT NULL,
  document_id     TEXT,
  phone           TEXT,
  pin             TEXT,
  qr_token        TEXT UNIQUE,          -- ⭐ para vista móvil /mozo/[token]
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waiters_owner ON waiters(owner_id);
CREATE INDEX IF NOT EXISTS idx_waiters_qr_token ON waiters(qr_token) WHERE qr_token IS NOT NULL;

-- Si la tabla ya existía sin qr_token, agregar la columna
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waiters' AND column_name = 'qr_token'
  ) THEN
    ALTER TABLE waiters ADD COLUMN qr_token TEXT UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_waiters_qr_token ON waiters(qr_token) WHERE qr_token IS NOT NULL;
  END IF;
END $$;

-- Generar tokens para waiters existentes sin token
UPDATE waiters
SET qr_token = 'wt-' || replace(gen_random_uuid()::text, '-', '')
WHERE qr_token IS NULL;

-- Función trigger para auto-generar qr_token en INSERT
CREATE OR REPLACE FUNCTION set_waiter_qr_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_token IS NULL THEN
    NEW.qr_token := 'wt-' || replace(gen_random_uuid()::text, '-', '');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_waiter_qr_token ON waiters;
CREATE TRIGGER trg_waiter_qr_token
  BEFORE INSERT ON waiters
  FOR EACH ROW
  EXECUTE FUNCTION set_waiter_qr_token();

-- ============================================================
-- 5. Tabla orders (comandas)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'borrador', 'enviada', 'en_preparacion', 'lista',
    'entregada', 'facturada', 'cancelada'
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
  order_number    TEXT NOT NULL,
  status          order_status NOT NULL DEFAULT 'borrador',
  order_type      order_type NOT NULL DEFAULT 'mesa',
  customer_name   TEXT,
  customer_phone  TEXT,
  party_size      INT,
  notes           TEXT,
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
    'pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    TEXT,
  menu_item_name  TEXT NOT NULL,
  menu_item_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes           TEXT,
  status          order_item_status NOT NULL DEFAULT 'pendiente',
  prepared_by     UUID REFERENCES waiters(id) ON DELETE SET NULL,
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
  changed_by      TEXT,
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
  stock_min       NUMERIC(12,3) NOT NULL DEFAULT 0,
  stock_max       NUMERIC(12,3) NOT NULL DEFAULT 0,
  cost_per_unit   NUMERIC(10,2) NOT NULL DEFAULT 0,
  supplier        TEXT,
  category        TEXT,
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
  menu_item_id        TEXT NOT NULL,
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
    'entrada', 'salida', 'ajuste', 'merma', 'transferencia'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS inventory_movements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id           UUID REFERENCES branches(id) ON DELETE SET NULL,
  inventory_item_id   UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  movement_type       movement_type NOT NULL,
  quantity            NUMERIC(12,3) NOT NULL,
  unit_cost           NUMERIC(10,2) NOT NULL DEFAULT 0,
  reason              TEXT,
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
  voucher_number  TEXT NOT NULL,
  printed_by      TEXT,
  print_format    TEXT NOT NULL DEFAULT 'pos_80mm',
  pdf_url         TEXT,
  printed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voucher_owner ON voucher_prints(owner_id);
CREATE INDEX IF NOT EXISTS idx_voucher_order ON voucher_prints(order_id);

-- ============================================================
-- 12. Función updated_at + triggers
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "branches_owner_all" ON branches;
CREATE POLICY "branches_owner_all" ON branches
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tables_owner_all" ON tables;
CREATE POLICY "tables_owner_all" ON tables
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waiters_owner_all" ON waiters;
CREATE POLICY "waiters_owner_all" ON waiters
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_owner_all" ON orders;
CREATE POLICY "orders_owner_all" ON orders
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_owner_all" ON order_items;
CREATE POLICY "order_items_owner_all" ON order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.owner_id = auth.uid())
  );

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "osh_owner_all" ON order_status_history;
CREATE POLICY "osh_owner_all" ON order_status_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.owner_id = auth.uid())
  );

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inv_owner_all" ON inventory_items;
CREATE POLICY "inv_owner_all" ON inventory_items
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE product_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipes_owner_all" ON product_recipes;
CREATE POLICY "recipes_owner_all" ON product_recipes
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mov_owner_all" ON inventory_movements;
CREATE POLICY "mov_owner_all" ON inventory_movements
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

ALTER TABLE voucher_prints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "voucher_owner_all" ON voucher_prints;
CREATE POLICY "voucher_owner_all" ON voucher_prints
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- 14. Función: siguiente número de comanda
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
-- 15. Función: siguiente número de voucher
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
-- 16. Función: descontar inventario al facturar (lógica pura)
-- ============================================================
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
  SELECT status, owner_id, branch_id, order_number
    INTO v_status, v_owner, v_branch, v_order_num
  FROM orders WHERE id = p_order;

  IF NOT FOUND THEN RETURN; END IF;
  IF v_status NOT IN ('facturada', 'entregada') THEN RETURN; END IF;

  FOR item_row IN
    SELECT id, menu_item_id, menu_item_name, quantity
    FROM order_items
    WHERE order_id = p_order AND status <> 'cancelado'
  LOOP
    FOR recipe_row IN
      SELECT id, inventory_item_id, quantity_per_dish
      FROM product_recipes
      WHERE owner_id = v_owner
        AND menu_item_id = item_row.menu_item_id
    LOOP
      UPDATE inventory_items
        SET stock_current = stock_current - (recipe_row.quantity_per_dish * item_row.quantity)
        WHERE id = recipe_row.inventory_item_id;

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

-- ============================================================
-- 17. Función trigger estándar (RETURNS TRIGGER, sin argumentos)
-- ============================================================
CREATE OR REPLACE FUNCTION consume_inventory_on_invoice()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM consume_inventory_for_order(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 18. Trigger: descontar inventario automáticamente
-- ============================================================
DROP TRIGGER IF EXISTS trg_consume_inventory ON orders;
CREATE TRIGGER trg_consume_inventory
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status IN ('facturada','entregada')
        AND OLD.status NOT IN ('facturada','entregada'))
  EXECUTE FUNCTION consume_inventory_on_invoice();

-- ============================================================
-- 19. Comentarios informativos
-- ============================================================
COMMENT ON TABLE branches IS 'Sucursales — solo plan Full';
COMMENT ON TABLE tables IS 'Mesas del restaurante — plan Premium+';
COMMENT ON TABLE waiters IS 'Mozos/asociados — plan Premium+';
COMMENT ON TABLE orders IS 'Comandas: mesa → mozo → cocina → entrega → factura';
COMMENT ON TABLE order_items IS 'Items de cada comanda';
COMMENT ON TABLE order_status_history IS 'Auditoría de cambios de estado de comanda';
COMMENT ON TABLE inventory_items IS 'Insumos con stock — plan Premium+';
COMMENT ON TABLE product_recipes IS 'Receta: qué insumos consume cada plato del menú';
COMMENT ON TABLE inventory_movements IS 'Movimientos de stock (entradas/salidas/ajustes)';
COMMENT ON TABLE voucher_prints IS 'Registro de vouchers impresos — plan Full';
COMMENT ON FUNCTION get_next_order_number IS 'Obtiene #0001, #0002... para comandas';
COMMENT ON FUNCTION consume_inventory_for_order IS 'Descuenta insumos automáticamente al facturar';

-- ============================================================
-- 20. Verificación final
-- ============================================================
DO $$
DECLARE
  plan_count INT;
  waiters_con_token INT;
  total_waiters INT;
BEGIN
  SELECT COUNT(*) INTO plan_count
  FROM pg_enum
  WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan');

  SELECT COUNT(*) INTO total_waiters FROM waiters;
  SELECT COUNT(*) INTO waiters_con_token FROM waiters WHERE qr_token IS NOT NULL;

  RAISE NOTICE '✅ user_plan enum tiene % valores (esperado: 4)', plan_count;
  RAISE NOTICE '✅ Tabla branches creada';
  RAISE NOTICE '✅ Tabla tables creada';
  RAISE NOTICE '✅ Tabla waiters creada (% total, % con token)', total_waiters, waiters_con_token;
  RAISE NOTICE '✅ Tabla orders creada';
  RAISE NOTICE '✅ Tabla order_items creada';
  RAISE NOTICE '✅ Tabla order_status_history creada';
  RAISE NOTICE '✅ Tabla inventory_items creada';
  RAISE NOTICE '✅ Tabla product_recipes creada';
  RAISE NOTICE '✅ Tabla inventory_movements creada';
  RAISE NOTICE '✅ Tabla voucher_prints creada';
  RAISE NOTICE '✅ RLS habilitado en todas las tablas';
  RAISE NOTICE '✅ Triggers updated_at creados';
  RAISE NOTICE '✅ Trigger trg_waiter_qr_token creado (auto-genera tokens)';
  RAISE NOTICE '✅ Funciones creadas: get_next_order_number, get_next_voucher_number, consume_inventory_for_order, consume_inventory_on_invoice';
  RAISE NOTICE '✅ Trigger trg_consume_inventory creado (descuento automático al facturar)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Migration completa. Ya puedes usar:';
  RAISE NOTICE '   - /dashboard/mesas, /dashboard/comandas, /dashboard/cocina, /dashboard/inventario';
  RAISE NOTICE '   - /dashboard/reportes (solo plan Full)';
  RAISE NOTICE '   - /mozo/[qr_token] (panel móvil sin login)';
END $$;
