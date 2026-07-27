import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RegisterForm } from './register-form';

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex bg-[#07070b]">
      {/* Hero izquierda */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#07070b]">
        {/* Orbes */}
        <div
          className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
          style={{ background: '#d4af37' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: '#06d6a0' }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: '#9d4edd' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-20 py-12 text-white overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="MenuPro"
              width={48}
              height={48}
              className="rounded-xl shadow-lg shadow-[#d4af37]/30"
              style={{ width: 48, height: 48 }}
            />
            <span className="text-2xl font-bold tracking-tight">MenuPro</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[10px] uppercase tracking-wider text-[#06d6a0] font-semibold mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
            Empieza gratis hoy
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold leading-[1.05] mb-5 tracking-tight">
            Tu carta digital
            <br />
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d35e] to-[#d4af37] bg-clip-text text-transparent">
              lista en 5 minutos
            </span>
          </h1>
          <p className="text-base text-white/60 mb-8 max-w-md leading-relaxed">
            Sin comisiones por venta. Sin tarjeta de crédito. Sin contratos.
            Solo crea tu menú, compártelo por WhatsApp y empieza a recibir
            pedidos.
          </p>

          {/* Plan comparison mini */}
          <div className="grid grid-cols-2 gap-3 max-w-md mb-8">
            {/* Free */}
            <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                Plan Free
              </div>
              <div className="text-2xl font-bold mb-2">
                S/ 0<span className="text-sm font-normal text-white/40">/mes</span>
              </div>
              <ul className="space-y-1.5 text-xs text-white/70">
                <li>✓ 1 menú activo</li>
                <li>✓ 10 platos</li>
                <li>✓ 5 imágenes</li>
                <li>✓ Carrito WhatsApp</li>
                <li>✓ QR básico</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-b from-[#d4af37]/10 to-transparent border border-[#d4af37]/40 rounded-2xl p-5">
              <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-[#d4af37] text-[#1a1a2e] text-[9px] font-bold uppercase">
                Popular
              </div>
              <div className="text-xs text-[#d4af37] uppercase tracking-wider mb-1 font-semibold">
                Plan Pro
              </div>
              <div className="text-2xl font-bold mb-2">
                S/ 35<span className="text-sm font-normal text-white/40">/mes</span>
              </div>
              <ul className="space-y-1.5 text-xs text-white">
                <li>✓ Menús ilimitados</li>
                <li>✓ Platos ilimitados</li>
                <li>✓ Imágenes ilimitadas</li>
                <li>✓ 5 créditos fondo removal</li>
                <li>✓ QR HD + Analytics</li>
              </ul>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06d6a0]" />
              Sin tarjeta para empezar
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Cancela cuando quieras
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9d4edd]" />
              Pago por MercadoPago
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-20 right-20 flex items-center justify-between text-xs text-white/30">
            <span>© {new Date().getFullYear()} MenuPro</span>
            <span>Hecho en Perú 🇵🇪</span>
          </div>
        </div>
      </div>

      {/* Form derecha */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        <div className="w-full max-w-md">
          {/* Botón volver al inicio — siempre visible, top-left */}
          <a
            href="/"
            className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-[#d4af37] transition-colors group"
            aria-label="Volver al inicio"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </a>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 mt-12">
            <img
              src="/logo.png"
              alt="MenuPro"
              width={40}
              height={40}
              className="rounded-lg"
              style={{ width: 40, height: 40 }}
            />
            <span className="text-xl font-bold text-white">MenuPro</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[10px] uppercase tracking-wider text-[#06d6a0] font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
              Crea tu cuenta gratis
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Empecemos 🚀
            </h2>
            <p className="text-white/50 text-sm">
              Crea tu cuenta y diseña tu primer menú en menos de 5 minutos.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
