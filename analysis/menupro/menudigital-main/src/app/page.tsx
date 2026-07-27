import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from '@/components/landing/trust-bar';
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { ScrollProgress } from "@/components/landing/scroll-progress";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#07070b] text-white">
      <ScrollProgress />
      <header className="border-b border-white/5 backdrop-blur sticky top-0 z-50 bg-[#07070b]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MenuPro"
              width={36}
              height={36}
              className="rounded-lg shadow-lg shadow-[#d4af37]/20"
              style={{ width: 36, height: 36 }}
            />
            <span className="font-bold text-lg">MenuPro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#comparativa" className="hover:text-white transition">Comparativa</a>
            <a href="#pricing" className="hover:text-white transition">Precios</a>
            <a href="#testimonios" className="hover:text-white transition">Testimonios</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            {/*
              Nota: el botón "Instalar app" (PWA) se omite en el header público.
              Razón: la PWA del dashboard es exclusiva de usuarios logueados (Pro+).
              La PWA de la carta pública (/r/[slug]) ya es instalable por los clientes
              del restaurante a través del manifest de esa ruta.
              El botón de instalación del dashboard vive dentro del dashboard mismo,
              donde se valida el plan y se muestra el badge correspondiente.
            */}
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="text-sm bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
