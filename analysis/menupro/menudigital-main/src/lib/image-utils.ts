/**
 * ============================================================
 *  MenuPro · Image URL Helpers (client-safe)
 * ============================================================
 *
 *  Funciones PURAS (sin dependencias de Node/sharp) para derivar
 *  URLs de variantes optimizadas desde una URL "large" de referencia.
 *
 *  Este archivo es SEGURO para importar en Client Components.
 *  No importa `sharp` ni ningún módulo nativo de Node.
 *
 *  El pipeline real de optimización (con sharp) está en
 *  `src/lib/image-optimizer.ts` y solo se usa en API routes (server).
 * ============================================================
 */

export type ImageSize = 'thumb' | 'medium' | 'large';
export type ImageFormat = 'webp' | 'avif';

/** Tamaños responsivos por defecto — calibrados para mobile-first */
export const SIZE_CONFIG: Record<ImageSize, { width: number; quality: number }> = {
  thumb: { width: 400, quality: 72 },
  medium: { width: 800, quality: 78 },
  large: { width: 1200, quality: 82 },
};

/**
 * Helper: dado un baseUrl del archivo large, deriva la URL de un tamaño específico.
 * Útil cuando solo guardamos la URL "large" en DB pero queremos mostrar el thumb en listas.
 *
 *   const thumbUrl = deriveVariantUrl(largeUrl, 'thumb');
 *
 * Si la URL no sigue el patrón de imagen optimizada (URL externa o subida antes
 * de la optimización), devuelve la URL original sin modificar — degrada gracefully.
 */
export function deriveVariantUrl(largeUrl: string, size: ImageSize): string {
  if (!largeUrl) return largeUrl;
  const match = largeUrl.match(/^(.*?)-(thumb|medium|large)-w\d+\.(webp|avif)$/);
  if (!match) return largeUrl;
  const base = match[1];
  const ext = match[3];
  const cfg = SIZE_CONFIG[size];
  return `${base}-${size}-w${cfg.width}.${ext}`;
}

/**
 * Helper: ¿esta URL parece ser de una imagen optimizada por nuestro pipeline?
 * Útil para decidir si aplicar srcset o mostrar un <img> simple.
 */
export function isOptimizedUrl(url: string): boolean {
  return /-(thumb|medium|large)-w\d+\.(webp|avif)$/.test(url);
}

/**
 * Construye un atributo `srcset` a partir de una URL optimizada (large).
 *
 *   buildSrcsetFromUrl(largeUrl)
 *   // → "/path/file-thumb-w400.webp 400w, /path/file-medium-w800.webp 800w, /path/file-large-w1200.webp 1200w"
 *
 * Si la URL no está optimizada, devuelve string vacío.
 */
export function buildSrcsetFromUrl(largeUrl: string): string {
  if (!largeUrl) return '';
  const match = largeUrl.match(/^(.*?)-(thumb|medium|large)-w\d+\.(webp|avif)$/);
  if (!match) return '';
  const base = match[1];
  const ext = match[3];
  return [
    `${base}-thumb-w400.${ext} 400w`,
    `${base}-medium-w800.${ext} 800w`,
    `${base}-large-w1200.${ext} 1200w`,
  ].join(', ');
}
