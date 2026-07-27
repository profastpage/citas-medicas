"""
Generate all favicon sizes + app icons + logo + OG image from FAVICON MENUPRO.png (1024x1024).

Outputs to /home/z/my-project/public/icons/ and /home/z/my-project/public/.
"""
import os
import shutil
from PIL import Image, ImageDraw

SRC = "/home/z/my-project/upload/FAVICON MENUPRO.png"
ICONS_DIR = "/home/z/my-project/public/icons"
PUBLIC_DIR = "/home/z/my-project/public"

os.makedirs(ICONS_DIR, exist_ok=True)

# 1. Open source and verify
src = Image.open(SRC).convert("RGBA")
print(f"Source: {src.size} mode={src.mode}")

# 2. Generate PNG icons of various sizes
PNG_SIZES = [
    ("favicon-16x16.png", 16),
    ("favicon-32x32.png", 32),
    ("icon-72x72.png", 72),
    ("icon-96x96.png", 96),
    ("icon-128x128.png", 128),
    ("icon-144x144.png", 144),
    ("icon-152x152.png", 152),
    ("apple-touch-icon.png", 180),
    ("icon-192x192.png", 192),
    ("icon-384x384.png", 384),
    ("icon-512x512.png", 512),
]
for name, size in PNG_SIZES:
    out = src.resize((size, size), Image.LANCZOS)
    out.save(os.path.join(ICONS_DIR, name), "PNG", optimize=True)
    print(f"  ✓ {name} ({size}x{size})")

# 3. Generate maskable icons (with safe padding for Android adaptive icons)
# Maskable icons need a "safe zone" — content should be within 80% of the canvas (centered)
def make_maskable(src_img, size, padding_pct=0.10):
    """Create a maskable icon: solid background + centered logo with safe padding."""
    canvas = Image.new("RGBA", (size, size), (7, 7, 11, 255))  # MenuPro dark bg #07070b
    inner_size = int(size * (1 - padding_pct * 2))
    inner = src_img.resize((inner_size, inner_size), Image.LANCZOS)
    offset = ((size - inner_size) // 2, (size - inner_size) // 2)
    canvas.paste(inner, offset, inner)
    return canvas

for name, size in [("icon-192x192-maskable.png", 192), ("icon-512x512-maskable.png", 512)]:
    out = make_maskable(src, size)
    out.save(os.path.join(ICONS_DIR, name), "PNG", optimize=True)
    print(f"  ✓ {name} (maskable, {size}x{size})")

# 4. Generate favicon.ico (multi-size: 16, 32, 48)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = [src.resize(s, Image.LANCZOS) for s in ico_sizes]
ico_images[0].save(
    os.path.join(ICONS_DIR, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes,
)
print("  ✓ favicon.ico (16, 32, 48)")

# Also save favicon.ico in /public root for legacy browsers
ico_images[0].save(
    os.path.join(PUBLIC_DIR, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes,
)
print("  ✓ /public/favicon.ico (root, for legacy)")

# 5. Generate logo.png (transparent, 512x512) for in-app brand usage
logo_512 = src.resize((512, 512), Image.LANCZOS)
logo_512.save(os.path.join(PUBLIC_DIR, "logo.png"), "PNG", optimize=True)
print("  ✓ /public/logo.png (512x512, transparent)")

# Also a smaller logo (192x192) for inline use
logo_192 = src.resize((192, 192), Image.LANCZOS)
logo_192.save(os.path.join(PUBLIC_DIR, "logo-192.png"), "PNG", optimize=True)
print("  ✓ /public/logo-192.png (192x192, transparent)")

# 6. Generate Open Graph image (1200x630) for social sharing
og = Image.new("RGBA", (1200, 630), (7, 7, 11, 255))
# Logo on the left (centered vertically)
logo_h = 380
logo_w = 380
logo_resized = src.resize((logo_w, logo_h), Image.LANCZOS)
og.paste(logo_resized, (140, (630 - logo_h) // 2), logo_resized)
og_rgb = og.convert("RGB")
og_rgb.save(os.path.join(PUBLIC_DIR, "og-image.png"), "PNG", optimize=True)
print("  ✓ /public/og-image.png (1200x630)")

# 7. Update screenshots with logo (optional, skip — keep existing screenshots)

print("\n✅ All favicons, icons and logo generated successfully!")
print(f"   Source: {SRC}")
print(f"   Output: {ICONS_DIR} and {PUBLIC_DIR}")
