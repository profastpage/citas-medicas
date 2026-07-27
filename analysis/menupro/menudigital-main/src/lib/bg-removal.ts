/**
 * lib/bg-removal.ts
 *
 * Script de "Quitar fondo con un clic" — 100% client-side.
 *
 * Flujo:
 *   1. removeBackground(blob) → usa @imgly/background-removal (WASM, ~50MB, cacheado en IndexedDB)
 *   2. autoCropAndCenter(blob) → canvas: detecta bbox de píxeles no transparentes,
 *      recorta al bbox + 10% padding, centra en lienzo cuadrado.
 *   3. uploadProcessed(blob) → POST /api/upload con transparent=true → devuelve URL.
 *
 * Resultado: una URL nueva con la comida centrada y sin fondo.
 */

// Tipos mínimos de @imgly/background-removal (carga dinámica)
type RemoveBgConfig = {
  publicPath?: string;
  proxyToBundle?: boolean;
  fetchArgs?: RequestInit;
  model?: 'isnet_fp16' | 'isnet_quint8';
  output?: { format?: 'image/png' | 'image/jpeg'; quality?: number };
  progress?: (key: string, current: number, total: number) => void;
};

type RemoveBgModule = {
  removeBackground: (blob: Blob, config?: RemoveBgConfig) => Promise<Blob>;
};

let _removeBgModule: RemoveBgModule | null = null;
let _loadingPromise: Promise<RemoveBgModule> | null = null;

/**
 * Carga dinámica del módulo @imgly/background-removal.
 * El modelo WASM (~50MB) se descarga la primera vez y se cachea en IndexedDB.
 * Las llamadas siguientes son instantáneas.
 */
async function loadRemoveBg(): Promise<RemoveBgModule> {
  if (_removeBgModule) return _removeBgModule;
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = (async () => {
    // Carga dinámica — solo se descarga el bundle JS cuando el usuario
    // realmente hace clic en "Quitar fondo".
    const mod = (await import('@imgly/background-removal')) as unknown as RemoveBgModule;
    _removeBgModule = mod;
    return mod;
  })();

  return _loadingPromise;
}

/**
 * Quita el fondo de una imagen. Devuelve un PNG con canal alpha.
 */
export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: (key: string, current: number, total: number) => void
): Promise<Blob> {
  const mod = await loadRemoveBg();
  return mod.removeBackground(imageBlob, {
    model: 'isnet_fp16',
    output: { format: 'image/png', quality: 1 },
    progress: onProgress,
  });
}

/**
 * Auto-crop + center: dado un PNG con alpha, recorta al bounding box de los
 * píxeles no transparentes (con 10% de padding) y centra el resultado en un
 * lienzo cuadrado (largo = max(ancho, alto) tras el padding).
 *
 * Devuelve un Blob PNG con la comida perfectamente centrada y sin fondo.
 */
export async function autoCropAndCenter(
  pngBlobWithAlpha: Blob
): Promise<Blob> {
  // Cargar el PNG a un ImageBitmap
  const bitmap = await createImageBitmap(pngBlobWithAlpha);
  const { width: W, height: H } = bitmap;

  // Pintar en canvas temporal para leer pixels
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = W;
  tmpCanvas.height = H;
  const tmpCtx = tmpCanvas.getContext('2d', { willReadFrequently: true });
  if (!tmpCtx) throw new Error('Canvas 2D no disponible');
  tmpCtx.drawImage(bitmap, 0, 0);

  const imageData = tmpCtx.getImageData(0, 0, W, H);
  const { data, width, height } = imageData;

  // Buscar bounding box de píxeles con alpha > 10
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4 + 3; // canal alpha
      if (data[idx] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Si no hay píxeles visibles, devolver original
  if (maxX < 0 || maxY < 0) {
    return pngBlobWithAlpha;
  }

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;

  // Padding 10% del lado mayor del bbox
  const padding = Math.round(Math.max(bboxW, bboxH) * 0.1);
  const paddedW = bboxW + padding * 2;
  const paddedH = bboxH + padding * 2;

  // Lienzo cuadrado: lado = max(paddedW, paddedH)
  const side = Math.max(paddedW, paddedH);
  // Limitar a 1200px máximo (coincide con resize de /api/upload)
  const finalSide = Math.min(side, 1200);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = finalSide;
  outCanvas.height = finalSide;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas 2D no disponible');

  // Lienzo transparente por defecto (no rellenar con color)
  outCtx.clearRect(0, 0, finalSide, finalSide);

  // Calcular escala para que el bbox + padding quepa en finalSide
  const scale = finalSide / side;

  // Dibujar el bbox centrado en el lienzo cuadrado
  // Centro del lienzo: (finalSide/2, finalSide/2)
  // Centro del bbox escalado: (bboxW*scale/2, bboxH*scale/2)
  const dx = (finalSide - bboxW * scale) / 2;
  const dy = (finalSide - bboxH * scale) / 2;

  outCtx.drawImage(
    bitmap,
    minX, minY, bboxW, bboxH, // src
    dx, dy, bboxW * scale, bboxH * scale // dst
  );

  // Devolver como PNG (preserva alpha)
  return new Promise((resolve, reject) => {
    outCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar el blob'));
          return;
        }
        resolve(blob);
      },
      'image/png',
      1
    );
  });
}

/**
 * Sube un blob procesado al backend y devuelve la URL pública.
 */
export async function uploadProcessedBlob(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob, `bg-removed-${Date.now()}.png`);
  formData.append('transparent', 'true');

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al subir la imagen procesada');
  }
  return data.url as string;
}

export interface BgRemovalProgress {
  stage: 'loading-model' | 'processing' | 'cropping' | 'uploading' | 'done';
  message: string;
  percent?: number;
}

/**
 * Pipeline completo: recibe la URL de la imagen original, la descarga,
 * quita el fondo, auto-crop + center, sube el resultado y devuelve la nueva URL.
 *
 * Llama a `onProgress` con actualizaciones de estado para mostrar al usuario.
 */
export async function processImageWithBgRemoval(
  originalImageUrl: string,
  onProgress?: (p: BgRemovalProgress) => void
): Promise<string> {
  // 1. Descargar la imagen original
  onProgress?.({ stage: 'loading-model', message: 'Cargando motor IA…' });
  // Forzar carga del módulo en paralelo
  const loadPromise = loadRemoveBg();

  const imgRes = await fetch(originalImageUrl, { cache: 'no-store' });
  if (!imgRes.ok) throw new Error('No se pudo descargar la imagen original');
  const originalBlob = await imgRes.blob();

  // 2. Quitar fondo
  onProgress?.({ stage: 'processing', message: 'Quitando fondo con IA…' });
  const mod = await loadPromise;
  const noBgBlob = await mod.removeBackground(originalBlob, {
    model: 'isnet_fp16',
    output: { format: 'image/png', quality: 1 },
    progress: (key, current, total) => {
      // key es como "fetch:model" o "compute"
      if (key.startsWith('fetch')) {
        onProgress?.({
          stage: 'loading-model',
          message: 'Descargando modelo IA…',
          percent: total > 0 ? (current / total) * 100 : undefined,
        });
      } else if (key.startsWith('compute') || key.startsWith('inference')) {
        onProgress?.({
          stage: 'processing',
          message: 'Procesando imagen…',
          percent: total > 0 ? (current / total) * 100 : undefined,
        });
      }
    },
  });

  // 3. Auto-crop + center
  onProgress?.({ stage: 'cropping', message: 'Centrando comida…' });
  const centeredBlob = await autoCropAndCenter(noBgBlob);

  // 4. Subir
  onProgress?.({ stage: 'uploading', message: 'Subiendo imagen…' });
  const newUrl = await uploadProcessedBlob(centeredBlob);

  onProgress?.({ stage: 'done', message: '¡Listo!' });
  return newUrl;
}
