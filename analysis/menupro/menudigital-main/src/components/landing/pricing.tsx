"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Utensils, Building2, Zap, ArrowRight, Star } from "lucide-react";

const PLANS_LANDING = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    description: "Para empezar y validar tu idea",
    color: "#6b7280",
    icon: Sparkles,
    features: [
      "1 menú digital",
      "Hasta 10 platos",
      "1 foto por plato",
      "Carrito con WhatsApp",
      "URL pública /r/tu-restaurante",
      "Vista previa en vivo",
      'Marca "Creado con MenuPro"',
      "📱 App instalable (PWA)",
    ],
    cta: "Empezar gratis",
    href: "/register",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 35,
    description: "Para restaurantes en serio",
    color: "#d4af37",
    icon: Zap,
    features: [
      "3 menús activos",
      "Platos ilimitados por menú",
      "3 fotos por plato + WebP",
      '30 créditos "Quitar fondo" IA',
      "QR profesional HD + dinámico",
      "Analytics de visitas",
      "Menú multi-idioma (ES/EN)",
      "Tema PedidosYa/Rappi + colores",
      'Marca "Creado con MenuPro"',
      "Soporte prioritario WhatsApp",
      "📱 PWA optimizada",
    ],
    cta: "Empezar Pro",
    href: "/register?plan=pro",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 99,
    description: "Logística completa + White label",
    color: "#9d4edd",
    icon: Utensils,
    features: [
      "10 menús activos",
      "5 fotos por plato",
      "✨ 100% White label (sin marca)",
      '100 créditos "Quitar fondo"',
      "🍽️ Gestión de mesas (hasta 50)",
      "👨‍🍳 Gestión de mozos (hasta 20)",
      "📋 Comandas: mesa → cocina → entrega",
      "🔥 Cocina Display en tiempo real",
      "📦 Inventario de insumos con recetas",
      "📲 PWA con modo offline real (mozos)",
    ],
    cta: "Empezar Premium",
    href: "/register?plan=premium",
    highlight: false,
  },
  {
    id: "full",
    name: "Full",
    priceMonthly: 199,
    description: "Multi-sucursal + AI + voucher printing",
    color: "#e63946",
    icon: Crown,
    features: [
      "✨ Menús ilimitados",
      "✨ 10 fotos por plato",
      "✨ Quitar fondo ilimitado",
      "🏬 Multi-sucursal ilimitada",
      "🖨️ Voucher printing 1-click (POS/A4/A5)",
      "📈 Reportes avanzados multi-sucursal",
      "🌐 Dominio propio (midominio.com)",
      "🤖 Auto-traducción AI (ES/EN/PT/FR/DE)",
      "🎟️ Programa de lealtad + cupones",
      "🔔 Notificaciones push",
      "🔄 Transferencia de stock entre locales",
      "👑 Onboarding personalizado 24/7",
    ],
    cta: "Empezar Full",
    href: "/register?plan=full",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#9d4edd]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              Planes simples,
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] bg-clip-text text-transparent">
                {" "}sin comisiones
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-xl mx-auto">
              Sin contratos. Cancelas cuando quieras.
            </p>
          </motion.div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS_LANDING.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl p-6 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#d4af37]/15 to-[#15152a] border-2 border-[#d4af37]/50 shadow-2xl shadow-[#d4af37]/20"
                  : "bg-white/[0.03] border border-white/10 hover:border-white/20"
              }`}
              style={
                plan.id === "premium" || plan.id === "full"
                  ? {
                      background: `linear-gradient(to bottom, ${plan.color}15, #15152a)`,
                      borderColor: `${plan.color}40`,
                    }
                  : undefined
              }
            >
              {/* Badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] text-[10px] font-bold tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> POPULAR
                </div>
              )}
              {(plan.id === "premium" || plan.id === "full") && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-lg whitespace-nowrap"
                  style={{ background: plan.color, color: "#0a0a14" }}
                >
                  {plan.id === "premium" ? "PREMIUM" : "FULL"}
                </div>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-2.5 mb-2 mt-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}
                >
                  <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
              </div>
              <p className="text-sm text-white/60 mb-5 min-h-[2.5em]">{plan.description}</p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/60">S/</span>
                  <span className="text-5xl font-bold">{plan.priceMonthly}</span>
                  <span className="text-white/50 text-sm">/mes</span>
                </div>
                {plan.priceMonthly > 0 && (
                  <div className="text-xs text-white/40 mt-1">
                    ≈ ${Math.round(plan.priceMonthly / 3.9)} USD · IVA incluido
                  </div>
                )}
                {plan.priceMonthly === 0 && (
                  <div className="text-xs text-white/40 mt-1">Para siempre, sin caducidad</div>
                )}
              </div>

              {/* Features list */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: `${plan.color}20` }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                    </div>
                    <span className="text-white/85 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`group flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:shadow-xl hover:shadow-[#d4af37]/30"
                    : plan.id === "free"
                    ? "bg-white/5 border border-white/15 text-white hover:bg-white/10"
                    : "hover:opacity-90 text-[#0a0a14]"
                }`}
                style={
                  plan.id === "premium" || plan.id === "full"
                    ? { background: `linear-gradient(to right, ${plan.color}, ${plan.color}cc)` }
                    : undefined
                }
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Upsell banner — la mayoría elige 99 o 199 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden bg-white/[0.03] border border-[#d4af37]/30 p-8 text-center relative"
        >
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37] tracking-wider mb-3">
              ⚡ RECOMENDADO PARA RESTAURANTES EN CRECIMIENTO
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              La mayoría elige <span className="text-[#d4af37]">Premium</span> o <span className="text-[#d4af37]">Full</span>
            </h3>
            <p className="text-white/60 max-w-xl mx-auto mb-4 text-sm">
              Por menos de <strong className="text-white/80">S/ 4 al día</strong>, obtienes comandas, cocina display, inventario y white label.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">Sin comisiones por venta</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">Cancelas cuando quieras</span>
            </div>
          </div>
        </motion.div>

        {/* Help cards — Premium / Full */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5 bg-white/[0.02] border border-white/10 flex items-start gap-4 hover:bg-white/[0.04] transition"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Utensils className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="font-bold text-white mb-1">¿Tienes mesas y mozos?</div>
              <div className="text-sm text-white/55 leading-relaxed">
                <strong className="text-white/80">Premium (S/ 99/mes)</strong> incluye comandas, inventario, cocina display y white label.
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5 bg-white/[0.02] border border-white/10 flex items-start gap-4 hover:bg-white/[0.04] transition"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="font-bold text-white mb-1">¿Tienes varias sucursales?</div>
              <div className="text-sm text-white/55 leading-relaxed">
                <strong className="text-white/80">Full (S/ 199/mes)</strong> desbloquea multi-sucursal, voucher POS, dominio propio y AI.
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-sm text-white/50 mt-8">
          ¿Necesitas algo más grande?{" "}
          <a href="mailto:hola@menupro.app" className="text-[#d4af37] hover:underline font-medium">
            Contáctanos
          </a>
        </p>
      </div>
    </section>
  );
}
