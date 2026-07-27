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
-- RESTAURANTE 1: Pollería El Dorado Chicken — Sucursal Centro
-- ════════════════════════════════════════════════════════════

-- ► Sucursal
INSERT INTO branches (
  id, owner_id, name, address, phone, is_active, created_at, updated_at
) VALUES (
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Pollería El Dorado Chicken — Sucursal Centro',
  'Av. Aviación 1234, San Borja, Lima',
  '+51 1 435-7890',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mesas
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '53a68e56-55b6-5b6a-ba8f-cc1b33a50c24'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  1,
  'Mesa 1',
  4,
  'libre'::table_status,
  'qr-table-polleria-001-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '1b05ab9f-a934-5cda-9baf-4ecf0d6cea17'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  2,
  'Mesa 2',
  4,
  'libre'::table_status,
  'qr-table-polleria-002-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'fdb66043-c13a-50ee-abeb-78a34bce32a6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  3,
  'Mesa 3',
  4,
  'libre'::table_status,
  'qr-table-polleria-003-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'd0ccc669-62f4-554b-bef8-21bb40b9c6a8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  4,
  'Mesa 4',
  6,
  'libre'::table_status,
  'qr-table-polleria-004-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'eb0387fb-1c2d-5203-9be1-8f79d15d9cd6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  5,
  'Mesa 5',
  6,
  'reservada'::table_status,
  'qr-table-polleria-005-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'dca90d20-8004-56d1-b048-d8317ffe5825'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  6,
  'Mesa 6',
  4,
  'libre'::table_status,
  'qr-table-polleria-006-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '6fa0f904-f494-5cdc-b302-1607c72adb12'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  7,
  'Mesa 7',
  4,
  'libre'::table_status,
  'qr-table-polleria-007-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '1d55a482-3920-5e5c-b9eb-f9c27a17e4e9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  8,
  'Mesa 8',
  4,
  'libre'::table_status,
  'qr-table-polleria-008-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'cd80b2dc-92ca-5d39-bb8e-d1b19f5bc6bb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  9,
  'Mesa 9',
  6,
  'libre'::table_status,
  'qr-table-polleria-009-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '0e03501c-d8a1-5a06-8892-08a303c13834'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  10,
  'Mesa 10',
  6,
  'reservada'::table_status,
  'qr-table-polleria-010-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'e15aba61-c3ee-5f53-97f9-47c280e7c54f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  11,
  'Mesa 11',
  8,
  'libre'::table_status,
  'qr-table-polleria-011-736434f8',
  '2do Piso',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '4aadd500-c5e1-5004-a696-58b1bb06ac26'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  12,
  'Mesa 12',
  8,
  'libre'::table_status,
  'qr-table-polleria-012-736434f8',
  '2do Piso',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mozos
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '66a9edf5-256e-5973-99a3-e5f145b664de'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Carlos Huamán Pérez',
  '44778899',
  '987 654 321',
  '1234',
  'waiter-polleria-0-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'María González Torres',
  '44556677',
  '987 111 222',
  '2345',
  'waiter-polleria-1-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'José Luis Rojas',
  '44889900',
  '987 333 444',
  '3456',
  'waiter-polleria-2-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '7e986f9c-ffeb-552b-93ba-bdc1ab9e0cbc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Ana Karen Quispe',
  '44990011',
  '987 555 666',
  '4567',
  'waiter-polleria-3-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '4efe8b00-c137-57e6-909a-bfa922eeb6c7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Pedro Salazar Mejía',
  '44112233',
  '987 777 888',
  '5678',
  'waiter-polleria-4-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();

-- ► Inventario (insumos)
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Pollo entero fresco',
  'POL-001',
  'unidad'::inventory_unit,
  80, 20, 150,
  18.0,
  'Avícola San Carlos',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '16f65486-e61c-5bc2-841b-de506896742e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  'entrada'::movement_type,
  80,
  18.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'f43c011d-d6c7-5a26-855b-97e71e386a4f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Papa amarilla',
  'PAP-001',
  'kg'::inventory_unit,
  50, 15, 100,
  3.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'd933565e-a851-56bd-a0a7-13c3d28a75c9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'f43c011d-d6c7-5a26-855b-97e71e386a4f'::uuid,
  'entrada'::movement_type,
  50,
  3.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '878e33d7-8a67-5376-8528-c5c3e501f566'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Papa blanca',
  'PAP-002',
  'kg'::inventory_unit,
  60, 20, 120,
  3.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'ff8fa37d-9cff-5f6e-bbb9-1194fc2e5c4c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '878e33d7-8a67-5376-8528-c5c3e501f566'::uuid,
  'entrada'::movement_type,
  60,
  3.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '5beecfa3-6e02-50e7-a3f5-0287b760086a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Aceite vegetal',
  'ACE-001',
  'litro'::inventory_unit,
  40, 10, 80,
  12.0,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '7a077ad4-a0db-513d-b905-9d558fffa314'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '5beecfa3-6e02-50e7-a3f5-0287b760086a'::uuid,
  'entrada'::movement_type,
  40,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'dfbdd8f1-7621-53b1-a5e1-43c733712136'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Sal industrial',
  'SAL-001',
  'kg'::inventory_unit,
  25, 5, 50,
  1.2,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'f856e7e2-e080-5ed7-9b70-6e64d9ea494c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'dfbdd8f1-7621-53b1-a5e1-43c733712136'::uuid,
  'entrada'::movement_type,
  25,
  1.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '38175fdb-f9e0-5f3e-99e0-6f16fc879345'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Ají amarillo',
  'AJI-001',
  'kg'::inventory_unit,
  8, 3, 20,
  6.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '37af6ffd-406c-59d7-b287-a3b3d70209f9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '38175fdb-f9e0-5f3e-99e0-6f16fc879345'::uuid,
  'entrada'::movement_type,
  8,
  6.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'f4d27818-4d10-52dc-963d-b3a57af3013a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Carbón de cocina',
  'CAR-001',
  'kg'::inventory_unit,
  30, 10, 100,
  2.5,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '582f6ed9-09f1-5bd2-8b1d-a32f163c6e8d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'f4d27818-4d10-52dc-963d-b3a57af3013a'::uuid,
  'entrada'::movement_type,
  30,
  2.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '1fd027ea-f27f-5f44-af39-43fdfd2d5153'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Gaseosa Inca Kola 500ml',
  'BEB-001',
  'unidad'::inventory_unit,
  100, 30, 200,
  2.2,
  'Coca Cola Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'a22a3ebf-4e94-50a0-a139-adb3b99e8499'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '1fd027ea-f27f-5f44-af39-43fdfd2d5153'::uuid,
  'entrada'::movement_type,
  100,
  2.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '3a603c52-7fe5-52df-aed8-6fcd4bab0d54'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Gaseosa Coca Cola 500ml',
  'BEB-002',
  'unidad'::inventory_unit,
  100, 30, 200,
  2.2,
  'Coca Cola Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '4952046e-91a4-513e-984f-8fd96bb8757a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '3a603c52-7fe5-52df-aed8-6fcd4bab0d54'::uuid,
  'entrada'::movement_type,
  100,
  2.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'c6403e61-ece3-5d2c-bcd8-0cd52e1a1810'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'Ensalada mixta',
  'ENS-001',
  'kg'::inventory_unit,
  15, 5, 30,
  4.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '754f9d7b-38b1-59af-9341-4d00e58c7dc2'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'c6403e61-ece3-5d2c-bcd8-0cd52e1a1810'::uuid,
  'entrada'::movement_type,
  15,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ► Recetas (plato → insumos)
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'a3ae5cb6-ea1c-5a24-93f7-6fa2b7cc7ad0'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '9fe90636-864b-5bb2-8f14-88ddfb00dea8'::text,
  'Pollo a la Brasa Entero',
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  1.0,
  '1 pollo entero por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '163b2e3f-34d1-5448-965c-4ac20f6e8526'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'a2079a8e-fa2b-52b6-ace3-c0196e45b4d0'::text,
  'Pollo a la Brasa Entero',
  '878e33d7-8a67-5376-8528-c5c3e501f566'::uuid,
  1.0,
  '1 kg papas fritas por pollo',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '721c66ba-1790-5aa4-99bd-f84e53495428'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '75344a75-ffc0-5f94-8c59-0b2d22b12a5e'::text,
  'Pollo a la Brasa Entero',
  'f4d27818-4d10-52dc-963d-b3a57af3013a'::uuid,
  0.5,
  '500g carbón por pollo',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'bf60da55-3139-5730-81c5-babaea82d3b1'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'adac482d-8f7a-5100-b15a-041cb875b571'::text,
  'Cuarto de Pollo',
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  0.25,
  '1/4 pollo',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '9304520d-fda0-5435-a962-c7c0ef57bcb6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '65d830d4-b870-536f-a5ed-772c51bdc9f6'::text,
  'Cuarto de Pollo',
  '878e33d7-8a67-5376-8528-c5c3e501f566'::uuid,
  0.3,
  '300g papas fritas',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'b090320a-3dcc-5cca-a518-c25e02575959'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '438d47b3-d5a1-59a2-b4ee-a5064dd3add3'::text,
  'Cuarto de Pollo',
  'c6403e61-ece3-5d2c-bcd8-0cd52e1a1810'::uuid,
  0.15,
  '150g ensalada',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '4a152c71-5341-57c2-ade1-485bae057571'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '719ce76c-2af2-54de-9efe-505c1b626289'::text,
  'Pollo Broaster Entero',
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '561cd1b3-a33d-59dd-afed-8e0ff277f993'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'ec52946a-3072-5568-9d6b-36fc471ba377'::text,
  'Pollo Broaster Entero',
  '5beecfa3-6e02-50e7-a3f5-0287b760086a'::uuid,
  0.5,
  '500ml aceite para fritura',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '4941de0d-c7cc-5625-891b-fa39c10cc9b8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '61c75e8a-2a91-52ca-9570-64b6878d13bf'::text,
  'Alitas Broaster (12 u)',
  '319ea400-cb1a-551e-b921-6ab498fd7608'::uuid,
  0.5,
  '12 alitas = ~750g',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'c15f98d3-bc08-54bc-9251-6b479b8969e9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'e87e354b-a0bd-5167-ad4b-697a23832e44'::text,
  'Inca Kola 500ml',
  '1fd027ea-f27f-5f44-af39-43fdfd2d5153'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ► Comandas (orders + items)
-- Comanda #0001 (mesa 1, mozo: Carlos Huamán Pérez)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '53a68e56-55b6-5b6a-ba8f-cc1b33a50c24'::uuid,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::uuid,
  '#0001',
  'entregada'::order_status,
  'mesa'::order_type,
  'Familia Mendoza',
  NULL,
  4,
  'Cliente habitual',
  78.0,
  0,
  8.0,
  86.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NULL,
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'b87d9336-a99b-5586-a767-67964fb14e46'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  'ed34360a-2b02-5381-bae5-aa436d2f6ebf'::text,
  'Pollo a la Brasa Entero',
  58.0,
  1,
  'Bien dorado, extra ají',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'c85d86b1-c9af-5905-8252-e1bd35d9e415'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  '5ecb3142-6ed6-5577-a71a-d57185a2bd95'::text,
  'Inca Kola 500ml',
  5.0,
  4,
  'Bien heladas',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '318507e9-010c-5311-98e8-8f2805d1bcc3'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  NULL,
  'borrador'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '78e0a646-74a6-5929-82d0-27ed23c7d4e0'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '7ed434f5-051a-5851-b351-ee7c94b6f74a'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '04d8ca61-a0b0-565e-9536-8e9e649ff795'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd7eaf527-1509-5838-ae85-d308ff6fd2ae'::uuid,
  '3c2d117e-0a74-5612-84ed-50e21d6d4e7b'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0002 (mesa 3, mozo: María González Torres)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'fdb66043-c13a-50ee-abeb-78a34bce32a6'::uuid,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::uuid,
  '#0002',
  'facturada'::order_status,
  'mesa'::order_type,
  'Sr. García',
  NULL,
  3,
  'Cuenta dividida en 2',
  79.0,
  0,
  6.0,
  85.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '3 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'af0acc7e-e4e0-5904-8736-9bdebea2edaa'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'c5379043-4271-5f7e-8ba7-5123a2725a39'::text,
  'Medio Pollo a la Brasa',
  34.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1eebc7e9-f6c4-50d1-b6d5-3629c856b0bb'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  '4b3fe774-3d08-5441-b915-84cf75ba4ee4'::text,
  'Cuarto de Pollo',
  19.0,
  1,
  'Sin ají',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '2844859a-f639-5078-89d7-29dd62261c77'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  '0a61f41a-d545-5fb9-9106-f8c63a24425c'::text,
  'Papas Fritas Familiares',
  14.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '9174fdf4-1826-59f0-ad51-252ada729035'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  '650a678c-75e0-5d18-af68-98353a1163c6'::text,
  'Chicha Morada 1L',
  12.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '78576ae5-ff87-5cfa-85eb-c3aa7ca9d1b0'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  NULL,
  'borrador'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:11:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '2413f5df-6b6a-517d-a7cb-7c49d4cde4bd'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '0b957e0b-72f3-5652-a87b-f036a449ce71'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '9d9b71b5-1e3c-5e18-acb2-17e046e6854d'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd6578896-a6af-598e-85fa-a261a38a5efa'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '273ef4a7-6556-5df4-aa2e-a15adc9e0f55'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'entregada'::order_status,
  'facturada'::order_status,
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO voucher_prints (
  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at
) VALUES (
  '0b1a6cd9-187a-5bc6-82ef-ba22496e9ff3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '702e24e3-7061-5288-a138-ee3aed50d12d'::uuid,
  'V-001002',
  '30ff7cc5-1d6e-5b2d-aff1-aa632334ed83'::text,
  'pos_80mm',
  NULL,
  '2026-07-26T20:38:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0003 (mesa 5, mozo: José Luis Rojas)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'eb0387fb-1c2d-5203-9be1-8f79d15d9cd6'::uuid,
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::uuid,
  '#0003',
  'lista'::order_status,
  'mesa'::order_type,
  'Aniversario López',
  NULL,
  4,
  'Llevar a mesa 5',
  103.0,
  0,
  10.0,
  113.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NULL,
  NULL,
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '473b368f-2b8c-5303-a697-d2878aa600c9'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  'f60b6771-d25f-5a01-b32b-f71835178ccb'::text,
  'Combo Familiar 4 Personas',
  75.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'b9f7f3f8-6c6a-5fc9-92d8-c82c0b00c48d'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  'f4d6891f-557d-5f13-b41e-aef20a289cb7'::text,
  'Alitas Broaster (12 u)',
  28.0,
  1,
  'Extra BBQ',
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '6ef5d9d9-7dff-5706-a719-5d9f5d26947e'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  NULL,
  'borrador'::order_status,
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'b64fc76c-f4d4-5b66-83fd-464f39d08dcc'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'ecbe9196-9a21-5170-bf50-b6c36755653e'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '02390c30-826b-51d7-99a1-589001b82089'::uuid,
  'e512e786-3b22-5c4f-837f-aac9bd67cf83'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '3e9ade26-2e6a-59e7-b6a8-59d0c2807b42'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0004 (mesa 7, mozo: Ana Karen Quispe)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  '6fa0f904-f494-5cdc-b302-1607c72adb12'::uuid,
  '7e986f9c-ffeb-552b-93ba-bdc1ab9e0cbc'::uuid,
  '#0004',
  'en_preparacion'::order_status,
  'mesa'::order_type,
  'Mesa cumpleañera',
  NULL,
  5,
  NULL,
  76.0,
  0,
  0,
  76.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'd0e48245-591d-5047-a825-a875a4c4308d'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  'b600cbb8-081d-5d09-b5c0-a9e60bcc6b19'::text,
  'Cuarto de Pollo + Porción Extra',
  24.0,
  2,
  'Uno sin sal',
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'e0d89be9-c04c-5d83-bf19-dcd0818853ea'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  '300bf77c-1af2-540a-a378-5b59d10cfd36'::text,
  'Arroz Chaufa de Pollo',
  18.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'd33c7af4-3641-5d51-91d4-6b08d5a450c7'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  '1c035ba4-361e-523c-83d3-3f0549504428'::text,
  'Limonada Fría 1L',
  10.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '33753d85-6090-538b-b208-4ad60f8e3962'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  NULL,
  'borrador'::order_status,
  '7e986f9c-ffeb-552b-93ba-bdc1ab9e0cbc'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c7ef3073-c53a-5c03-9b50-a29cc56f0a12'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '7e986f9c-ffeb-552b-93ba-bdc1ab9e0cbc'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd47ae38b-5bfc-586f-b1a1-c87a907b4d40'::uuid,
  '58f73b6c-1ad5-51c1-a965-2125bd3362f8'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '7e986f9c-ffeb-552b-93ba-bdc1ab9e0cbc'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0005 (mesa 9, mozo: Carlos Huamán Pérez)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '9d62eac3-d949-558a-aef0-a921f20a33d8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c987a60d-6c21-5cb7-a09b-14b704ade696'::uuid,
  'cd80b2dc-92ca-5d39-bb8e-d1b19f5bc6bb'::uuid,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::uuid,
  '#0005',
  'enviada'::order_status,
  'mesa'::order_type,
  'Familia Ruiz',
  NULL,
  4,
  NULL,
  74.0,
  0,
  0,
  74.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1e8a6036-f06b-5b3f-b0c4-7a7d6d86d07b'::uuid,
  '9d62eac3-d949-558a-aef0-a921f20a33d8'::uuid,
  '3efca93e-22e2-5f60-bb85-8a9f538faaf7'::text,
  'Pollo Broaster Entero',
  56.0,
  1,
  'Extra crujiente',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '3c0f7ef9-acef-5957-ae30-312b24fa13a8'::uuid,
  '9d62eac3-d949-558a-aef0-a921f20a33d8'::uuid,
  '8a6f66fc-1bc0-5022-8cf7-bcf315c3f082'::text,
  'Nuggets de Pollo (10 u)',
  18.0,
  1,
  'Para niño',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'eddc90b5-2075-5800-95cb-98375b1fddf6'::uuid,
  '9d62eac3-d949-558a-aef0-a921f20a33d8'::uuid,
  NULL,
  'borrador'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '76aa221b-13d2-555d-9e0b-2896f0dd64f1'::uuid,
  '9d62eac3-d949-558a-aef0-a921f20a33d8'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '66a9edf5-256e-5973-99a3-e5f145b664de'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- RESTAURANTE 2: Chifa Dragón de Oro — Sucursal Cercado
-- ════════════════════════════════════════════════════════════

-- ► Sucursal
INSERT INTO branches (
  id, owner_id, name, address, phone, is_active, created_at, updated_at
) VALUES (
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Chifa Dragón de Oro — Sucursal Cercado',
  'Av. Brasil 876, Jesús María, Lima',
  '+51 1 421-3344',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mesas
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '055ea183-1e45-5e1c-8a55-74d722fbc6b7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  1,
  'Mesa 1',
  4,
  'libre'::table_status,
  'qr-table-chifa-001-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '5fc573f9-e5e3-5e15-a267-1e248fcbcc53'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  2,
  'Mesa 2',
  4,
  'libre'::table_status,
  'qr-table-chifa-002-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '40247554-1a10-5011-b51d-6d6eb25cd371'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  3,
  'Mesa 3',
  4,
  'libre'::table_status,
  'qr-table-chifa-003-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '35b9861f-72bb-5203-bfa1-3b747e2956f0'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  4,
  'Mesa 4',
  4,
  'libre'::table_status,
  'qr-table-chifa-004-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'a0f3c956-2633-5fb7-b127-2b69d0e00565'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  5,
  'Mesa 5',
  6,
  'reservada'::table_status,
  'qr-table-chifa-005-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '033fc6f9-23c5-510c-a123-ec63f4219229'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  6,
  'Mesa 6',
  6,
  'libre'::table_status,
  'qr-table-chifa-006-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'acee36c7-31a5-5b1b-801e-59585352cb04'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  7,
  'Mesa 7',
  8,
  'libre'::table_status,
  'qr-table-chifa-007-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'a3b02be6-a7fa-5cea-a2e7-b6402a1edbe7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  8,
  'Mesa 8',
  8,
  'libre'::table_status,
  'qr-table-chifa-008-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'aa905785-11f2-5447-8d04-93c5e13b0952'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  9,
  'Mesa 9',
  10,
  'libre'::table_status,
  'qr-table-chifa-009-736434f8',
  'Privado',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'c2de29be-cc2e-5656-afc2-bf0ddc2e7a01'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  10,
  'Mesa 10',
  10,
  'reservada'::table_status,
  'qr-table-chifa-010-736434f8',
  'Privado',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mozos
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Luis Chong Sifuentes',
  '33445566',
  '987 100 200',
  '1111',
  'waiter-chifa-0-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Carmen Yip Sánchez',
  '33556677',
  '987 300 400',
  '2222',
  'waiter-chifa-1-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Roberto Li Wong',
  '33667788',
  '987 500 600',
  '3333',
  'waiter-chifa-2-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  'ef377757-e1d9-5108-924b-264cfcb632a6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Patricia Vásquez Lam',
  '33778899',
  '987 700 800',
  '4444',
  'waiter-chifa-3-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();

-- ► Inventario (insumos)
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '6995d238-09f7-5f59-8ed0-af9db1bb0633'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Pechuga de pollo',
  'POL-002',
  'kg'::inventory_unit,
  45, 15, 90,
  12.0,
  'Avícola San Carlos',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '30e54015-e8a2-5ca1-83ca-9b9660790d5b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '6995d238-09f7-5f59-8ed0-af9db1bb0633'::uuid,
  'entrada'::movement_type,
  45,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '96d9311c-61d0-597a-81fa-73b2e28e2a71'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Camarón fresco',
  'CAM-001',
  'kg'::inventory_unit,
  12, 5, 30,
  55.0,
  'Mariscos del Pacífico',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'd0b3f2c2-71c3-5549-a0ae-e1c29656ad48'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '96d9311c-61d0-597a-81fa-73b2e28e2a71'::uuid,
  'entrada'::movement_type,
  12,
  55.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '508fb18b-095b-5da8-9adb-587c2a39edf8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Arroz chaufa (cocido)',
  'ARR-001',
  'kg'::inventory_unit,
  80, 20, 150,
  3.2,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'fd7bdcca-41d3-5aad-a6e9-e7e833d5b49f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '508fb18b-095b-5da8-9adb-587c2a39edf8'::uuid,
  'entrada'::movement_type,
  80,
  3.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'b55a4e92-8abe-5564-9db5-8918c6a413dc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Fideos chinos',
  'FID-001',
  'paquete'::inventory_unit,
  60, 15, 120,
  4.5,
  'Importadora China',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'a57aa2c3-9bd8-5d3b-a212-4f27a3f45d41'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'b55a4e92-8abe-5564-9db5-8918c6a413dc'::uuid,
  'entrada'::movement_type,
  60,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '578d85a6-609b-5b46-8a71-6b87bc785442'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Sillao (salsa de soya)',
  'SIL-001',
  'litro'::inventory_unit,
  20, 5, 40,
  14.0,
  'Importadora China',
  'Salsas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '70c624e1-154e-58fa-9ad3-9c60dbebbcf6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '578d85a6-609b-5b46-8a71-6b87bc785442'::uuid,
  'entrada'::movement_type,
  20,
  14.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'c9b021a4-8991-5608-8cd7-50a3e75c15d4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Cebollita china',
  'CEB-001',
  'kg'::inventory_unit,
  15, 5, 30,
  4.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'bc8af6ff-41a0-5d66-b535-db8e29c1f344'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'c9b021a4-8991-5608-8cd7-50a3e75c15d4'::uuid,
  'entrada'::movement_type,
  15,
  4.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '93bf73ff-2334-5241-b9a8-d3f46d66bbe1'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Huevos',
  'HUE-001',
  'docena'::inventory_unit,
  30, 10, 60,
  10.0,
  'Avícola San Carlos',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '6b392f31-db93-54b2-b768-6c78a0793e80'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '93bf73ff-2334-5241-b9a8-d3f46d66bbe1'::uuid,
  'entrada'::movement_type,
  30,
  10.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '27cb397d-be89-57f4-9b2d-379f9c73cabb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Wantanes congelados',
  'WAN-001',
  'paquete'::inventory_unit,
  25, 8, 60,
  12.0,
  'Importadora China',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '184e540d-b50c-5c1a-85ef-3f0ce57f84f7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '27cb397d-be89-57f4-9b2d-379f9c73cabb'::uuid,
  'entrada'::movement_type,
  25,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'e4c3c65f-721c-58be-a7e8-eaf6937a9928'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Aceite vegetal',
  'ACE-001',
  'litro'::inventory_unit,
  35, 10, 80,
  12.0,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'bbd7576b-6b85-586c-9306-d5985576b97f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'e4c3c65f-721c-58be-a7e8-eaf6937a9928'::uuid,
  'entrada'::movement_type,
  35,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'b3b92d9e-e331-5ba6-accf-926c83f359ef'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Té de jazmín',
  'TE-001',
  'paquete'::inventory_unit,
  12, 3, 30,
  8.0,
  'Importadora China',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'c9341a07-5318-55e4-b8bf-94a4f01ec907'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'b3b92d9e-e331-5ba6-accf-926c83f359ef'::uuid,
  'entrada'::movement_type,
  12,
  8.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '647f549a-538e-5ebf-a26c-fb8256fd75dd'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Chicha morada 1L',
  'BEB-003',
  'unidad'::inventory_unit,
  40, 10, 80,
  6.0,
  'Distribuidora Lima',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'b459e2f8-bafe-5e0f-82aa-b61f8870b77d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '647f549a-538e-5ebf-a26c-fb8256fd75dd'::uuid,
  'entrada'::movement_type,
  40,
  6.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'c6cfcaf5-8ced-5192-ae6d-9ba1a09cdc26'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'Inca Kola 1.5L',
  'BEB-004',
  'unidad'::inventory_unit,
  30, 10, 60,
  7.0,
  'Coca Cola Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '77e70e82-81f0-59f5-8de0-71bea3a94367'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'c6cfcaf5-8ced-5192-ae6d-9ba1a09cdc26'::uuid,
  'entrada'::movement_type,
  30,
  7.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ► Recetas (plato → insumos)
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'eae22b17-10e1-5bb9-bd8b-a555c9151bac'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '2aae5987-2256-5ddd-ac37-b8c611ddf9be'::text,
  'Arroz Chaufa de Pollo',
  '6995d238-09f7-5f59-8ed0-af9db1bb0633'::uuid,
  0.2,
  '200g por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '9d7e5aa6-ffe5-54eb-bd07-2092dc77b297'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '916aa7a4-4629-5f92-8862-62b98de9fbcb'::text,
  'Arroz Chaufa de Pollo',
  '508fb18b-095b-5da8-9adb-587c2a39edf8'::uuid,
  0.3,
  '300g por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd3c380ac-2516-5778-870f-c333a36ede3d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c1286ac3-6dd6-5966-bd63-12bbb6811090'::text,
  'Arroz Chaufa de Pollo',
  '578d85a6-609b-5b46-8a71-6b87bc785442'::uuid,
  0.03,
  '30ml sillao',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '4d00ad1c-45c9-5850-a55d-ddd3c37aa441'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'ffce5ea0-1a8e-5e7b-b8c2-c9e74c44c8ed'::text,
  'Arroz Chaufa de Pollo',
  'c9b021a4-8991-5608-8cd7-50a3e75c15d4'::uuid,
  0.05,
  '50g cebollita',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd0aa7228-4074-5338-8096-8eac3c0dc9ce'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'fe381c1a-c92b-559f-935e-c2b743cbb425'::text,
  'Arroz Chaufa de Pollo',
  '93bf73ff-2334-5241-b9a8-d3f46d66bbe1'::uuid,
  0.08,
  '1 huevo = ~0.08 docena',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '9f625bfa-7262-596e-a63a-00f95d2ba8bc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '79cd76bb-9213-5722-aa9f-9b34402e6104'::text,
  'Wantán Frito (12 u)',
  '27cb397d-be89-57f4-9b2d-379f9c73cabb'::uuid,
  1.0,
  '1 paquete = 12 wantanes',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'bccdb7c3-ecef-5d80-8d44-70e500414754'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '93878926-e2d1-51a2-817a-cda6d33c780a'::text,
  'Wantán Frito (12 u)',
  'e4c3c65f-721c-58be-a7e8-eaf6937a9928'::uuid,
  0.2,
  '200ml aceite',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '976e5d08-df15-5f18-be33-f92c61bfffac'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '3c19bf7a-8c35-57eb-99c7-a90d0a5474ad'::text,
  'Tallarín Saltado de Pollo',
  'b55a4e92-8abe-5564-9db5-8918c6a413dc'::uuid,
  1.0,
  '1 paquete por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '7f67d23b-0894-5eae-9daa-c246ef290d25'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '5bb16aa1-e67a-5467-9163-275f82408fc1'::text,
  'Tallarín Saltado de Pollo',
  '6995d238-09f7-5f59-8ed0-af9db1bb0633'::uuid,
  0.2,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '0df9cb00-3c3e-521b-a0be-131c12631a85'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'fefd0c1d-46ac-5840-ad5a-f144822ce947'::text,
  'Tallarín Saltado de Pollo',
  '578d85a6-609b-5b46-8a71-6b87bc785442'::uuid,
  0.04,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '4fe5d24f-4385-598b-9d2a-7015a27f26d2'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'f96bb644-dcc7-518d-b67a-af5a8c936467'::text,
  'Pollo Chi Jau Kay',
  '6995d238-09f7-5f59-8ed0-af9db1bb0633'::uuid,
  0.3,
  '300g pechuga',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '151c5391-a623-5159-8085-63b9e8fdb763'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '32683aea-8b73-5da8-8a44-03970dca01e3'::text,
  'Sopa Wantán',
  '27cb397d-be89-57f4-9b2d-379f9c73cabb'::uuid,
  0.5,
  '6 wantanes por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '0c75eb44-36e1-5975-b177-ca3f402b0ba0'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c7de170f-c7a4-5b4a-9cbc-78efe69b13a3'::text,
  'Inca Kola 1.5L',
  'c6cfcaf5-8ced-5192-ae6d-9ba1a09cdc26'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ► Comandas (orders + items)
-- Comanda #0101 (mesa 2, mozo: Luis Chong Sifuentes)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '5fc573f9-e5e3-5e15-a267-1e248fcbcc53'::uuid,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::uuid,
  '#0101',
  'entregada'::order_status,
  'mesa'::order_type,
  'Familia Tanaka',
  NULL,
  4,
  'Cliente frecuente',
  66.0,
  0,
  7.0,
  73.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NULL,
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '986dc6b3-7d9b-57b9-96f9-1cc74b027220'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'a71c38cf-027f-5b9d-afd2-b7e802930db9'::text,
  'Arroz Chaufa Especial',
  36.0,
  1,
  'Sin ajo',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'cf773111-7479-5c4f-9826-b4fda25b023a'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'dc1b7536-dce7-5d74-b129-1710ad3f2f97'::text,
  'Wantán Frito (12 u)',
  18.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'a13b4918-801f-53a1-a2d1-ecddb80a7d68'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  '27973dbe-a47d-552a-85eb-3c9a4d188e85'::text,
  'Inca Kola 1.5L',
  12.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '067ec4d4-8973-58ba-94d8-9208600960c8'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  NULL,
  'borrador'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '791b6382-2239-59bd-bcb2-e4b7d28d5763'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '852ee221-76f4-5503-a31e-150c41525439'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'ae98adb8-fa7e-52cb-8cfb-e21d670ebb8b'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '470d9a28-9a4a-591d-ac08-d4c64a1203d7'::uuid,
  '8e52522d-35a5-52e1-82c7-7785472dc3db'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0102 (mesa 4, mozo: Carmen Yip Sánchez)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '35b9861f-72bb-5203-bfa1-3b747e2956f0'::uuid,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::uuid,
  '#0102',
  'facturada'::order_status,
  'mesa'::order_type,
  'Sr. Wong',
  NULL,
  4,
  'Cumpleaños',
  94.0,
  0,
  9.0,
  103.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '3 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '9a412d9f-a694-5aef-89a4-e743d428f688'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  '5e9a6410-63f3-5de4-9ffa-f118181ae9e0'::text,
  'Sopa Wantán',
  16.0,
  2,
  'Extra cebollita',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '2e30a230-19f8-53bb-a034-c7a66dafae27'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  '9a5d9359-172e-5ae2-b135-253f0dd768e4'::text,
  'Pollo Chi Jau Kay',
  28.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5f0147f3-2ced-5368-804a-6813fd47449e'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  '3a537506-3ff3-5801-ab54-49caa3343899'::text,
  'Arroz Chaufa de Pollo',
  22.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5e03b9ce-d055-5b45-8617-2f2c4d0d7cbd'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  '4b1a0a5c-7f25-5593-b265-2f3d65e64051'::text,
  'Chicha Morada 1L',
  12.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '8fe489a4-be66-567f-a4e1-aab5f914a5bb'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  NULL,
  'borrador'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:11:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '135fd9f7-26f2-5408-ab35-0c4840050bd3'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'e9897321-3695-5424-9a5a-5af6a23f7c30'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '0e7fc864-53af-5d24-ab4d-b49b53dbe3a4'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c2f16558-760d-5e09-ac03-7e534d164a22'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'a079c2b8-2b54-5dda-be94-0f62b17405a7'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'entregada'::order_status,
  'facturada'::order_status,
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO voucher_prints (
  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at
) VALUES (
  '7c059a94-ad87-58ba-9328-fdd83bc8b90e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '3d52da49-b3f5-5357-a1a1-981878fae196'::uuid,
  'V-002002',
  '594786fd-2f72-56ac-a50f-a93d3c6e8ff4'::text,
  'pos_80mm',
  NULL,
  '2026-07-26T20:38:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0103 (mesa 6, mozo: Roberto Li Wong)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  '033fc6f9-23c5-510c-a123-ec63f4219229'::uuid,
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::uuid,
  '#0103',
  'lista'::order_status,
  'mesa'::order_type,
  'Familia Vargas',
  NULL,
  3,
  NULL,
  64.0,
  0,
  4.0,
  68.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NULL,
  NULL,
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'c1cce0fd-3546-5c4f-b7c7-d0460ffb4748'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  '3dad6b8c-af42-577e-8266-fb0484878dc0'::text,
  'Tallarín Saltado de Pollo',
  24.0,
  2,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'd474615f-0e25-5635-9095-e7c3b32fad6d'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  'e39f3e0e-689a-5d8b-9e57-f9e8702d3099'::text,
  'Sopa Wantán',
  16.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '055a3ce5-036f-570a-84f9-257fd3731780'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  NULL,
  'borrador'::order_status,
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'cc07dade-2510-50b7-9ec6-ba180f23c834'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'e7b6b62d-f2c9-5308-ad27-1747e430283b'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '69c2cd52-b437-5381-84a1-72be13f92aa9'::uuid,
  '7a535044-c1e8-58c4-a653-d6a9b855652f'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '88206aaa-1067-5f4c-8fe3-3627b7689405'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0104 (mesa 8, mozo: Patricia Vásquez Lam)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'a3b02be6-a7fa-5cea-a2e7-b6402a1edbe7'::uuid,
  'ef377757-e1d9-5108-924b-264cfcb632a6'::uuid,
  '#0104',
  'en_preparacion'::order_status,
  'mesa'::order_type,
  'Grupo de amigos',
  NULL,
  3,
  NULL,
  96.0,
  0,
  0,
  96.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'afa7599a-297d-5b86-b16e-3777aec29873'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  '1ccbc2ca-5af6-5eb7-9543-cadd1f1ce54f'::text,
  'Arroz Chaufa Especial',
  36.0,
  1,
  'Sin camarón',
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '77a2b130-2d6f-545b-b0c2-e91fed8d2972'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  'ca36e880-bbce-5d82-8a5b-b5332b2f245d'::text,
  'Tallarín Saltado de Camarón',
  34.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '22c9242b-6406-5bb8-a1f3-98c3d6402f75'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  '58cd84a3-2515-5ae4-b766-4c4f1487d6f2'::text,
  'Chijaukay de Pollo',
  26.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c3549382-d246-54a3-9cf6-54241dda065f'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  NULL,
  'borrador'::order_status,
  'ef377757-e1d9-5108-924b-264cfcb632a6'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '76783129-2777-5da3-a7a0-1c20a7cb3a48'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  'ef377757-e1d9-5108-924b-264cfcb632a6'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '29a5fb65-7ff7-54a5-8236-3d838bb492e9'::uuid,
  '872d8977-f807-551e-86f4-33006360e065'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  'ef377757-e1d9-5108-924b-264cfcb632a6'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0105 (mesa 10, mozo: Luis Chong Sifuentes)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '10db90ed-3e72-591b-b088-fdf3b0a45e07'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22ae3b5c-dbe8-52ad-b319-9c642da406b5'::uuid,
  'c2de29be-cc2e-5656-afc2-bf0ddc2e7a01'::uuid,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::uuid,
  '#0105',
  'enviada'::order_status,
  'mesa'::order_type,
  'Mesa privada — Sr. Li',
  NULL,
  4,
  'Reunión de negocios',
  104.0,
  0,
  0,
  104.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '4f8a78b6-f915-5526-90c0-baec1e8597da'::uuid,
  '10db90ed-3e72-591b-b088-fdf3b0a45e07'::uuid,
  '4d085282-b9ad-52bb-9d93-e18dcdcaa664'::text,
  'Combo Familiar: Pollo + Chaufa + Wantán',
  88.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'e104a2e2-0869-5875-99eb-038bfe237574'::uuid,
  '10db90ed-3e72-591b-b088-fdf3b0a45e07'::uuid,
  'a34d065d-3b9e-5a99-8c55-4805b9849b07'::text,
  'Té Chino',
  4.0,
  4,
  'Bien caliente',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'af5f0b23-97a6-5e59-baf2-b17d7573a638'::uuid,
  '10db90ed-3e72-591b-b088-fdf3b0a45e07'::uuid,
  NULL,
  'borrador'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '82c05a6e-1246-54bb-aa04-acca808fe3c1'::uuid,
  '10db90ed-3e72-591b-b088-fdf3b0a45e07'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '58612775-c880-5f8a-ab9c-c89c9ccf2a0e'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- RESTAURANTE 3: Pizzería Bella Napoli — Sucursal Miraflores
-- ════════════════════════════════════════════════════════════

-- ► Sucursal
INSERT INTO branches (
  id, owner_id, name, address, phone, is_active, created_at, updated_at
) VALUES (
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Pizzería Bella Napoli — Sucursal Miraflores',
  'Av. Larco 678, Miraflores, Lima',
  '+51 1 241-5566',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mesas
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'f9b834c0-7501-5a72-846e-77ba468276a3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  1,
  'Mesa 1',
  2,
  'libre'::table_status,
  'qr-table-pizzeria-001-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '3aace4fa-5881-5523-a2c5-21e8ee10bcdb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  2,
  'Mesa 2',
  2,
  'libre'::table_status,
  'qr-table-pizzeria-002-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '75ff4ce1-7dd9-5231-be95-d594c239f062'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  3,
  'Mesa 3',
  4,
  'libre'::table_status,
  'qr-table-pizzeria-003-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '94cd7c5b-622a-5e16-b679-93bd5edc882a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  4,
  'Mesa 4',
  4,
  'libre'::table_status,
  'qr-table-pizzeria-004-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '1069d74f-878f-5e08-ad8a-3479367746d5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  5,
  'Mesa 5',
  4,
  'reservada'::table_status,
  'qr-table-pizzeria-005-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '126e7328-7e73-5576-98ed-0994b337a28a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  6,
  'Mesa 6',
  4,
  'libre'::table_status,
  'qr-table-pizzeria-006-736434f8',
  'Salón Interior',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '17de545b-e4b9-5646-91c7-7d2175332d1b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  7,
  'Mesa 7',
  4,
  'libre'::table_status,
  'qr-table-pizzeria-007-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'b0e3327a-8587-5dc0-8cd5-73f37d20402d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  8,
  'Mesa 8',
  4,
  'libre'::table_status,
  'qr-table-pizzeria-008-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '1a843866-4b46-5fcc-9a03-d067b52fdb92'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  9,
  'Mesa 9',
  6,
  'libre'::table_status,
  'qr-table-pizzeria-009-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'a1fb6d85-3288-5624-9e1c-27a8125dbfc3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  10,
  'Mesa 10',
  6,
  'reservada'::table_status,
  'qr-table-pizzeria-010-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mozos
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Marco Rossi Bianchi',
  '33889911',
  '987 234 567',
  '1112',
  'waiter-pizzeria-0-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Sofía Linares Mendoza',
  '33990022',
  '987 345 678',
  '2223',
  'waiter-pizzeria-1-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Diego Marini Padilla',
  '34001133',
  '987 456 789',
  '3334',
  'waiter-pizzeria-2-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '6ce46e48-8960-542d-acc9-adbbdf25bf37'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Valeria Santoro Ríos',
  '34112244',
  '987 567 890',
  '4445',
  'waiter-pizzeria-3-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  'dc63c1b8-0b7a-5b35-986a-591a670be300'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Andrea Ferretti López',
  '34223355',
  '987 678 901',
  '5556',
  'waiter-pizzeria-4-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();

-- ► Inventario (insumos)
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'bacc18fb-691a-5d07-a563-939985d41c35'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Harina tipo 00',
  'HAR-001',
  'kg'::inventory_unit,
  50, 15, 100,
  4.5,
  'Importadora Italia',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '1f5aaa0e-3e22-5819-a9e0-1abd372392cf'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'bacc18fb-691a-5d07-a563-939985d41c35'::uuid,
  'entrada'::movement_type,
  50,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '81d0accc-2dfd-5cc3-8809-0f144bdd96d6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Mozarella fior di latte',
  'QUE-001',
  'kg'::inventory_unit,
  30, 10, 60,
  35.0,
  'Lácteos Peruanos',
  'Lácteos',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '6e305b6d-c4d1-5e80-a65f-2afdccf1bb7a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '81d0accc-2dfd-5cc3-8809-0f144bdd96d6'::uuid,
  'entrada'::movement_type,
  30,
  35.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '4cf7b7b4-515f-5dfa-8a0c-0a529635edea'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Queso parmesano',
  'QUE-002',
  'kg'::inventory_unit,
  10, 3, 20,
  65.0,
  'Importadora Italia',
  'Lácteos',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '274f9aa2-0970-5cbc-ac4e-349547fa1a40'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '4cf7b7b4-515f-5dfa-8a0c-0a529635edea'::uuid,
  'entrada'::movement_type,
  10,
  65.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '510dd337-07c4-55f7-b010-4f9428f0b3d4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Salsa de tomate San Marzano',
  'SAL-002',
  'kg'::inventory_unit,
  20, 5, 40,
  12.0,
  'Importadora Italia',
  'Salsas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '4ef512d8-662a-537f-b079-b6a4ddb3c510'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '510dd337-07c4-55f7-b010-4f9428f0b3d4'::uuid,
  'entrada'::movement_type,
  20,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '371cf9ff-1e28-5b2c-8c24-4c6093cc0f3a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Tomate fresco',
  'TOM-001',
  'kg'::inventory_unit,
  25, 10, 50,
  4.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '6e35dfa4-650e-5f02-9ab1-731e752e362e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '371cf9ff-1e28-5b2c-8c24-4c6093cc0f3a'::uuid,
  'entrada'::movement_type,
  25,
  4.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '7b717aef-e0c3-5799-ae02-fc117e636481'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Albahaca fresca',
  'ALB-001',
  'paquete'::inventory_unit,
  30, 10, 60,
  3.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '2532406c-2d18-5a6a-9785-05fd1351f998'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '7b717aef-e0c3-5799-ae02-fc117e636481'::uuid,
  'entrada'::movement_type,
  30,
  3.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '3909f060-e79d-59d3-b810-d519e5af14a4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Levadura seca',
  'LEV-001',
  'kg'::inventory_unit,
  8, 2, 15,
  25.0,
  'Importadora Italia',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '17899c3f-996d-511c-9f94-4a66239178b4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '3909f060-e79d-59d3-b810-d519e5af14a4'::uuid,
  'entrada'::movement_type,
  8,
  25.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '0a8c7470-8b88-57c8-8fef-341086e31e30'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Aceite de oliva virgen',
  'ACE-002',
  'litro'::inventory_unit,
  15, 5, 30,
  45.0,
  'Importadora Italia',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '05e1fc39-d3be-5b16-a7c8-007f6cc9276b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '0a8c7470-8b88-57c8-8fef-341086e31e30'::uuid,
  'entrada'::movement_type,
  15,
  45.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'f264e19e-8d67-56b0-9fe5-fd0e1a416368'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Pepperoni',
  'PEP-001',
  'kg'::inventory_unit,
  12, 4, 25,
  38.0,
  'Fricar Perú',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'facfae47-99ab-5759-b2bc-7fe2278ce89b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'f264e19e-8d67-56b0-9fe5-fd0e1a416368'::uuid,
  'entrada'::movement_type,
  12,
  38.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '5a670a73-8629-5f3d-876f-717cc12fc998'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Jamón italiano',
  'JAM-001',
  'kg'::inventory_unit,
  10, 3, 20,
  42.0,
  'Importadora Italia',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '49695925-b1b4-5485-8ac2-13d03658f47f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '5a670a73-8629-5f3d-876f-717cc12fc998'::uuid,
  'entrada'::movement_type,
  10,
  42.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'a72fedc8-2cce-5209-b00e-6cdfac6b3fcc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Champiñones frescos',
  'CHA-001',
  'kg'::inventory_unit,
  15, 5, 30,
  8.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '0ffe6ec9-5be0-5044-8500-949a46d6ca91'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'a72fedc8-2cce-5209-b00e-6cdfac6b3fcc'::uuid,
  'entrada'::movement_type,
  15,
  8.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '5812649d-810d-5d5f-9b1b-2cb692bf6c71'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Spaghetti seco',
  'PAS-001',
  'paquete'::inventory_unit,
  40, 10, 80,
  6.5,
  'Importadora Italia',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'c1e53ce9-175a-5cff-9df3-e86792bd7188'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '5812649d-810d-5d5f-9b1b-2cb692bf6c71'::uuid,
  'entrada'::movement_type,
  40,
  6.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '826887b8-8f10-52ea-9b0b-35b86b89175b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Vino tinto Sangiovese',
  'VIN-001',
  'unidad'::inventory_unit,
  36, 10, 60,
  28.0,
  'Importadora Italia',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'ff961e97-00da-5f53-ac8d-7b92c228d1c8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '826887b8-8f10-52ea-9b0b-35b86b89175b'::uuid,
  'entrada'::movement_type,
  36,
  28.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '237d1fb3-f78a-5cfd-b6c1-6fcc07dd4463'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'Espresso café',
  'CAF-001',
  'kg'::inventory_unit,
  8, 3, 20,
  45.0,
  'Cafetaleros Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'cb885688-4fd5-578d-8bf3-cd8a01219e95'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '237d1fb3-f78a-5cfd-b6c1-6fcc07dd4463'::uuid,
  'entrada'::movement_type,
  8,
  45.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ► Recetas (plato → insumos)
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'acfaccfc-5975-5561-bece-965f172dff99'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '4a20e6dd-7ba7-524c-a038-42d6b66614b8'::text,
  'Pizza Margherita',
  'bacc18fb-691a-5d07-a563-939985d41c35'::uuid,
  0.3,
  '300g masa',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '61cafd49-920a-5b1d-b352-40d8d2889de3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '46109286-3f81-5852-811d-5716e58cd004'::text,
  'Pizza Margherita',
  '81d0accc-2dfd-5cc3-8809-0f144bdd96d6'::uuid,
  0.15,
  '150g queso',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '083883a4-5cf3-51b9-a79d-65c6c3d430c6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'da4ee278-17ca-5a7a-93fc-dafbb634f7f3'::text,
  'Pizza Margherita',
  '510dd337-07c4-55f7-b010-4f9428f0b3d4'::uuid,
  0.1,
  '100g salsa',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '017c7007-10f7-578d-a525-c95ff48d1593'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c0d8e146-8db7-5456-9a4d-e8943ebf5c9f'::text,
  'Pizza Margherita',
  '7b717aef-e0c3-5799-ae02-fc117e636481'::uuid,
  0.05,
  '1 paquete por pizza',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '6a184b2d-68c3-5e9e-8db0-b6a5a9adda8c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'd52d113c-51ed-5ffb-b076-369871f39fdb'::text,
  'Pizza Margherita',
  '0a8c7470-8b88-57c8-8fef-341086e31e30'::uuid,
  0.02,
  '20ml aceite',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'aae0f966-fb37-53e8-b4a8-d9b4275f108e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'adff0c4f-1421-53b6-86d7-b7759181a930'::text,
  'Pizza Pepperoni',
  'bacc18fb-691a-5d07-a563-939985d41c35'::uuid,
  0.3,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'c4106e04-f5c0-5647-ade5-6fdb789b6ea5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '00f4059e-e3bd-5880-9abe-fb462cb7db47'::text,
  'Pizza Pepperoni',
  '81d0accc-2dfd-5cc3-8809-0f144bdd96d6'::uuid,
  0.2,
  '200g queso',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '62026709-583c-5ccb-9b38-08e2a7ec9159'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '40cb7c53-9550-583b-b7ed-c90cd96fdac8'::text,
  'Pizza Pepperoni',
  '510dd337-07c4-55f7-b010-4f9428f0b3d4'::uuid,
  0.1,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'b174384c-8013-5a85-be51-a8f662534327'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c8a1eeea-56b5-5a3c-99af-064ddd4d92ed'::text,
  'Pizza Pepperoni',
  'f264e19e-8d67-56b0-9fe5-fd0e1a416368'::uuid,
  0.1,
  '100g pepperoni',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'e795e4e2-fb97-503b-8139-26f9e52172f1'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'fe0f37b6-063e-5a49-98f9-a2b963c4747f'::text,
  'Spaghetti Bolognesa',
  '5812649d-810d-5d5f-9b1b-2cb692bf6c71'::uuid,
  1.0,
  '1 paquete',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '24c469ab-1398-5b87-8611-d630c0d85c77'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '002fa18b-3077-57de-8f8f-291f640b4cc1'::text,
  'Spaghetti Bolognesa',
  '510dd337-07c4-55f7-b010-4f9428f0b3d4'::uuid,
  0.2,
  '200g salsa',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '6efbbec2-512a-5d1f-828d-83fc906431df'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '77d921ea-e484-54a3-9896-7123dafb5fe2'::text,
  'Tiramisú',
  '81d0accc-2dfd-5cc3-8809-0f144bdd96d6'::uuid,
  0.05,
  '50g mascarpone aprox',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '59682b1c-bf1b-5e7b-b4e0-7d16fe1e8378'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '35483758-4f3c-5423-a349-842ce326f740'::text,
  'Espresso',
  '237d1fb3-f78a-5cfd-b6c1-6fcc07dd4463'::uuid,
  0.018,
  '18g café por espresso',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'e43f3bd8-77d5-5c89-8b1a-4488b149d99c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '0d26c759-518a-538a-a787-e1f09b0dbc73'::text,
  'Vino Tinto Copa',
  '826887b8-8f10-52ea-9b0b-35b86b89175b'::uuid,
  0.5,
  'Media botella',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ► Comandas (orders + items)
-- Comanda #0201 (mesa 1, mozo: Marco Rossi Bianchi)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  'f9b834c0-7501-5a72-846e-77ba468276a3'::uuid,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::uuid,
  '#0201',
  'entregada'::order_status,
  'mesa'::order_type,
  'Pareja aniversario',
  NULL,
  2,
  'Cena romántica',
  84.0,
  0,
  8.0,
  92.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NULL,
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1785ea18-9861-524d-b0fa-ec72e95de112'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  '3590ad24-1359-5f9b-80d6-bf949996679a'::text,
  'Pizza Margherita',
  38.0,
  1,
  'Extra albahaca',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'c5140576-5087-573d-a2cb-5f3628c805e1'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  'c754bb87-26fb-53b4-8565-1434fe219924'::text,
  'Bruschetta Classica',
  18.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '6ad3e8b7-a634-5c89-ab41-8215ee75f534'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  '273e456c-f1f2-548a-a815-a12927b8533d'::text,
  'Vino Tinto Copa',
  14.0,
  2,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '4f12a243-ea2c-57d3-8be5-f7625a46ebed'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  NULL,
  'borrador'::order_status,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '740d8448-31c6-533a-8e67-28411c9fe35b'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'ea5c3909-4c18-56bc-bed3-90c62d763b09'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '43b1916d-343f-5532-9340-9ec3d0a5c4de'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'dd05c167-ba7e-5a40-938d-0325ba2ac527'::uuid,
  'e6d0374d-cd5b-5dbf-9aeb-8badf7a66ea7'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '82f8258e-2aef-5d4c-b236-8f76a2fd6815'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0202 (mesa 3, mozo: Sofía Linares Mendoza)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '75ff4ce1-7dd9-5231-be95-d594c239f062'::uuid,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::uuid,
  '#0202',
  'facturada'::order_status,
  'mesa'::order_type,
  'Familia Fernández',
  NULL,
  4,
  NULL,
  158.0,
  0,
  12.0,
  170.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '3 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'be8bf634-b3d6-584d-9a2d-791501869457'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'b9a14b4f-02bd-5538-8682-f31b34228bef'::text,
  'Pizza Pepperoni',
  44.0,
  2,
  'Una mitad sin pepperoni',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1c3107ca-1e68-5e93-8ad9-9548e431e867'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'bfab26d4-5cd3-55c5-b3f7-ae1c5ad7df0f'::text,
  'Garlic Bread',
  14.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '7987584e-cdfd-5480-bf1c-2c2788ffa4d5'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'cb0598f4-f927-5ea8-a1f0-0f6f8daa1d64'::text,
  'Coca Cola 500ml',
  5.0,
  4,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'f4fa5f79-7b92-5316-9609-0bebbe5f4fa1'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  '996d8a9d-0837-53b8-8ade-99326bc37e57'::text,
  'Tiramisú',
  18.0,
  2,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c786e3d8-b785-53b3-9739-79cc7c6c498e'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  NULL,
  'borrador'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:11:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd22bf83b-6490-51f3-b4c0-a5c27126aa4c'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '5d9d9ea9-8bf8-599b-af3f-6ae2ac444b82'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '741f3aa2-9e83-5707-a4fc-b48cad83d038'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'b1de175b-61d5-5e70-a1fc-71b7c9c906b4'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '0c46304a-c3f9-5228-a9df-ef6d69db0c37'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'entregada'::order_status,
  'facturada'::order_status,
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO voucher_prints (
  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at
) VALUES (
  '462adcdf-e2a6-5a77-a064-ec1834cdb016'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '176e7a7b-b0a8-55f2-b255-7164f430b70b'::uuid,
  'V-003002',
  '7b74153f-2aa3-533d-bcd3-478fb27b9749'::text,
  'pos_80mm',
  NULL,
  '2026-07-26T20:38:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0203 (mesa 5, mozo: Diego Marini Padilla)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '1069d74f-878f-5e08-ad8a-3479367746d5'::uuid,
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::uuid,
  '#0203',
  'lista'::order_status,
  'mesa'::order_type,
  'Mesa de negocios',
  NULL,
  2,
  'Cuenta empresa',
  84.0,
  0,
  5.0,
  89.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NULL,
  NULL,
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '28885a65-7137-59d6-a12f-8110ea2dad61'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  '9e6f4a01-3bc9-5ea8-b977-472d9799b713'::text,
  'Pizza Quattro Formaggi',
  48.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'b1943885-a708-538d-8319-3dc20bad38c6'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  'ab59d17b-81e3-51d4-9ae0-49f4cee9cc8e'::text,
  'Caprese',
  24.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'e1f90ca7-bb1e-50af-b312-b9c7864d9b6a'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  'fd2bc966-85d8-5d36-92ff-80455fa3b9b5'::text,
  'Espresso',
  6.0,
  2,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'e6d55cb8-6c27-522f-bce9-68b50a05c77f'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  NULL,
  'borrador'::order_status,
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '8dc3f713-8883-5513-b6e7-52139598bb31'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'ece2c08d-b26e-55f3-a113-16663aeba5b7'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '3c41a97e-c645-5e72-b3ac-e85c54f14100'::uuid,
  'be57704f-d9d1-5cd2-9909-10c2353d93f4'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '6c7779ca-35d5-5454-b93c-5bf360a4a176'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0204 (mesa 7, mozo: Valeria Santoro Ríos)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '17de545b-e4b9-5646-91c7-7d2175332d1b'::uuid,
  '6ce46e48-8960-542d-acc9-adbbdf25bf37'::uuid,
  '#0204',
  'en_preparacion'::order_status,
  'mesa'::order_type,
  'Grupo amigos',
  NULL,
  3,
  NULL,
  156.0,
  0,
  0,
  156.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5920b0a9-25ae-5bb6-b27e-c4bd44c8b56c'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  '311730d5-ec9d-5a59-a073-4b8e821abe07'::text,
  'Lasagna Bolognesa',
  38.0,
  2,
  'Una vegetariana si es posible',
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'ac094903-8c38-5282-80ff-66bb9cd2b24c'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  'bfc58a21-2a5c-560c-9c89-5ba1fd0cc2c4'::text,
  'Antipasto Italiano',
  38.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1adcd045-de7d-5a63-b590-7772101327d2'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  'c522dabe-5416-5209-86ad-af831469d418'::text,
  'Vino Tinto Copa',
  14.0,
  3,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '35eb5f5b-30d8-51fd-a16d-28ce2d2ea0fb'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  NULL,
  'borrador'::order_status,
  '6ce46e48-8960-542d-acc9-adbbdf25bf37'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '092971cc-17d3-5e34-87ab-335591c1a817'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '6ce46e48-8960-542d-acc9-adbbdf25bf37'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '9d79e385-9d92-5703-8203-d27ee7b62c19'::uuid,
  'e43bdca0-494c-53ab-a2a2-36ed550c9bd8'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '6ce46e48-8960-542d-acc9-adbbdf25bf37'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0205 (mesa 9, mozo: Andrea Ferretti López)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf5c99fb-5924-50c5-b017-8d88293d9c14'::uuid,
  '1a843866-4b46-5fcc-9a03-d067b52fdb92'::uuid,
  'dc63c1b8-0b7a-5b35-986a-591a670be300'::uuid,
  '#0205',
  'enviada'::order_status,
  'mesa'::order_type,
  'Cita romántica',
  NULL,
  2,
  NULL,
  106.0,
  0,
  0,
  106.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '2e9f0d1d-b3a6-5650-bbe6-fd82fb394919'::uuid,
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  'e38c5f9c-5333-5f0e-8c7e-5d349f892702'::text,
  'Pizza Diavola',
  46.0,
  1,
  'Extra picante',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'a225dc32-e7a2-5bda-8159-93a3bb3f57d4'::uuid,
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  '134a0580-0fee-5758-b2a3-1d7c76e15272'::text,
  'Calamari Fritti',
  28.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5cd1394b-a6c3-517c-908b-d761da4d143a'::uuid,
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  'f0d6188a-238f-5809-8ccb-9bbcad3a577d'::text,
  'Panna Cotta',
  16.0,
  2,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '8316975e-9c9f-5cb1-a418-763e4b0b33f3'::uuid,
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  NULL,
  'borrador'::order_status,
  'dc63c1b8-0b7a-5b35-986a-591a670be300'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '42dcd18e-0a6c-5c6c-a517-122a192b670d'::uuid,
  'f46daaeb-9d3d-5ceb-a0f7-ac8dac6ed3d4'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  'dc63c1b8-0b7a-5b35-986a-591a670be300'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- RESTAURANTE 4: Smash Brothers Burger House — Sucursal Barranco
-- ════════════════════════════════════════════════════════════

-- ► Sucursal
INSERT INTO branches (
  id, owner_id, name, address, phone, is_active, created_at, updated_at
) VALUES (
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Smash Brothers Burger House — Sucursal Barranco',
  'Av. Grau 432, Barranco, Lima',
  '+51 1 256-7788',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mesas
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'ab391fd5-3bea-59d8-a1a9-6701245e4bc8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  1,
  'Mesa 1',
  2,
  'libre'::table_status,
  'qr-table-burgers-001-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '94366ade-eb6e-5885-a4c1-ccfd5f757d8b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  2,
  'Mesa 2',
  2,
  'libre'::table_status,
  'qr-table-burgers-002-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '4cefc299-8b49-5656-9108-fd429e8a010c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  3,
  'Mesa 3',
  2,
  'libre'::table_status,
  'qr-table-burgers-003-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'e43ddbb8-7c8b-5f29-b1a7-cfea41a71b88'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  4,
  'Mesa 4',
  2,
  'libre'::table_status,
  'qr-table-burgers-004-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '65c2b9f3-516b-53c3-bd56-12062cef46da'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  5,
  'Mesa 5',
  2,
  'reservada'::table_status,
  'qr-table-burgers-005-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'fab82760-1dab-5104-8f3c-929c7751ca00'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  6,
  'Mesa 6',
  2,
  'libre'::table_status,
  'qr-table-burgers-006-736434f8',
  'Barra',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '59517e8d-a54e-53bd-954a-277fcb153e83'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  7,
  'Mesa 7',
  4,
  'libre'::table_status,
  'qr-table-burgers-007-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'a47c5845-4c9a-5e89-a53c-1e394e061c8f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  8,
  'Mesa 8',
  4,
  'libre'::table_status,
  'qr-table-burgers-008-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'b8bade8e-0b56-50ee-b73d-caaf8c7ee412'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  9,
  'Mesa 9',
  4,
  'libre'::table_status,
  'qr-table-burgers-009-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'c5d6d30f-db40-59eb-b44a-988e65e636a7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  10,
  'Mesa 10',
  4,
  'reservada'::table_status,
  'qr-table-burgers-010-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '757b2719-0631-5334-b88c-bac08ac80fa5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  11,
  'Mesa 11',
  6,
  'libre'::table_status,
  'qr-table-burgers-011-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '155cef94-8276-5184-a779-12973acd6455'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  12,
  'Mesa 12',
  6,
  'libre'::table_status,
  'qr-table-burgers-012-736434f8',
  'Salón',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '021eba99-23a4-5947-9aea-ac42d61baa84'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  13,
  'Mesa 13',
  4,
  'libre'::table_status,
  'qr-table-burgers-013-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '4f6e7c5c-1990-5f88-9857-7ea6499a1707'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  14,
  'Mesa 14',
  4,
  'libre'::table_status,
  'qr-table-burgers-014-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '8f41e5c6-8fa1-5f2f-a00c-b16a47f0d1c8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  15,
  'Mesa 15',
  6,
  'libre'::table_status,
  'qr-table-burgers-015-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mozos
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Diego Padilla Rojas',
  '44556677',
  '987 111 333',
  '1212',
  'waiter-burgers-0-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Camila Torres Vega',
  '44667788',
  '987 222 444',
  '2323',
  'waiter-burgers-1-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Sebastián Mendoza Yui',
  '44778899',
  '987 333 555',
  '3434',
  'waiter-burgers-2-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '4d54136e-4fe0-549d-b0a7-e08c3878d08e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Andrea Quispe Salazar',
  '44889900',
  '987 444 666',
  '4545',
  'waiter-burgers-3-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();

-- ► Inventario (insumos)
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Carne molida de res (smash)',
  'CAR-002',
  'kg'::inventory_unit,
  40, 15, 80,
  22.0,
  'Fricar Perú',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '49def44e-cc2c-56d0-be8f-25fcd7c71d97'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  'entrada'::movement_type,
  40,
  22.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'fd6e41e9-f9f1-57f6-824e-4e100b4181bb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Pan brioche',
  'PAN-001',
  'unidad'::inventory_unit,
  200, 50, 400,
  1.2,
  'Panadería Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'e84d3af5-57d4-5ea0-b1bd-d3447cad81e3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'fd6e41e9-f9f1-57f6-824e-4e100b4181bb'::uuid,
  'entrada'::movement_type,
  200,
  1.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '9e480209-56bd-5b4b-b100-7e10889061d6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Cheddar americano',
  'QUE-003',
  'kg'::inventory_unit,
  12, 4, 25,
  32.0,
  'Lácteos Peruanos',
  'Lácteos',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '2e63f3c1-d560-50e3-aef4-7fd8ac86e246'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '9e480209-56bd-5b4b-b100-7e10889061d6'::uuid,
  'entrada'::movement_type,
  12,
  32.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '46865675-4b9d-58ee-9a92-78556ffb793d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Tocino ahumado',
  'TOC-001',
  'kg'::inventory_unit,
  10, 3, 20,
  28.0,
  'Fricar Perú',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '642bc8f5-a768-5b76-9894-c9c6d513fd1a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '46865675-4b9d-58ee-9a92-78556ffb793d'::uuid,
  'entrada'::movement_type,
  10,
  28.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'df7f053a-8b77-5442-875f-3af7b0e55d4d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Lechuga romana',
  'LEC-001',
  'kg'::inventory_unit,
  8, 3, 15,
  4.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'f4a397d4-aa70-5ab8-a0b8-7e3899da5a96'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'df7f053a-8b77-5442-875f-3af7b0e55d4d'::uuid,
  'entrada'::movement_type,
  8,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '6ea5f785-51f4-5032-b4d7-f46b6859f47b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Tomate fresco',
  'TOM-001',
  'kg'::inventory_unit,
  12, 4, 25,
  4.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '95245a57-3ad2-5344-b57d-5d3f534c4401'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '6ea5f785-51f4-5032-b4d7-f46b6859f47b'::uuid,
  'entrada'::movement_type,
  12,
  4.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '005e14ba-41f7-505c-8616-8e174b016fa2'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Cebolla blanca',
  'CEB-002',
  'kg'::inventory_unit,
  15, 5, 30,
  2.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '1a6ae1eb-c95a-5d99-b59d-1a44ca523222'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '005e14ba-41f7-505c-8616-8e174b016fa2'::uuid,
  'entrada'::movement_type,
  15,
  2.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '83b560ee-4c6a-50ea-85bb-7d5545a1f140'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Papa blanca',
  'PAP-002',
  'kg'::inventory_unit,
  60, 20, 120,
  3.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '7d3174e2-7aec-5f1e-aa37-fb79903e6e91'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '83b560ee-4c6a-50ea-85bb-7d5545a1f140'::uuid,
  'entrada'::movement_type,
  60,
  3.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '8aef59a3-9470-596d-bd31-853d5005f15f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Salsa thousand',
  'SAL-003',
  'litro'::inventory_unit,
  8, 3, 15,
  15.0,
  'Distribuidora Lima',
  'Salsas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'eb7e0b94-bf2c-5e56-a96f-b06d644d131e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '8aef59a3-9470-596d-bd31-853d5005f15f'::uuid,
  'entrada'::movement_type,
  8,
  15.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'e0309fd6-ffcb-5857-9d65-bd34d7b2d6a1'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Salsa BBQ',
  'SAL-004',
  'litro'::inventory_unit,
  6, 2, 12,
  18.0,
  'Distribuidora Lima',
  'Salsas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '4c339641-0789-564a-a4c0-d52519988c31'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'e0309fd6-ffcb-5857-9d65-bd34d7b2d6a1'::uuid,
  'entrada'::movement_type,
  6,
  18.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '747ce341-8d37-5093-8678-c9b88005ce95'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Coca Cola 500ml',
  'BEB-002',
  'unidad'::inventory_unit,
  120, 30, 240,
  2.2,
  'Coca Cola Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '52318363-823b-5dda-b0cc-6ddf8c2a6378'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '747ce341-8d37-5093-8678-c9b88005ce95'::uuid,
  'entrada'::movement_type,
  120,
  2.2,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '62789f0d-e3be-52e7-8937-9d8d06920c3d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Leche entera',
  'LEC-002',
  'litro'::inventory_unit,
  15, 5, 30,
  4.5,
  'Lácteos Peruanos',
  'Lácteos',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '1fa72e5f-c0f1-5770-909e-0e7dea8dcd9d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '62789f0d-e3be-52e7-8937-9d8d06920c3d'::uuid,
  'entrada'::movement_type,
  15,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '778576cb-9dda-5729-9aff-c4053875cea6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'Helado de vainilla',
  'HEL-001',
  'kg'::inventory_unit,
  10, 3, 20,
  18.0,
  'Heladería Lima',
  'Postres',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '89df9789-44d3-5a75-b0bb-1d944eda3784'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '778576cb-9dda-5729-9aff-c4053875cea6'::uuid,
  'entrada'::movement_type,
  10,
  18.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ► Recetas (plato → insumos)
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '63bfff91-2dbe-5a85-bf02-975096fd2a79'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '1bea8436-ddde-5fba-8df7-469db524c1d0'::text,
  'Single Smash',
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  0.09,
  '90g por burger',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd8ec888c-25c0-5b47-8b4c-0b66ba0bf615'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'c5339513-939b-50d9-91a6-be9059cd6269'::text,
  'Single Smash',
  'fd6e41e9-f9f1-57f6-824e-4e100b4181bb'::uuid,
  1.0,
  '1 pan por burger',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '208aaa3c-d897-57ce-bb03-517718ccf2b7'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '5d4bce08-29ee-5dac-b965-d5b9a389b21d'::text,
  'Single Smash',
  '9e480209-56bd-5b4b-b100-7e10889061d6'::uuid,
  0.02,
  '20g queso',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'c2e9cd1e-1e5c-539a-ae06-f072b9f1f380'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'b9791f09-62f8-5b90-91cc-da5c9aef963c'::text,
  'Single Smash',
  '83b560ee-4c6a-50ea-85bb-7d5545a1f140'::uuid,
  0.2,
  '200g papas fritas',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'c870cf3e-6e92-580a-82d6-87786a08f420'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'b8f40801-fb1c-51fc-9f4a-117585539bae'::text,
  'Double Smash',
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  0.18,
  '2x 90g',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'f8705ea6-daf5-5867-82b6-169d8bfb384d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'f7583244-8f5b-5aee-ac4e-3b110e117c6b'::text,
  'Double Smash',
  'fd6e41e9-f9f1-57f6-824e-4e100b4181bb'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '07291b98-2a05-5f8a-93fe-2e2cb63d20cf'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '5bd567e3-2835-5ce9-ade9-c57d5f135ed2'::text,
  'Double Smash',
  '9e480209-56bd-5b4b-b100-7e10889061d6'::uuid,
  0.04,
  '2x 20g',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'a38028fb-b319-5880-bc0a-4a320e049810'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '7bd698f0-f3df-5f75-b16a-b47d283d68d4'::text,
  'Bacon Smash',
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  0.18,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'b2bdce32-0254-562d-9509-d827f02cb2f5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '24af7447-c59f-55a9-aff4-6ee60e39da0b'::text,
  'Bacon Smash',
  '46865675-4b9d-58ee-9a92-78556ffb793d'::uuid,
  0.05,
  '50g tocino (3 tiras)',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'fd1c54b1-ad65-58f1-9019-c48f48a794ff'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '9dc03a92-642a-51ac-bc23-e3193b3f6576'::text,
  'Bacon Smash',
  'e0309fd6-ffcb-5857-9d65-bd34d7b2d6a1'::uuid,
  0.03,
  '30ml BBQ',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'e586724e-bcd5-50b8-89d1-7ca1ffdf417a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '596aafe9-30d8-5096-896f-5cf039f4a92e'::text,
  'Papas Fritas',
  '83b560ee-4c6a-50ea-85bb-7d5545a1f140'::uuid,
  0.2,
  '200g papas',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '1dac1734-f65c-5591-b8b9-d11a888752d6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '08c299f3-7ed9-577b-8901-1892dbeab0c6'::text,
  'Milkshake Clásico',
  '62789f0d-e3be-52e7-8937-9d8d06920c3d'::uuid,
  0.2,
  '200ml leche',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'cd357585-3744-54bd-bf4f-c1faaaebbb84'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '58ac3d01-9465-5f1c-add0-c6270a4f9246'::text,
  'Milkshake Clásico',
  '778576cb-9dda-5729-9aff-c4053875cea6'::uuid,
  0.1,
  '100g helado',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'a623a218-3cc4-5b94-aecc-a21013b76014'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'd57e2707-326a-5b07-9057-259cabf205e9'::text,
  'Combo Smash Brothers',
  '29b1bdac-d4ef-54ed-9f79-eda695622937'::uuid,
  0.18,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '2ef4ceb2-e6a1-56fc-90ee-f65f4673c1b3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '359d9013-da29-5ed1-bdec-1b91c81f452a'::text,
  'Combo Smash Brothers',
  'fd6e41e9-f9f1-57f6-824e-4e100b4181bb'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd2ba7a4e-0881-5379-a95e-8f0e0095e52d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'd03b1cac-95e6-503c-b716-1376b923a484'::text,
  'Combo Smash Brothers',
  '83b560ee-4c6a-50ea-85bb-7d5545a1f140'::uuid,
  0.2,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '7f744bc8-2ac2-5d6d-9e85-fa4a7a8714cb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '6c8607d7-76da-56e9-8ab4-f430ea14b0ed'::text,
  'Combo Smash Brothers',
  '747ce341-8d37-5093-8678-c9b88005ce95'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ► Comandas (orders + items)
-- Comanda #0301 (mesa 2, mozo: Diego Padilla Rojas)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '94366ade-eb6e-5885-a4c1-ccfd5f757d8b'::uuid,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::uuid,
  '#0301',
  'entregada'::order_status,
  'mesa'::order_type,
  'Cliente solo',
  NULL,
  1,
  'Para llevar originalmente, comió in situ',
  49.0,
  0,
  3.0,
  52.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NULL,
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'adea2c8a-b83b-53af-b3ef-8530c13ecaf2'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  '77e0e33b-787a-5edb-8203-b319b1b8992a'::text,
  'Double Smash',
  26.0,
  1,
  'Extra queso',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '23f4b0c9-d802-5b0c-acbb-a1efe367b0e6'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  '674ca581-53ff-5cf6-8e7c-b6670362ca2d'::text,
  'Papas con Cheddar y Tocino',
  18.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'a09e55c6-b661-558d-b478-0e00cf766714'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  'b7b56e40-4159-5d5a-b4e1-f78c5e1ae515'::text,
  'Coca Cola 500ml',
  5.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '05da4ae8-d37a-536d-862d-35828b47ff3d'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  NULL,
  'borrador'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'b62e1425-eec7-531f-b74d-cd145e196bd9'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'cff92b0d-741b-568a-a15f-b769f66937f8'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '866749f5-dfdb-557e-81cb-499b052a84b3'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '8a07df3b-0119-5b5f-82b7-b5081bf3d3be'::uuid,
  '734b776e-0f5a-5add-a1f2-437ae3ff67dc'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0302 (mesa 4, mozo: Camila Torres Vega)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'e43ddbb8-7c8b-5f29-b1a7-cfea41a71b88'::uuid,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::uuid,
  '#0302',
  'facturada'::order_status,
  'mesa'::order_type,
  'Familia Ramírez',
  NULL,
  4,
  NULL,
  122.0,
  0,
  12.0,
  134.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '3 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '992f16b2-3615-59eb-9c2f-cbf2dd339282'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'dc81a7b7-8df0-588d-8e1d-2491ec3f6256'::text,
  'Combo Familiar 4 personas',
  110.0,
  1,
  '2 classic + 2 bacon smash',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '79b32c5c-6371-524a-a00c-6eb494ad37b1'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  '8f41b280-e949-51f9-8723-204b86488724'::text,
  'Aros de Cebolla',
  12.0,
  1,
  'Extra salsa',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '32503dbb-ff3b-5dd9-88d4-43c9673e5eb5'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  NULL,
  'borrador'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:11:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'b7407972-0ae5-544f-93d3-ecd7a022e2b9'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'a85b247f-f432-5f29-8482-5835581ac3dc'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '9a6a1593-82ed-5c82-9e25-431dccd14a20'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '885b0577-9815-5364-8c07-aca5f4b9d41d'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '9bda16b4-8809-5e73-b427-2da1f6fe2c2e'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'entregada'::order_status,
  'facturada'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO voucher_prints (
  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at
) VALUES (
  '5ed8c832-d211-527a-a53f-09085316fa5f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '10fea125-5a28-5410-965a-af75a5f26819'::uuid,
  'V-004002',
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  'pos_80mm',
  NULL,
  '2026-07-26T20:38:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0303 (mesa 6, mozo: Sebastián Mendoza Yui)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'fab82760-1dab-5104-8f3c-929c7751ca00'::uuid,
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::uuid,
  '#0303',
  'lista'::order_status,
  'mesa'::order_type,
  'Pareja jóvenes',
  NULL,
  2,
  NULL,
  84.0,
  0,
  5.0,
  89.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NULL,
  NULL,
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'ccb4b3fa-e715-5868-8ae5-82a925246a58'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  '27eada3c-a374-5bcd-9305-401f1451a9cf'::text,
  'Triple Smash',
  34.0,
  1,
  'Sin cebolla',
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '4bacd86b-293b-5770-a54e-ccfcda8d73c4'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  '58f6d4b4-79be-5356-994f-f863d4f192f4'::text,
  'Classic Cheeseburger',
  22.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '95246f92-56bf-5b8b-b78e-5e3f2b4612e8'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  'af4bec23-bed3-505f-971a-6fa8858e8ac4'::text,
  'Milkshake Clásico',
  14.0,
  2,
  '1 vainilla, 1 chocolate',
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'f4c39e0b-d5be-55c2-8988-d0b6a90bd227'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  NULL,
  'borrador'::order_status,
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'db0af15a-d3c7-5af5-a99b-7e95eac10b32'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'ca67ab55-4522-5916-b806-e484cd6373ea'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '00cb007b-5359-53d0-80f8-93bc2bc7857c'::uuid,
  'c6fb6a95-3a43-5906-8ca8-e0844638ea17'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '1f560297-94c5-55c1-a9e7-b3a3e53390d1'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0304 (mesa 8, mozo: Andrea Quispe Salazar)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'a47c5845-4c9a-5e89-a53c-1e394e061c8f'::uuid,
  '4d54136e-4fe0-549d-b0a7-e08c3878d08e'::uuid,
  '#0304',
  'en_preparacion'::order_status,
  'mesa'::order_type,
  'Grupo universitarios',
  NULL,
  4,
  NULL,
  92.0,
  0,
  0,
  92.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'fe19027c-fe99-5b60-8801-3bf915be1dcd'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  '88555108-c6ea-50e9-90ec-a3735a6ed2a6'::text,
  'Spicy Mexican',
  28.0,
  2,
  'Extra jalapeños',
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '7b029f44-d2a1-52e6-880c-6a0035dc2e29'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  '7a4f3412-c4e0-5e64-84ee-a348ee7d2793'::text,
  'Papas Gajo',
  12.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5a3641ea-2f1e-5b8d-bf86-527ea1500165'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  'd7297043-08cd-5157-a8f3-cbb246cd4cf4'::text,
  'Cerveza Artesanal',
  12.0,
  2,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '7e56f5d8-4119-527a-bb81-9a29e570f8d2'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  NULL,
  'borrador'::order_status,
  '4d54136e-4fe0-549d-b0a7-e08c3878d08e'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'f0c5ee80-2711-5b96-aafc-246039667352'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '4d54136e-4fe0-549d-b0a7-e08c3878d08e'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '944fcfdd-d80b-5257-889a-6695b2cd7ea6'::uuid,
  '05a31e87-7163-5b69-8025-7d6715f4e4d6'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '4d54136e-4fe0-549d-b0a7-e08c3878d08e'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0305 (mesa 10, mozo: Diego Padilla Rojas)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '98ced035-8398-5818-acf5-016a605654c0'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  'c5d6d30f-db40-59eb-b44a-988e65e636a7'::uuid,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::uuid,
  '#0305',
  'enviada'::order_status,
  'mesa'::order_type,
  'Pareja',
  NULL,
  2,
  'Cita casual',
  66.0,
  0,
  0,
  66.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '29413679-d2cb-59c7-974c-79164dc51700'::uuid,
  '98ced035-8398-5818-acf5-016a605654c0'::uuid,
  'd1c82cc5-ebed-5fd6-bcac-9ba721aca25c'::text,
  'Combo Smash Brothers',
  36.0,
  1,
  'Carne bien hecha',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'e2357c41-ae27-50f9-8053-d6cff24d5bbe'::uuid,
  '98ced035-8398-5818-acf5-016a605654c0'::uuid,
  '48860614-a812-589b-a63a-7c7fbf5a8e6c'::text,
  'Combo Clásico',
  30.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '16d96ea3-fbb2-5c81-b802-ae841060cbb2'::uuid,
  '98ced035-8398-5818-acf5-016a605654c0'::uuid,
  NULL,
  'borrador'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c81eb90e-e275-5cf1-aa13-364cf1892f64'::uuid,
  '98ced035-8398-5818-acf5-016a605654c0'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  'f62fce08-bdf0-5dfb-99a6-1606b625c09f'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0306 (mesa 12, mozo: Camila Torres Vega)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'a5c90915-92bd-5d8f-9e22-b2ca96b45d41'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'bffba6bb-78d0-51f6-a33b-89ca266175a8'::uuid,
  '155cef94-8276-5184-a779-12973acd6455'::uuid,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::uuid,
  '#0306',
  'borrador'::order_status,
  'mesa'::order_type,
  NULL,
  NULL,
  2,
  NULL,
  54.0,
  0,
  0,
  54.0,
  'S/',
  NULL,
  NULL,
  NULL,
  NULL,
  '2026-07-26T18:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '3439d30e-f93f-59e4-a9c2-2bd0a5066729'::uuid,
  'a5c90915-92bd-5d8f-9e22-b2ca96b45d41'::uuid,
  'fc5412ec-1979-547d-9f9c-e7596a97ea3e'::text,
  'Bacon Smash',
  30.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'abcec099-18c7-5d85-9bca-54e084764e01'::uuid,
  'a5c90915-92bd-5d8f-9e22-b2ca96b45d41'::uuid,
  '36b11f66-808d-5f0e-8b03-dbb50c83739f'::text,
  'Crispy Chicken',
  24.0,
  1,
  'Sin mayo',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '473b8cf9-b4cd-5d68-8ea7-906a7b665de1'::uuid,
  'a5c90915-92bd-5d8f-9e22-b2ca96b45d41'::uuid,
  NULL,
  'borrador'::order_status,
  '2fc50f50-04ff-573a-b7ef-83d48071f3e4'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- RESTAURANTE 5: La Mar Cevichería — Sucursal San Isidro
-- ════════════════════════════════════════════════════════════

-- ► Sucursal
INSERT INTO branches (
  id, owner_id, name, address, phone, is_active, created_at, updated_at
) VALUES (
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'La Mar Cevichería — Sucursal San Isidro',
  'Av. La Mar 767, San Isidro, Lima',
  '+51 1 421-3344',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mesas
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '608d42f8-565e-5027-aa3f-3ec19ca44b30'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  1,
  'Mesa 1',
  2,
  'libre'::table_status,
  'qr-table-cevicheria-001-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '1f2ea880-1ea1-5c59-a961-dda56f2eca73'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  2,
  'Mesa 2',
  4,
  'libre'::table_status,
  'qr-table-cevicheria-002-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '62422473-bd82-53c8-a56f-9e61a4f31037'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  3,
  'Mesa 3',
  4,
  'libre'::table_status,
  'qr-table-cevicheria-003-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '322f6bc2-f77e-5d1c-918d-2b47b5bc2ba9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  4,
  'Mesa 4',
  4,
  'libre'::table_status,
  'qr-table-cevicheria-004-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'f2d8f2b7-ded8-51e1-bcf7-226f52574506'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  5,
  'Mesa 5',
  4,
  'reservada'::table_status,
  'qr-table-cevicheria-005-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'bf9e97e0-b522-51a6-85c6-9162ec22b70f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  6,
  'Mesa 6',
  4,
  'libre'::table_status,
  'qr-table-cevicheria-006-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'c251fb15-b7ab-5d45-a24a-e1828d6795c9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  7,
  'Mesa 7',
  6,
  'libre'::table_status,
  'qr-table-cevicheria-007-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'a853cdd4-66ed-5b6f-9b59-0fa008c0a813'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  8,
  'Mesa 8',
  6,
  'libre'::table_status,
  'qr-table-cevicheria-008-736434f8',
  'Salón Principal',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'b95e231d-2d4d-5575-8657-268d14e90f6f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  9,
  'Mesa 9',
  4,
  'libre'::table_status,
  'qr-table-cevicheria-009-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '9177edfa-6035-54a9-8e10-9162b4481596'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  10,
  'Mesa 10',
  4,
  'reservada'::table_status,
  'qr-table-cevicheria-010-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  'dcabc3e3-a010-5a84-a633-e3b45b93d606'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  11,
  'Mesa 11',
  6,
  'libre'::table_status,
  'qr-table-cevicheria-011-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO tables (
  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at
) VALUES (
  '0d52661d-2d24-5b59-9a38-df9264140c3f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  12,
  'Mesa 12',
  6,
  'libre'::table_status,
  'qr-table-cevicheria-012-736434f8',
  'Terraza',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  number = EXCLUDED.number,
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  is_active = TRUE,
  updated_at = NOW();

-- ► Mozos
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'José Díaz Fernández',
  '44778812',
  '987 888 111',
  '1122',
  'waiter-cevicheria-0-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Lucía Mendoza Salazar',
  '44778813',
  '987 888 222',
  '2233',
  'waiter-cevicheria-1-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '8898baac-813e-5645-a862-e5fe8930532d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Manuel Huertas Vargas',
  '44778814',
  '987 888 333',
  '3344',
  'waiter-cevicheria-2-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO waiters (
  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at
) VALUES (
  '61144282-f711-5a3a-881c-e9fae6387f3d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Rosa Quispe Yui',
  '44778815',
  '987 888 444',
  '4455',
  'waiter-cevicheria-3-736434f8-5873-55',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  full_name = EXCLUDED.full_name,
  document_id = EXCLUDED.document_id,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin,
  is_active = TRUE,
  updated_at = NOW();

-- ► Inventario (insumos)
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '9134134a-2281-545a-a124-fa3fca75a61c'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Pescado fresco corvina',
  'PES-001',
  'kg'::inventory_unit,
  40, 15, 80,
  35.0,
  'Mariscos del Pacífico',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '9158f3ec-d77f-5d10-9aae-e100097cd4fd'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '9134134a-2281-545a-a124-fa3fca75a61c'::uuid,
  'entrada'::movement_type,
  40,
  35.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '5dee8a3e-d041-57d0-b235-cc10b05c5c91'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Camarón fresco',
  'CAM-001',
  'kg'::inventory_unit,
  15, 5, 30,
  55.0,
  'Mariscos del Pacífico',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'a457395f-b37d-508f-a868-833ada853a95'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '5dee8a3e-d041-57d0-b235-cc10b05c5c91'::uuid,
  'entrada'::movement_type,
  15,
  55.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '9341ae5d-1b57-52ac-89eb-1f56b01a3565'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Calamar fresco',
  'CAL-001',
  'kg'::inventory_unit,
  12, 4, 25,
  32.0,
  'Mariscos del Pacífico',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '9da61fbe-d20a-5853-9b80-f2630c9f8cb4'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '9341ae5d-1b57-52ac-89eb-1f56b01a3565'::uuid,
  'entrada'::movement_type,
  12,
  32.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '821d9b88-fc9e-50d5-859a-1627ccd5acc3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Conchas de abanico',
  'CON-001',
  'kg'::inventory_unit,
  8, 3, 20,
  85.0,
  'Mariscos del Pacífico',
  'Carnes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '71bf7b7e-14ae-560b-956c-376ed91b0a5b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '821d9b88-fc9e-50d5-859a-1627ccd5acc3'::uuid,
  'entrada'::movement_type,
  8,
  85.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'cf2823f0-f2ce-53cb-978b-50267d115732'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Limón sutil',
  'LIM-001',
  'kg'::inventory_unit,
  30, 10, 60,
  4.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'f52a4d97-55dc-59ba-aa31-81b2e45eb0dc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'cf2823f0-f2ce-53cb-978b-50267d115732'::uuid,
  'entrada'::movement_type,
  30,
  4.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '547540a6-f7a9-53e4-afbb-9947827b3e08'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Cebolla morada',
  'CEB-003',
  'kg'::inventory_unit,
  20, 5, 40,
  3.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '634fa8b4-169c-54b5-bffb-5451b7f4a616'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '547540a6-f7a9-53e4-afbb-9947827b3e08'::uuid,
  'entrada'::movement_type,
  20,
  3.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '9e2d4c3c-4b8f-58ed-841f-1a5f5f568456'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Ají limo',
  'AJI-002',
  'kg'::inventory_unit,
  6, 2, 15,
  12.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '3b4e0e42-d5b1-5839-928e-89e3545eb5ea'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '9e2d4c3c-4b8f-58ed-841f-1a5f5f568456'::uuid,
  'entrada'::movement_type,
  6,
  12.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'b5659259-91b7-5bf3-a146-85e20afbca66'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Ají amarillo',
  'AJI-001',
  'kg'::inventory_unit,
  8, 3, 20,
  6.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '85cafc0b-db1c-51a2-8500-8d512427c52b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'b5659259-91b7-5bf3-a146-85e20afbca66'::uuid,
  'entrada'::movement_type,
  8,
  6.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '16df1633-0475-5645-93cf-29566dd31134'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Cilantro fresco',
  'CIL-001',
  'paquete'::inventory_unit,
  25, 10, 50,
  2.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '0a5d9817-2aba-5c0a-9390-9eb664e65cb5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '16df1633-0475-5645-93cf-29566dd31134'::uuid,
  'entrada'::movement_type,
  25,
  2.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'd7b41e02-89ae-55f9-9a71-93fdf266313e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Yuca',
  'YUC-001',
  'kg'::inventory_unit,
  25, 10, 50,
  4.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '9694896c-3bc8-584a-8405-1ec080bf28e8'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'd7b41e02-89ae-55f9-9a71-93fdf266313e'::uuid,
  'entrada'::movement_type,
  25,
  4.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '77eecf1f-ac69-5863-8a29-cfaeaa00332a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Camote',
  'CAM-002',
  'kg'::inventory_unit,
  20, 5, 40,
  3.5,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'df231853-20c6-5050-9a5e-1db52a279caf'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '77eecf1f-ac69-5863-8a29-cfaeaa00332a'::uuid,
  'entrada'::movement_type,
  20,
  3.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '501c89e5-c208-5a63-9406-0c2331f08637'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Choclo',
  'CHO-001',
  'kg'::inventory_unit,
  15, 5, 30,
  5.0,
  'Mercado Mayorista',
  'Verduras',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '1810889d-9cc5-5954-b047-f62883d8c597'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '501c89e5-c208-5a63-9406-0c2331f08637'::uuid,
  'entrada'::movement_type,
  15,
  5.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '429f59ae-c1f0-5965-b5b2-c09c64e29d2d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Chicha morada 1L',
  'BEB-003',
  'unidad'::inventory_unit,
  40, 10, 80,
  6.0,
  'Distribuidora Lima',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  '9b25735d-af31-5a7b-a3be-d53ae958c211'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '429f59ae-c1f0-5965-b5b2-c09c64e29d2d'::uuid,
  'entrada'::movement_type,
  40,
  6.0,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  'de854c82-af88-5f39-8d1c-b9a1d0bd5f00'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Cerveza Cusqueña 620ml',
  'BEB-005',
  'unidad'::inventory_unit,
  60, 20, 120,
  6.5,
  'Cervecería Perú',
  'Bebidas',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'ccc4e354-fa6f-5927-ab24-589a538a5169'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'de854c82-af88-5f39-8d1c-b9a1d0bd5f00'::uuid,
  'entrada'::movement_type,
  60,
  6.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO inventory_items (
  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at
) VALUES (
  '29599847-a9a9-5c65-b46d-9034214d8d9d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'Arroz graneado',
  'ARR-002',
  'kg'::inventory_unit,
  30, 10, 60,
  3.5,
  'Distribuidora Lima',
  'Abarrotes',
  TRUE, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  unit = EXCLUDED.unit,
  stock_current = EXCLUDED.stock_current,
  stock_min = EXCLUDED.stock_min,
  stock_max = EXCLUDED.stock_max,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  category = EXCLUDED.category,
  is_active = TRUE,
  updated_at = NOW();
INSERT INTO inventory_movements (
  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at
) VALUES (
  'dab4440a-a55d-575e-a0e0-74c9969db83b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '29599847-a9a9-5c65-b46d-9034214d8d9d'::uuid,
  'entrada'::movement_type,
  30,
  3.5,
  'Stock inicial — compra de apertura',
  NULL,
  'system',
  '2026-07-19T20:41:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ► Recetas (plato → insumos)
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd1752552-ae90-5da0-970a-ac99a0b49a15'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '529f3bcd-1af2-5c33-9e82-9bb99608e804'::text,
  'Ceviche Clásico',
  '9134134a-2281-545a-a124-fa3fca75a61c'::uuid,
  0.2,
  '200g pescado por porción',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '4d659a1e-2ff9-5b70-a02a-9ebefc888344'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '28d32a98-4db0-5021-963f-2d0ebeb4cf56'::text,
  'Ceviche Clásico',
  '547540a6-f7a9-53e4-afbb-9947827b3e08'::uuid,
  0.1,
  '100g cebolla',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '2d59e0eb-4f51-585b-9cb7-0acdd1b09b19'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '22bd43a9-3050-5b9b-bad3-1b2d3efe4047'::text,
  'Ceviche Clásico',
  'cf2823f0-f2ce-53cb-978b-50267d115732'::uuid,
  0.1,
  '100ml jugo',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'd49c4c81-08bd-5a50-80ed-5c27bc5ed46d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'f5f14261-3b54-5b6e-b7b3-048627333373'::text,
  'Ceviche Clásico',
  '9e2d4c3c-4b8f-58ed-841f-1a5f5f568456'::uuid,
  0.02,
  '20g ají',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '465e71a8-349b-5741-9886-6f2d15cdbd11'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'a6f729fd-2f45-58ce-8b29-980dc2eea772'::text,
  'Ceviche Clásico',
  '77eecf1f-ac69-5863-8a29-cfaeaa00332a'::uuid,
  0.1,
  '100g camote',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'dbc8b836-66c0-5948-b92a-b81a9511e879'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '4105b399-2278-5b8a-81b7-7079708bfbc4'::text,
  'Ceviche Clásico',
  '501c89e5-c208-5a63-9406-0c2331f08637'::uuid,
  0.05,
  '50g choclo',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '9fac4c7d-e54f-5128-9e03-645cc686410b'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '320d07c9-44a5-5ec3-ab59-65e8932da91a'::text,
  'Ceviche Mixto',
  '9134134a-2281-545a-a124-fa3fca75a61c'::uuid,
  0.15,
  '150g pescado',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '76406a23-5591-5f7f-92d0-42165f67f88d'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'd1907812-ae1d-5d33-a0f3-3b1f7e82823e'::text,
  'Ceviche Mixto',
  '5dee8a3e-d041-57d0-b235-cc10b05c5c91'::uuid,
  0.08,
  '80g camarón',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '3f507c14-f3bc-5658-8c73-5f18ad13f37f'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '4cf82aa8-5fd9-5bc3-8b75-d500679da56e'::text,
  'Ceviche Mixto',
  '9341ae5d-1b57-52ac-89eb-1f56b01a3565'::uuid,
  0.08,
  '80g calamar',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '5f8ab06b-a5ed-52b2-9e79-d19ad0736a6e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '88fea289-764e-5d56-9c35-e79dfdc31f07'::text,
  'Ceviche Mixto',
  '821d9b88-fc9e-50d5-859a-1627ccd5acc3'::uuid,
  0.05,
  '50g conchas',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '23d4c8ad-bd25-5682-9feb-1b8e86472960'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '1bdd3972-c96e-524b-b6b6-fa9b9eb6860f'::text,
  'Ceviche de Camarón',
  '5dee8a3e-d041-57d0-b235-cc10b05c5c91'::uuid,
  0.25,
  '250g camarón',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '8825bf07-0798-5ffd-84c3-2160419dc8d5'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cf913e42-b14b-54cf-8cf1-4304d290f137'::text,
  'Chicharrón de Pescado',
  '9134134a-2281-545a-a124-fa3fca75a61c'::uuid,
  0.25,
  '250g pescado',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'fafbb79b-de28-5fc7-a1fb-42c3190ac08a'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'ccbf0a26-bbee-5aee-988e-cc5244d9f0e9'::text,
  'Arroz con Mariscos',
  '29599847-a9a9-5c65-b46d-9034214d8d9d'::uuid,
  0.3,
  '300g arroz',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '6d846373-11a1-51ef-a82a-82a6b00ce952'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '1bebebff-f708-5e86-92d0-054fb85b4769'::text,
  'Arroz con Mariscos',
  '5dee8a3e-d041-57d0-b235-cc10b05c5c91'::uuid,
  0.1,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '74739ba2-936e-5e40-a12b-26f0bb1d7284'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'e7a3e717-25a4-541a-8e34-3bfd57c27b31'::text,
  'Arroz con Mariscos',
  '9341ae5d-1b57-52ac-89eb-1f56b01a3565'::uuid,
  0.1,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  '2e2c119a-1e1e-5be6-b348-9b29850dc82e'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'a38978c1-e100-5519-ae10-f89bf28ccbe2'::text,
  'Chicha Morada 1L',
  '429f59ae-c1f0-5965-b5b2-c09c64e29d2d'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();
INSERT INTO product_recipes (
  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at
) VALUES (
  'bfde40d7-b612-5823-9782-bf259fb4ee26'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '5e8c4c10-1c40-51bc-98d8-2433503c0e97'::text,
  'Cerveza Cusqueña 620ml',
  'de854c82-af88-5f39-8d1c-b9a1d0bd5f00'::uuid,
  1.0,
  '',
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  quantity_per_dish = EXCLUDED.quantity_per_dish,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ► Comandas (orders + items)
-- Comanda #0401 (mesa 1, mozo: José Díaz Fernández)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '608d42f8-565e-5027-aa3f-3ec19ca44b30'::uuid,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::uuid,
  '#0401',
  'entregada'::order_status,
  'mesa'::order_type,
  'Cliente habitual',
  NULL,
  2,
  NULL,
  58.0,
  0,
  5.0,
  63.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NULL,
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'a99b70fb-75d2-5c51-86f2-103fbbfeb398'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  'aba01f22-e1d9-5720-b51b-e506b2131451'::text,
  'Ceviche Clásico',
  28.0,
  1,
  'Bien picante',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '01d1c4d8-574c-51e7-8e66-e80f5ceba695'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  '514c4336-5502-5ed9-9b25-15392b2c1bcf'::text,
  'Causa de Atún',
  18.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '3286877f-bcfb-5253-832c-af5911a9099b'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  '4f15dc45-c753-525d-854a-0ba3b60f85cd'::text,
  'Chicha Morada 1L',
  12.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '97c10984-6f23-559b-ad5f-28934075bc49'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  NULL,
  'borrador'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd64d9c67-7e7d-55d5-a978-29cbac6d1b41'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '80f014d3-512a-5038-9ea8-a1bdcb69c5a9'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '5391a14c-8722-5169-a613-bfbe2e869ec4'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'dc3fde4b-312a-54e3-aa98-3caa98c1fe47'::uuid,
  '758c42e1-e907-534c-ba21-b43399b759c0'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0402 (mesa 3, mozo: Lucía Mendoza Salazar)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  '62422473-bd82-53c8-a56f-9e61a4f31037'::uuid,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::uuid,
  '#0402',
  'facturada'::order_status,
  'mesa'::order_type,
  'Sr. Vargas',
  NULL,
  4,
  'Cuenta corporativa',
  152.0,
  0,
  18.0,
  170.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '3 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '32372ac5-3f3d-57cd-a21e-6824a1466dd6'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'e96a8221-3d33-5140-9cbc-3581da118658'::text,
  'Ceviche Mixto',
  38.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5e95e826-e697-5063-ae64-7e0da9e4bf9f'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'ea43b8d6-34a1-5d39-a636-7baba2fa8f98'::text,
  'Arroz con Mariscos',
  36.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '78c2468f-ebdc-58c5-9480-b2ca382fa968'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  '0b549a1d-0d11-5658-853f-05fb44ae927d'::text,
  'Parihuela de Mariscos',
  42.0,
  1,
  NULL,
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'b4878277-f33a-5363-8862-0faf7e8ead7b'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  '04fdde6e-4b1d-5455-a6e2-079ef9f683e4'::text,
  'Cerveza Cusqueña 620ml',
  12.0,
  3,
  'Bien heladas',
  'entregado'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:41:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '702b6c74-89db-56ec-84db-591ba2c531ad'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  NULL,
  'borrador'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:11:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'c7bedc4f-dd40-53bf-bb2f-b28a9a997a52'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:16:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '218febe9-2ba5-51a7-b968-4d24da0b581c'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '702415cb-c046-5d14-9129-1a972eba30ed'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '82c6b642-eac0-5f82-bf26-bf93d98156b6'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'lista'::order_status,
  'entregada'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '25f45e2a-7907-5aac-8a74-b6a46d73c67f'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'entregada'::order_status,
  'facturada'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO voucher_prints (
  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at
) VALUES (
  'bbad94fe-2c1f-5e8d-bd4f-da75fd7876cc'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'cff11772-dd44-5821-9c7e-3789b54b69ed'::uuid,
  'V-005002',
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  'pos_80mm',
  NULL,
  '2026-07-26T20:38:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0403 (mesa 5, mozo: Manuel Huertas Vargas)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'f2d8f2b7-ded8-51e1-bcf7-226f52574506'::uuid,
  '8898baac-813e-5645-a862-e5fe8930532d'::uuid,
  '#0403',
  'lista'::order_status,
  'mesa'::order_type,
  'Familia Reyes',
  NULL,
  4,
  NULL,
  124.0,
  0,
  8.0,
  132.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  NULL,
  NULL,
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '18f2b3fc-351f-5b6c-80e2-74bcf82cb7cb'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  '90b83b2a-f29b-5035-95b9-b04623875a7a'::text,
  'Ceviche de Camarón',
  36.0,
  2,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'd496526f-a4cb-57fb-badd-3818cc611e83'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  '1647adfa-7d14-5926-8d53-af122782e419'::text,
  'Chicharrón de Pescado',
  30.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '5951b18d-c093-5909-83c4-c84e1084ff35'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  'a37bbad0-d7e9-5b97-aceb-b715cab6062a'::text,
  'Causa de Camarón',
  22.0,
  1,
  NULL,
  'listo'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:31:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'a78b9ec8-ef4c-59ce-9f70-d7617d5a307b'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  NULL,
  'borrador'::order_status,
  '8898baac-813e-5645-a862-e5fe8930532d'::text,
  NULL,
  '2026-07-26T20:21:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '52369a85-5b0d-53a4-b840-78b2d49f74d2'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '8898baac-813e-5645-a862-e5fe8930532d'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '870a4871-f929-5c53-9d56-093b0396c987'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '8898baac-813e-5645-a862-e5fe8930532d'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'd332ce56-55f8-5229-8cd8-badbd54ebd5d'::uuid,
  '9f7dd409-eaa5-5dbb-bc89-7325ee503ed2'::uuid,
  'en_preparacion'::order_status,
  'lista'::order_status,
  '8898baac-813e-5645-a862-e5fe8930532d'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0404 (mesa 7, mozo: Rosa Quispe Yui)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'c251fb15-b7ab-5d45-a24a-e1828d6795c9'::uuid,
  '61144282-f711-5a3a-881c-e9fae6387f3d'::uuid,
  '#0404',
  'en_preparacion'::order_status,
  'mesa'::order_type,
  'Pareja',
  NULL,
  2,
  NULL,
  84.0,
  0,
  0,
  84.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '1cb07e0f-6ae1-5ec1-9474-e8e1711b0db3'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  '2e565561-9d4b-5b6c-9d25-4be144fff087'::text,
  'Tiradito Tricolor',
  38.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'e879d3ba-02c2-5065-ac5d-a088ba45dcb8'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  'faaa6efd-19e9-5bfb-a286-81ad96b5cca9'::text,
  'Conchas a la Parmesana',
  36.0,
  1,
  'Extra parmesano',
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'f361a4cf-1683-5dcc-ae80-b25dcaa6c9f2'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  'c939a2cb-5ab9-56f7-820d-9d5ae620bb9a'::text,
  'Limón Frío 1L',
  10.0,
  1,
  NULL,
  'en_preparacion'::order_item_status,
  NOW() - INTERVAL '10 minutes',
  '2026-07-26T19:21:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '2a5b6ea4-680c-5c7f-8be9-1ac8f7164981'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  NULL,
  'borrador'::order_status,
  '61144282-f711-5a3a-881c-e9fae6387f3d'::text,
  NULL,
  '2026-07-26T20:26:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'db0f31f7-e6b2-5bbc-a1bb-53e2f04299e5'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '61144282-f711-5a3a-881c-e9fae6387f3d'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '1bd7fb37-222b-5164-bc58-b464a329f030'::uuid,
  '33907ece-ce2b-55e1-8f9d-955df17ca534'::uuid,
  'enviada'::order_status,
  'en_preparacion'::order_status,
  '61144282-f711-5a3a-881c-e9fae6387f3d'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0405 (mesa 9, mozo: José Díaz Fernández)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'd5c29bb9-b9ca-514b-9eb2-deeb2eabbae3'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'b95e231d-2d4d-5575-8657-268d14e90f6f'::uuid,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::uuid,
  '#0405',
  'enviada'::order_status,
  'mesa'::order_type,
  'Cliente solo',
  NULL,
  1,
  NULL,
  72.0,
  0,
  0,
  72.0,
  'S/',
  NOW() - INTERVAL '30 minutes',
  NULL,
  NULL,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  'efe261dc-79d3-5832-97bd-a5e035c347f8'::uuid,
  'd5c29bb9-b9ca-514b-9eb2-deeb2eabbae3'::uuid,
  'a3319304-317d-539f-9c93-a4cb59bcf7b5'::text,
  'Jalea Mixta',
  40.0,
  1,
  'Salsa criolla aparte',
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '2e41b950-a6bb-5356-8aa6-8a9871840dfd'::uuid,
  'd5c29bb9-b9ca-514b-9eb2-deeb2eabbae3'::uuid,
  'b36fe919-4ed4-58dc-a789-a79b6b4892e3'::text,
  'Pulpo al Olivo',
  32.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:11:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'be8c236b-2277-51a0-95d0-9678f4a44107'::uuid,
  'd5c29bb9-b9ca-514b-9eb2-deeb2eabbae3'::uuid,
  NULL,
  'borrador'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:31:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  '75cb4bcd-a0d5-5ac1-b1ea-7cacb4e6aa9d'::uuid,
  'd5c29bb9-b9ca-514b-9eb2-deeb2eabbae3'::uuid,
  'borrador'::order_status,
  'enviada'::order_status,
  '33623ebd-cf86-5d3f-bdf6-b30e23bb4220'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Comanda #0406 (mesa 11, mozo: Lucía Mendoza Salazar)
INSERT INTO orders (
  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,
  customer_name, customer_phone, party_size, notes,
  subtotal, tax, tip, total, currency,
  sent_at, ready_at, delivered_at, invoiced_at,
  created_at, updated_at
) VALUES (
  'd2177394-6c3d-507c-b9f2-59dce5e7cbb9'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '33e11bd8-7e0e-5958-a04a-f4df6de1a220'::uuid,
  'dcabc3e3-a010-5a84-a633-e3b45b93d606'::uuid,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::uuid,
  '#0406',
  'borrador'::order_status,
  'mesa'::order_type,
  NULL,
  NULL,
  1,
  NULL,
  52.0,
  0,
  0,
  52.0,
  'S/',
  NULL,
  NULL,
  NULL,
  NULL,
  '2026-07-26T18:51:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  table_id = EXCLUDED.table_id,
  waiter_id = EXCLUDED.waiter_id,
  order_number = EXCLUDED.order_number,
  status = EXCLUDED.status,
  customer_name = EXCLUDED.customer_name,
  party_size = EXCLUDED.party_size,
  notes = EXCLUDED.notes,
  subtotal = EXCLUDED.subtotal,
  tip = EXCLUDED.tip,
  total = EXCLUDED.total,
  sent_at = EXCLUDED.sent_at,
  ready_at = EXCLUDED.ready_at,
  delivered_at = EXCLUDED.delivered_at,
  invoiced_at = EXCLUDED.invoiced_at,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '3e7e6077-9cb8-50b9-9ca5-ac1846372e1b'::uuid,
  'd2177394-6c3d-507c-b9f2-59dce5e7cbb9'::uuid,
  '3001e7bf-c455-5f66-b3b1-4745ba8bdc4a'::text,
  'Ceviche Norteño',
  30.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_items (
  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at
) VALUES (
  '6f7ddc29-217a-5f4f-b0bf-bca80708ff34'::uuid,
  'd2177394-6c3d-507c-b9f2-59dce5e7cbb9'::uuid,
  '8b96efbf-19f0-5fdb-94c7-102e9ed8dcb4'::text,
  'Leche de Tigre Clásica',
  22.0,
  1,
  NULL,
  'pendiente'::order_item_status,
  NULL,
  '2026-07-26T19:01:02+00:00'::timestamptz,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  menu_item_name = EXCLUDED.menu_item_name,
  menu_item_price = EXCLUDED.menu_item_price,
  quantity = EXCLUDED.quantity,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO order_status_history (
  id, order_id, from_status, to_status, changed_by, notes, created_at
) VALUES (
  'b5e513d8-b265-5c9b-acc9-018ee291365c'::uuid,
  'd2177394-6c3d-507c-b9f2-59dce5e7cbb9'::uuid,
  NULL,
  'borrador'::order_status,
  'b39a670a-ec3e-5fd7-9b15-7f4e6d7668eb'::text,
  NULL,
  '2026-07-26T20:36:02+00:00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ════════════════════════════════════════════════════════════
DO $$ BEGIN
  RAISE NOTICE '✅ Organización de mozos creada para cuenta demo';
  RAISE NOTICE '📊 Resumen: 5 restaurantes, 5 sucursales, 59 mesas, 22 mozos';
  RAISE NOTICE '📊 Inventario: 64 insumos, 71 recetas, 64 movimientos';
  RAISE NOTICE '📊 Comandas: 27 comandas, 75 ítems, 5 vouchers';
END $$;

SELECT 'sucursales' AS tabla, COUNT(*) AS total FROM branches WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'mesas', COUNT(*) FROM tables WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'mozos', COUNT(*) FROM waiters WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'insumos', COUNT(*) FROM inventory_items WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'recetas', COUNT(*) FROM product_recipes WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'comandas', COUNT(*) FROM orders WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'items', COUNT(*) FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'movimientos', COUNT(*) FROM inventory_movements WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'vouchers', COUNT(*) FROM voucher_prints WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid;

-- ════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- ════════════════════════════════════════════════════════════
