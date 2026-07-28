// ============================================================
// CitasPro — Rate limiting helpers (server-side, in-memory)
// ============================================================
// Protects Supabase Auth (which has hard rate limits on the free
// tier: ~4 sign-ups/hour, ~30 login attempts/minute per IP) and
// Vercel serverless function execution from:
//   - Brute-force login attempts
//   - Registration spam
//   - API abuse (creating thousands of records)
//   - Bugs that loop and call APIs in a tight cycle
//
// LIMITS (calibrated to Supabase's hard limits — we throttle
// BEFORE Supabase sees the request):
//   /api/auth/login       — 10 req / 15 min / per IP  (login)
//   /api/auth/register    — 5 req / hour   / per IP  (signup)
//   /api/auth/forgot      — 5 req / hour   / per IP  (reset email)
//   /api/auth/*           — 30 req / min   / per IP  (other auth)
//   /api/* (authenticated) — 200 req / min / per user
//   All other routes       — 60 req / min  / per IP
//
// STORAGE: in-memory Map. On Vercel serverless this is per-instance
// (each Lambda container has its own counter), which gives ~rough
// protection. For production-grade distributed limiting, upgrade
// to Upstash Redis — see `rate-limit-redis.ts` placeholder.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

interface RateBucket {
  count: number;
  resetAt: number;
}

// Map<key, RateBucket>
const store = new Map<string, RateBucket>();

// Periodically purge expired entries to avoid memory leak
// (runs on every call, cheap because we just iterate keys)
function purgeExpired(now: number) {
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
  }
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints — strict to protect Supabase Auth free tier
  '/api/auth/login':     { windowMs: 15 * 60 * 1000, max: 10 },  // 10 / 15 min
  '/api/auth/register':  { windowMs: 60 * 60 * 1000, max: 5 },   // 5  / hour
  '/api/auth/forgot':    { windowMs: 60 * 60 * 1000, max: 5 },   // 5  / hour
  '/api/auth/google':    { windowMs: 15 * 60 * 1000, max: 10 },  // 10 / 15 min
  '/api/auth/me':        { windowMs: 60 * 1000,      max: 60 },  // 60 / min
  '/api/auth/logout':    { windowMs: 60 * 1000,      max: 30 },  // 30 / min

  // Payment/webhook endpoints
  '/api/billing/webhook': { windowMs: 60 * 1000, max: 100 }, // MP can retry

  // Public health check
  '/api/health': { windowMs: 60 * 1000, max: 60 },
};

export const DEFAULT_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000,  // 1 minute
  max: 120,             // 120 req/min default for authenticated API
};

export const IP_DEFAULT_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000,
  max: 60,  // 60 req/min for unauthenticated requests per IP
};

/**
 * Check rate limit for a given key. Returns null if OK,
 * or a NextResponse 429 if limit exceeded.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): NextResponse | null {
  const now = Date.now();
  purgeExpired(now);

  const bucket = store.get(key);
  if (!bucket) {
    // First request in window
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  if (bucket.resetAt < now) {
    // Window expired, reset
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  bucket.count++;
  if (bucket.count > config.max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: 'Demasiadas solicitudes. Intenta de nuevo en ' + retryAfter + ' segundos.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(bucket.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Extract a stable client identifier from the request.
 * Prefers the user's auth UID (most accurate for authenticated routes),
 * falls back to IP address.
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Try forwarded-for (Vercel always sets this)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return `ip:${ip}`;
  }

  // Vercel-specific header
  const vercelIp = req.headers.get('x-vercel-forwarded-for');
  if (vercelIp) return `ip:${vercelIp}`;

  // Real-IP fallback
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return `ip:${realIp}`;

  return 'ip:unknown';
}

/**
 * Get rate limit config for a path.
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Exact match
  if (RATE_LIMITS[pathname]) return RATE_LIMITS[pathname];

  // Prefix matches for dynamic routes
  if (pathname.startsWith('/api/auth/')) {
    return { windowMs: 60 * 1000, max: 30 }; // 30/min for any other auth route
  }
  if (pathname.startsWith('/api/billing/')) {
    return { windowMs: 60 * 1000, max: 30 };
  }
  if (pathname.startsWith('/api/')) {
    return DEFAULT_LIMIT;
  }

  return IP_DEFAULT_LIMIT;
}

/**
 * Build a rate-limit key combining identifier + path.
 */
export function buildRateLimitKey(identifier: string, pathname: string): string {
  return `${identifier}:${pathname}`;
}
