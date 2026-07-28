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
