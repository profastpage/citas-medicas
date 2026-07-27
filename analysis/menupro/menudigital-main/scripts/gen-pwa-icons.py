#!/usr/bin/env python3
"""
Genera todos los íconos PWA necesarios para MenuPro.
- icon-72x72.png hasta icon-512x512.png (any)
- icon-192x192-maskable.png y icon-512x512-maskable.png (con safe zone del 80%)
- apple-touch-icon.png (180x180)
- favicon-32x32.png, favicon-16x16.png
- screenshot-mobile.png y screenshot-desktop.png (placeholders)
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = "/home/z/my-project/public/icons"
os.makedirs(OUT_DIR, exist_ok=True)

# Colores de marca MenuPro (naranja → rojo)
BRAND_BG = (255, 107, 53)       # #ff6b35
BRAND_BG2 = (230, 57, 70)       # #e63946
BRAND_FG = (255, 255, 255)
MASKABLE_BG = (7, 7, 11)        # #07070b (tema oscuro)


def gradient_bg(size, color1, color2, diagonal=True):
    """Crea un fondo con gradiente diagonal."""
    img = Image.new("RGB", (size, size), color1)
    draw = ImageDraw.Draw(img)
    if diagonal:
        for i in range(size):
            # Interpolación lineal entre color1 y color2
            t = i / size
            r = int(color1[0] * (1 - t) + color2[0] * t)
            g = int(color1[1] * (1 - t) + color2[1] * t)
            b = int(color1[2] * (1 - t) + color2[2] * t)
            draw.line([(i, 0), (i, size)], fill=(r, g, b))
    return img


def draw_letter_m(img, size, color, safe_zone_factor=1.0):
    """Dibuja la letra 'M' estilizada centrada."""
    draw = ImageDraw.Draw(img)
    # El factor de zona segura reduce el tamaño de la letra para maskable
    letter_size = int(size * 0.55 * safe_zone_factor)
    # Margen desde el centro
    margin = (size - letter_size) // 2

    # Buscar una fuente del sistema
    font_path = None
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            font_path = c
            break
    try:
        font = ImageFont.truetype(font_path, letter_size) if font_path else ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    # Medir la letra para centrarla
    try:
        bbox = draw.textbbox((0, 0), "M", font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
    except Exception:
        text_w, text_h = letter_size, letter_size

    x = (size - text_w) // 2
    y = (size - text_h) // 2 - int(size * 0.05)
    draw.text((x, y), "M", fill=color, font=font)


def make_icon(size, maskable=False):
    """Genera un ícono de tamaño dado."""
    if maskable:
        # Maskable: fondo sólido oscuro + gradiente circular en zona segura (80%)
        img = Image.new("RGB", (size, size), MASKABLE_BG)
        # Dibujar círculo gradiente en el centro (80% del tamaño)
        safe_size = int(size * 0.8)
        gradient = gradient_bg(safe_size, BRAND_BG, BRAND_BG2)
        # Crear máscara circular
        mask = Image.new("L", (safe_size, safe_size), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse([0, 0, safe_size - 1, safe_size - 1], fill=255)
        # Pegar el gradiente circular en el centro
        offset = (size - safe_size) // 2
        img.paste(gradient, (offset, offset), mask)
        draw_letter_m(img, size, BRAND_FG, safe_zone_factor=0.75)
    else:
        # Ícono normal: gradiente diagonal + M blanca
        img = gradient_bg(size, BRAND_BG, BRAND_BG2)
        # Esquinas redondeadas (iOS style) — solo si tamaño >= 96
        if size >= 96:
            radius = size // 6
            mask = Image.new("L", (size, size), 0)
            mdraw = ImageDraw.Draw(mask)
            mdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
            # Aplicar máscara: el resultado se verá con esquinas redondeadas
            # Necesitamos RGBA para la transparencia
            img_rgba = img.convert("RGBA")
            img_rgba.putalpha(mask)
            img = img_rgba
        draw_letter_m(img, size, BRAND_FG, safe_zone_factor=1.0)
    img.save(f"{OUT_DIR}/icon-{size}x{size}{('-maskable' if maskable else '')}.png", "PNG", optimize=True)
    print(f"  ✓ icon-{size}x{size}{('-maskable' if maskable else '')}.png")


def make_apple_touch_icon():
    """Apple touch icon (180x180, sin esquinas redondeadas — iOS las agrega)."""
    size = 180
    img = gradient_bg(size, BRAND_BG, BRAND_BG2)
    draw_letter_m(img, size, BRAND_FG, safe_zone_factor=1.0)
    img.save(f"{OUT_DIR}/apple-touch-icon.png", "PNG", optimize=True)
    print(f"  ✓ apple-touch-icon.png")


def make_favicon():
    """Favicon 32x32 y 16x16."""
    for size in [16, 32]:
        img = gradient_bg(size, BRAND_BG, BRAND_BG2)
        draw_letter_m(img, size, BRAND_FG, safe_zone_factor=1.0)
        img.save(f"{OUT_DIR}/favicon-{size}x{size}.png", "PNG", optimize=True)
        print(f"  ✓ favicon-{size}x{size}.png")
    # favicon.ico (32x32)
    img32 = gradient_bg(32, BRAND_BG, BRAND_BG2)
    draw_letter_m(img32, 32, BRAND_FG, safe_zone_factor=1.0)
    img32.save(f"{OUT_DIR}/favicon.ico", "ICO")
    print("  ✓ favicon.ico")


def make_screenshot_mobile():
    """Screenshot móvil 390x844 (placeholder)."""
    w, h = 390, 844
    img = Image.new("RGB", (w, h), (7, 7, 11))
    draw = ImageDraw.Draw(img)
    # Header naranja
    draw.rectangle([0, 0, w, 120], fill=BRAND_BG)
    # Texto
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_big = ImageFont.truetype(font_path, 24)
        font_sm = ImageFont.truetype(font_path, 14)
    except Exception:
        font_big = ImageFont.load_default()
        font_sm = ImageFont.load_default()
    draw.text((20, 40), "Mi Restaurante", fill=(255, 255, 255), font=font_big)
    draw.text((20, 80), "Carta digital", fill=(255, 255, 255), font=font_sm)
    # Cards de platos
    for i in range(4):
        y = 150 + i * 130
        draw.rounded_rectangle([20, y, w - 20, y + 110], radius=12, fill=(26, 26, 46))
        # Imagen placeholder
        draw.rounded_rectangle([30, y + 10, 110, y + 100], radius=8, fill=BRAND_BG2)
        draw.text((130, y + 25), f"Plato {i+1}", fill=(255, 255, 255), font=font_sm)
        draw.text((130, y + 55), "S/ 25.00", fill=BRAND_BG, font=font_big)
    # Bottom nav
    draw.rectangle([0, h - 60, w, h], fill=(26, 26, 46))
    draw.text((20, h - 40), "🛒 Ver carrito", fill=BRAND_BG, font=font_sm)
    img.save(f"{OUT_DIR}/screenshot-mobile.png", "PNG", optimize=True)
    print("  ✓ screenshot-mobile.png")


def make_screenshot_desktop():
    """Screenshot desktop 1280x720 (placeholder)."""
    w, h = 1280, 720
    img = Image.new("RGB", (w, h), (7, 7, 11))
    draw = ImageDraw.Draw(img)
    # Sidebar
    draw.rectangle([0, 0, 250, h], fill=(15, 15, 25))
    # Header
    draw.rectangle([250, 0, w, 80], fill=BRAND_BG)
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_xl = ImageFont.truetype(font_path, 32)
        font_md = ImageFont.truetype(font_path, 18)
        font_sm = ImageFont.truetype(font_path, 14)
    except Exception:
        font_xl = font_md = font_sm = ImageFont.load_default()
    draw.text((280, 25), "Dashboard · MenuPro", fill=(255, 255, 255), font=font_xl)
    # Sidebar items
    items = ["📊 Inicio", "🍽️ Menús", "📊 Analytics", "📋 Comandas", "🔥 Cocina", "📦 Inventario", "⚙️ Ajustes"]
    for i, item in enumerate(items):
        y = 100 + i * 50
        draw.text((30, y), item, fill=(200, 200, 200), font=font_md)
    # Cards de stats
    stats = [("Ventas hoy", "S/ 1,250", BRAND_BG), ("Pedidos", "47", BRAND_BG2), ("Mozos activos", "5", (157, 78, 221)), ("Mesas", "12/20", (6, 214, 160))]
    for i, (label, value, color) in enumerate(stats):
        x = 280 + (i % 4) * 245
        y = 110 + (i // 4) * 130
        draw.rounded_rectangle([x, y, x + 230, y + 110], radius=12, fill=(26, 26, 46))
        draw.text((x + 20, y + 15), label, fill=(150, 150, 150), font=font_sm)
        draw.text((x + 20, y + 45), value, fill=color, font=font_xl)
    # Chart placeholder
    draw.rounded_rectangle([280, 270, w - 30, h - 30], radius=12, fill=(26, 26, 46))
    draw.text((300, 290), "Ventas por hora", fill=(255, 255, 255), font=font_md)
    # Bars
    base_y = h - 60
    for i in range(20):
        x = 300 + i * 45
        bar_h = ((i * 17) % 200) + 50
        top_y = max(base_y - bar_h, 330)  # no subir por encima del título del chart
        draw.rectangle([x, top_y, x + 30, base_y], fill=BRAND_BG)
    img.save(f"{OUT_DIR}/screenshot-desktop.png", "PNG", optimize=True)
    print("  ✓ screenshot-desktop.png")


if __name__ == "__main__":
    print(f"Generando íconos PWA en {OUT_DIR} ...")
    # Íconos normales
    for size in [72, 96, 128, 144, 152, 192, 384, 512]:
        make_icon(size, maskable=False)
    # Maskables
    for size in [192, 512]:
        make_icon(size, maskable=True)
    # Especiales
    make_apple_touch_icon()
    make_favicon()
    make_screenshot_mobile()
    make_screenshot_desktop()
    print(f"\n✅ Todos los íconos generados en {OUT_DIR}")
