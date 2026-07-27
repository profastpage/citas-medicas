"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Check, Sparkles, Crown } from "lucide-react";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { InstallInstructionsModal } from "./install-instructions-modal";
import { type PlanId, isPlanAtLeast } from "@/lib/plans";

type Variant = "dashboard" | "mozo" | "landing";
type Size = "sm" | "md" | "lg";

interface Props {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Mostrar etiqueta de texto (default true) */
  showLabel?: boolean;
  /** Estilo visual: solid (botón primario) | ghost (solo outline) | compact (icono + texto pequeño) */
  style?: "solid" | "ghost" | "compact";
  /** Plan actual del usuario — si se pasa, muestra badge y copy específico */
  planId?: PlanId;
}

// Features de PWA según plan
function getPwaFeatureText(variant: Variant, planId: PlanId | undefined): {
  badge?: string;
  tooltip: string;
  premiumOnly?: boolean;
} {
  if (variant === "mozo") {
    // Mozos: PWA con offline real solo en Premium+
    if (!planId) return { tooltip: "Instala el panel del mozo en tu celular" };
    if (isPlanAtLeast(planId, "full")) {
      return {
        badge: "Full",
        tooltip: "PWA Premium con Background Sync — comandas offline se envían solas al volver la conexión",
      };
    }
    if (isPlanAtLeast(planId, "premium")) {
      return {
        badge: "Premium",
        tooltip: "PWA con modo offline — toma comandas sin internet y se sincronizan solas",
      };
    }
    // Free/Pro: PWA básica (sin offline)
    return {
      badge: "Básica",
      tooltip: "PWA básica — instala el panel en tu celular. El modo offline real requiere plan Premium (S/ 99/mes)",
      premiumOnly: false,
    };
  }
  if (variant === "dashboard") {
    if (!planId) return { tooltip: "Instala MenuPro en tu dispositivo" };
    if (isPlanAtLeast(planId, "full")) {
      return { badge: "Full", tooltip: "PWA Full con todas las features premium instaladas" };
    }
    if (isPlanAtLeast(planId, "premium")) {
      return { badge: "Premium", tooltip: "PWA Premium — acceso completo al panel desde tu pantalla de inicio" };
    }
    if (planId === "pro") {
      return { badge: "Pro", tooltip: "PWA optimizada — carga instantánea del dashboard" };
    }
    return { badge: "Free", tooltip: "PWA básica — instala MenuPro en tu pantalla de inicio" };
  }
  // landing
  return { tooltip: "Instala MenuPro en tu celular o desktop" };
}

export function InstallAppButton({
  variant = "dashboard",
  size = "md",
  className = "",
  showLabel = true,
  style = "solid",
  planId,
}: Props) {
  const { platform, canInstall, needsManualInstructions, state, promptInstall } = usePwaInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const featureInfo = getPwaFeatureText(variant, planId);

  // No mostrar nada si ya está instalado o si no es instalable (a menos que sea iOS que siempre podemos mostrar instrucciones)
  if (state === "installed") {
    if (justInstalled) {
      return (
        <span className={`inline-flex items-center gap-1.5 text-emerald-400 text-sm ${className}`}>
          <Check className="w-4 h-4" />
          {showLabel && "App instalada"}
        </span>
      );
    }
    return null;
  }

  if (state === "dismissed") return null;
  if (state === "unsupported" && platform !== "ios") return null;

  // Colores según variante
  const colors = {
    dashboard: "from-[#ff6b35] to-[#e63946]",
    mozo: "from-[#9d4edd] to-[#d4af37]",
    landing: "from-[#d4af37] to-[#f4d35e]",
  }[variant];

  const sizeClasses: Record<Size, { padding: string; iconSize: string; fontSize: string }> = {
    sm: { padding: "px-3 py-1.5", iconSize: "w-3.5 h-3.5", fontSize: "text-xs" },
    md: { padding: "px-4 py-2", iconSize: "w-4 h-4", fontSize: "text-sm" },
    lg: { padding: "px-5 py-2.5", iconSize: "w-5 h-5", fontSize: "text-base" },
  };
  const sizes = sizeClasses[size];

  const handleClick = async () => {
    if (needsManualInstructions) {
      // iOS: abrir modal con instrucciones
      setModalOpen(true);
      return;
    }
    if (canInstall) {
      const result = await promptInstall();
      if (result === "manual") {
        // iOS llegó aquí por algún motivo — abrir modal
        setModalOpen(true);
      } else if (result === "accepted") {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
      // Si dismissed o failed, simplemente no hacer nada (el hook ya marcó el estado)
      return;
    }
    // Si no es instalable pero es iOS, abrir modal con instrucciones manuales
    if (platform === "ios") {
      setModalOpen(true);
    }
  };

  // Estilos según `style`
  const baseClasses =
    style === "ghost"
      ? `inline-flex items-center gap-1.5 ${sizes.padding} rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition font-medium ${sizes.fontSize}`
      : style === "compact"
      ? `inline-flex items-center gap-1.5 ${sizes.padding} rounded-lg bg-gradient-to-r ${colors} text-[#0a0a14] hover:opacity-90 transition font-semibold ${sizes.fontSize}`
      : `inline-flex items-center gap-2 ${sizes.padding} rounded-xl bg-gradient-to-r ${colors} text-[#0a0a14] hover:opacity-90 transition font-semibold shadow-lg ${sizes.fontSize} ${variant === "dashboard" ? "shadow-[#ff6b35]/20" : variant === "mozo" ? "shadow-[#9d4edd]/20" : "shadow-[#d4af37]/20"}`;

  const label =
    variant === "mozo"
      ? "Instalar panel del mozo"
      : variant === "landing"
      ? "Instalar app"
      : "Instalar app";

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`${baseClasses} ${className} relative`}
        title={featureInfo.tooltip}
        aria-label={label}
      >
        {variant === "mozo" ? (
          <Smartphone className={sizes.iconSize} />
        ) : (
          <Download className={sizes.iconSize} />
        )}
        {showLabel && label}

        {/* Plan badge — solo si tiene planId y no es compact sin label */}
        {featureInfo.badge && (showLabel || style !== "compact") && (
          <span
            className={`ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              featureInfo.badge === "Premium" || featureInfo.badge === "Full"
                ? "bg-black/20 text-current"
                : "bg-black/10 text-current"
            }`}
          >
            {featureInfo.badge === "Premium" || featureInfo.badge === "Full" ? (
              <Crown className="w-2.5 h-2.5" />
            ) : (
              <Sparkles className="w-2.5 h-2.5" />
            )}
            {featureInfo.badge}
          </span>
        )}
      </motion.button>

      <InstallInstructionsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={platform}
        variant={variant}
        onInstallNative={
          canInstall && !needsManualInstructions
            ? async () => {
                const r = await promptInstall();
                if (r === "accepted") {
                  setModalOpen(false);
                  setJustInstalled(true);
                  setTimeout(() => setJustInstalled(false), 4000);
                } else if (r === "dismissed") {
                  setModalOpen(false);
                }
              }
            : undefined
        }
      />
    </>
  );
}
