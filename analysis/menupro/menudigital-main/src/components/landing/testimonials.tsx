"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "María Quispe",
    role: "La Parrilla de la Esquina",
    city: "Lima",
    avatar: "M",
    color: "#d4af37",
    rating: 5,
    plan: "Pro",
    quote:
      "Pasé de imprimir cartas cada mes a un QR que actualizo desde mi celular. Los clientes aman el carrito de WhatsApp. En 2 semanas mis pedidos por WhatsApp subieron 60%.",
  },
  {
    name: "Carlos Romero",
    role: "Cevichería El Puerto",
    city: "Callao",
    avatar: "C",
    color: "#9d4edd",
    rating: 5,
    plan: "Premium",
    quote:
      "El panel de mozos offline es oro puro. Mis mozos toman la comanda desde su celular sin internet y se sincroniza solo. El inventario con recetas me ahorra 2 horas diarias.",
  },
  {
    name: "Rosa Mendoza",
    role: "Pollería Don Tito",
    city: "Arequipa",
    avatar: "R",
    color: "#e63946",
    rating: 5,
    plan: "Full",
    quote:
      "Tengo 4 sucursales y ahora veo todo consolidado. El voucher printing 1-click va directo al POS. Los reportes por sucursal y por mozo me dan datos para decidir.",
  },
  {
    name: "Jorge Huamán",
    role: "Sanguchería La 12",
    city: "Trujillo",
    avatar: "J",
    color: "#06d6a0",
    rating: 5,
    plan: "Pro",
    quote:
      "Empecé con Free para probar, en 1 día ya tenía mi carta lista. Subí a Pro por los 3 menús (desayuno/almuerzo/cena) y analytics. Mejor inversión del año.",
  },
  {
    name: "Patricia Solís",
    role: "Cafetería Aroma",
    city: "Cusco",
    avatar: "P",
    color: "#118ab2",
    rating: 5,
    plan: "Premium",
    quote:
      "Los turistas aman el menú en inglés. La cocina display cambió mi operación: cero errores, cero papel. El soporte me respondió en WhatsApp en 20 minutos.",
  },
  {
    name: "Diego Fernández",
    role: "Anticuchería La Negra",
    city: "Lima",
    avatar: "D",
    color: "#d4af37",
    rating: 5,
    plan: "Full",
    quote:
      "El auto-translate AI me dio menú en 5 idiomas sin pagar traductor. Las notificaciones push a clientes frecuentes subieron mis ventas nocturnas 35%.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="py-20 md:py-28 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#06d6a0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              Lo que dicen
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] bg-clip-text text-transparent">
                {" "}los restauranteros
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                ))}
              </div>
              <span className="text-white/70 font-semibold">4.9/5</span>
              <span className="text-white/40 text-sm">· 320 reseñas verificadas</span>
            </div>
          </motion.div>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all overflow-hidden group"
            >
              {/* Quote icon decorativo */}
              <Quote
                className="absolute top-4 right-4 w-10 h-10 text-white/5 group-hover:text-white/10 transition-colors"
                style={{ color: `${t.color}10` }}
              />

              {/* Rating */}
              <div className="flex gap-0.5 mb-3 relative">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5 relative">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    background: `${t.color}25`,
                    color: t.color,
                    border: `1px solid ${t.color}40`,
                  }}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{t.name}</div>
                  <div className="text-xs text-white/50 truncate">{t.role}</div>
                  <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    📍 {t.city} ·{" "}
                    <span style={{ color: t.color }} className="font-semibold">
                      Plan {t.plan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, transparent, ${t.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Trust bar inferior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <TrustStat value="+500" label="Restaurantes activos" color="#06d6a0" />
          <TrustStat value="+50k" label="Pedidos WhatsApp/mes" color="#d4af37" />
          <TrustStat value="4.9★" label="Rating promedio" color="#9d4edd" />
          <TrustStat value="<5min" label="Tiempo de alta" color="#e63946" />
        </motion.div>
      </div>
    </section>
  );
}

function TrustStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div>
      <div
        className="text-3xl md:text-4xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}
