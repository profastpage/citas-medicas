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
