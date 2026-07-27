import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
        className={`${inter.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          {children}
          <SonnerToaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "var(--popover)",
                border: "1px solid var(--border)",
                color: "var(--popover-foreground)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
