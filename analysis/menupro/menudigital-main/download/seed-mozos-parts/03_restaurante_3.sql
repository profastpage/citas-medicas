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
