"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type Platform = "ios" | "android" | "desktop" | "other";
export type InstallState = "available" | "installed" | "unsupported" | "dismissed";

const DISMISS_KEY = "menupro_install_dismissed_at";
const DISMISS_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

/**
 * Hook que detecta plataforma, estado de instalación y evento beforeinstallprompt.
 * Permite disparar la instalación nativa en Chrome/Android/Edge y mostrar
 * instrucciones manuales en iOS Safari.
 */
export function usePwaInstall() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [state, setState] = useState<InstallState>("unsupported");

  // Detectar plataforma y modo standalone
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(ua);
    const isDesktop = !isIOS && !isAndroid;
    setPlatform(isIOS ? "ios" : isAndroid ? "android" : isDesktop ? "desktop" : "other");

    // standalone detection (iOS: navigator.standalone / display-mode: standalone)
    const standalone =
      (window.matchMedia?.("(display-mode: standalone)")?.matches) ||
      (window.matchMedia?.("(display-mode: window-controls-overlay)")?.matches) ||
      // iOS Safari tiene navigator.standalone (no tipado)
      (window.navigator as { standalone?: boolean })?.standalone === true;
    setIsStandalone(Boolean(standalone));
    if (standalone) {
      setState("installed");
      return;
    }

    // Si fue dismissado recientemente, no mostrar
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < DISMISS_DURATION_MS) {
      setState("dismissed");
    }
  }, []);

  // Capturar beforeinstallprompt (Chrome/Android/Edge)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      if (state !== "dismissed" && state !== "installed") {
        setState("available");
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installedHandler = () => {
      setState("installed");
      setInstallEvent(null);
    };
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [state]);

  // Para iOS Safari, mostrar botón "instalar" que abre modal con instrucciones
  // (no hay evento beforeinstallprompt — el usuario debe hacerlo manual vía Share → Add to Home Screen)
  useEffect(() => {
    if (platform === "ios" && !isStandalone && state === "unsupported") {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > DISMISS_DURATION_MS) {
        setState("available");
      } else {
        setState("dismissed");
      }
    } else if (platform === "android" || platform === "desktop") {
      // En Android/desktop Chrome/Edge, si no hay beforeinstallprompt todavía,
      // asumimos unsupported hasta que llegue el evento
      if (state === "unsupported" && !installEvent) {
        // Esperar 3s antes de declarar unsupported (puede tardar en llegar)
        const t = setTimeout(() => {
          if (!installEvent) {
            setState((s) => (s === "available" ? s : "unsupported"));
          }
        }, 3000);
        return () => clearTimeout(t);
      }
    }
  }, [platform, isStandalone, state, installEvent]);

  // Acción de instalar
  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "manual" | "failed"> => {
    if (platform === "ios") {
      // iOS no soporta prompt nativo — devolver "manual" para que la UI muestre instrucciones
      return "manual";
    }
    if (!installEvent) return "failed";
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      if (choice.outcome === "accepted") {
        setState("installed");
        return "accepted";
      } else {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        setState("dismissed");
        return "dismissed";
      }
    } catch {
      return "failed";
    }
  }, [installEvent, platform]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setState("dismissed");
  }, []);

  return {
    platform,
    state, // "available" | "installed" | "unsupported" | "dismissed"
    isStandalone,
    canInstall: state === "available" && (platform === "ios" || !!installEvent),
    needsManualInstructions: platform === "ios" && state === "available",
    promptInstall,
    dismiss,
  };
}
