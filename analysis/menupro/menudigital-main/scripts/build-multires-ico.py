#!/usr/bin/env python3
"""
Crea un favicon.ico multi-resolución embebiendo PNGs (formato ICO moderno,
soportado por Windows Vista+ y todos los navegadores desde hace años).

PIL no embebe múltiples tamaños correctamente cuando se usa sizes=[...],
así que escribimos la estructura binaria ICO a mano.
"""

import struct
from PIL import Image

SRC = "/home/z/my-project/upload/pasted_image_1785097360610.png"
ICO_TARGETS = [
    "/home/z/my-project/public/favicon.ico",
    "/home/z/my-project/public/icons/favicon.ico",
]
ICO_SIZES = [16, 32, 48, 64, 128, 256]


def make_square(img: Image.Image, size: int) -> Image.Image:
    """Redimensiona el logo sobre canvas cuadrado transparente, fit:contain."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ratio = min(size / img.width, size / img.height)
    w, h = max(1, int(img.width * ratio)), max(1, int(img.height * ratio))
    r = img.resize((w, h), Image.LANCZOS)
    canvas.paste(r, ((size - w) // 2, (size - h) // 2), r)
    return canvas


def png_bytes(img: Image.Image) -> bytes:
    import io
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def build_ico(src_path: str, sizes: list[int]) -> bytes:
    src = Image.open(src_path).convert("RGBA")

    # Generar PNGs para cada tamaño
    pngs: list[bytes] = []
    for s in sizes:
        square = make_square(src, s)
        pngs.append(png_bytes(square))

    # Header ICO: 6 bytes
    count = len(sizes)
    header = struct.pack("<HHH", 0, 1, count)

    # Directory: 16 bytes por entrada
    directory = bytearray()
    data_offset = 6 + 16 * count
    png_data = bytearray()
    for i, s in enumerate(sizes):
        png = pngs[i]
        # width/height: 0 significa 256
        w_byte = 0 if s == 256 else s
        h_byte = 0 if s == 256 else s
        directory += struct.pack(
            "<BBBBHHII",
            w_byte,           # width
            h_byte,           # height
            0,                # color count (0 = más de 256)
            0,                # reserved
            1,                # planes
            32,               # bit count
            len(png),         # bytes in res
            data_offset + len(png_data),  # image offset
        )
        png_data += png

    return bytes(header) + bytes(directory) + bytes(png_data)


def main() -> None:
    ico_bytes = build_ico(SRC, ICO_SIZES)
    for path in ICO_TARGETS:
        with open(path, "wb") as f:
            f.write(ico_bytes)
        print(f"✅ {path} ({len(ico_bytes)} bytes, {len(ICO_SIZES)} resoluciones: {ICO_SIZES})")

    # Verificar
    for path in ICO_TARGETS:
        v = Image.open(path)
        print(f"   ↳ {path} → sizes embebidas = {sorted(v.info.get('sizes', set()))}")


if __name__ == "__main__":
    main()
