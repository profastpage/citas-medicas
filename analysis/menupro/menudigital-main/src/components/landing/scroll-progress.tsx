"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * ScrollProgress — barra de progreso de lectura ultra-pro inmersiva.
 *
 * Características:
 * - Se fija al top (z-100) por encima del header sticky
 * - Gradiente dorado→ámbar que se "llena" según el scroll
 * - Spring physics para movimiento suave (no robótico)
 * - Respeta prefers-reduced-motion (sin animación)
 * - Ancho subtle 3px (no invasivo)
 * - Glow effect sutil para premium feel
 * - Funciona en mobile + desktop + iOS Safari (usa window scroll)
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  // Mostrar solo después de un mínimo de scroll (evita flickr al inicio)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduce) {
    // Sin animación: barra estática que usa el progreso directo
    return (
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-[#d4af37] via-[#f4d35e] to-[#d4af37] transition-transform duration-150 pointer-events-none"
        style={{ transform: `scaleX(${visible ? 1 : 0})` }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #d4af37 0%, #f4d35e 50%, #d4af37 100%)",
        boxShadow: "0 0 12px rgba(212,175,55,0.6), 0 0 4px rgba(244,211,94,0.8)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      aria-hidden
    />
  );
}
