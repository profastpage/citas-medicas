#!/usr/bin/env python3
"""
Generador del script SQL para crear la cuenta demo MenuPro.

Produce un SQL idempotente que:
1. Crea el usuario demo en auth.users (con password hasheada bcrypt)
2. Crea el profile con plan='full'
3. Crea 5 menús de distintos rubros con layouts/temas distintos:
   - Pollería "El Dorado Chicken"        (single, dark, expanded, large img)
   - Chifa "Dragón de Oro"                (double, dark, expanded, medium img)
   - Pizzería "Bella Napoli"              (grid, light, minimal, medium img)
   - Burger House "Smash Brothers"        (single + carta_style=true → carrusel Rappi, dark, autoscroll)
   - Cevichería "La Mar"                  (single + carta_list_style=true → lista Rappi, light, minimal)
4. Crea ~25 categorías y ~115 platos con imágenes WebP de Unsplash

Idempotencia: usa UUIDs determinísticos (uuid5) y ON CONFLICT DO NOTHING/UPDATE.
El usuario puede ejecutar el SQL cuantas veces quiera sin romper nada.

Credenciales demo:
  Email:    demo@menudigital.pro
  Password: DemoMenuPro2025!
"""

import bcrypt
import uuid
from textwrap import dedent

# ─────────────────────────────────────────────────────────────────────────────
# Configuración
# ─────────────────────────────────────────────────────────────────────────────

DEMO_EMAIL = "demo@menudigital.pro"
DEMO_PASSWORD = "DemoMenuPro2025!"
DEMO_FULL_NAME = "Cuenta Demo MenuPro"

# Namespace fijo para UUIDs determinísticos (uuid5)
# Esto garantiza que re-ejecutar el script produzca los mismos IDs
NS = uuid.UUID("00000000-0000-0000-0000-0000deadbeef")

# IDs determinísticos
DEMO_USER_ID    = str(uuid.uuid5(NS, "demo-user"))
DEMO_PROFILE_ID = DEMO_USER_ID  # profiles.id = auth.users.id (1:1)


def uid(prefix: str) -> str:
    """Genera un UUID determinístico a partir de un prefix string."""
    return str(uuid.uuid5(NS, prefix))


# ─────────────────────────────────────────────────────────────────────────────
# Hash bcrypt de la contraseña
# ─────────────────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hashea la contraseña con bcrypt (cost factor 10 = compatibilidad Supabase)."""
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# Helper para URLs de imágenes Unsplash (formato WebP)
# ─────────────────────────────────────────────────────────────────────────────

def unsplash(photo_id: str, w: int = 800, h: int = 600) -> str:
    """URL de Unsplash que sirve la imagen recortada y convertida a WebP."""
    return f"https://images.unsplash.com/photo-{photo_id}?w={w}&h={h}&fit=crop&crop=entropy&q=80&fm=webp"


# ─────────────────────────────────────────────────────────────────────────────
# Definición de los 5 restaurantes
# ─────────────────────────────────────────────────────────────────────────────

RESTAURANTS = [
    # 1) POLLERÍA — Layout single, dark, naranja, expanded, large images
    {
        "key": "polleria",
        "name": "Pollería El Dorado Chicken",
        "slug": "polleria-el-dorado",
        "slogan": "El verdadero pollo a la brasa peruano",
        "description": "Más de 25 años llevando el mejor pollo a la brasa a tu mesa. Brasa, broaster y guarniciones hechas en casa todos los días.",
        "whatsapp": "+51987654321",
        "color": "#d62828",
        "secondary": "#1a1a2e",
        "currency": "S/",
        "logo": unsplash("1518492104633-130d0cc84637", 400, 400),
        "cover": unsplash("1606756790138-261d2b21cd75", 1600, 600),
        "theme": {
            "layout": "single",
            "dark_mode": True,
            "card_style": "expanded",
            "image_size": "large",
            "font": "Inter",
            "show_search": True,
            "show_category_icons": True,
            "rounded_corners": True,
            "dish_gallery": True,
            "carta_style": False,
            "carta_list_style": False,
            "carta_autoscroll": False,
            "carta_scroll_speed": 30,
        },
        "social": {
            "facebook": "https://facebook.com/elpolleriaeldorado",
            "instagram": "https://instagram.com/eldorado_chicken",
            "tiktok": "https://tiktok.com/@eldoradochicken",
        },
        "categories": [
            {
                "name": "Pollos a la Brasa",
                "dishes": [
                    ("Pollo a la Brasa Entero", "1 pollo entero (8 presas) ahumado al carbón, servido con papas fritas, ensalada y ají de la casa.", 58.00, "1606756790138-261d2b21cd75"),
                    ("Medio Pollo a la Brasa", "4 presas de pollo a la brasa con papas fritas y ensalada clásica.", 34.00, "1598103442097-8b74394b95c6"),
                    ("Cuarto de Pollo", "2 presas de pollo a la brasa con papas fritas y ensalada.", 19.00, "1569058242253-92a9c755a0ec"),
                    ("Cuarto de Pollo + Porción Extra", "Cuarto de pollo con doble porción de papas fritas y ensalada familiar.", 24.00, "1606756790138-261d2b21cd75"),
                    ("Pollo a la Brasa Picante", "Pollo a la brasa bañado en salsa picante de la casa. Para los amantes del ají.", 36.00, "1555939594-58d7cb561ad1"),
                ],
            },
            {
                "name": "Pollo Broaster",
                "dishes": [
                    ("Pollo Broaster Entero", "8 presas de pollo broaster crujiente con papas fritas y ají.", 56.00, "1569058242253-92a9c755a0ec"),
                    ("Medio Pollo Broaster", "4 presas broaster con papas fritas y ensalada.", 32.00, "1555939594-58d7cb561ad1"),
                    ("Cuarto Broaster", "2 presas broaster con papas fritas.", 18.00, "1606756790138-261d2b21cd75"),
                    ("Alitas Broaster (12 u)", "12 alitas broaster crujientes con salsa a elección.", 28.00, "1598103442097-8b74394b95c6"),
                    ("Nuggets de Pollo (10 u)", "10 nuggets crujientes con salsa a elección.", 18.00, "1607013251379-e6eecfffe234"),
                ],
            },
            {
                "name": "Guarniciones",
                "dishes": [
                    ("Papas Fritas Familiares", "Porción grande de papas fritas crujientes para 4 personas.", 14.00, "1573080496219-bb080dd4f877"),
                    ("Ensalada Familiar", "Lechuga, tomate, cebolla, zanahoria y palta. Aderezo de la casa.", 12.00, "1512621776951-a57141f2eefd"),
                    ("Arroz Blanco", "Porción de arroz blanco graneado para acompañar.", 6.00, "1586201375761-83865001e31c"),
                    ("Arroz Chaufa de Pollo", "Salteado al wok con huevo, sillao y cebollita china.", 18.00, "1606756790138-261d2b21cd75"),
                    ("Frijoles Patrones", "Porción de frijoles canarios guisados al estilo peruano.", 8.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Combos Familiares",
                "dishes": [
                    ("Combo Familiar 4 Personas", "1 pollo entero a la brasa + papas + ensalada + 4 gaseosas 500ml.", 75.00, "1606756790138-261d2b21cd75"),
                    ("Combo Pareja", "1/2 pollo + papas + ensalada + 2 gaseosas 500ml.", 45.00, "1598103442097-8b74394b95c6"),
                    ("Combo Súper Familiar", "1 pollo entero + 1/4 pollo extra + papas grandes + ensalada + 4 gaseosas.", 89.00, "1569058242253-92a9c755a0ec"),
                    ("Combo Individual", "1/4 pollo + papas + ensalada + gaseosa 500ml.", 22.00, "1518492104633-130d0cc84637"),
                ],
            },
            {
                "name": "Bebidas",
                "dishes": [
                    ("Inca Kola 500ml", "Gaseosa Inca Kola personal 500ml bien helada.", 5.00, "1437418747212-8d9709afab22"),
                    ("Coca Cola 500ml", "Gaseosa Coca Cola personal 500ml.", 5.00, "1554866585-cd94860890b7"),
                    ("Chicha Morada 1L", "Chicha morada casera preparada con maíz morado, piña y canela.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Maracuyá 1L", "Jugo de maracuyá natural preparado al momento.", 14.00, "1606756790138-261d2b21cd75"),
                    ("Limonada Fría 1L", "Limonada con hierbabuena fría.", 10.00, "1606756790138-261d2b21cd75"),
                ],
            },
        ],
    },
    # 2) CHIFA — Layout double, dark, rojo chino + dorado, Playfair Display, expanded, medium img
    {
        "key": "chifa",
        "name": "Chifa Dragón de Oro",
        "slug": "chifa-dragon-de-oro",
        "slogan": "Tradición china peruana desde 1985",
        "description": "Auténtica comida china-peruana preparada por chefs cantoneses. Wok al fuego, ingredientes frescos y el verdadero sabor del chifa peruano.",
        "whatsapp": "+51987654322",
        "color": "#c1121f",
        "secondary": "#1a1a2e",
        "currency": "S/",
        "logo": unsplash("1525755662778-989d0524087e", 400, 400),
        "cover": unsplash("1582450871972-ab5ca641643d", 1600, 600),
        "theme": {
            "layout": "double",
            "dark_mode": True,
            "card_style": "expanded",
            "image_size": "medium",
            "font": "Playfair Display",
            "show_search": True,
            "show_category_icons": True,
            "rounded_corners": True,
            "dish_gallery": True,
            "carta_style": False,
            "carta_list_style": False,
            "carta_autoscroll": False,
            "carta_scroll_speed": 30,
        },
        "social": {
            "facebook": "https://facebook.com/chifadragondeoro",
            "instagram": "https://instagram.com/dragondeoro",
        },
        "categories": [
            {
                "name": "Entradas",
                "dishes": [
                    ("Wantán Frito (12 u)", "12 wantanes crujientes rellenos de carne de cerdo, con salsa tamarindo.", 18.00, "1606756790138-261d2b21cd75"),
                    ("Sopa Wantán", "Sopa con wantanes de cerdo, pollo, huevos y cebollita china.", 16.00, "1504674900247-0877df9cc836"),
                    ("Tallarín Saltado Kallu", "Tallarín chino saltado al wok con pollo, sillao y vegetales.", 22.00, "1606756790138-261d2b21cd75"),
                    ("Chijaukay de Pollo", "Pollo rebozado frito con salsa dulce-tamarindo y semillas de sésamo.", 26.00, "1569058242253-92a9c755a0ec"),
                    ("Ensalada de Wantán", "Wantanes fritos sobre lechuga con aderezo de mostaza y sillao.", 20.00, "1512621776951-a57141f2eefd"),
                ],
            },
            {
                "name": "Sopas",
                "dishes": [
                    ("Sopa Wantán Especial", "Caldo de pollo con wantanes, pollo, huevos y cebollita china.", 18.00, "1606756790138-261d2b21cd75"),
                    ("Sopa Fuchifú", "Sopa de arroz inflado con pollo, huevos y cebollita china.", 16.00, "1606756790138-261d2b21cd75"),
                    ("SuedPa", "Sopa con fideos chinos, mariscos, pollo y huevos.", 28.00, "1606756790138-261d2b21cd75"),
                    ("Sopa de Mariscos", "Caldo con camarones, calamar, pescado y huevos.", 32.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Arroz Chaufa",
                "dishes": [
                    ("Arroz Chaufa de Pollo", "Arroz frito al wok con pollo, huevos, sillao y cebollita china.", 22.00, "1525755662778-989d0524087e"),
                    ("Arroz Chaufa de Camarón", "Arroz frito con camarones, huevos y vegetales.", 32.00, "1582450871972-ab5ca641643d"),
                    ("Arroz Chaufa Especial", "Arroz frito con pollo, camarón, jamón y huevos.", 36.00, "1582450871972-ab5ca641643d"),
                    ("Arroz Chaufa con Tallarín", "Mitad arroz chaufa, mitad tallarín saltado. Para indecisos.", 28.00, "1606756790138-261d2b21cd75"),
                    ("Arroz Tipakay", "Arroz frito con pollo rebozado, jamón y huevos.", 30.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Tallarines",
                "dishes": [
                    ("Tallarín Saltado de Pollo", "Fideos chinos saltados al wok con pollo, sillao y cebollita china.", 24.00, "1606756790138-261d2b21cd75"),
                    ("Tallarín Saltado de Camarón", "Fideos chinos saltados con camarones y vegetales.", 34.00, "1606756790138-261d2b21cd75"),
                    ("Tallarín Saltado Especial", "Fideos con pollo, camarón, jamón y huevos.", 38.00, "1606756790138-261d2b21cd75"),
                    ("Tallarín con Tamarindo", "Fideos chinos con salsa tamarindo y pollo rebozado.", 28.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Especiales",
                "dishes": [
                    ("Pollo Chi Jau Kay", "Pollo rebozado crujiente con salsa tamarindo dulce.", 28.00, "1569058242253-92a9c755a0ec"),
                    ("Camarón Chi Jau Kay", "Camarones rebozados con salsa tamarindo.", 42.00, "1606756790138-261d2b21cd75"),
                    ("Pollo Kallu", "Pollo deshilachado saltado con tallarín, ajo y sillao.", 26.00, "1606756790138-261d2b21cd75"),
                    ("Japu", "Arroz chaufa cubierto con pollo saltado al wok.", 32.00, "1606756790138-261d2b21cd75"),
                    ("Pollo Sueco", "Pollo frito con salsa agridulce de tomate.", 26.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Bebidas",
                "dishes": [
                    ("Té Chino", "Té de jazmín caliente para acompañar la comida.", 4.00, "1606756790138-261d2b21cd75"),
                    ("Chicha Morada 1L", "Chicha morada casera preparada con maíz morado.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Inca Kola 1.5L", "Gaseosa Inca Kola 1.5 litros para compartir.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Coca Cola 1.5L", "Gaseosa Coca Cola 1.5 litros.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Limón Frío 1L", "Limonada con hierbabuena bien fría.", 10.00, "1606756790138-261d2b21cd75"),
                ],
            },
        ],
    },
    # 3) PIZZERÍA — Layout grid, light, rojo italiano + crema, Playfair Display, minimal, medium img
    {
        "key": "pizzeria",
        "name": "Pizzería Bella Napoli",
        "slug": "pizzeria-bella-napoli",
        "slogan": "Auténtica pizza napolitana al horno de piedra",
        "description": "Pizza artesanal hecha con masa madre y horno de piedra. Ingredientes importados de Italia y mozzarella fior di latte.",
        "whatsapp": "+51987654323",
        "color": "#bc4749",
        "secondary": "#f2e8cf",
        "currency": "S/",
        "logo": unsplash("1513104890138-7c749659a591", 400, 400),
        "cover": unsplash("1565299624946-b28f40a0ae38", 1600, 600),
        "theme": {
            "layout": "grid",
            "dark_mode": False,
            "card_style": "minimal",
            "image_size": "medium",
            "font": "Playfair Display",
            "show_search": True,
            "show_category_icons": True,
            "rounded_corners": True,
            "dish_gallery": True,
            "carta_style": False,
            "carta_list_style": False,
            "carta_autoscroll": False,
            "carta_scroll_speed": 30,
        },
        "social": {
            "instagram": "https://instagram.com/bellanapoli_pe",
            "facebook": "https://facebook.com/bellanapolipizzeria",
            "tiktok": "https://tiktok.com/@bellanapoli",
        },
        "categories": [
            {
                "name": "Pizzas Clásicas",
                "dishes": [
                    ("Pizza Margherita", "Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca y aceite de oliva.", 38.00, "1513104890138-7c749659a591"),
                    ("Pizza Napolitana", "Salsa de tomate, mozzarella, anchoas, alcaparras y orégano.", 42.00, "1574071318508-1cdbab80d002"),
                    ("Pizza Pepperoni", "Salsa de tomate, mozzarella y pepperoni picante.", 44.00, "1565299624946-b28f40a0ae38"),
                    ("Pizza Quattro Formaggi", "Mozzarella, gorgonzola, parmesano y fontina.", 48.00, "1604382354936-07c5d9983bd3"),
                    ("Pizza Quattro Stagioni", "Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas.", 46.00, "1593560708920-61dd98c46a4e"),
                    ("Pizza Prosciutto e Funghi", "Tomate, mozzarella, jamón italiano y champiñones frescos.", 44.00, "1604382354936-07c5d9983bd3"),
                ],
            },
            {
                "name": "Pizzas Especiales",
                "dishes": [
                    ("Pizza Diavola", "Salsa de tomate, mozzarella, salame picante y ají molido.", 46.00, "1574071318508-1cdbab80d002"),
                    ("Pizza Capricciosa", "Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas.", 48.00, "1571997478779-2adcbbe9ab2f"),
                    ("Pizza Tartufo", "Mozzarella, crema de trufa negra y champiñones porcini.", 58.00, "1604382354936-07c5d9983bd3"),
                    ("Pizza Burrata", "Pizza margherita cubierta con burrata fresca y tomates cherry.", 56.00, "1565299624946-b28f40a0ae38"),
                    ("Pizza Parma", "Tomate, mozzarella, jamón de Parma, rúcula y parmesano.", 54.00, "1565299624946-b28f40a0ae38"),
                    ("Pizza Frutti di Mare", "Salsa de tomate, mozzarella, camarones, calamar y mejillones.", 62.00, "1604382354936-07c5d9983bd3"),
                ],
            },
            {
                "name": "Pastas",
                "dishes": [
                    ("Spaghetti Bolognesa", "Espaguetis con salsa de carne de res y tomate al estilo italiano.", 32.00, "1551183053-bf91a1d81141"),
                    ("Spaghetti Carbonara", "Espaguetis con panceta, huevo, pecorino y pimienta negra.", 36.00, "1551183053-bf91a1d81141"),
                    ("Fettuccine Alfredo", "Fettuccine con salsa cremosa de parmesano y mantequilla.", 34.00, "1574894709920-11b28e7367e3"),
                    ("Lasagna Bolognesa", "Capas de pasta con ragú de carne, bechamel y parmesano.", 38.00, "1574894709920-11b28e7367e3"),
                    ("Ravioli di Ricotta", "Raviolis rellenos de ricotta y espinaca con salsa de tomate.", 40.00, "1604382354936-07c5d9983bd3"),
                ],
            },
            {
                "name": "Entradas",
                "dishes": [
                    ("Bruschetta Classica", "Pan tostado con tomate fresco, ajo, albahaca y aceite de oliva.", 18.00, "1544025162-d76694265947"),
                    ("Caprese", "Tomate, mozzarella fresca, albahaca y aceite de oliva.", 24.00, "1544025162-d76694265947"),
                    ("Antipasto Italiano", "Tabla de jamón, salame, quesos, aceitunas y vegetales asados.", 38.00, "1544025162-d76694265947"),
                    ("Garlic Bread", "Pan al ajo con mantequilla y perejil, gratinado con parmesano.", 14.00, "1601924994987-69e26d50dc26"),
                    ("Calamari Fritti", "Anillos de calamar rebozados con salsa marinara.", 28.00, "1599487488170-d11ec9c172f0"),
                ],
            },
            {
                "name": "Postres",
                "dishes": [
                    ("Tiramisú", "Bizcocho bañado en café, crema de mascarpone y cacao.", 18.00, "1571877227200-a0d98ea607e9"),
                    ("Panna Cotta", "Crema cocida con vainilla y coulis de frutos rojos.", 16.00, "1488477181946-6428a0291777"),
                    ("Cannoli Siciliani", "Crepes rellenos de crema de ricotta y pistachos.", 17.00, "1606756790138-261d2b21cd75"),
                    ("Gelato (2 bolas)", "Helado artesanal italiano, sabores a elección.", 14.00, "1606756790138-261d2b21cd75"),
                ],
            },
            {
                "name": "Bebidas",
                "dishes": [
                    ("Vino Tinto Copa", "Copa de vino tinto Sangiovese.", 14.00, "1606756790138-261d2b21cd75"),
                    ("Limonata Italiana", "Limonada con gas al estilo italiano.", 8.00, "1606756790138-261d2b21cd75"),
                    ("Espresso", "Café espresso italiano.", 6.00, "1606756790138-261d2b21cd75"),
                    ("Coca Cola 500ml", "Gaseosa personal.", 5.00, "1606756790138-261d2b21cd75"),
                ],
            },
        ],
    },
    # 4) BURGER HOUSE — Layout single + theme_carta_style=true (carrusel Rappi/PedidosYa), dark, autoscroll
    {
        "key": "burgers",
        "name": "Smash Brothers Burger House",
        "slug": "smash-brothers-burgers",
        "slogan": "Smash burgers hechos con amor y mucho queso",
        "description": "Hamburguesas estilo smash con carne 100% res peruana, pan brioche hecho en casa y salsas artesanales. El verdadero sabor americano en Lima.",
        "whatsapp": "+51987654324",
        "color": "#e63946",
        "secondary": "#1d3557",
        "currency": "S/",
        "logo": unsplash("1568901346375-23c9450c58cd", 400, 400),
        "cover": unsplash("1571091718767-18b5b1457add", 1600, 600),
        "theme": {
            "layout": "single",
            "dark_mode": True,
            "card_style": "compact",
            "image_size": "medium",
            "font": "Inter",
            "show_search": True,
            "show_category_icons": True,
            "rounded_corners": True,
            "dish_gallery": True,
            "carta_style": True,
            "carta_list_style": False,
            "carta_autoscroll": True,
            "carta_scroll_speed": 30,
        },
        "social": {
            "instagram": "https://instagram.com/smashbrothers_pe",
            "tiktok": "https://tiktok.com/@smashbrothers",
            "facebook": "https://facebook.com/smashbrothersburgers",
        },
        "categories": [
            {
                "name": "Smash Burgers",
                "dishes": [
                    ("Single Smash", "1 smash burger de 90g, cheddar, pepinillos, cebolla y salsa smash.", 18.00, "1550547660-d9450f859349"),
                    ("Double Smash", "2 smash burgers de 90g, cheddar doble, pepinillos y salsa smash.", 26.00, "1586190848861-99aa4a171e90"),
                    ("Triple Smash", "3 smash burgers de 90g, cheddar triple, todo completo.", 34.00, "1571091718767-18b5b1457add"),
                    ("Bacon Smash", "Double smash burger con tocino crujiente y salsa BBQ.", 30.00, "1568901346375-23c9450c58cd"),
                    ("Cheese Lover", "Double smash con cheddar, americano y mozzarella fundida.", 32.00, "1550547660-d9450f859349"),
                    ("Mushroom Swiss", "Double smash con champiñones salteados y queso suizo.", 30.00, "1568901346375-23c9450c58cd"),
                ],
            },
            {
                "name": "Clásicas",
                "dishes": [
                    ("Classic Cheeseburger", "Carne 150g, cheddar, lechuga, tomate, cebolla y salsa thousand.", 22.00, "1568901346375-23c9450c58cd"),
                    ("Bacon Cheeseburger", "Carne 150g, cheddar, tocino, cebolla caramelizada.", 26.00, "1571091718767-18b5b1457add"),
                    ("BBQ Burger", "Carne 150g, cheddar, tocino, aros de cebolla y salsa BBQ.", 28.00, "1586190848861-99aa4a171e90"),
                    ("Big Brothers", "Doble carne 150g, doble cheddar, tocino y huevo frito.", 34.00, "1550547660-d9450f859349"),
                ],
            },
            {
                "name": "Especiales",
                "dishes": [
                    ("Truffle Burger", "Carne 150g, queso suizo, champiñones y mayo de trufa.", 32.00, "1568901346375-23c9450c58cd"),
                    ("Spicy Mexican", "Carne 150g, jalapeños, guacamole, cheddar y salsa picante.", 28.00, "1565299624946-b28f40a0ae38"),
                    ("Hawaiiana", "Carne 150g, jamón, piña, cheddar y salsa BBQ.", 26.00, "1568901346375-23c9450c58cd"),
                    ("Crispy Chicken", "Pollo crujiente, cheddar, lechuga, pepinillos y mayo chipotle.", 24.00, "1606756790138-261d2b21cd75"),
                    ("Veggie Brothers", "Burger de lentejas y quinoa, lechuga, tomate y aguacate.", 22.00, "1550317138-10000687a72b"),
                ],
            },
            {
                "name": "Hot Dogs",
                "dishes": [
                    ("Classic Dog", "Salchicha de res, cebolla, pepinillos, ketchup y mostaza.", 14.00, "1599487488170-d11ec9c172f0"),
                    ("Bacon Dog", "Salchicha envuelta en tocino, cebolla caramelizada y BBQ.", 18.00, "1599487488170-d11ec9c172f0"),
                    ("Chili Cheese Dog", "Salchicha con chili con carne, cheddar fundido y cebolla.", 20.00, "1599487488170-d11ec9c172f0"),
                ],
            },
            {
                "name": "Acompañamientos",
                "dishes": [
                    ("Papas Fritas", "Corte natural con piel, sal y hierbas.", 9.00, "1573080496219-bb080dd4f877"),
                    ("Papas Gajo", "Papas gajo crujientes con salsa especial.", 12.00, "1573080496219-bb080dd4f877"),
                    ("Papas con Cheddar y Tocino", "Papas cubiertas con cheddar fundido y tocino crujiente.", 18.00, "1573080496219-bb080dd4f877"),
                    ("Aros de Cebolla", "8 aros de cebolla empanizados crujientes.", 12.00, "1639024471283-03518883512d"),
                    ("Nuggets de Pollo (8 u)", "8 nuggets de pollo crujientes con salsa a elección.", 14.00, "1607013251379-e6eecfffe234"),
                ],
            },
            {
                "name": "Combos",
                "dishes": [
                    ("Combo Smash Brothers", "Double Smash + papas + gaseosa 500ml.", 36.00, "1571091718767-18b5b1457add"),
                    ("Combo Clásico", "Classic Cheeseburger + papas + gaseosa 500ml.", 30.00, "1568901346375-23c9450c58cd"),
                    ("Combo Familiar 4 personas", "4 burgers clásicas + 2 papas grandes + 4 gaseosas.", 110.00, "1571091718767-18b5b1457add"),
                    ("Combo Pareja", "2 burgers + 1 papas grande + 2 gaseosas.", 56.00, "1568901346375-23c9450c58cd"),
                ],
            },
            {
                "name": "Bebidas",
                "dishes": [
                    ("Coca Cola 500ml", "Gaseosa personal bien fría.", 5.00, "1554866585-cd94860890b7"),
                    ("Inca Kola 500ml", "Gaseosa Inca Kola personal.", 5.00, "1554866585-cd94860890b7"),
                    ("Limonada Fría 500ml", "Limonada con hierbabuena bien helada.", 7.00, "1606756790138-261d2b21cd75"),
                    ("Milkshake Clásico", "Malteada de vainilla, chocolate o fresa (400ml).", 14.00, "1606756790138-261d2b21cd75"),
                    ("Cerveza Artesanal", "Cerveza artesanal nacional 330ml.", 12.00, "1606756790138-261d2b21cd75"),
                ],
            },
        ],
    },
    # 5) CEVICICHERÍA — Layout single + theme_carta_list_style=true (lista Rappi), light, azul marino + celeste, minimal
    {
        "key": "cevicheria",
        "name": "La Mar Cevichería",
        "slug": "cevicheria-la-mar",
        "slogan": "La frescura del mar peruano en cada plato",
        "description": "Cevichería peruana con pescado fresco del día. Especialidades en ceviches, tiraditos, leche de tigre y mariscos. Tradición costeña desde 1998.",
        "whatsapp": "+51987654325",
        "color": "#0077b6",
        "secondary": "#caf0f8",
        "currency": "S/",
        "logo": unsplash("1559847844-5315695dadae", 400, 400),
        "cover": unsplash("1559847844-5315695dadae", 1600, 600),
        "theme": {
            "layout": "single",
            "dark_mode": False,
            "card_style": "minimal",
            "image_size": "medium",
            "font": "Inter",
            "show_search": True,
            "show_category_icons": True,
            "rounded_corners": True,
            "dish_gallery": True,
            "carta_style": False,
            "carta_list_style": True,
            "carta_autoscroll": False,
            "carta_scroll_speed": 30,
        },
        "social": {
            "facebook": "https://facebook.com/lamarcevicheria",
            "instagram": "https://instagram.com/lamarcevicheria",
        },
        "categories": [
            {
                "name": "Ceviches",
                "dishes": [
                    ("Ceviche Clásico", "Pescado fresco en leche de tigre, cebolla morada, camote, choclo y ají limo.", 28.00, "1559847844-5315695dadae"),
                    ("Ceviche Mixto", "Pescado, camarones, calamar y conchas de abanico en leche de tigre.", 38.00, "1559847844-5315695dadae"),
                    ("Ceviche de Camarón", "Camarones frescos en leche de tigre con ají limo y cebolla.", 36.00, "1599487488170-d11ec9c172f0"),
                    ("Ceviche de Conchas Negras", "Conchas negras frescas en leche de tigre clásica.", 48.00, "1559847844-5315695dadae"),
                    ("Ceviche de Pota", "Pota (calamar gigante) en leche de tigre con cebolla y camote.", 26.00, "1559847844-5315695dadae"),
                    ("Ceviche Norteño", "Pescado en leche de tigre al estilo norteño con ají mocho.", 30.00, "1559847844-5315695dadae"),
                ],
            },
            {
                "name": "Tiraditos",
                "dishes": [
                    ("Tiradito Clásico", "Filetes de pescado cortados fino en leche de tigre, ají limo y sésamo.", 32.00, "1559847844-5315695dadae"),
                    ("Tiradito Apanado", "Tiradito de pescado rebozado frito con salsa criolla.", 30.00, "1559847844-5315695dadae"),
                    ("Tiradito de Atún", "Atún fresco en salsa acevichada con ají amarillo.", 36.00, "1615144564660-989e8d4d70c3"),
                    ("Tiradito Tricolor", "Tres tiraditos: ají amarillo, ají limo y acevichado.", 38.00, "1559847844-5315695dadae"),
                ],
            },
            {
                "name": "Leches de Tigre",
                "dishes": [
                    ("Leche de Tigre Clásica", "Caldo de ceviche con trozos de pescado, cebolla y ají limo.", 22.00, "1559847844-5315695dadae"),
                    ("Leche de Pantera", "Leche de tigre con mariscos negros, más intensa.", 28.00, "1615144564660-989e8d4d70c3"),
                    ("Leche de Tigre Mixta", "Con pescado, camarón, calamar y conchas.", 30.00, "1559847844-5315695dadae"),
                    ("Leche de Tigre con Camarón", "Leche de tigre con camarones frescos.", 26.00, "1563897539633-7964b1d54c7e"),
                ],
            },
            {
                "name": "Pescados",
                "dishes": [
                    ("Chicharrón de Pescado", "Pescado frito crujiente con yuca y salsa criolla.", 30.00, "1615144564660-989e8d4d70c3"),
                    ("Pescado Frito", "Filete de pescado frito con yuca, cebolla y limón.", 28.00, "1615144564660-989e8d4d70c3"),
                    ("Pescado a lo Macho", "Filete de pescado en salsa de mariscos con ají.", 36.00, "1615144564660-989e8d4d70c3"),
                    ("Sudado de Pescado", "Pescado cocido al vapor con cebolla, tomate y cilantro.", 30.00, "1615144564660-989e8d4d70c3"),
                    ("Filete a la Plancha", "Filete de pescado a la plancha con guarnición a elección.", 32.00, "1615144564660-989e8d4d70c3"),
                ],
            },
            {
                "name": "Mariscos",
                "dishes": [
                    ("Chicharrón de Mariscos", "Mezcla de mariscos rebozados fritos con yuca y salsa criolla.", 38.00, "1615144564660-989e8d4d70c3"),
                    ("Arroz con Mariscos", "Arroz graneado con mariscos salteados al wok.", 36.00, "1565299624946-b28f40a0ae38"),
                    ("Parihuela de Mariscos", "Sopa de mariscos con pescado, camarón, calamar y conchas.", 42.00, "1615144564660-989e8d4d70c3"),
                    ("Jalea Mixta", "Pescado y mariscos rebozados fritos con yuca y salsa criolla.", 40.00, "1615144564660-989e8d4d70c3"),
                    ("Conchas a la Parmesana", "Conchas de abanico gratinadas con parmesano y vino blanco.", 36.00, "1615144564660-989e8d4d70c3"),
                ],
            },
            {
                "name": "Entradas",
                "dishes": [
                    ("Causa de Camarón", "Causa limeña de papa amarilla con relleno de camarón.", 22.00, "1615144564660-989e8d4d70c3"),
                    ("Causa de Atún", "Causa de papa amarilla con relleno de atún y palta.", 18.00, "1615144564660-989e8d4d70c3"),
                    ("Pulpo al Olivo", "Pulpo cocido con salsa de aceitunas botija y pan tostado.", 32.00, "1615144564660-989e8d4d70c3"),
                    ("Anticucho de Corazón", "4 anticuchos de corazón de res con papa y ají.", 24.00, "1615144564660-989e8d4d70c3"),
                    ("Tequeños de Mariscos (6 u)", "6 tequeños rellenos de mariscos con salsa tártara.", 22.00, "1615144564660-989e8d4d70c3"),
                ],
            },
            {
                "name": "Bebidas",
                "dishes": [
                    ("Chicha Morada 1L", "Chicha morada casera preparada con maíz morado, piña y canela.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Maracuyá 1L", "Jugo de maracuyá natural preparado al momento.", 14.00, "1606756790138-261d2b21cd75"),
                    ("Cerveza Cusqueña 620ml", "Cerveza nacional bien helada.", 12.00, "1606756790138-261d2b21cd75"),
                    ("Limonada Fría 1L", "Limonada con hierbabuena bien fría.", 10.00, "1606756790138-261d2b21cd75"),
                    ("Inca Kola 1.5L", "Gaseosa Inca Kola 1.5L para compartir.", 12.00, "1606756790138-261d2b21cd75"),
                ],
            },
        ],
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Generación SQL
# ─────────────────────────────────────────────────────────────────────────────

def sql_escape(text: str) -> str:
    """Escapa comillas simples para SQL."""
    if text is None:
        return ""
    return text.replace("'", "''")


def gen_sql() -> str:
    pwd_hash = hash_password(DEMO_PASSWORD)

    lines = []
    a = lines.append

    # Header
    a("-- ============================================================")
    a("-- MENU PRO — CUENTA DEMO CON 5 MENÚS POBLADOS")
    a("-- ============================================================")
    a("-- Este script es IDEMPOTENTE: puede ejecutarse cuantas veces")
    a("-- quieras sin riesgo. Solo crea lo que falta o actualiza lo")
    a("-- existente.")
    a("--")
    a("-- Credenciales demo:")
    a(f"--   Email:    {DEMO_EMAIL}")
    a(f"--   Password: {DEMO_PASSWORD}")
    a("--")
    a("-- Plan: FULL (white-label, todas las funcionalidades)")
    a("--")
    a("-- 5 menús de distintos rubros:")
    a("--   1. Pollería El Dorado Chicken     (single, dark, expanded, large)")
    a("--   2. Chifa Dragón de Oro            (double, dark, Playfair, medium)")
    a("--   3. Pizzería Bella Napoli          (grid, light, minimal, Playfair)")
    a("--   4. Smash Brothers Burger House    (single + carta_style=carrusel Rappi)")
    a("--   5. La Mar Cevichería              (single + carta_list_style=lista Rappi)")
    a("--")
    a("-- Total: ~25 categorías y ~115 platos con imágenes WebP de Unsplash")
    a("-- ============================================================")
    a("")
    a("-- ────────────────────────────────────────────────────────────")
    a("-- PASO 0: Asegurar que el enum user_plan tiene todos los valores")
    a("-- ────────────────────────────────────────────────────────────")
    a("ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'premium';")
    a("ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'full';")
    a("")
    a("-- ────────────────────────────────────────────────────────────")
    a("-- PASO 1: Crear usuario en auth.users (con password bcrypt)")
    a("-- ────────────────────────────────────────────────────────────")
    a("-- Si el usuario ya existe (mismo email), NO lo modificamos.")
    a("INSERT INTO auth.users (")
    a("  id, instance_id, aud, role, email,")
    a("  encrypted_password, email_confirmed_at,")
    a("  raw_app_meta_data, raw_user_meta_data,")
    a("  created_at, updated_at, last_sign_in_at,")
    a("  confirmation_token, recovery_token,")
    a("  email_change_token_new, email_change,")
    a("  phone, phone_confirmed_at,")
    a("  banned_until, is_sso_user, deleted_at")
    a(") VALUES (")
    a(f"  '{DEMO_USER_ID}'::uuid,")
    a(f"  '00000000-0000-0000-0000-000000000000'::uuid,")
    a("  'authenticated',")
    a("  'authenticated',")
    a(f"  '{sql_escape(DEMO_EMAIL)}',")
    a(f"  '{sql_escape(pwd_hash)}',")
    a("  NOW(),")
    a("  '{}'::jsonb,")
    a(f"  '{{\"full_name\":\"{sql_escape(DEMO_FULL_NAME)}\"}}'::jsonb,")
    a("  NOW(),")
    a("  NOW(),")
    a("  NOW(),")
    a("  '',")
    a("  '',")
    a("  '',")
    a("  '',")
    a("  '',")
    a("  NULL,")
    a("  NULL,")
    a("  FALSE,")
    a("  NULL")
    a(") ON CONFLICT (id) DO NOTHING;")
    a("")
    a("-- Si el email ya existe pero con otro ID, intentamos por email")
    a(f"-- (esto puede fallar si hay otro usuario con ese email —")
    a("-- en ese caso elimina primero el usuario existente desde el")
    a("-- panel de Supabase → Authentication → Users).")
    a("")
    a("-- Asegurar identidad en auth.identities")
    a("INSERT INTO auth.identities (")
    a("  id, user_id, identity_data, identity_id, provider, last_sign_in_at, created_at, updated_at")
    a(") VALUES (")
    a(f"  '{uid('identity-demo')}'::uuid,")
    a(f"  '{DEMO_USER_ID}'::uuid,")
    a(f"  '{{\"sub\":\"{DEMO_USER_ID}\",\"email\":\"{sql_escape(DEMO_EMAIL)}\"}}'::jsonb,")
    a(f"  '{DEMO_USER_ID}',")
    a("  'email',")
    a("  NOW(),")
    a("  NOW(),")
    a("  NOW()")
    a(") ON CONFLICT DO NOTHING;")
    a("")
    a("-- ────────────────────────────────────────────────────────────")
    a("-- PASO 2: Crear profile con plan='full'")
    a("-- ────────────────────────────────────────────────────────────")
    a("INSERT INTO profiles (")
    a("  id, email, full_name, plan, is_super_admin, is_active,")
    a("  created_at, updated_at")
    a(") VALUES (")
    a(f"  '{DEMO_PROFILE_ID}'::uuid,")
    a(f"  '{sql_escape(DEMO_EMAIL)}',")
    a(f"  '{sql_escape(DEMO_FULL_NAME)}',")
    a("  'full',")
    a("  FALSE,")
    a("  TRUE,")
    a("  NOW(),")
    a("  NOW()")
    a(") ON CONFLICT (id) DO UPDATE SET")
    a("  email = EXCLUDED.email,")
    a("  full_name = EXCLUDED.full_name,")
    a("  plan = 'full',")
    a("  is_active = TRUE,")
    a("  updated_at = NOW();")
    a("")

    # Para cada restaurante
    for r_idx, r in enumerate(RESTAURANTS, 1):
        menu_id = uid(f"menu-{r['key']}")
        a("")
        a("-- ════════════════════════════════════════════════════════════")
        a(f"-- MENÚ {r_idx}: {r['name']}")
        a("-- ════════════════════════════════════════════════════════════")
        a("")
        a("INSERT INTO menus (")
        a("  id, user_id, name, slug, slogan, description, whatsapp,")
        a("  color, currency, logo_url, branding_text, is_published,")
        a("  theme_color_secondary, theme_font, theme_layout,")
        a("  theme_image_size, theme_card_style, theme_cover_url,")
        a("  theme_show_search, theme_show_category_icons,")
        a("  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,")
        a("  theme_carta_style, theme_carta_list_style,")
        a("  theme_carta_autoscroll, theme_carta_scroll_speed,")
        a("  social_facebook, social_instagram, social_whatsapp,")
        a("  social_tiktok, social_twitter, social_youtube, social_web,")
        a("  created_at, updated_at")
        a(") VALUES (")
        a(f"  '{menu_id}'::uuid,")
        a(f"  '{DEMO_USER_ID}'::uuid,")
        a(f"  '{sql_escape(r['name'])}',")
        a(f"  '{sql_escape(r['slug'])}',")
        a(f"  '{sql_escape(r['slogan'])}',")
        a(f"  '{sql_escape(r['description'])}',")
        a(f"  '{sql_escape(r['whatsapp'])}',")
        a(f"  '{r['color']}',")
        a(f"  '{r['currency']}',")
        a(f"  '{sql_escape(r['logo'])}',")
        a("  NULL,")  # branding_text NULL = white-label (plan Full)
        a("  TRUE,")
        a(f"  '{r['secondary']}',")
        a(f"  '{r['theme']['font']}',")
        a(f"  '{r['theme']['layout']}',")
        a(f"  '{r['theme']['image_size']}',")
        a(f"  '{r['theme']['card_style']}',")
        a(f"  '{sql_escape(r['cover'])}',")
        a(f"  {('TRUE' if r['theme']['show_search'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['show_category_icons'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['rounded_corners'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['dark_mode'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['dish_gallery'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['carta_style'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['carta_list_style'] else 'FALSE')},")
        a(f"  {('TRUE' if r['theme']['carta_autoscroll'] else 'FALSE')},")
        a(f"  {r['theme']['carta_scroll_speed']},")
        a(f"  {("'" + sql_escape(r['social'].get('facebook','')) + "'") if r['social'].get('facebook') else 'NULL'},")
        a(f"  {("'" + sql_escape(r['social'].get('instagram','')) + "'") if r['social'].get('instagram') else 'NULL'},")
        a(f"  {("'" + sql_escape(r['whatsapp']) + "'")},")
        a(f"  {("'" + sql_escape(r['social'].get('tiktok','')) + "'") if r['social'].get('tiktok') else 'NULL'},")
        a(f"  {("'" + sql_escape(r['social'].get('twitter','')) + "'") if r['social'].get('twitter') else 'NULL'},")
        a(f"  {("'" + sql_escape(r['social'].get('youtube','')) + "'") if r['social'].get('youtube') else 'NULL'},")
        a(f"  {("'" + sql_escape(r['social'].get('web','')) + "'") if r['social'].get('web') else 'NULL'},")
        a("  NOW(), NOW()")
        a(") ON CONFLICT (id) DO UPDATE SET")
        a("  name = EXCLUDED.name,")
        a("  slug = EXCLUDED.slug,")
        a("  slogan = EXCLUDED.slogan,")
        a("  description = EXCLUDED.description,")
        a("  whatsapp = EXCLUDED.whatsapp,")
        a("  color = EXCLUDED.color,")
        a("  currency = EXCLUDED.currency,")
        a("  logo_url = EXCLUDED.logo_url,")
        a("  branding_text = EXCLUDED.branding_text,")
        a("  is_published = TRUE,")
        a("  theme_color_secondary = EXCLUDED.theme_color_secondary,")
        a("  theme_font = EXCLUDED.theme_font,")
        a("  theme_layout = EXCLUDED.theme_layout,")
        a("  theme_image_size = EXCLUDED.theme_image_size,")
        a("  theme_card_style = EXCLUDED.theme_card_style,")
        a("  theme_cover_url = EXCLUDED.theme_cover_url,")
        a("  theme_show_search = EXCLUDED.theme_show_search,")
        a("  theme_show_category_icons = EXCLUDED.theme_show_category_icons,")
        a("  theme_rounded_corners = EXCLUDED.theme_rounded_corners,")
        a("  theme_dark_mode = EXCLUDED.theme_dark_mode,")
        a("  theme_dish_gallery = EXCLUDED.theme_dish_gallery,")
        a("  theme_carta_style = EXCLUDED.theme_carta_style,")
        a("  theme_carta_list_style = EXCLUDED.theme_carta_list_style,")
        a("  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,")
        a("  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,")
        a("  social_facebook = EXCLUDED.social_facebook,")
        a("  social_instagram = EXCLUDED.social_instagram,")
        a("  social_whatsapp = EXCLUDED.social_whatsapp,")
        a("  social_tiktok = EXCLUDED.social_tiktok,")
        a("  social_twitter = EXCLUDED.social_twitter,")
        a("  social_youtube = EXCLUDED.social_youtube,")
        a("  social_web = EXCLUDED.social_web,")
        a("  updated_at = NOW();")
        a("")

        # Asegurar slug único (si existe otro usuario con mismo slug)
        # El UNIQUE index es (user_id, slug) por lo que está bien

        # Para cada categoría
        for c_idx, cat in enumerate(r["categories"]):
            cat_id = uid(f"cat-{r['key']}-{c_idx}")
            a(f"-- Categoría {c_idx+1}: {cat['name']}")
            a("INSERT INTO categories (")
            a("  id, menu_id, name, sort_order, created_at")
            a(") VALUES (")
            a(f"  '{cat_id}'::uuid,")
            a(f"  '{menu_id}'::uuid,")
            a(f"  '{sql_escape(cat['name'])}',")
            a(f"  {c_idx},")
            a("  NOW()")
            a(") ON CONFLICT (id) DO UPDATE SET")
            a("  name = EXCLUDED.name,")
            a("  sort_order = EXCLUDED.sort_order;")
            a("")

            for d_idx, (dname, ddesc, dprice, dphoto) in enumerate(cat["dishes"]):
                dish_id = uid(f"dish-{r['key']}-{c_idx}-{d_idx}")
                img_url = unsplash(dphoto)
                a("INSERT INTO dishes (")
                a("  id, category_id, name, description, price, image_url, sort_order, created_at")
                a(") VALUES (")
                a(f"  '{dish_id}'::uuid,")
                a(f"  '{cat_id}'::uuid,")
                a(f"  '{sql_escape(dname)}',")
                a(f"  '{sql_escape(ddesc)}',")
                a(f"  {dprice},")
                a(f"  '{sql_escape(img_url)}',")
                a(f"  {d_idx},")
                a("  NOW()")
                a(") ON CONFLICT (id) DO UPDATE SET")
                a("  name = EXCLUDED.name,")
                a("  description = EXCLUDED.description,")
                a("  price = EXCLUDED.price,")
                a("  image_url = EXCLUDED.image_url,")
                a("  sort_order = EXCLUDED.sort_order;")
                a("")

    # Resumen final
    a("-- ════════════════════════════════════════════════════════════")
    a("-- VERIFICACIÓN")
    a("-- ════════════════════════════════════════════════════════════")
    a("DO $$ BEGIN")
    a(f"  RAISE NOTICE '✅ Cuenta demo creada: {DEMO_EMAIL} (plan FULL)';")
    a(f"  RAISE NOTICE '🔑 Password: {DEMO_PASSWORD}';")
    a("END $$;")
    a("")
    a("SELECT 'menus creados' AS info, COUNT(*) AS total FROM menus WHERE user_id = '" + DEMO_USER_ID + "'::uuid;")
    a("SELECT 'categorias creadas' AS info, COUNT(*) AS total FROM categories WHERE menu_id IN (SELECT id FROM menus WHERE user_id = '" + DEMO_USER_ID + "'::uuid);")
    a("SELECT 'platos creados' AS info, COUNT(*) AS total FROM dishes WHERE category_id IN (SELECT c.id FROM categories c JOIN menus m ON m.id = c.menu_id WHERE m.user_id = '" + DEMO_USER_ID + "'::uuid);")
    a("")
    a("-- URLs públicas de los 5 menús (después de deploy):")
    for r in RESTAURANTS:
        a(f"-- https://menudigital-pro.vercel.app/r/{r['slug']}")
    a("")
    a("-- ════════════════════════════════════════════════════════════")
    a("-- FIN DEL SCRIPT")
    a("-- ════════════════════════════════════════════════════════════")

    return "\n".join(lines) + "\n"


def main() -> None:
    sql = gen_sql()

    # Guardar en supabase/
    out_supabase = "/home/z/my-project/supabase/seed-demo-account.sql"
    with open(out_supabase, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"✅ SQL guardado en {out_supabase}")

    # Copia a download/ para entrega al usuario
    out_download = "/home/z/my-project/download/seed-demo-account.sql"
    import shutil
    shutil.copyfile(out_supabase, out_download)
    print(f"✅ Copia para descarga en {out_download}")

    # Imprimir resumen
    print(f"\n📊 Resumen:")
    total_cats = sum(len(r["categories"]) for r in RESTAURANTS)
    total_dishes = sum(len(c["dishes"]) for r in RESTAURANTS for c in r["categories"])
    print(f"  Restaurantes: {len(RESTAURANTS)}")
    print(f"  Categorías:   {total_cats}")
    print(f"  Platos:       {total_dishes}")
    print(f"  Email:        {DEMO_EMAIL}")
    print(f"  Password:     {DEMO_PASSWORD}")
    print(f"  Plan:         FULL")
    print(f"  Tamaño SQL:   {len(sql):,} bytes / {sql.count(chr(10))} líneas")


if __name__ == "__main__":
    main()
