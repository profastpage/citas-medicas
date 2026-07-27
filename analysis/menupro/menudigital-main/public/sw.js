/* ==========================================================================
   MenuPro Service Worker — PWA Strategy
   ==========================================================================
   Estrategias:
   - App Shell (HTML/JS/CSS del dashboard): Cache First + network fallback
   - Carta pública (/r/[slug]): Stale While Revalidate (lectura rápida offline)
   - Imágenes: Cache First con expiración (30 días)
   - API críticas (comandas/mozo-panel): Network First con fallback offline
   - Google Fonts: Cache First (1 año)
   - Cualquier otra: Network First, fallback al cache
   ==========================================================================
*/

const SW_VERSION = 'v1.0.0';
const STATIC_CACHE = `menupro-static-${SW_VERSION}`;
const RUNTIME_CACHE = `menupro-runtime-${SW_VERSION}`;
const IMAGE_CACHE = `menupro-images-${SW_VERSION}`;
const FONT_CACHE = `menupro-fonts-${SW_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Recursos estáticos del App Shell que siempre cachamos
const APP_SHELL = [
  '/',
  '/dashboard',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-192x192-maskable.png',
];

// ==========================================================================
// INSTALL: precachear app shell
// ==========================================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Install', SW_VERSION);
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch((err) => {
        // No fallar si algún recurso no existe (ej. offline.html aún no creado)
        console.warn('[SW] Algunos recursos del app shell no se pudieron cachear:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ==========================================================================
// ACTIVATE: limpiar caches viejos
// ==========================================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate', SW_VERSION);
  const allowedCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !allowedCaches.includes(name))
            .map((name) => {
              console.log('[SW] Borrando cache viejo:', name);
              return caches.delete(name);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ==========================================================================
// FETCH: estrategia según tipo de recurso
// ==========================================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no GET (POST/PATCH/DELETE van directo a la red)
  if (request.method !== 'GET') return;

  // Ignorar peticiones de Supabase, MercadoPago y externas (excepto fonts)
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('mercadopago') ||
    url.hostname.includes('googleapis.com/youtube') ||
    url.hostname.includes('sentry')
  ) {
    return;
  }

  // Navegaciones HTML → Network First con fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Google Fonts → Cache First (1 año)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(handleFonts(request));
    return;
  }

  // Imágenes → Cache First (30 días)
  if (
    request.destination === 'image' ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|avif)$/i.test(url.pathname)
  ) {
    event.respondWith(handleImages(request));
    return;
  }

  // JS/CSS/WASM → Stale While Revalidate
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'worker'
  ) {
    event.respondWith(handleStatic(request));
    return;
  }

  // API → Network First con fallback al cache (para offline premium)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApi(request));
    return;
  }

  // Default → Network First
  event.respondWith(handleDefault(request));
});

// ==========================================================================
// Handlers específicos
// ==========================================================================

async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response(
      '<h1>Sin conexión</h1><p>Necesitas internet para esta página.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function handleImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    // Revalidar en background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {});
    return cached;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Imagen placeholder si no hay red ni cache
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#1a1a2e" width="400" height="300"/><text x="50%" y="50%" fill="#666" font-family="sans-serif" font-size="18" text-anchor="middle">Sin imagen</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

async function handleFonts(request) {
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    return cached || new Response('', { status: 504 });
  }
}

async function handleApi(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const networkResponse = await fetch(request);
    // Solo cachear GET exitosos (no cacheamos errores ni respuestas parciales)
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Offline: intentar devolver cache (útil para mozo-panel offline premium)
    const cached = await cache.match(request);
    if (cached) {
      // Agregar header para que el cliente sepa que viene de cache offline
      const headers = new Headers(cached.headers);
      headers.set('X-Served-From', 'offline-cache');
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers,
      });
    }
    return new Response(
      JSON.stringify({ error: 'offline', message: 'Sin conexión. Reintenta en unos segundos.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleDefault(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || new Response('', { status: 504 });
  }
}

// ==========================================================================
// MESSAGE: permitir al cliente forzar update del SW
// ==========================================================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION });
  }
});

// ==========================================================================
// SYNC: Background Sync para comandas offline (Premium+)
// Cuando el mozo pierde internet y rellena comandas, se envían al volver
// ==========================================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comandas') {
    event.waitUntil(syncPendingComandas());
  }
});

async function syncPendingComandas() {
  try {
    // Recoger comandas pendientes del IndexedDB (la UI las guarda ahí)
    const allClients = await self.clients.matchAll({ includeUncontrolled: true });
    allClients.forEach((client) => {
      client.postMessage({ type: 'SYNC_COMANDAS_REQUEST' });
    });
  } catch (err) {
    console.error('[SW] Error en sync de comandas:', err);
  }
}

// ==========================================================================
// PUSH: notificaciones push (futuro - pedidos nuevos al admin)
// ==========================================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'MenuPro', body: event.data.text() };
  }
  const title = payload.title || 'MenuPro';
  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: payload.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
