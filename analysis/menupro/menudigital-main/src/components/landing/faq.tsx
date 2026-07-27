'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: '¿MenuPro cobra comisión por cada venta?',
    a: 'No. Nunca. Los pedidos van directo al WhatsApp de tu restaurante. MenuPro solo cobra la suscripción mensual del plan Pro. Tus ventas son 100% tuyas.',
  },
  {
    q: '¿Necesito instalar algo en mi computadora?',
    a: 'No. Todo funciona desde el navegador. Diseñas tu menú en menupro.app, lo publicas, y tus clientes lo ven desde su celular sin instalar ninguna app.',
  },
  {
    q: '¿Puedo cambiar de plan cuando quiera?',
    a: 'Sí. Puedes subir a Pro o bajar a Free en cualquier momento desde el panel de facturación. Los cambios se aplican inmediatamente.',
  },
  {
    q: '¿Qué pasa si cancelo mi suscripción Pro?',
    a: 'Conservas acceso Pro hasta el fin del período pagado. Después, tu menú vuelve al plan Free (mantiene la marca MenuPro y los límites del plan Free).',
  },
  {
    q: '¿Mis clientes necesitan descargar una app?',
    a: 'No. Tu menú se abre en cualquier navegador móvil moderno. Solo necesitan la cámara para escanear el QR y WhatsApp para enviar el pedido.',
  },
  {
    q: '¿Puedo usar mi propio dominio?',
    a: 'En el plan Pro puedes solicitar un subdominio (tu-restaurante.menupro.app). Para dominio propio contáctanos para configuración personalizada.',
  },
  {
    q: '¿Funciona sin internet?',
    a: 'El menú requiere conexión a internet para cargarse, pero una vez abierto funciona sin conexión temporalmente. El envío del pedido por WhatsApp requiere conexión.',
  },
  {
    q: '¿Cómo recibo los pagos de mis clientes?',
    a: 'MenuPro no procesa pagos. Los pedidos llegan por WhatsApp y coordinas el pago directamente con el cliente (efectivo, Yape, Plin, transferencia, tarjeta).',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs font-semibold text-[#d4af37] tracking-wider mb-4">
            DUDAS FRECUENTES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition"
              >
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all ${
                  open === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4 text-sm text-white/70 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
