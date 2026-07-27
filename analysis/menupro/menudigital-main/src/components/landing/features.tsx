"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  ShoppingCart,
  QrCode,
  Image as ImageIcon,
  Shield,
  TrendingUp,
  Globe,
  ChefHat,
  Package,
  ArrowUpRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Smartphone,
    title: "Editor visual en vivo",
    desc: "Diseña tu carta arrastrando y soltando. Vista previa instantánea en móvil y desktop mientras editas. Sin código, sin complicaciones.",
    color: "#d4af37",
    size: "lg",
  },
  {
    icon: ShoppingCart,
    title: "Carrito con WhatsApp",
    desc: "Tus clientes arman su pedido y lo envían directo a tu WhatsApp Business. Cero comisiones por venta.",
    color: "#06d6a0",
    size: "sm",
  },
  {
    icon: QrCode,
    title: "Código QR HD",
    desc: "Descarga en alta resolución, imprímelo y ponlo en cada mesa. QR dinámico que puedes actualizar sin reimprimir.",
    color: "#9d4edd",
    size: "sm",
  },
  {
    icon: ImageIcon,
    title: "Fotos profesionales + WebP",
    desc: "Sube fotos profesionales de tus platos (1 en Free, 3 en Pro, 5 en Premium, 10 en Full). Optimización automática WebP para carga ultrarrápida en móvil.",
    color: "#118ab2",
    size: "lg",
  },
  {
    icon: ChefHat,
    title: "Comandas + Cocina Display",
    desc: "Sistema completo: mozo toma comanda desde su celular → cocina display en tiempo real → entrega. Incluye inventario con recetas automáticas.",
    color: "#e63946",
    size: "lg",
  },
  {
    icon: TrendingUp,
    title: "Analytics avanzados",
    desc: "Visitas, clics en WhatsApp, platos más pedidos, horas pico. Toma decisiones con datos reales de tu restaurante.",
    color: "#d4af37",
    size: "sm",
  },
  {
    icon: Globe,
    title: "Multi-idioma ES/EN",
    desc: "Atiende turistas sin esfuerzo. Tu carta se traduce automáticamente al inglés.",
    color: "#06d6a0",
    size: "sm",
  },
  {
    icon: Package,
    title: "Inventario de insumos",
    desc: "Recetas que consumen stock automáticamente al facturar. Alertas de stock bajo para que nunca te quedes sin insumos.",
    color: "#9d4edd",
    size: "lg",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-white/5 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              Diseñado para
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] bg-clip-text text-transparent">
                {" "}restaurantes reales
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-xl mx-auto">
              Funciona en cualquier restaurante, pollería, sanguchería o cafetería del Perú.
            </p>
          </motion.div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const colSpan = f.size === "lg" ? "lg:col-span-2" : "";
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all overflow-hidden ${colSpan}`}
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top right, ${f.color}15 0%, transparent 60%)`,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${f.color}20`,
                      border: `1px solid ${f.color}40`,
                    }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                      <ArrowUpRight
                        className="w-4 h-4 text-white/30 group-hover:text-white/70 transition opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1"
                      />
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                  </div>
                </div>

                {/* Decorative line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, transparent, ${f.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Sin comisiones — banner inferior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#06d6a0]/10 via-[#d4af37]/10 to-[#06d6a0]/10 border border-[#06d6a0]/20 p-8 text-center"
        >
          <Shield className="w-10 h-10 text-[#06d6a0] mx-auto mb-3" />
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Sin comisiones por venta. <span className="text-[#06d6a0]">Nunca.</span>
          </h3>
          <p className="text-white/70 max-w-xl mx-auto">
            Pagas solo la suscripción mensual. MenuPro no toca tus ventas. Tus clientes te pagan directo,
            tu dinero es 100% tuyo desde el primer día.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
