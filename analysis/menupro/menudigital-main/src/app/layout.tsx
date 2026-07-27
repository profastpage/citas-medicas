import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";
import PwaRegistry from "@/components/pwa/pwa-registry";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MenuPro — Menús digitales profesionales con WhatsApp",
  description:
    "Crea tu carta digital con carrito integrado de WhatsApp en minutos. Sin comisiones por venta. Hecho en Perú para restaurantes peruanos.",
  keywords: [
    "menú digital",
    "carta digital",
    "WhatsApp",
    "restaurante",
    "Perú",
    "QR",
    "MenuPro",
  ],
  authors: [{ name: "MenuPro" }],
  manifest: "/manifest.json",
  applicationName: "MenuPro",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MenuPro",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "MenuPro — Menús digitales profesionales",
    description:
      "Crea tu carta digital con WhatsApp en minutos. Sin comisiones por venta.",
    type: "website",
    siteName: "MenuPro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MenuPro — Menús digitales profesionales con WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuPro",
    description: "Menús digitales profesionales con WhatsApp",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/favicon.ico"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ff6b35" },
    { media: "(prefers-color-scheme: dark)", color: "#07070b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* PWA: Soporte iOS Safari (no soporta manifest del todo) */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MenuPro" />
        <meta name="application-name" content="MenuPro" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-[#07070b] text-white min-h-screen`}
      >
        {children}
        <PwaRegistry />
        <SonnerToaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
