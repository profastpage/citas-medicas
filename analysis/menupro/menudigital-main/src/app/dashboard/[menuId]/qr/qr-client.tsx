'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  Copy,
  Crown,
  Loader2,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import QRCode from 'qrcode';
import type { Plan } from '@/lib/plans';

interface Props {
  menu: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  plan: Plan;
}

export function QRClient({ menu, plan }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const [loading, setLoading] = useState(!plan.limits.hasQR);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // URL OPTIMIZADA PARA QR: usamos /qr/[slug] en vez de /r/[slug]
  // Razones:
  //   1. Distinguir en analíticas visitas vía QR (/qr/) vs visitas directas (/r/)
  //   2. URL semántica — al ver /qr/ en un escáner queda claro que es un QR code
  //   3. La ruta /qr/[slug] hace redirect 302 a /r/[slug] (el menú público real)
  //      Modern browsers y escáneres nativos (iOS 11+, Android 9+) siguen el
  //      redirect automáticamente sin que el usuario note la diferencia.
  //   4. Si un escáner básico muestra la URL como texto, el usuario puede
  //      copiar/pegar la URL /qr/[slug] y el redirect lo lleva al menú.
  const menuUrl = `${origin}/qr/${menu.slug}`;

  useEffect(() => {
    if (!plan.limits.hasQR) {
      return;
    }

    let cancelled = false;

    // Generar QR en alta resolución (PNG) y SVG
    Promise.all([
      QRCode.toDataURL(menuUrl, {
        width: 1024,
        margin: 2,
        color: {
          dark: '#0a0a14',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      }),
      QRCode.toString(menuUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#0a0a14',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      }),
    ])
      .then(([png, svg]) => {
        if (cancelled) return;
        setQrDataUrl(png);
        setQrSvg(svg);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('Error generando QR');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [menuUrl, plan.limits.hasQR]);

  function downloadPNG() {
    if (!qrDataUrl) return;
    setDownloading(true);
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${menu.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 500);
    toast.success('QR PNG descargado');
  }

  function downloadSVG() {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${menu.slug}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('QR SVG descargado');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      toast.success('Enlace copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  // Upsell si no es Pro
  if (!plan.limits.hasQR) {
    return (
      <div className="min-h-screen bg-[#07070b] text-white">
        <header className="border-b border-white/10 bg-[#0a0a14]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a
              href={`/dashboard/${menu.id}`}
              className="flex items-center gap-3 text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al editor</span>
            </a>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-[#d4af37]" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Código QR exclusivo Pro</h1>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Descarga el QR de tu menú en alta resolución para imprimir en mesas,
            afiches y flyers. Disponible solo en el plan Pro.
          </p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8 max-w-md mx-auto">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">S/ 35</span>
              <span className="text-white/50">/mes</span>
            </div>
            <div className="text-sm text-white/60 mb-6">≈ $9 USD</div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:opacity-90 font-semibold"
            >
              <a href="/dashboard/billing">Upgrade a Pro</a>
            </Button>
          </div>

          <p className="text-sm text-white/40">
            Mientras tanto, puedes compartir tu menú directamente con este link:
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <code className="text-sm text-white/70">{menuUrl}</code>
            <button
              onClick={copyLink}
              className="text-white/60 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <header className="border-b border-white/10 bg-[#0a0a14]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href={`/dashboard/${menu.id}`}
            className="flex items-center gap-3 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al editor</span>
          </a>
          <a
            href={`/r/${menu.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/60 hover:text-white"
          >
            Ver menú público →
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Código QR de tu menú</h1>
          <p className="text-white/60">
            Imprime y coloca en las mesas para que tus clientes escaneen
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Preview */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR para ${menu.name}`}
                  className="w-full h-auto"
                />
              )}
              <div className="text-center mt-6 pb-2">
                <div className="font-bold text-2xl text-[#0a0a14]">{menu.name}</div>
                <div
                  className="text-sm font-semibold mt-1"
                  style={{ color: menu.color }}
                >
                  Escanea para ver la carta
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Descargar</h3>
                <div className="space-y-3">
                  <Button
                    onClick={downloadPNG}
                    disabled={downloading}
                    className="w-full justify-start bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:opacity-90 font-semibold"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    PNG alta resolución (1024×1024)
                  </Button>
                  <Button
                    onClick={downloadSVG}
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    SVG vectorial (editable)
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Enlace del menú</h3>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={menuUrl}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70"
                  />
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <a
                    href={menuUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-3 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/25 transition-colors"
                    title="Abrir enlace en nueva pestaña"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
                  Esta URL es la que contiene el QR. Al escanearlo, el menú se abre
                  automáticamente en la mayoría de teléfonos modernos.
                </p>
              </div>

              {/* Bloque informativo: cómo funciona el escaneo en distintos dispositivos */}
              <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/25 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-semibold text-sm text-white/90">
                    Escaneo automático en teléfonos modernos
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-white/70 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#d4af37]">▸</span>
                    <span><b className="text-white/90">iPhone (iOS 11+):</b> abre la app Cámara nativa y apunta al QR. Aparece una notificación con el dominio — tócala y el menú se abre directamente en Safari.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#d4af37]">▸</span>
                    <span><b className="text-white/90">Android (9+):</b> la cámara nativa reconoce QR automáticamente. Toca la notificación "Abrir en navegador" y el menú carga al instante.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#d4af37]">▸</span>
                    <span><b className="text-white/90">Apps de terceros:</b> algunas apps (como la de la imagen 3) muestran el botón "Abrir navegador". Toca ese botón — no necesitas copiar y pegar.</span>
                  </li>
                </ul>
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a1a2e] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Probar escaneo (abrir menú)
                </a>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h4 className="font-semibold mb-3 text-sm">💡 Recomendaciones de impresión</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Tamaño mínimo recomendado: 8×8 cm para mesas</li>
                  <li>• Imprime en material resistente (laminado o PVC)</li>
                  <li>• Usa el formato SVG para escalado sin pérdida</li>
                  <li>• Coloca el QR en un lugar visible y limpio</li>
                  <li>• Prueba escanear antes de imprimir en lote</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
