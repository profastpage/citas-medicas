'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon, Wand2, Sparkles } from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { deriveVariantUrl } from '@/lib/image-utils';

interface Props {
  initialUrl?: string;
  onUploaded: (url: string) => void;
  plan: Plan;
  imagesCount: number;
  shape?: 'circle' | 'square';
  size?: number;
}

interface QuotaInfo {
  hasFeature: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetAt: string | null;
}

export function ImageUploader({
  initialUrl = '',
  onUploaded,
  plan,
  imagesCount,
  shape = 'square',
  size = 80,
}: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('Procesando…');
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxImages = plan.limits.maxImages;
  const canUpload = maxImages === -1 || imagesCount < maxImages;
  const canRemoveBg = plan.limits.hasBgRemoval && !!url;

  // Cargar cuota solo para usuarios Pro
  const fetchQuota = useCallback(async () => {
    if (!plan.limits.hasBgRemoval) return;
    try {
      const res = await fetch('/api/bg-removal/quota');
      if (res.ok) {
        const data = (await res.json()) as QuotaInfo;
        setQuota(data);
      }
    } catch {
      // Silencioso — no bloquear el uploader si la cuota no carga
    }
  }, [plan.limits.hasBgRemoval]);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Máximo 5MB por imagen');
        return;
      }
      if (!canUpload && !url) {
        toast.error(
          maxImages === -1
            ? 'Error inesperado. Recarga la página.'
            : `Límite de ${maxImages} imágenes alcanzado. Upgrade a Pro para imágenes ilimitadas.`
        );
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error');
        setUrl(data.url);
        onUploaded(data.url);
        toast.success('Imagen subida');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error al subir');
      } finally {
        setUploading(false);
      }
    },
    [canUpload, maxImages, url, onUploaded]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setUrl('');
    onUploaded('');
    if (inputRef.current) inputRef.current.value = '';
  }

  /**
   * Pipeline de "Quitar fondo con un clic" — SERVER-SIDE:
   *  1. POST /api/bg-removal/process con la URL de la imagen
   *  2. El servidor descarga la imagen, quita el fondo con IA (model medium),
   *     auto-crop + center, y sube el resultado a Supabase Storage
   *  3. Devuelve { url, quota }
   *  4. Actualizamos la UI con la nueva imagen + nueva cuota
   *
   * Ventajas vs pipeline client-side:
   *  - Sin descargar 50MB de WASM en el navegador
   *  - ~1-3s en vez de 10-30s
   *  - Funciona en cualquier dispositivo (móviles antiguos, tablets)
   *  - El contador se incrementa automáticamente en el servidor
   */
  async function handleRemoveBackground() {
    if (!url) return;

    // Verificar cuota antes de empezar
    if (quota && quota.remaining <= 0) {
      toast.error(
        'Has alcanzado tu límite mensual de "Quitar fondo". Se renueva en 30 días.'
      );
      return;
    }

    setRemovingBg(true);
    setProgressMsg('Procesando en servidor…');

    try {
      const res = await fetch('/api/bg-removal/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo quitar el fondo');
      }

      // Actualizar UI con la nueva imagen + nueva cuota
      setUrl(data.url);
      onUploaded(data.url);
      setQuota({
        hasFeature: true,
        used: data.quota.used,
        limit: data.quota.limit,
        remaining: data.quota.remaining,
        resetAt: quota?.resetAt ?? null,
      });
      toast.success('¡Fondo quitado y comida centrada!');
    } catch (err) {
      console.error('[bg-removal] error:', err);
      toast.error(err instanceof Error ? err.message : 'Error al quitar fondo');
    } finally {
      setRemovingBg(false);
      setProgressMsg('Procesando…');
    }
  }

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
  const isCircle = shape === 'circle';

  return (
    <div className="flex items-start gap-3">
      <div
        onClick={() => !uploading && !removingBg && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative cursor-pointer flex items-center justify-center transition-all ${shapeClass} ${
          dragOver
            ? 'border-[#d4af37] bg-[#d4af37]/10 scale-105'
            : 'border-white/15 hover:border-[#d4af37]/60 hover:bg-white/5'
        } ${url ? 'border-0' : 'border-2 border-dashed'} ${
          removingBg ? 'pointer-events-none' : ''
        }`}
        style={{ width: size, height: size }}
      >
        {url ? (
          <>
            <img
              src={deriveVariantUrl(url, 'thumb')}
              srcSet={`${deriveVariantUrl(url, 'thumb')} 400w, ${deriveVariantUrl(url, 'medium')} 800w`}
              sizes={`${size}px`}
              alt=""
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover ${shapeClass} ${
                removingBg ? 'opacity-40' : ''
              }`}
              style={
                // Mostrar cuadrícula de transparencia si la imagen tiene alpha
                // (resultado de bg removal)
                url.includes('.webp') || url.includes('.png')
                  ? {
                      backgroundImage:
                        'linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)',
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                    }
                  : undefined
              }
            />
            {/* Overlay de progreso */}
            {removingBg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-inherit">
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin mb-1" />
                <span className="text-[9px] text-white/80 text-center px-1 leading-tight">
                  {progressMsg}
                </span>
              </div>
            )}
            {!removingBg && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className={`absolute ${
                  isCircle ? '-top-1 -right-1' : 'top-1 right-1'
                } w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 z-10`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </>
        ) : uploading ? (
          <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin" />
        ) : (
          <div className="text-center">
            {size >= 100 ? (
              <>
                <Upload className="w-5 h-5 text-white/40 mx-auto mb-1" />
                <div className="text-[10px] text-white/50">Click o arrastra</div>
              </>
            ) : (
              <ImageIcon className="w-4 h-4 text-white/30" />
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {size >= 100 && (
        <div className="flex-1 space-y-2 pt-1">
          <p className="text-xs text-white/40">
            {url ? 'Imagen cargada' : 'Sube desde tu dispositivo o arrastra aquí'}
          </p>
          {!canUpload && !url && (
            <p className="text-xs text-amber-400">
              Límite alcanzado ({maxImages}). Upgrade a Pro para imágenes ilimitadas.
            </p>
          )}

          {/* Botón "Quitar fondo" — solo visible si: */}
          {/*  1. Plan Pro (hasBgRemoval) */}
          {/*  2. Hay una imagen cargada */}
          {/*  3. Cuota restante > 0 */}
          {canRemoveBg && (
            <div className="space-y-1.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveBackground}
                disabled={removingBg || (quota !== null && quota.remaining <= 0)}
                className="h-8 gap-1.5 border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 hover:text-[#d4af37] hover:border-[#d4af37]/60 text-xs"
              >
                {removingBg ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Procesando…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    Quitar fondo
                  </>
                )}
              </Button>

              {/* Badge de créditos restantes */}
              {quota && (
                <div className="flex items-center gap-1 text-[10px] text-white/50">
                  <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                  <span>
                    {quota.remaining}/{quota.limit} restantes este mes
                  </span>
                </div>
              )}

              {/* Hint de auto-centrado */}
              {!removingBg && (
                <p className="text-[10px] text-white/30 leading-tight">
                  Quita el fondo y centra automáticamente la comida
                </p>
              )}
            </div>
          )}

          {/* Upsell para plan Free */}
          {!plan.limits.hasBgRemoval && url && (
            <div className="pt-1">
              <a
                href="/dashboard/billing"
                className="inline-flex items-center gap-1 text-[11px] text-[#d4af37] hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Upgrade a Pro para quitar fondo con 1 clic
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
