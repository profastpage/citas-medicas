import sharp from 'sharp';

/**
 * ============================================================
 *  MenuPro · Image Optimizer (SERVER-ONLY)
 * ============================================================
 *
 *  ⚠️  Este archivo importa `sharp` (módulo nativo de Node).
 *      NO importar desde Client Components — usar `image-utils.ts` en su lugar.
 *
 *  Pipeline profesional de optimización de imágenes para web.
 *  Todas las imágenes que se suben pasan por aquí → WebP + AVIF
 *  multi-size + EXIF strip + compresión adaptativa por tamaño.
 *
 *  Estrategia:
 *  ──────────
 *  · 3 tamaños responsivos: thumb (400w), medium (800w), large (1200w)
 *  · 2 formatos por tamaño: WebP (compatibilidad universal) y AVIF (mejor compresión, ~20% menor)
 *  · Calidad adaptativa: thumbnails más comprimidos (q72) que large (q82)
 *  · EXIF/metadata stripping (privacidad + ahorro ~50KB por imagen)
 *  · Preserva aspect ratio con `fit: 'inside'` (sin crop, sin estirar)
 *  · Para imágenes con alpha (PNG transparente): WebP lossless en alpha
 *
 *  Uso (solo en API routes / server components):
 *  ────
 *    const result = await optimizeImage(buffer, { transparent: false });
 *    // result.variants = [{ size: 'thumb', width: 400, format: 'webp', buffer, ... }, ...]
 *    // result.metadata = { width, height, originalSize, optimizedSize, savingsPct }
 *
 *  El cliente recibe todas las URLs y usa <img srcset> para que el navegador
 *  elija el tamaño óptimo según el viewport y DPR del dispositivo.
 * ============================================================
 */

// Re-exportar tipos y helpers PUROS desde image-utils.ts (client-safe)
export type { ImageSize, ImageFormat } from './image-utils';
export { deriveVariantUrl, isOptimizedUrl, buildSrcsetFromUrl as buildSrcset } from './image-utils';

import type { ImageSize, ImageFormat } from './image-utils';

export interface OptimizeVariant {
  size: ImageSize;
  format: ImageFormat;
  width: number;
  height: number;
  buffer: Buffer;
  bytes: number;
  /** Suffix added to the filename, e.g. "-thumb-w400" → file-thumb-w400.webp */
  suffix: string;
  contentType: string;
}

export interface OptimizeOptions {
  /** Si la imagen tiene transparencia (PNG con alpha, resultado de bg-removal) — preserva alpha */
  transparent?: boolean;
  /** Tamaños a generar. Default: los 3 */
  sizes?: ImageSize[];
  /** Formatos a generar. Default: solo WebP (AVIF puede activarse cuando los navegadores lo soporten mejor) */
  formats?: ImageFormat[];
  /** Ancho máximo original. Si la imagen es menor, no se agranda. Default 1200 */
  maxWidth?: number;
  /** Quality override (si no se especifica, se usa calidad adaptativa por tamaño) */
  quality?: number;
}

export interface OptimizeResult {
  variants: OptimizeVariant[];
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalBytes: number;
    /** Bytes del WebP large (referencia para comparar) */
    optimizedBytes: number;
    savingsPct: number;
    hasAlpha: boolean;
  };
}

/** Tamaños responsivos por defecto — calibrados para mobile-first (server-side con effort) */
const SIZE_CONFIG: Record<ImageSize, { width: number; quality: number; effort: number }> = {
  thumb: { width: 400, quality: 72, effort: 6 },
  medium: { width: 800, quality: 78, effort: 6 },
  large: { width: 1200, quality: 82, effort: 5 },
};

/**
 * Optimiza una imagen a múltiples tamaños y formatos.
 *
 * @param input Buffer de la imagen original (JPEG, PNG, WebP, GIF, AVIF, etc.)
 * @param options Ver OptimizeOptions
 * @returns Variantes optimizadas + metadata
 */
export async function optimizeImage(
  input: Buffer,
  options: OptimizeOptions = {}
): Promise<OptimizeResult> {
  const {
    transparent = false,
    sizes = ['thumb', 'medium', 'large'],
    formats = ['webp'],
    maxWidth = 1200,
    quality,
  } = options;

  // Cargar metadata del original
  const original = sharp(input, { pages: 1 });
  const meta = await original.metadata();
  const originalWidth = meta.width || 0;
  const originalHeight = meta.height || 0;
  const hasAlpha = meta.hasAlpha ?? false;
  const originalBytes = input.byteLength;

  if (!originalWidth || !originalHeight) {
    throw new Error('Imagen sin dimensiones válidas');
  }

  const variants: OptimizeVariant[] = [];

  for (const size of sizes) {
    const cfg = SIZE_CONFIG[size];
    // No upscaling: si la imagen original es menor que el target, usar el ancho original
    const targetWidth = Math.min(cfg.width, maxWidth, originalWidth);

    for (const format of formats) {
      const q = quality ?? cfg.quality;
      let pipeline = sharp(input, { pages: 1 })
        .rotate() // auto-orient based on EXIF
        .resize({
          width: targetWidth,
          height: targetWidth, // square upper bound — fit: 'inside' preserves aspect ratio
          fit: 'inside',
          withoutEnlargement: true,
        });

      if (format === 'webp') {
        if (transparent && hasAlpha) {
          pipeline = pipeline.webp({
            quality: q,
            alphaQuality: 100,
            effort: cfg.effort,
          });
        } else {
          pipeline = pipeline.webp({
            quality: q,
            effort: cfg.effort,
          });
        }
      } else if (format === 'avif') {
        pipeline = pipeline.avif({
          quality: Math.max(q - 5, 50),
          effort: 4,
          chromaSubsampling: '4:2:0',
        });
      }

      const buffer = await pipeline.toBuffer();
      const { width = 0, height = 0 } = await sharp(buffer).metadata();

      variants.push({
        size,
        format,
        width,
        height,
        buffer,
        bytes: buffer.byteLength,
        suffix: `-${size}-w${width}`,
        contentType: format === 'avif' ? 'image/avif' : 'image/webp',
      });
    }
  }

  // Referencia: el WebP large (o el primero disponible)
  const reference =
    variants.find((v) => v.size === 'large' && v.format === 'webp') ||
    variants.find((v) => v.format === 'webp') ||
    variants[0];

  const savingsPct = originalBytes > 0
    ? Math.round((1 - reference.bytes / originalBytes) * 100)
    : 0;

  return {
    variants,
    metadata: {
      originalWidth,
      originalHeight,
      originalBytes,
      optimizedBytes: reference.bytes,
      savingsPct,
      hasAlpha,
    },
  };
}
