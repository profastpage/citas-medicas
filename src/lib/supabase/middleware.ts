// ============================================================
// Supabase client — Middleware (Edge runtime)
// Refresca la sesión del usuario en cada request para evitar logout
// inesperado cuando el token expira.
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Crea un cliente Supabase para el middleware (Edge runtime).
 * Refresca el token de sesión si está expirado y actualiza las cookies.
 */
export function createSupabaseMiddlewareClient(req: NextRequest) {
  // Clonamos la respuesta para poder mutar cookies tanto en req como en res.
  const res = NextResponse.next({ request: { url: req.url } });

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value);
          });
          // Clonamos la respuesta para que las cookies se propaguen.
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, res };
}
