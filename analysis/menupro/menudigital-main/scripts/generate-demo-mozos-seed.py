#!/usr/bin/env python3
"""
Genera el SQL para poblar la organización completa de mozos para la cuenta demo.

Crea para la cuenta demo@menudigital.pro (DEMO_USER_ID):

PARA CADA UNO DE LOS 5 MENÚS/RESTAURANTES:
- 1 sucursal (branch) principal con dirección real de Lima
- 8-12 mesas distribuidas por zonas (Salón, Terraza, 2do piso)
- 4-5 mozos con PIN, teléfono, DNI y qr_token generado deterministamente
- 8-12 insumos típicos del rubro (con stock mínimo, máximo, costo)
- 5-8 recetas (relación plato → insumo)
- 4-6 comandas de ejemplo en distintos estados (enviada, en_preparacion, lista, entregada, facturada)
- 2-4 ítems por comanda con notas y estados
- 1-2 movimientos de inventario (entradas por compra)
- 1-2 vouchers impresos para comandas facturadas

TOTAL APROX:
- 5 sucursales
- 50 mesas
- 22 mozos
- 55 insumos
- 30 recetas
- 25 comandas con ~75 ítems
- 10 vouchers

El SQL es 100% idempotente (ON CONFLICT DO NOTHING / DO UPDATE).
Re-ejecutable sin riesgo.

REQUIERE: Haber ejecutado previamente seed-demo-account.sql (que crea el usuario + 5 menús).
"""

import uuid
import json
from datetime import datetime, timedelta

# ─────────────────────────────────────────────────────────────────────────────
# Configuración
# ─────────────────────────────────────────────────────────────────────────────

NS = uuid.UUID("00000000-0000-0000-0000-0000deadbeef")

# El usuario demo (debe coincidir con el generado por seed-demo-account.sql)
DEMO_USER_ID = str(uuid.uuid5(NS, "demo-user"))


def uid(prefix: str) -> str:
    return str(uuid.uuid5(NS, prefix))


def sql_escape(text) -> str:
    if text is None:
        return ""
    return str(text).replace("'", "''")


# ─────────────────────────────────────────────────────────────────────────────
# Datos por restaurante: sucursal, mesas, mozos, insumos, recetas, comandas
# ─────────────────────────────────────────────────────────────────────────────

RESTAURANTS = [
    # ════════════════════════════════════════════════════════════
    # 1) POLLERÍA EL DORADO CHICKEN
    # ════════════════════════════════════════════════════════════
    {
        "key": "polleria",
        "branch_name": "Pollería El Dorado Chicken — Sucursal Centro",
        "branch_address": "Av. Aviación 1234, San Borja, Lima",
        "branch_phone": "+51 1 435-7890",
        "locations": [
            ("Salón Principal", 6, [4, 4, 4, 6, 6, 4]),        # 6 mesas
            ("Terraza",          4, [4, 4, 6, 6]),              # 4 mesas
            ("2do Piso",         2, [8, 8]),                    # 2 mesas (grupos grandes)
        ],
        "waiters": [
            ("Carlos Huamán Pérez",     "44778899", "987 654 321", "1234"),
            ("María González Torres",   "44556677", "987 111 222", "2345"),
            ("José Luis Rojas",         "44889900", "987 333 444", "3456"),
            ("Ana Karen Quispe",        "44990011", "987 555 666", "4567"),
            ("Pedro Salazar Mejía",     "44112233", "987 777 888", "5678"),
        ],
        "inventory": [
            # (name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category)
            ("Pollo entero fresco",     "POL-001", "unidad", 80,  20, 150, 18.00, "Avícola San Carlos",    "Carnes"),
            ("Papa amarilla",           "PAP-001", "kg",     50,  15, 100, 3.50,  "Mercado Mayorista",     "Verduras"),
            ("Papa blanca",             "PAP-002", "kg",     60,  20, 120, 3.00,  "Mercado Mayorista",     "Verduras"),
            ("Aceite vegetal",          "ACE-001", "litro",  40,  10, 80,  12.00, "Distribuidora Lima",    "Abarrotes"),
            ("Sal industrial",          "SAL-001", "kg",     25,  5,  50,  1.20,  "Distribuidora Lima",    "Abarrotes"),
            ("Ají amarillo",            "AJI-001", "kg",     8,   3,  20,  6.00,  "Mercado Mayorista",     "Verduras"),
            ("Carbón de cocina",        "CAR-001", "kg",     30,  10, 100, 2.50,  "Distribuidora Lima",    "Abarrotes"),
            ("Gaseosa Inca Kola 500ml", "BEB-001", "unidad", 100, 30, 200, 2.20,  "Coca Cola Perú",        "Bebidas"),
            ("Gaseosa Coca Cola 500ml", "BEB-002", "unidad", 100, 30, 200, 2.20,  "Coca Cola Perú",        "Bebidas"),
            ("Ensalada mixta",          "ENS-001", "kg",     15,  5,  30,  4.50,  "Mercado Mayorista",     "Verduras"),
        ],
        "recipes": [
            # (menu_item_name (debe coincidir con dishes), inventory_item_name, qty_per_dish, notes)
            ("Pollo a la Brasa Entero", "Pollo entero fresco", 1.0, "1 pollo entero por porción"),
            ("Pollo a la Brasa Entero", "Papa blanca", 1.0, "1 kg papas fritas por pollo"),
            ("Pollo a la Brasa Entero", "Carbón de cocina", 0.5, "500g carbón por pollo"),
            ("Cuarto de Pollo", "Pollo entero fresco", 0.25, "1/4 pollo"),
            ("Cuarto de Pollo", "Papa blanca", 0.3, "300g papas fritas"),
            ("Cuarto de Pollo", "Ensalada mixta", 0.15, "150g ensalada"),
            ("Pollo Broaster Entero", "Pollo entero fresco", 1.0, ""),
            ("Pollo Broaster Entero", "Aceite vegetal", 0.5, "500ml aceite para fritura"),
            ("Alitas Broaster (12 u)", "Pollo entero fresco", 0.5, "12 alitas = ~750g"),
            ("Inca Kola 500ml", "Gaseosa Inca Kola 500ml", 1.0, ""),
        ],
        "orders": [
            # (table_number, waiter_idx, status, items[(dish_name, price, qty, notes)], customer_name, party_size, notes, tip)
            (1, 0, "entregada", [
                ("Pollo a la Brasa Entero", 58.00, 1, "Bien dorado, extra ají"),
                ("Inca Kola 500ml", 5.00, 4, "Bien heladas"),
            ], "Familia Mendoza", 4, "Cliente habitual", 8.00),
            (3, 1, "facturada", [
                ("Medio Pollo a la Brasa", 34.00, 1, ""),
                ("Cuarto de Pollo", 19.00, 1, "Sin ají"),
                ("Papas Fritas Familiares", 14.00, 1, ""),
                ("Chicha Morada 1L", 12.00, 1, ""),
            ], "Sr. García", 3, "Cuenta dividida en 2", 6.00),
            (5, 2, "lista", [
                ("Combo Familiar 4 Personas", 75.00, 1, ""),
                ("Alitas Broaster (12 u)", 28.00, 1, "Extra BBQ"),
            ], "Aniversario López", 4, "Llevar a mesa 5", 10.00),
            (7, 3, "en_preparacion", [
                ("Cuarto de Pollo + Porción Extra", 24.00, 2, "Uno sin sal"),
                ("Arroz Chaufa de Pollo", 18.00, 1, ""),
                ("Limonada Fría 1L", 10.00, 1, ""),
            ], "Mesa cumpleañera", 5, "", 0),
            (9, 0, "enviada", [
                ("Pollo Broaster Entero", 56.00, 1, "Extra crujiente"),
                ("Nuggets de Pollo (10 u)", 18.00, 1, "Para niño"),
            ], "Familia Ruiz", 4, "", 0),
        ],
    },

    # ════════════════════════════════════════════════════════════
    # 2) CHIFA DRAGÓN DE ORO
    # ════════════════════════════════════════════════════════════
    {
        "key": "chifa",
        "branch_name": "Chifa Dragón de Oro — Sucursal Cercado",
        "branch_address": "Av. Brasil 876, Jesús María, Lima",
        "branch_phone": "+51 1 421-3344",
        "locations": [
            ("Salón Principal", 8, [4, 4, 4, 4, 6, 6, 8, 8]),
            ("Privado",          2, [10, 10]),
        ],
        "waiters": [
            ("Luis Chong Sifuentes",     "33445566", "987 100 200", "1111"),
            ("Carmen Yip Sánchez",       "33556677", "987 300 400", "2222"),
            ("Roberto Li Wong",          "33667788", "987 500 600", "3333"),
            ("Patricia Vásquez Lam",     "33778899", "987 700 800", "4444"),
        ],
        "inventory": [
            ("Pechuga de pollo",         "POL-002", "kg",     45,  15, 90,   12.00, "Avícola San Carlos",    "Carnes"),
            ("Camarón fresco",            "CAM-001", "kg",     12,  5,  30,   55.00, "Mariscos del Pacífico", "Carnes"),
            ("Arroz chaufa (cocido)",    "ARR-001", "kg",     80,  20, 150,  3.20,  "Distribuidora Lima",    "Abarrotes"),
            ("Fideos chinos",             "FID-001", "paquete", 60,  15, 120,  4.50,  "Importadora China",     "Abarrotes"),
            ("Sillao (salsa de soya)",   "SIL-001", "litro",  20,  5,  40,   14.00, "Importadora China",     "Salsas"),
            ("Cebollita china",           "CEB-001", "kg",     15,  5,  30,   4.00,  "Mercado Mayorista",     "Verduras"),
            ("Huevos",                    "HUE-001", "docena", 30,  10, 60,   10.00, "Avícola San Carlos",    "Abarrotes"),
            ("Wantanes congelados",       "WAN-001", "paquete", 25, 8,  60,   12.00, "Importadora China",     "Abarrotes"),
            ("Aceite vegetal",            "ACE-001", "litro",  35,  10, 80,   12.00, "Distribuidora Lima",    "Abarrotes"),
            ("Té de jazmín",              "TE-001",  "paquete", 12, 3,  30,   8.00,  "Importadora China",     "Bebidas"),
            ("Chicha morada 1L",          "BEB-003", "unidad", 40,  10, 80,   6.00,  "Distribuidora Lima",    "Bebidas"),
            ("Inca Kola 1.5L",            "BEB-004", "unidad", 30,  10, 60,   7.00,  "Coca Cola Perú",        "Bebidas"),
        ],
        "recipes": [
            ("Arroz Chaufa de Pollo", "Pechuga de pollo", 0.2, "200g por porción"),
            ("Arroz Chaufa de Pollo", "Arroz chaufa (cocido)", 0.3, "300g por porción"),
            ("Arroz Chaufa de Pollo", "Sillao (salsa de soya)", 0.03, "30ml sillao"),
            ("Arroz Chaufa de Pollo", "Cebollita china", 0.05, "50g cebollita"),
            ("Arroz Chaufa de Pollo", "Huevos", 0.08, "1 huevo = ~0.08 docena"),
            ("Wantán Frito (12 u)", "Wantanes congelados", 1.0, "1 paquete = 12 wantanes"),
            ("Wantán Frito (12 u)", "Aceite vegetal", 0.2, "200ml aceite"),
            ("Tallarín Saltado de Pollo", "Fideos chinos", 1.0, "1 paquete por porción"),
            ("Tallarín Saltado de Pollo", "Pechuga de pollo", 0.2, ""),
            ("Tallarín Saltado de Pollo", "Sillao (salsa de soya)", 0.04, ""),
            ("Pollo Chi Jau Kay", "Pechuga de pollo", 0.3, "300g pechuga"),
            ("Sopa Wantán", "Wantanes congelados", 0.5, "6 wantanes por porción"),
            ("Inca Kola 1.5L", "Inca Kola 1.5L", 1.0, ""),
        ],
        "orders": [
            (2, 0, "entregada", [
                ("Arroz Chaufa Especial", 36.00, 1, "Sin ajo"),
                ("Wantán Frito (12 u)", 18.00, 1, ""),
                ("Inca Kola 1.5L", 12.00, 1, ""),
            ], "Familia Tanaka", 4, "Cliente frecuente", 7.00),
            (4, 1, "facturada", [
                ("Sopa Wantán", 16.00, 2, "Extra cebollita"),
                ("Pollo Chi Jau Kay", 28.00, 1, ""),
                ("Arroz Chaufa de Pollo", 22.00, 1, ""),
                ("Chicha Morada 1L", 12.00, 1, ""),
            ], "Sr. Wong", 4, "Cumpleaños", 9.00),
            (6, 2, "lista", [
                ("Tallarín Saltado de Pollo", 24.00, 2, ""),
                ("Sopa Wantán", 16.00, 1, ""),
            ], "Familia Vargas", 3, "", 4.00),
            (8, 3, "en_preparacion", [
                ("Arroz Chaufa Especial", 36.00, 1, "Sin camarón"),
                ("Tallarín Saltado de Camarón", 34.00, 1, ""),
                ("Chijaukay de Pollo", 26.00, 1, ""),
            ], "Grupo de amigos", 3, "", 0),
            (10, 0, "enviada", [
                ("Combo Familiar: Pollo + Chaufa + Wantán", 88.00, 1, ""),
                ("Té Chino", 4.00, 4, "Bien caliente"),
            ], "Mesa privada — Sr. Li", 4, "Reunión de negocios", 0),
        ],
    },

    # ════════════════════════════════════════════════════════════
    # 3) PIZZERÍA BELLA NAPOLI
    # ════════════════════════════════════════════════════════════
    {
        "key": "pizzeria",
        "branch_name": "Pizzería Bella Napoli — Sucursal Miraflores",
        "branch_address": "Av. Larco 678, Miraflores, Lima",
        "branch_phone": "+51 1 241-5566",
        "locations": [
            ("Salón Interior",  6, [2, 2, 4, 4, 4, 4]),
            ("Terraza",         4, [4, 4, 6, 6]),
        ],
        "waiters": [
            ("Marco Rossi Bianchi",      "33889911", "987 234 567", "1112"),
            ("Sofía Linares Mendoza",    "33990022", "987 345 678", "2223"),
            ("Diego Marini Padilla",     "34001133", "987 456 789", "3334"),
            ("Valeria Santoro Ríos",     "34112244", "987 567 890", "4445"),
            ("Andrea Ferretti López",    "34223355", "987 678 901", "5556"),
        ],
        "inventory": [
            ("Harina tipo 00",          "HAR-001", "kg",     50,  15, 100, 4.50,  "Importadora Italia",   "Abarrotes"),
            ("Mozarella fior di latte", "QUE-001", "kg",     30,  10, 60,  35.00, "Lácteos Peruanos",     "Lácteos"),
            ("Queso parmesano",         "QUE-002", "kg",     10,  3,  20,  65.00, "Importadora Italia",   "Lácteos"),
            ("Salsa de tomate San Marzano", "SAL-002", "kg", 20,  5,  40,  12.00, "Importadora Italia",   "Salsas"),
            ("Tomate fresco",           "TOM-001", "kg",     25,  10, 50,  4.00,  "Mercado Mayorista",    "Verduras"),
            ("Albahaca fresca",         "ALB-001", "paquete", 30, 10, 60,  3.50,  "Mercado Mayorista",    "Verduras"),
            ("Levadura seca",           "LEV-001", "kg",     8,   2,  15,  25.00, "Importadora Italia",   "Abarrotes"),
            ("Aceite de oliva virgen",  "ACE-002", "litro",  15,  5,  30,  45.00, "Importadora Italia",   "Abarrotes"),
            ("Pepperoni",               "PEP-001", "kg",     12,  4,  25,  38.00, "Fricar Perú",          "Carnes"),
            ("Jamón italiano",          "JAM-001", "kg",     10,  3,  20,  42.00, "Importadora Italia",   "Carnes"),
            ("Champiñones frescos",     "CHA-001", "kg",     15,  5,  30,  8.00,  "Mercado Mayorista",    "Verduras"),
            ("Spaghetti seco",          "PAS-001", "paquete", 40, 10, 80, 6.50,  "Importadora Italia",   "Abarrotes"),
            ("Vino tinto Sangiovese",   "VIN-001", "unidad", 36,  10, 60,  28.00, "Importadora Italia",   "Bebidas"),
            ("Espresso café",           "CAF-001", "kg",     8,   3,  20,  45.00, "Cafetaleros Perú",     "Bebidas"),
        ],
        "recipes": [
            ("Pizza Margherita", "Harina tipo 00", 0.3, "300g masa"),
            ("Pizza Margherita", "Mozarella fior di latte", 0.15, "150g queso"),
            ("Pizza Margherita", "Salsa de tomate San Marzano", 0.1, "100g salsa"),
            ("Pizza Margherita", "Albahaca fresca", 0.05, "1 paquete por pizza"),
            ("Pizza Margherita", "Aceite de oliva virgen", 0.02, "20ml aceite"),
            ("Pizza Pepperoni", "Harina tipo 00", 0.3, ""),
            ("Pizza Pepperoni", "Mozarella fior di latte", 0.2, "200g queso"),
            ("Pizza Pepperoni", "Salsa de tomate San Marzano", 0.1, ""),
            ("Pizza Pepperoni", "Pepperoni", 0.1, "100g pepperoni"),
            ("Spaghetti Bolognesa", "Spaghetti seco", 1.0, "1 paquete"),
            ("Spaghetti Bolognesa", "Salsa de tomate San Marzano", 0.2, "200g salsa"),
            ("Tiramisú", "Mozarella fior di latte", 0.05, "50g mascarpone aprox"),
            ("Espresso", "Espresso café", 0.018, "18g café por espresso"),
            ("Vino Tinto Copa", "Vino tinto Sangiovese", 0.5, "Media botella"),
        ],
        "orders": [
            (1, 0, "entregada", [
                ("Pizza Margherita", 38.00, 1, "Extra albahaca"),
                ("Bruschetta Classica", 18.00, 1, ""),
                ("Vino Tinto Copa", 14.00, 2, ""),
            ], "Pareja aniversario", 2, "Cena romántica", 8.00),
            (3, 1, "facturada", [
                ("Pizza Pepperoni", 44.00, 2, "Una mitad sin pepperoni"),
                ("Garlic Bread", 14.00, 1, ""),
                ("Coca Cola 500ml", 5.00, 4, ""),
                ("Tiramisú", 18.00, 2, ""),
            ], "Familia Fernández", 4, "", 12.00),
            (5, 2, "lista", [
                ("Pizza Quattro Formaggi", 48.00, 1, ""),
                ("Caprese", 24.00, 1, ""),
                ("Espresso", 6.00, 2, ""),
            ], "Mesa de negocios", 2, "Cuenta empresa", 5.00),
            (7, 3, "en_preparacion", [
                ("Lasagna Bolognesa", 38.00, 2, "Una vegetariana si es posible"),
                ("Antipasto Italiano", 38.00, 1, ""),
                ("Vino Tinto Copa", 14.00, 3, ""),
            ], "Grupo amigos", 3, "", 0),
            (9, 4, "enviada", [
                ("Pizza Diavola", 46.00, 1, "Extra picante"),
                ("Calamari Fritti", 28.00, 1, ""),
                ("Panna Cotta", 16.00, 2, ""),
            ], "Cita romántica", 2, "", 0),
        ],
    },

    # ════════════════════════════════════════════════════════════
    # 4) SMASH BROTHERS BURGER HOUSE
    # ════════════════════════════════════════════════════════════
    {
        "key": "burgers",
        "branch_name": "Smash Brothers Burger House — Sucursal Barranco",
        "branch_address": "Av. Grau 432, Barranco, Lima",
        "branch_phone": "+51 1 256-7788",
        "locations": [
            ("Barra",        6, [2, 2, 2, 2, 2, 2]),  # 6 mesas de barra (individual/pareja)
            ("Salón",        6, [4, 4, 4, 4, 6, 6]),
            ("Terraza",      3, [4, 4, 6]),
        ],
        "waiters": [
            ("Diego Padilla Rojas",      "44556677", "987 111 333", "1212"),
            ("Camila Torres Vega",       "44667788", "987 222 444", "2323"),
            ("Sebastián Mendoza Yui",    "44778899", "987 333 555", "3434"),
            ("Andrea Quispe Salazar",    "44889900", "987 444 666", "4545"),
        ],
        "inventory": [
            ("Carne molida de res (smash)", "CAR-002", "kg",     40,  15, 80,  22.00, "Fricar Perú",          "Carnes"),
            ("Pan brioche",                "PAN-001", "unidad", 200, 50, 400, 1.20,  "Panadería Lima",       "Abarrotes"),
            ("Cheddar americano",          "QUE-003", "kg",     12,  4,  25,  32.00, "Lácteos Peruanos",     "Lácteos"),
            ("Tocino ahumado",             "TOC-001", "kg",     10,  3,  20,  28.00, "Fricar Perú",          "Carnes"),
            ("Lechuga romana",             "LEC-001", "kg",     8,   3,  15,  4.50,  "Mercado Mayorista",    "Verduras"),
            ("Tomate fresco",              "TOM-001", "kg",     12,  4,  25,  4.00,  "Mercado Mayorista",    "Verduras"),
            ("Cebolla blanca",             "CEB-002", "kg",     15,  5,  30,  2.50,  "Mercado Mayorista",    "Verduras"),
            ("Papa blanca",                "PAP-002", "kg",     60,  20, 120, 3.00,  "Mercado Mayorista",    "Verduras"),
            ("Salsa thousand",             "SAL-003", "litro",  8,   3,  15,  15.00, "Distribuidora Lima",   "Salsas"),
            ("Salsa BBQ",                  "SAL-004", "litro",  6,   2,  12,  18.00, "Distribuidora Lima",   "Salsas"),
            ("Coca Cola 500ml",            "BEB-002", "unidad", 120, 30, 240, 2.20,  "Coca Cola Perú",       "Bebidas"),
            ("Leche entera",               "LEC-002", "litro",  15,  5,  30,  4.50,  "Lácteos Peruanos",     "Lácteos"),
            ("Helado de vainilla",         "HEL-001", "kg",     10,  3,  20,  18.00, "Heladería Lima",       "Postres"),
        ],
        "recipes": [
            ("Single Smash", "Carne molida de res (smash)", 0.09, "90g por burger"),
            ("Single Smash", "Pan brioche", 1.0, "1 pan por burger"),
            ("Single Smash", "Cheddar americano", 0.02, "20g queso"),
            ("Single Smash", "Papa blanca", 0.2, "200g papas fritas"),
            ("Double Smash", "Carne molida de res (smash)", 0.18, "2x 90g"),
            ("Double Smash", "Pan brioche", 1.0, ""),
            ("Double Smash", "Cheddar americano", 0.04, "2x 20g"),
            ("Bacon Smash", "Carne molida de res (smash)", 0.18, ""),
            ("Bacon Smash", "Tocino ahumado", 0.05, "50g tocino (3 tiras)"),
            ("Bacon Smash", "Salsa BBQ", 0.03, "30ml BBQ"),
            ("Papas Fritas", "Papa blanca", 0.2, "200g papas"),
            ("Milkshake Clásico", "Leche entera", 0.2, "200ml leche"),
            ("Milkshake Clásico", "Helado de vainilla", 0.1, "100g helado"),
            ("Combo Smash Brothers", "Carne molida de res (smash)", 0.18, ""),
            ("Combo Smash Brothers", "Pan brioche", 1.0, ""),
            ("Combo Smash Brothers", "Papa blanca", 0.2, ""),
            ("Combo Smash Brothers", "Coca Cola 500ml", 1.0, ""),
        ],
        "orders": [
            (2, 0, "entregada", [
                ("Double Smash", 26.00, 1, "Extra queso"),
                ("Papas con Cheddar y Tocino", 18.00, 1, ""),
                ("Coca Cola 500ml", 5.00, 1, ""),
            ], "Cliente solo", 1, "Para llevar originalmente, comió in situ", 3.00),
            (4, 1, "facturada", [
                ("Combo Familiar 4 personas", 110.00, 1, "2 classic + 2 bacon smash"),
                ("Aros de Cebolla", 12.00, 1, "Extra salsa"),
            ], "Familia Ramírez", 4, "", 12.00),
            (6, 2, "lista", [
                ("Triple Smash", 34.00, 1, "Sin cebolla"),
                ("Classic Cheeseburger", 22.00, 1, ""),
                ("Milkshake Clásico", 14.00, 2, "1 vainilla, 1 chocolate"),
            ], "Pareja jóvenes", 2, "", 5.00),
            (8, 3, "en_preparacion", [
                ("Spicy Mexican", 28.00, 2, "Extra jalapeños"),
                ("Papas Gajo", 12.00, 1, ""),
                ("Cerveza Artesanal", 12.00, 2, ""),
            ], "Grupo universitarios", 4, "", 0),
            (10, 0, "enviada", [
                ("Combo Smash Brothers", 36.00, 1, "Carne bien hecha"),
                ("Combo Clásico", 30.00, 1, ""),
            ], "Pareja", 2, "Cita casual", 0),
            (12, 1, "borrador", [
                ("Bacon Smash", 30.00, 1, ""),
                ("Crispy Chicken", 24.00, 1, "Sin mayo"),
            ], "", 2, "", 0),
        ],
    },

    # ════════════════════════════════════════════════════════════
    # 5) LA MAR CEVICICHERÍA
    # ════════════════════════════════════════════════════════════
    {
        "key": "cevicheria",
        "branch_name": "La Mar Cevichería — Sucursal San Isidro",
        "branch_address": "Av. La Mar 767, San Isidro, Lima",
        "branch_phone": "+51 1 421-3344",
        "locations": [
            ("Salón Principal", 8, [2, 4, 4, 4, 4, 4, 6, 6]),
            ("Terraza",         4, [4, 4, 6, 6]),
        ],
        "waiters": [
            ("José Díaz Fernández",      "44778812", "987 888 111", "1122"),
            ("Lucía Mendoza Salazar",    "44778813", "987 888 222", "2233"),
            ("Manuel Huertas Vargas",    "44778814", "987 888 333", "3344"),
            ("Rosa Quispe Yui",          "44778815", "987 888 444", "4455"),
        ],
        "inventory": [
            ("Pescado fresco corvina",   "PES-001", "kg",     40,  15, 80,  35.00, "Mariscos del Pacífico", "Carnes"),
            ("Camarón fresco",            "CAM-001", "kg",     15,  5,  30,  55.00, "Mariscos del Pacífico", "Carnes"),
            ("Calamar fresco",            "CAL-001", "kg",     12,  4,  25,  32.00, "Mariscos del Pacífico", "Carnes"),
            ("Conchas de abanico",        "CON-001", "kg",     8,   3,  20,  85.00, "Mariscos del Pacífico", "Carnes"),
            ("Limón sutil",               "LIM-001", "kg",     30,  10, 60,  4.50,  "Mercado Mayorista",    "Verduras"),
            ("Cebolla morada",            "CEB-003", "kg",     20,  5,  40,  3.50,  "Mercado Mayorista",    "Verduras"),
            ("Ají limo",                  "AJI-002", "kg",     6,   2,  15,  12.00, "Mercado Mayorista",    "Verduras"),
            ("Ají amarillo",              "AJI-001", "kg",     8,   3,  20,  6.00,  "Mercado Mayorista",    "Verduras"),
            ("Cilantro fresco",           "CIL-001", "paquete", 25, 10, 50,  2.00,  "Mercado Mayorista",    "Verduras"),
            ("Yuca",                      "YUC-001", "kg",     25,  10, 50,  4.00,  "Mercado Mayorista",    "Verduras"),
            ("Camote",                    "CAM-002", "kg",     20,  5,  40,  3.50,  "Mercado Mayorista",    "Verduras"),
            ("Choclo",                    "CHO-001", "kg",     15,  5,  30,  5.00,  "Mercado Mayorista",    "Verduras"),
            ("Chicha morada 1L",          "BEB-003", "unidad", 40,  10, 80,  6.00,  "Distribuidora Lima",    "Bebidas"),
            ("Cerveza Cusqueña 620ml",    "BEB-005", "unidad", 60,  20, 120, 6.50,  "Cervecería Perú",      "Bebidas"),
            ("Arroz graneado",            "ARR-002", "kg",     30,  10, 60,  3.50,  "Distribuidora Lima",    "Abarrotes"),
        ],
        "recipes": [
            ("Ceviche Clásico", "Pescado fresco corvina", 0.2, "200g pescado por porción"),
            ("Ceviche Clásico", "Cebolla morada", 0.1, "100g cebolla"),
            ("Ceviche Clásico", "Limón sutil", 0.1, "100ml jugo"),
            ("Ceviche Clásico", "Ají limo", 0.02, "20g ají"),
            ("Ceviche Clásico", "Camote", 0.1, "100g camote"),
            ("Ceviche Clásico", "Choclo", 0.05, "50g choclo"),
            ("Ceviche Mixto", "Pescado fresco corvina", 0.15, "150g pescado"),
            ("Ceviche Mixto", "Camarón fresco", 0.08, "80g camarón"),
            ("Ceviche Mixto", "Calamar fresco", 0.08, "80g calamar"),
            ("Ceviche Mixto", "Conchas de abanico", 0.05, "50g conchas"),
            ("Ceviche de Camarón", "Camarón fresco", 0.25, "250g camarón"),
            ("Chicharrón de Pescado", "Pescado fresco corvina", 0.25, "250g pescado"),
            ("Arroz con Mariscos", "Arroz graneado", 0.3, "300g arroz"),
            ("Arroz con Mariscos", "Camarón fresco", 0.1, ""),
            ("Arroz con Mariscos", "Calamar fresco", 0.1, ""),
            ("Chicha Morada 1L", "Chicha morada 1L", 1.0, ""),
            ("Cerveza Cusqueña 620ml", "Cerveza Cusqueña 620ml", 1.0, ""),
        ],
        "orders": [
            (1, 0, "entregada", [
                ("Ceviche Clásico", 28.00, 1, "Bien picante"),
                ("Causa de Atún", 18.00, 1, ""),
                ("Chicha Morada 1L", 12.00, 1, ""),
            ], "Cliente habitual", 2, "", 5.00),
            (3, 1, "facturada", [
                ("Ceviche Mixto", 38.00, 1, ""),
                ("Arroz con Mariscos", 36.00, 1, ""),
                ("Parihuela de Mariscos", 42.00, 1, ""),
                ("Cerveza Cusqueña 620ml", 12.00, 3, "Bien heladas"),
            ], "Sr. Vargas", 4, "Cuenta corporativa", 18.00),
            (5, 2, "lista", [
                ("Ceviche de Camarón", 36.00, 2, ""),
                ("Chicharrón de Pescado", 30.00, 1, ""),
                ("Causa de Camarón", 22.00, 1, ""),
            ], "Familia Reyes", 4, "", 8.00),
            (7, 3, "en_preparacion", [
                ("Tiradito Tricolor", 38.00, 1, ""),
                ("Conchas a la Parmesana", 36.00, 1, "Extra parmesano"),
                ("Limón Frío 1L", 10.00, 1, ""),
            ], "Pareja", 2, "", 0),
            (9, 0, "enviada", [
                ("Jalea Mixta", 40.00, 1, "Salsa criolla aparte"),
                ("Pulpo al Olivo", 32.00, 1, ""),
            ], "Cliente solo", 1, "", 0),
            (11, 1, "borrador", [
                ("Ceviche Norteño", 30.00, 1, ""),
                ("Leche de Tigre Clásica", 22.00, 1, ""),
            ], "", 1, "", 0),
        ],
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Generación SQL
# ─────────────────────────────────────────────────────────────────────────────

def now_minus_minutes(mins: int) -> str:
    """Timestamp ISO hace N minutos."""
    dt = datetime.utcnow() - timedelta(minutes=mins)
    return dt.strftime("%Y-%m-%dT%H:%M:%S+00:00")


def gen_sql() -> str:
    lines = []
    a = lines.append

    # Header
    a("-- ============================================================")
    a("-- MENU PRO — ORGANIZACIÓN DE MOZOS PARA CUENTA DEMO")
    a("-- ============================================================")
    a("-- Puebla la organización completa de mozos para la cuenta demo:")
    a("--   demo@menudigital.pro (plan FULL)")
    a("--")
    a("-- Para cada uno de los 5 restaurantes:")
    a("--   ✓ 1 sucursal (branch) con dirección real")
    a("--   ✓ 8-12 mesas por sucursal distribuidas por zonas")
    a("--   ✓ 4-5 mozos con PIN, teléfono, DNI y qr_token")
    a("--   ✓ 8-14 insumos típicos del rubro")
    a("--   ✓ 5-17 recetas (plato → insumos)")
    a("--   ✓ 5-6 comandas de ejemplo en distintos estados")
    a("--   ✓ 2-4 ítems por comanda")
    a("--   ✓ Movimientos de inventario (entradas por compra)")
    a("--   ✓ Vouchers impresos para comandas facturadas")
    a("--")
    a("-- REQUIERE haber ejecutado previamente:")
    a("--   1. supabase/schema.sql")
    a("--   2. supabase/consolidated-migrations.sql")
    a("--   3. supabase/add-premium-logistics.sql")
    a("--   4. supabase/mozos-mesas-migration.sql")
    a("--   5. supabase/seed-demo-account.sql (crea el usuario demo + 5 menús)")
    a("--")
    a("-- IDEMPOTENTE: puede ejecutarse cuantas veces quieras.")
    a("-- ============================================================")
    a("")

    # Verificar que el usuario demo existe
    a("-- ────────────────────────────────────────────────────────────")
    a("-- PASO 0: Verificar que el usuario demo existe")
    a("-- ────────────────────────────────────────────────────────────")
    a(f"DO $$")
    a(f"DECLARE")
    a(f"  v_user_exists BOOLEAN;")
    a(f"BEGIN")
    a(f"  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = '{DEMO_USER_ID}'::uuid) INTO v_user_exists;")
    a(f"  IF NOT v_user_exists THEN")
    a(f"    RAISE EXCEPTION 'Usuario demo no encontrado. Ejecuta primero seed-demo-account.sql. ID esperado: {DEMO_USER_ID}';")
    a(f"  ELSE")
    a(f"    RAISE NOTICE '✅ Usuario demo encontrado: {DEMO_USER_ID}';")
    a(f"  END IF;")
    a(f"END $$;")
    a("")

    total_branches = 0
    total_tables = 0
    total_waiters = 0
    total_inventory = 0
    total_recipes = 0
    total_orders = 0
    total_items = 0
    total_movements = 0
    total_vouchers = 0

    for r_idx, r in enumerate(RESTAURANTS, 1):
        branch_id = uid(f"branch-{r['key']}")
        total_branches += 1

        a("")
        a("-- ════════════════════════════════════════════════════════════")
        a(f"-- RESTAURANTE {r_idx}: {r['branch_name']}")
        a("-- ════════════════════════════════════════════════════════════")
        a("")

        # ─── SUCURSAL ──────────────────────────────────────────────
        a("-- ► Sucursal")
        a("INSERT INTO branches (")
        a("  id, owner_id, name, address, phone, is_active, created_at, updated_at")
        a(") VALUES (")
        a(f"  '{branch_id}'::uuid,")
        a(f"  '{DEMO_USER_ID}'::uuid,")
        a(f"  '{sql_escape(r['branch_name'])}',")
        a(f"  '{sql_escape(r['branch_address'])}',")
        a(f"  '{sql_escape(r['branch_phone'])}',")
        a("  TRUE, NOW(), NOW()")
        a(") ON CONFLICT (id) DO UPDATE SET")
        a("  name = EXCLUDED.name,")
        a("  address = EXCLUDED.address,")
        a("  phone = EXCLUDED.phone,")
        a("  is_active = TRUE,")
        a("  updated_at = NOW();")
        a("")

        # ─── MESAS ─────────────────────────────────────────────────
        a("-- ► Mesas")
        table_number = 0
        table_ids = []  # Para usar en comandas
        for loc_name, loc_count, capacities in r["locations"]:
            for i in range(loc_count):
                table_number += 1
                capacity = capacities[i] if i < len(capacities) else 4
                table_id = uid(f"table-{r['key']}-{table_number}")
                table_ids.append(table_id)
                total_tables += 1
                # Algunas mesas ocupadas (estado variado)
                status = "libre"
                if table_number % 3 == 0:
                    status = "libre"
                elif table_number % 5 == 0:
                    status = "reservada"
                else:
                    status = "libre"

                a("INSERT INTO tables (")
                a("  id, owner_id, branch_id, number, name, capacity, status, qr_token, location, is_active, created_at, updated_at")
                a(") VALUES (")
                a(f"  '{table_id}'::uuid,")
                a(f"  '{DEMO_USER_ID}'::uuid,")
                a(f"  '{branch_id}'::uuid,")
                a(f"  {table_number},")
                a(f"  'Mesa {table_number}',")
                a(f"  {capacity},")
                a(f"  '{status}'::table_status,")
                a(f"  'qr-table-{r['key']}-{table_number:03d}-{uid('')[:8]}',")  # token determinist
                a(f"  '{sql_escape(loc_name)}',")
                a("  TRUE, NOW(), NOW()")
                a(") ON CONFLICT (id) DO UPDATE SET")
                a("  branch_id = EXCLUDED.branch_id,")
                a("  number = EXCLUDED.number,")
                a("  name = EXCLUDED.name,")
                a("  capacity = EXCLUDED.capacity,")
                a("  status = EXCLUDED.status,")
                a("  location = EXCLUDED.location,")
                a("  is_active = TRUE,")
                a("  updated_at = NOW();")
        a("")

        # ─── MOZOS ─────────────────────────────────────────────────
        a("-- ► Mozos")
        waiter_ids = []
        for w_idx, (wname, wdni, wphone, wpin) in enumerate(r["waiters"]):
            waiter_id = uid(f"waiter-{r['key']}-{w_idx}")
            waiter_ids.append(waiter_id)
            total_waiters += 1
            # Generar qr_token determinist (8 bytes hex = 16 chars, suficiente para URL)
            qr_token = f"waiter-{r['key']}-{w_idx}-{uid('')[:16]}"

            a("INSERT INTO waiters (")
            a("  id, owner_id, branch_id, full_name, document_id, phone, pin, qr_token, is_active, created_at, updated_at")
            a(") VALUES (")
            a(f"  '{waiter_id}'::uuid,")
            a(f"  '{DEMO_USER_ID}'::uuid,")
            a(f"  '{branch_id}'::uuid,")
            a(f"  '{sql_escape(wname)}',")
            a(f"  '{sql_escape(wdni)}',")
            a(f"  '{sql_escape(wphone)}',")
            a(f"  '{sql_escape(wpin)}',")
            a(f"  '{qr_token}',")
            a("  TRUE, NOW(), NOW()")
            a(") ON CONFLICT (id) DO UPDATE SET")
            a("  branch_id = EXCLUDED.branch_id,")
            a("  full_name = EXCLUDED.full_name,")
            a("  document_id = EXCLUDED.document_id,")
            a("  phone = EXCLUDED.phone,")
            a("  pin = EXCLUDED.pin,")
            a("  is_active = TRUE,")
            a("  updated_at = NOW();")
        a("")

        # ─── INVENTARIO ────────────────────────────────────────────
        a("-- ► Inventario (insumos)")
        inv_id_by_name = {}
        for inv_name, sku, unit, stock_cur, stock_min, stock_max, cost, supplier, cat in r["inventory"]:
            inv_id = uid(f"inv-{r['key']}-{inv_name}")
            inv_id_by_name[inv_name] = inv_id
            total_inventory += 1
            a("INSERT INTO inventory_items (")
            a("  id, owner_id, branch_id, name, sku, unit, stock_current, stock_min, stock_max, cost_per_unit, supplier, category, is_active, created_at, updated_at")
            a(") VALUES (")
            a(f"  '{inv_id}'::uuid,")
            a(f"  '{DEMO_USER_ID}'::uuid,")
            a(f"  '{branch_id}'::uuid,")
            a(f"  '{sql_escape(inv_name)}',")
            a(f"  '{sql_escape(sku)}',")
            a(f"  '{unit}'::inventory_unit,")
            a(f"  {stock_cur}, {stock_min}, {stock_max},")
            a(f"  {cost},")
            a(f"  '{sql_escape(supplier)}',")
            a(f"  '{sql_escape(cat)}',")
            a("  TRUE, NOW(), NOW()")
            a(") ON CONFLICT (id) DO UPDATE SET")
            a("  name = EXCLUDED.name,")
            a("  sku = EXCLUDED.sku,")
            a("  unit = EXCLUDED.unit,")
            a("  stock_current = EXCLUDED.stock_current,")
            a("  stock_min = EXCLUDED.stock_min,")
            a("  stock_max = EXCLUDED.stock_max,")
            a("  cost_per_unit = EXCLUDED.cost_per_unit,")
            a("  supplier = EXCLUDED.supplier,")
            a("  category = EXCLUDED.category,")
            a("  is_active = TRUE,")
            a("  updated_at = NOW();")

            # Movimiento de entrada (compra inicial)
            movement_id = uid(f"mov-{r['key']}-{inv_name}-init")
            total_movements += 1
            a("INSERT INTO inventory_movements (")
            a("  id, owner_id, branch_id, inventory_item_id, movement_type, quantity, unit_cost, reason, related_order_id, created_by, created_at")
            a(") VALUES (")
            a(f"  '{movement_id}'::uuid,")
            a(f"  '{DEMO_USER_ID}'::uuid,")
            a(f"  '{branch_id}'::uuid,")
            a(f"  '{inv_id}'::uuid,")
            a("  'entrada'::movement_type,")
            a(f"  {stock_cur},")
            a(f"  {cost},")
            a(f"  'Stock inicial — compra de apertura',")
            a("  NULL,")
            a("  'system',")
            a(f"  '{now_minus_minutes(60 * 24 * 7)}'::timestamptz")  # hace 7 días
            a(") ON CONFLICT (id) DO NOTHING;")
        a("")

        # ─── RECETAS ───────────────────────────────────────────────
        a("-- ► Recetas (plato → insumos)")
        for rec_idx, (dish_name, inv_name, qty, notes) in enumerate(r["recipes"]):
            recipe_id = uid(f"recipe-{r['key']}-{rec_idx}")
            inv_id = inv_id_by_name.get(inv_name)
            if not inv_id:
                a(f"-- ⚠️ SKIP: insumo no encontrado para receta '{dish_name}' → '{inv_name}'")
                continue
            total_recipes += 1
            a("INSERT INTO product_recipes (")
            a("  id, owner_id, menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes, created_at, updated_at")
            a(") VALUES (")
            a(f"  '{recipe_id}'::uuid,")
            a(f"  '{DEMO_USER_ID}'::uuid,")
            a(f"  '{uid(f'dish-{r['key']}-recipe-{rec_idx}')}'::text,")  # placeholder, el real se resuelve en runtime
            a(f"  '{sql_escape(dish_name)}',")
            a(f"  '{inv_id}'::uuid,")
            a(f"  {qty},")
            a(f"  '{sql_escape(notes)}',")
            a("  NOW(), NOW()")
            a(") ON CONFLICT (id) DO UPDATE SET")
            a("  menu_item_name = EXCLUDED.menu_item_name,")
            a("  quantity_per_dish = EXCLUDED.quantity_per_dish,")
            a("  notes = EXCLUDED.notes,")
            a("  updated_at = NOW();")
        a("")

        # ─── COMANDAS ──────────────────────────────────────────────
        a("-- ► Comandas (orders + items)")
        for o_idx, order_data in enumerate(r["orders"]):
            table_num, waiter_idx, status, items, customer_name, party_size, order_notes, tip = order_data
            table_id = table_ids[table_num - 1] if table_num <= len(table_ids) else None
            waiter_id = waiter_ids[waiter_idx] if waiter_idx < len(waiter_ids) else None
            order_id = uid(f"order-{r['key']}-{o_idx}")
            order_number = f"#{(r_idx - 1) * 100 + o_idx + 1:04d}"

            # Calcular subtotal y total
            subtotal = sum(price * qty for _, price, qty, _ in items)
            total = subtotal + tip

            # Timestamps según estado
            sent_at = "NOW() - INTERVAL '30 minutes'" if status in ("enviada", "en_preparacion", "lista", "entregada", "facturada") else "NULL"
            ready_at = "NOW() - INTERVAL '15 minutes'" if status in ("lista", "entregada", "facturada") else "NULL"
            delivered_at = "NOW() - INTERVAL '5 minutes'" if status in ("entregada", "facturada") else "NULL"
            invoiced_at = "NOW() - INTERVAL '3 minutes'" if status == "facturada" else "NULL"

            total_orders += 1

            a(f"-- Comanda {order_number} (mesa {table_num}, mozo: {r['waiters'][waiter_idx][0]})")
            a("INSERT INTO orders (")
            a("  id, owner_id, branch_id, table_id, waiter_id, order_number, status, order_type,")
            a("  customer_name, customer_phone, party_size, notes,")
            a("  subtotal, tax, tip, total, currency,")
            a("  sent_at, ready_at, delivered_at, invoiced_at,")
            a("  created_at, updated_at")
            a(") VALUES (")
            a(f"  '{order_id}'::uuid,")
            a(f"  '{DEMO_USER_ID}'::uuid,")
            a(f"  '{branch_id}'::uuid,")
            table_val = "NULL" if not table_id else f"'{table_id}'::uuid"
            waiter_val = "NULL" if not waiter_id else f"'{waiter_id}'::uuid"
            a(f"  {table_val},")
            a(f"  {waiter_val},")
            a(f"  '{order_number}',")
            a(f"  '{status}'::order_status,")
            a("  'mesa'::order_type,")
            a(f"  {("'" + sql_escape(customer_name) + "'") if customer_name else 'NULL'},")
            a("  NULL,")  # customer_phone
            a(f"  {party_size if party_size else 'NULL'},")
            a(f"  {("'" + sql_escape(order_notes) + "'") if order_notes else 'NULL'},")
            a(f"  {subtotal},")
            a("  0,")  # tax
            a(f"  {tip},")
            a(f"  {total},")
            a("  'S/',")
            a(f"  {sent_at},")
            a(f"  {ready_at},")
            a(f"  {delivered_at},")
            a(f"  {invoiced_at},")
            a(f"  '{now_minus_minutes(60 + o_idx * 10)}'::timestamptz,")
            a("  NOW()")
            a(") ON CONFLICT (id) DO UPDATE SET")
            a("  branch_id = EXCLUDED.branch_id,")
            a("  table_id = EXCLUDED.table_id,")
            a("  waiter_id = EXCLUDED.waiter_id,")
            a("  order_number = EXCLUDED.order_number,")
            a("  status = EXCLUDED.status,")
            a("  customer_name = EXCLUDED.customer_name,")
            a("  party_size = EXCLUDED.party_size,")
            a("  notes = EXCLUDED.notes,")
            a("  subtotal = EXCLUDED.subtotal,")
            a("  tip = EXCLUDED.tip,")
            a("  total = EXCLUDED.total,")
            a("  sent_at = EXCLUDED.sent_at,")
            a("  ready_at = EXCLUDED.ready_at,")
            a("  delivered_at = EXCLUDED.delivered_at,")
            a("  invoiced_at = EXCLUDED.invoiced_at,")
            a("  updated_at = NOW();")

            # Items de la comanda
            for it_idx, (dish_name, price, qty, item_notes) in enumerate(items):
                item_id = uid(f"item-{r['key']}-{o_idx}-{it_idx}")
                total_items += 1

                # Estado del item según estado de la orden
                if status == "borrador":
                    item_status = "pendiente"
                elif status == "enviada":
                    item_status = "pendiente"
                elif status == "en_preparacion":
                    item_status = "en_preparacion"
                elif status == "lista":
                    item_status = "listo"
                elif status in ("entregada", "facturada"):
                    item_status = "entregado"
                else:
                    item_status = "pendiente"

                a("INSERT INTO order_items (")
                a("  id, order_id, menu_item_id, menu_item_name, menu_item_price, quantity, notes, status, prepared_at, created_at, updated_at")
                a(") VALUES (")
                a(f"  '{item_id}'::uuid,")
                a(f"  '{order_id}'::uuid,")
                a(f"  '{uid(f'dish-{r['key']}-item-{o_idx}-{it_idx}')}'::text,")
                a(f"  '{sql_escape(dish_name)}',")
                a(f"  {price},")
                a(f"  {qty},")
                a(f"  {("'" + sql_escape(item_notes) + "'") if item_notes else 'NULL'},")
                a(f"  '{item_status}'::order_item_status,")
                a(f"  {'NULL' if item_status == 'pendiente' else 'NOW() - INTERVAL \'10 minutes\''},")
                a(f"  '{now_minus_minutes(50 + o_idx * 10)}'::timestamptz,")
                a("  NOW()")
                a(") ON CONFLICT (id) DO UPDATE SET")
                a("  menu_item_name = EXCLUDED.menu_item_name,")
                a("  menu_item_price = EXCLUDED.menu_item_price,")
                a("  quantity = EXCLUDED.quantity,")
                a("  notes = EXCLUDED.notes,")
                a("  status = EXCLUDED.status,")
                a("  updated_at = NOW();")

            # Status history
            status_seq = ["borrador", "enviada", "en_preparacion", "lista", "entregada", "facturada"]
            try:
                target_idx = status_seq.index(status)
            except ValueError:
                target_idx = 0

            prev = "NULL"
            for s_i in range(target_idx + 1):
                cur_status = status_seq[s_i]
                hist_id = uid(f"hist-{r['key']}-{o_idx}-{s_i}")
                a("INSERT INTO order_status_history (")
                a("  id, order_id, from_status, to_status, changed_by, notes, created_at")
                a(") VALUES (")
                a(f"  '{hist_id}'::uuid,")
                a(f"  '{order_id}'::uuid,")
                a(f"  {prev},")
                a(f"  '{cur_status}'::order_status,")
                a(f"  '{waiter_id}'::text,")
                a("  NULL,")
                a(f"  '{now_minus_minutes((target_idx - s_i + 1) * 5)}'::timestamptz")
                a(") ON CONFLICT (id) DO NOTHING;")
                prev = f"'{cur_status}'::order_status"

            # Voucher si está facturada
            if status == "facturada":
                voucher_id = uid(f"voucher-{r['key']}-{o_idx}")
                voucher_num = f"V-{r_idx:03d}{o_idx + 1:03d}"
                total_vouchers += 1
                a("INSERT INTO voucher_prints (")
                a("  id, owner_id, order_id, voucher_number, printed_by, print_format, pdf_url, printed_at")
                a(") VALUES (")
                a(f"  '{voucher_id}'::uuid,")
                a(f"  '{DEMO_USER_ID}'::uuid,")
                a(f"  '{order_id}'::uuid,")
                a(f"  '{voucher_num}',")
                a(f"  '{waiter_id}'::text,")
                a("  'pos_80mm',")
                a("  NULL,")
                a(f"  '{now_minus_minutes(2 + o_idx)}'::timestamptz")
                a(") ON CONFLICT (id) DO NOTHING;")
            a("")

    # ─── VERIFICACIÓN FINAL ─────────────────────────────────────
    a("-- ════════════════════════════════════════════════════════════")
    a("-- VERIFICACIÓN")
    a("-- ════════════════════════════════════════════════════════════")
    a("DO $$ BEGIN")
    a("  RAISE NOTICE '✅ Organización de mozos creada para cuenta demo';")
    a(f"  RAISE NOTICE '📊 Resumen: 5 restaurantes, {total_branches} sucursales, {total_tables} mesas, {total_waiters} mozos';")
    a(f"  RAISE NOTICE '📊 Inventario: {total_inventory} insumos, {total_recipes} recetas, {total_movements} movimientos';")
    a(f"  RAISE NOTICE '📊 Comandas: {total_orders} comandas, {total_items} ítems, {total_vouchers} vouchers';")
    a("END $$;")
    a("")
    a("SELECT 'sucursales' AS tabla, COUNT(*) AS total FROM branches WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'mesas', COUNT(*) FROM tables WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'mozos', COUNT(*) FROM waiters WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'insumos', COUNT(*) FROM inventory_items WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'recetas', COUNT(*) FROM product_recipes WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'comandas', COUNT(*) FROM orders WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'items', COUNT(*) FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'movimientos', COUNT(*) FROM inventory_movements WHERE owner_id = '" + DEMO_USER_ID + "'::uuid")
    a("UNION ALL SELECT 'vouchers', COUNT(*) FROM voucher_prints WHERE owner_id = '" + DEMO_USER_ID + "'::uuid;")
    a("")
    a("-- ════════════════════════════════════════════════════════════")
    a("-- FIN DEL SCRIPT")
    a("-- ════════════════════════════════════════════════════════════")

    return "\n".join(lines) + "\n"


def main() -> None:
    sql = gen_sql()

    out_supabase = "/home/z/my-project/supabase/seed-demo-mozos-org.sql"
    with open(out_supabase, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"✅ SQL guardado en {out_supabase}")

    import shutil
    out_download = "/home/z/my-project/download/seed-demo-mozos-org.sql"
    shutil.copyfile(out_supabase, out_download)
    print(f"✅ Copia para descarga en {out_download}")

    print(f"\n📊 Resumen generado:")
    print(f"  Restaurantes: {len(RESTAURANTS)}")
    total_b = sum(1 for _ in RESTAURANTS)
    total_t = sum(sum(len(c[2]) for c in r["locations"]) for r in RESTAURANTS)
    total_w = sum(len(r["waiters"]) for r in RESTAURANTS)
    total_i = sum(len(r["inventory"]) for r in RESTAURANTS)
    total_rc = sum(len(r["recipes"]) for r in RESTAURANTS)
    total_o = sum(len(r["orders"]) for r in RESTAURANTS)
    total_it = sum(sum(len(o[3]) for o in r["orders"]) for r in RESTAURANTS)
    total_mv = sum(len(r["inventory"]) for r in RESTAURANTS)
    total_v = sum(sum(1 for o in r["orders"] if o[2] == "facturada") for r in RESTAURANTS)
    print(f"  Sucursales:     {total_b}")
    print(f"  Mesas:          {total_t}")
    print(f"  Mozos:          {total_w}")
    print(f"  Insumos:        {total_i}")
    print(f"  Recetas:        {total_rc}")
    print(f"  Movimientos:    {total_mv}")
    print(f"  Comandas:       {total_o}")
    print(f"  Items:          {total_it}")
    print(f"  Vouchers:       {total_v}")
    print(f"  Tamaño SQL:     {len(sql):,} bytes / {sql.count(chr(10))} líneas")


if __name__ == "__main__":
    main()
