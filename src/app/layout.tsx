import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CitasPro — Sistema de citas médicas para clínicas peruanas",
  description:
    "Gestiona citas, pacientes, médicos, caja e historia clínica en un solo lugar. Hecho en Perú para consultorios y clínicas. Sin comisiones por cita.",
  keywords: [
    "citas médicas",
    "sistema de citas",
    "clínica",
    "consultorio",
    "Perú",
    "gestión médica",
    "historia clínica",
    "CitasPro",
  ],
  authors: [{ name: "FastPagePro" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-[#07070b] text-white min-h-screen`}
      >
        {children}
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
