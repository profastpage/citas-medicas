"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

/**
 * PwaRegistry — registra el service worker y muestra:
 * - Banner de actualización cuando hay una nueva versión
 * - Banner de offline cuando no hay conexión
 *
 * El banner de instalación se maneja por separado con <InstallAppButton />
 * en cada contexto (dashboard, panel del mozo, landing) para que sea contextual.
 */
export default function PwaRegistry() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // ============================================================
  // Registrar Service Worker (solo en producción)
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        setRegistration(reg);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setShowUpdateBanner(true);
            }
          });
        });

        if (reg.waiting && navigator.serviceWorker.controller) {
          setShowUpdateBanner(true);
        }
      } catch (err) {
        console.warn("[PWA] No se pudo registrar el SW:", err);
      }
    };

    register();

    const handleControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  // ============================================================
  // Detectar online/offline
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsOffline(!navigator.onLine);
    update();
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // ============================================================
  // Acción del banner de update
  // ============================================================
  const handleUpdate = async () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage("SKIP_WAITING");
  };

  return (
    <>
      {/* Banner Offline (arriba) */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span>Sin conexión — navegando en modo offline</span>
        </div>
      )}

      {/* Banner de actualización disponible */}
      {showUpdateBanner && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md mx-4">
          <RefreshCw className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Nueva versión disponible</p>
            <p className="text-xs opacity-90">Recarga para obtener las últimas mejoras.</p>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 rounded-lg bg-white text-orange-600 hover:bg-white/90 text-sm font-semibold"
          >
            Actualizar
          </button>
          <button
            onClick={() => setShowUpdateBanner(false)}
            className="text-white/80 hover:text-white px-1"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
