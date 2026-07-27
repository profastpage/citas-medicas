"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const RESTAURANTS = [
  "La Parrilla",
  "Cevichería Mar",
  "Pollería Don José",
  "Anticuchería Lima",
  "Sanguchería El Chavo",
  "Café del Barrio",
];

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-white/[0.015] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs uppercase tracking-widest text-white/40 font-medium">
            Más de 500 restaurantes confían en MenuPro
          </p>

          {/* Marquee de restaurantes */}
          <div className="relative w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
              {RESTAURANTS.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2 text-white/40 hover:text-white/80 transition"
                >
                  <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                    {name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
              ))}
            </div>
            <span className="text-sm text-white/80">
              <span className="font-bold text-[#d4af37]">4.9/5</span> basado en 320+ reseñas reales
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
