import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Extraer el host de la URL de Supabase para images.remotePatterns
let supabaseHost = "";
try {
  if (supabaseUrl) supabaseHost = new URL(supabaseUrl).hostname;
} catch {
  /* noop */
}

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // ─── Optimización de imágenes (next/image) ───
  // AVIF tiene ~20% mejor compresión que WebP. Lo declaramos primero para
  // que next/image lo prefiera cuando el navegador lo soporte.
  images: {
    formats: ["image/avif", "image/webp"],
    ...(supabaseHost
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ],
        }
      : {}),
    // Tamaños responsivos que next/image generará automáticamente
    deviceSizes: [400, 800, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache TTL para imágenes optimizadas (segundos)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año — las URLs son inmutables
  },
  // ─── Compresión de respuestas HTTP ───
  compress: true,
};

export default nextConfig;
