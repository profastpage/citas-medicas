#!/usr/bin/env python3
"""
Regenera TODOS los favicons e iconos del proyecto MenuPro a partir del logo nuevo.
- favicon.ico multi-resolución (16, 32, 48, 64)
- favicon-16x16.png, favicon-32x32.png
- icon-{72,96,128,144,152,192,384,512}x{...}.png
- icon-192x192-maskable.png, icon-512x512-maskable.png
- apple-touch-icon.png (180x180)
- logo.png (512x512), logo-192.png (192x192)
- src/app/icon.webp (favicon moderno Next.js App Router)

El logo original es 56x59 RGBA (no cuadrado). Para cada tamaño se hace fit:contain
sobre un canvas cuadrado transparente, preservando el aspect ratio del logo.
Para maskable, se rellena con el color de marca (#ff6b35) y el logo ocupa el 70% (safe zone).
"""

from PIL import Image
import os

SRC = "/home/z/my-project/upload/pasted_image_1785097360610.png"
BRAND_COLOR = (255, 107, 53, 255)  # #ff6b35 naranja MenuPro

# (destino, tamaño, maskable?)
TARGETS = [
    # /public/icons/ — PNG normales (purpose=any)
    ("/home/z/my-project/public/icons/favicon-16x16.png", 16, False),
    ("/home/z/my-project/public/icons/favicon-32x32.png", 32, False),
    ("/home/z/my-project/public/icons/icon-72x72.png", 72, False),
    ("/home/z/my-project/public/icons/icon-96x96.png", 96, False),
    ("/home/z/my-project/public/icons/icon-128x128.png", 128, False),
    ("/home/z/my-project/public/icons/icon-144x144.png", 144, False),
    ("/home/z/my-project/public/icons/icon-152x152.png", 152, False),
    ("/home/z/my-project/public/icons/icon-192x192.png", 192, False),
    ("/home/z/my-project/public/icons/icon-384x384.png", 384, False),
    ("/home/z/my-project/public/icons/icon-512x512.png", 512, False),
    # /public/icons/ — maskable (purpose=maskable)
    ("/home/z/my-project/public/icons/icon-192x192-maskable.png", 192, True),
    ("/home/z/my-project/public/icons/icon-512x512-maskable.png", 512, True),
    # apple-touch-icon (180x180, fondo sólido para iOS)
    ("/home/z/my-project/public/icons/apple-touch-icon.png", 180, True),
    # /public/ — logo en alta resolución
    ("/home/z/my-project/public/logo.png", 512, False),
    ("/home/z/my-project/public/logo-192.png", 192, False),
]

# Favicon moderno para Next.js App Router (auto-detectado)
WEBP_TARGET = "/home/z/my-project/src/app/icon.webp"

# favicon.ico multi-resolución
ICO_TARGETS = [
    "/home/z/my-project/public/favicon.ico",
    "/home/z/my-project/public/icons/favicon.ico",
]


def resize_to_square(img: Image.Image, size: int, maskable: bool) -> Image.Image:
    """Redimensiona el logo sobre un canvas cuadrado.

    - maskable=False: canvas transparente, logo con fit:contain (preserva aspect ratio)
    - maskable=True:  canvas con color de marca, logo al 70% centrado (safe zone)
    """
    if maskable:
        canvas = Image.new("RGBA", (size, size), BRAND_COLOR)
        logo_target = int(size * 0.70)
        # Preservar aspect ratio del logo dentro de la safe zone
        ratio = min(logo_target / img.width, logo_target / img.height)
        new_w = max(1, int(img.width * ratio))
        new_h = max(1, int(img.height * ratio))
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)
        offset = ((size - new_w) // 2, (size - new_h) // 2)
        canvas.paste(img_resized, offset, img_resized)
        return canvas
    else:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ratio = min(size / img.width, size / img.height)
        new_w = max(1, int(img.width * ratio))
        new_h = max(1, int(img.height * ratio))
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)
        offset = ((size - new_w) // 2, (size - new_h) // 2)
        canvas.paste(img_resized, offset, img_resized)
        return canvas


def main() -> None:
    src_img = Image.open(SRC).convert("RGBA")
    print(f"🖼️  Logo original: {src_img.size[0]}x{src_img.size[1]} {src_img.mode}")

    # PNGs
    for path, size, maskable in TARGETS:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        out = resize_to_square(src_img, size, maskable=maskable)
        out.save(path, "PNG", optimize=True)
        print(f"✅ {path} ({size}x{size}{' maskable' if maskable else ''})")

    # WebP para Next.js App Router (favicon moderno)
    os.makedirs(os.path.dirname(WEBP_TARGET), exist_ok=True)
    webp_img = resize_to_square(src_img, 512, maskable=False)
    webp_img.save(WEBP_TARGET, "WEBP", quality=95, method=6, lossless=False)
    print(f"✅ {WEBP_TARGET} (512x512 webp — Next.js App Router favicon)")

    # favicon.ico multi-resolución (16, 32, 48, 64)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [resize_to_square(src_img, s[0], maskable=False) for s in ico_sizes]
    for ico_path in ICO_TARGETS:
        os.makedirs(os.path.dirname(ico_path), exist_ok=True)
        ico_images[0].save(
            ico_path,
            format="ICO",
            sizes=ico_sizes,
        )
        print(f"✅ {ico_path} (multi-res 16/32/48/64)")

    print("\n🎉 Todos los favicons e iconos regenerados correctamente.")


if __name__ == "__main__":
    main()
