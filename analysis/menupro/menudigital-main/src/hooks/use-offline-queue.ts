"use client";

/**
 * Hook para gestionar comandas en cola offline (Premium+).
 *
 * Funcionamiento:
 * - Cuando el mozo está offline y crea una comanda, se guarda en IndexedDB.
 * - El Service Worker hace Background Sync cuando vuelve la conexión.
 * - Si el usuario vuelve online manualmente, este hook también reintentará.
 *
 * IndexedDB schema:
 *   DB: menupro-offline
 *   Store: pending-comandas
 *     { id, waiterToken, mesaId, items, notas, cliente, createdAt, attempts }
 */

import { useCallback, useEffect, useState } from "react";

export interface PendingComanda {
  id: string; // uuid client-generated
  waiterToken: string;
  mesaId: string;
  mesaNumero: string;
  items: Array<{
    dish_id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    notas?: string;
  }>;
  notas?: string;
  cliente?: string;
  createdAt: string;
  attempts: number;
  status: "pending" | "syncing" | "synced" | "failed";
}

const DB_NAME = "menupro-offline";
const DB_VERSION = 1;
const STORE = "pending-comandas";

// ============================================================
// IndexedDB helpers (sin librería externa)
// ============================================================

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("waiterToken", "waiterToken", { unique: false });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

async function putPending(comanda: PendingComanda): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(comanda);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllPending(): Promise<PendingComanda[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as PendingComanda[]);
    req.onerror = () => reject(req.error);
  });
}

async function deletePending(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ============================================================
// Hook principal
// ============================================================

export function useOfflineQueue(waiterToken: string | null) {
  const [pending, setPending] = useState<PendingComanda[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Cargar pendientes al montar
  const refresh = useCallback(async () => {
    try {
      const all = await getAllPending();
      const mine = all.filter(
        (c) => c.waiterToken === waiterToken && c.status !== "synced"
      );
      setPending(mine.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    } catch (err) {
      console.warn("[useOfflineQueue] No se pudo leer cola:", err);
    }
  }, [waiterToken]);

  useEffect(() => {
    refresh();
    // Refrescar cada 5s mientras haya pendientes
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Agregar comanda a la cola offline
  const enqueue = useCallback(
    async (comanda: Omit<PendingComanda, "id" | "createdAt" | "attempts" | "status" | "waiterToken">) => {
      if (!waiterToken) throw new Error("waiterToken requerido");
      const newComanda: PendingComanda = {
        ...comanda,
        id: `oc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        waiterToken,
        createdAt: new Date().toISOString(),
        attempts: 0,
        status: "pending",
      };
      await putPending(newComanda);
      await refresh();
      return newComanda;
    },
    [waiterToken, refresh]
  );

  // Intentar sincronizar todas las pendientes con el servidor
  const syncNow = useCallback(async () => {
    if (isSyncing) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    setIsSyncing(true);
    try {
      const all = await getAllPending();
      const mine = all.filter(
        (c) => c.waiterToken === waiterToken && c.status === "pending"
      );
      for (const c of mine) {
        // Marcar como syncing
        await putPending({ ...c, status: "syncing" });
        try {
          const res = await fetch("/api/mozo-panel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              waiterToken: c.waiterToken,
              mesaId: c.mesaId,
              items: c.items,
              notas: c.notas,
              cliente: c.cliente,
              offlineId: c.id,
            }),
          });
          if (res.ok) {
            await deletePending(c.id);
          } else {
            // Reintentar después
            await putPending({
              ...c,
              status: "pending",
              attempts: c.attempts + 1,
            });
          }
        } catch (err) {
          // Sin conexión todavía — marcar como pending
          await putPending({
            ...c,
            status: "pending",
            attempts: c.attempts + 1,
          });
        }
      }
      await refresh();
    } finally {
      setIsSyncing(false);
    }
  }, [waiterToken, isSyncing, refresh]);

  // Auto-sync cuando vuelve la conexión
  useEffect(() => {
    if (!waiterToken) return;
    const goOnline = () => {
      console.log("[useOfflineQueue] Online — sincronizando...");
      syncNow();
    };
    window.addEventListener("online", goOnline);
    // Sincronizar al montar si ya está online
    if (typeof navigator !== "undefined" && navigator.onLine) {
      syncNow();
    }
    return () => window.removeEventListener("online", goOnline);
  }, [waiterToken, syncNow]);

  // Escuchar mensajes del SW (Background Sync)
  useEffect(() => {
    if (!waiterToken) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_COMANDAS_REQUEST") {
        syncNow();
      }
    };
    navigator.serviceWorker?.addEventListener("message", handler);
    return () => navigator.serviceWorker?.removeEventListener("message", handler);
  }, [waiterToken, syncNow]);

  return {
    pending,
    isSyncing,
    enqueue,
    syncNow,
    refresh,
    hasPending: pending.length > 0,
  };
}
