// ============================================================
// Supabase client — Server-side (Node.js runtime, RSC, route handlers)
// Usa cookies para mantener la sesión del usuario entre requests.
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // En desarrollo esto ayuda a detectar variables faltantes rápido.
  // En producción, Vercel fallaría al deploy si faltan (buena seguridad).
  console.warn(
    '[supabase/server] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'El cliente funcionará pero las llamadas fallarán.'
  );
}

/**
 * Crea un cliente Supabase para uso en Server Components y Route Handlers.
 * Lee/escribe cookies para mantener la sesión del usuario.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_URL ?? '',
    SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Este método es llamado desde un Server Component donde no
            // podemos setear cookies. La sesión se refrescará en el
            // siguiente middleware o Server Action.
          }
        },
      },
    }
  );
}

/**
 * Crea un cliente Supabase para uso en Server Actions (donde sí podemos
 * mutar cookies).
 */
export async function createSupabaseActionClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    SUPABASE_URL ?? '',
    SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
