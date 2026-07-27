"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Zap, TrendingUp, ShoppingBag, Clock } from "lucide-react";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Decorative gradient orbs — animados */}
      <motion.div
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 30, 0], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #9d4edd 0%, transparent 70%)" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        {/* ─── IZQUIERDA: Copy + CTAs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/15 to-[#f4d35e]/10 border border-[#d4af37]/40 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs font-semibold text-[#d4af37] tracking-wide">
              MENÚS DIGITALES PROFESIONALES
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5 tracking-tight">
            Menús digitales
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d35e] to-[#d4af37] bg-clip-text text-transparent">
                que venden más
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-[#f4d35e] rounded-full origin-left"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed">
            Tu carta digital con carrito de WhatsApp en 5 minutos. Sin comisiones, sin contratos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] font-bold hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all"
              >
                Crear mi menú gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 transition font-medium"
              >
                Ver precios
              </a>
            </motion.div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Cancelas cuando quieras
            </div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md"
          >
            <Stat value="+500" label="Restaurantes" />
            <Stat value="+50k" label="Pedidos WhatsApp" />
            <Stat value="4.9★" label="Rating promedio" />
          </motion.div>
        </motion.div>

        {/* ─── DERECHA: Mockup premium con device frame ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <PhoneMockup />

          {/* Floating cards — solo desktop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -left-4 lg:-left-12 top-1/4 bg-[#1a1a2e] border border-white/10 rounded-2xl p-3 shadow-2xl hidden md:block backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/50">Visitas hoy</div>
                <div className="text-xl font-bold text-emerald-400">+147</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute -right-4 lg:-right-12 bottom-1/3 bg-[#1a1a2e] border border-white/10 rounded-2xl p-3 shadow-2xl hidden md:block backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#06d6a0]/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#06d6a0]" />
              </div>
              <div>
                <div className="text-[10px] text-white/50">Pedidos WhatsApp</div>
                <div className="text-xl font-bold text-[#06d6a0]">+12</div>
              </div>
            </div>
          </motion.div>

          {/* Top floating — rating */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute -top-3 right-6 bg-[#1a1a2e] border border-white/10 rounded-full px-3 py-1.5 shadow-2xl hidden md:flex items-center gap-1.5 backdrop-blur"
          >
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d35e] border border-[#1a1a2e] text-[8px] flex items-center justify-center font-bold text-[#1a1a2e]"
                >
                  {["L", "M", "P"][i - 1]}
                </div>
              ))}
            </div>
            <span className="text-xs text-white/80 font-medium">
              <span className="text-[#d4af37] font-bold">4.9</span> · 320 reseñas
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs text-white/50 mt-0.5">{label}</div>
    </div>
  );
}

// ─── Phone mockup ultra profesional ───
function PhoneMockup() {
  return (
    <div className="relative max-w-[340px] mx-auto">
      {/* Glow behind phone */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 to-[#9d4edd]/20 blur-3xl rounded-full" />

      {/* Phone frame */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-[#0a0a14] rounded-[2.5rem] border-[3px] border-[#1a1a2e] shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.1)" }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a14] rounded-b-2xl z-10 border-x border-b border-white/5" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[10px] text-white/60 font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm border border-white/40" />
            <span className="text-[8px]">●●●●</span>
            <span className="w-5 h-2 rounded-sm border border-white/40 inline-block" />
          </span>
        </div>

        {/* Restaurant header */}
        <div className="bg-gradient-to-b from-[#0f0f1a] to-[#0a0a14] px-5 pt-3 pb-4 text-center relative">
          {/* Cover image bg */}
          <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, #d4af37 0%, #e63946 100%)" }} />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f4d35e] mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-[#1a1a2e] shadow-lg">
              L
            </div>
            <div className="font-bold text-lg flex items-center justify-center gap-1">
              La Parrilla
              <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            </div>
            <div className="text-[10px] text-[#d4af37] tracking-widest uppercase mt-0.5 font-semibold">
              Cocina de autor
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Abierto ahora
              </span>
              <span className="text-[10px] text-white/40 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> 25-35 min
              </span>
            </div>
          </div>
        </div>

        {/* Dish list */}
        <div className="bg-[#0a0a14] px-3 py-3 space-y-2">
          {[
            { name: "Ceviche Clásico", desc: "Pescado fresco, ají limo, cebolla", price: "S/ 28.00", tag: "TOP", color: "#d4af37" },
            { name: "Lomo Saltado", desc: "Salteado de res, papas fritas", price: "S/ 35.00", tag: null, color: "#d4af37" },
            { name: "Ají de Gallina", desc: "Crema de ají amarillo, pecanas", price: "S/ 30.00", tag: "NEW", color: "#06d6a0" },
          ].map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-[#d4af37]/20 transition"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/30 to-[#e63946]/20 flex-shrink-0" />
                {d.tag && (
                  <span
                    className="absolute -top-1 -right-1 text-[8px] font-bold px-1 py-0.5 rounded-full"
                    style={{ background: d.color, color: "#0a0a14" }}
                  >
                    {d.tag}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{d.name}</div>
                <div className="text-[10px] text-white/50 truncate">{d.desc}</div>
                <div className="text-[#d4af37] font-bold text-sm mt-0.5">{d.price}</div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d35e] flex items-center justify-center text-[#1a1a2e] font-bold shadow-md"
              >
                +
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Floating cart bar */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] p-3 m-3 rounded-2xl flex items-center justify-between shadow-xl"
        >
          <div className="text-[#1a1a2e] font-semibold text-sm flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#e63946] text-white text-[8px] font-bold flex items-center justify-center">
                3
              </span>
            </div>
            Ver pedido
          </div>
          <div className="text-[#1a1a2e] font-bold">S/ 93.00</div>
        </motion.div>

        {/* WhatsApp floating button */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
