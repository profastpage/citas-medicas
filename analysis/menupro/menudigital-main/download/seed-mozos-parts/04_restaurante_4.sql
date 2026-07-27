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
