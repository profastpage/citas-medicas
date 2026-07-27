"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus, Monitor, Smartphone, Download, Check, Apple } from "lucide-react";
import type { Platform } from "@/hooks/use-pwa-install";

interface Props {
  open: boolean;
  onClose: () => void;
  platform: Platform;
  onInstallNative?: () => void;
  variant?: "dashboard" | "mozo" | "landing";
}

export function InstallInstructionsModal({ open, onClose, platform, onInstallNative, variant = "dashboard" }: Props) {
  // Para desktop/android, disparamos la instalación nativa automáticamente al abrir el modal
  useEffect(() => {
    if (!open) return;
    if ((platform === "android" || platform === "desktop") && onInstallNative) {
      // Pequeño delay para que el modal se muestre primero y luego se dispare el prompt nativo
      const t = setTimeout(() => onInstallNative(), 400);
      return () => clearTimeout(t);
    }
  }, [open, platform, onInstallNative]);

  const titleColor =
    variant === "mozo"
      ? "from-[#9d4edd] to-[#d4af37]"
      : variant === "landing"
      ? "from-[#d4af37] to-[#f4d35e]"
      : "from-[#ff6b35] to-[#e63946]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a14] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${titleColor} flex items-center justify-center text-xl font-bold text-[#0a0a14]`}>
                  {variant === "mozo" ? "👨‍🍳" : "M"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Instalar MenuPro{variant === "mozo" ? " · Panel del mozo" : ""}
                  </h3>
                  <p className="text-xs text-white/50">
                    {platform === "ios" && "iPhone / iPad"}
                    {platform === "android" && "Android"}
                    {platform === "desktop" && "Escritorio"}
                    {platform === "other" && "Tu dispositivo"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido según plataforma */}
            {platform === "ios" && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
                  <Apple className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    iPhone/iPad no soporta instalación directa. Sigue estos pasos para agregar MenuPro a tu pantalla de inicio.
                  </p>
                </div>

                <ol className="space-y-3">
                  <Step
                    num={1}
                    icon={<Share className="w-4 h-4" />}
                    title="Toca el botón Compartir"
                    desc="Está en la barra inferior de Safari (cuadrado con flecha hacia arriba)."
                  />
                  <Step
                    num={2}
                    icon={<Plus className="w-4 h-4" />}
                    title="Selecciona 'Añadir a pantalla de inicio'"
                    desc="Desplázate hacia abajo en la hoja de acciones y toca esa opción."
                  />
                  <Step
                    num={3}
                    icon={<Check className="w-4 h-4" />}
                    title="Confirma"
                    desc="Toca 'Añadir' en la esquina superior derecha. ¡Listo! Tendrás el ícono en tu pantalla de inicio."
                  />
                </ol>

                <div className="text-center text-xs text-white/40 pt-2">
                  Una vez instalada, abrirá en pantalla completa, sin la barra del navegador.
                </div>
              </div>
            )}

            {platform === "android" && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
                  <Smartphone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Si no apareció el diálogo de instalación automática, sigue estos pasos manuales:
                  </p>
                </div>

                <ol className="space-y-3">
                  <Step
                    num={1}
                    icon={<Download className="w-4 h-4" />}
                    title="Menú de Chrome (⋮)"
                    desc="Toca los tres puntos en la esquina superior derecha del navegador."
                  />
                  <Step
                    num={2}
                    icon={<Plus className="w-4 h-4" />}
                    title="Selecciona 'Instalar aplicación' o 'Añadir a pantalla de inicio'"
                    desc="Está en el menú desplegable."
                  />
                  <Step
                    num={3}
                    icon={<Check className="w-4 h-4" />}
                    title="Confirma"
                    desc="Toca 'Instalar' en el diálogo. El ícono aparecerá en tu launcher."
                  />
                </ol>
              </div>
            )}

            {platform === "desktop" && (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2.5">
                  <Monitor className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-100/90 leading-relaxed">
                    Si no apareció el diálogo de instalación automática, usa el ícono de instalación en la barra de direcciones:
                  </p>
                </div>

                <ol className="space-y-3">
                  <Step
                    num={1}
                    icon={<Download className="w-4 h-4" />}
                    title="Busca el ícono de instalación"
                    desc="Aparece en la barra de direcciones (a la derecha de la URL). Es un ícono con un + o un monitor con flecha hacia abajo."
                  />
                  <Step
                    num={2}
                    icon={<Plus className="w-4 h-4" />}
                    title="Haz clic y selecciona 'Instalar'"
                    desc="Aparecerá un diálogo de confirmación."
                  />
                  <Step
                    num={3}
                    icon={<Check className="w-4 h-4" />}
                    title="¡Listo!"
                    desc="MenuPro se abrirá en su propia ventana, sin pestañas del navegador. Podrás fijarla en tu taskbar/dock."
                  />
                </ol>

                <div className="text-center text-xs text-white/40 pt-2">
                  También desde el menú ⋮ → "Instalar MenuPro..."
                </div>
              </div>
            )}

            {platform === "other" && (
              <div className="space-y-3 text-sm text-white/70">
                <p>Tu navegador no soporta instalación directa de PWAs.</p>
                <p className="text-white/50 text-xs">
                  Te recomendamos abrir esta página en Chrome, Edge o Safari para poder instalar MenuPro como aplicación.
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={onClose}
              className={`mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r ${titleColor} text-[#0a0a14] font-semibold hover:opacity-90 transition`}
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Step({ num, icon, title, desc }: { num: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">
          <span className="text-white/40 mr-1.5">{num}.</span>
          {title}
        </div>
        <div className="text-xs text-white/55 mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </li>
  );
}
