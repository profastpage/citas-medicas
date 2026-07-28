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

