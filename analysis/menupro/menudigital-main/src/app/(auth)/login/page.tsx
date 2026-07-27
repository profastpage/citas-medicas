import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; error_description?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const redirectTo = params.redirect || '/dashboard';
  const oauthError = params.error_description || params.error;

  return (
    <main className="min-h-screen flex bg-[#07070b]">
      {/* Hero izquierda */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#07070b]">
        {/* Orbes decorativos */}
        <div
          className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
          style={{ background: '#d4af37' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: '#9d4edd' }}
        />
        <div
          className="absolute top-1/3 left-0 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: '#06d6a0' }}
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

        <div className="relative z-10 flex flex-col justify-center px-20 py-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
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

          {/* Headline */}
          <h1 className="text-6xl font-bold leading-[1.05] mb-6 tracking-tight">
            Bienvenido
            <br />
            de vuelta a tus
            <br />
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d35e] to-[#d4af37] bg-clip-text text-transparent">
              menús que venden
            </span>
          </h1>
          <p className="text-lg text-white/60 mb-10 max-w-md leading-relaxed">
            Gestiona tu carta digital, recibe pedidos por WhatsApp y haz crecer
            tu restaurante — todo desde un solo lugar.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-md">
            {[
              { value: '5 min', label: 'Crear menú' },
              { value: '0%', label: 'Comisión por venta' },
              { value: '24/7', label: 'Pedidos automáticos' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-xl p-4"
              >
                <div className="text-xl font-bold text-[#d4af37]">
                  {s.value}
                </div>
                <div className="text-[11px] text-white/50 mt-1 leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mini features */}
          <div className="space-y-3 max-w-md">
            {[
              'Editor visual con vista previa en vivo',
              'Carrito integrado directo a tu WhatsApp',
              'Código QR para tus mesas (HD en Pro)',
              'Analytics de platos más pedidos',
            ].map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-3 text-sm text-white/80"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-5 h-5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-[#d4af37]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>

          {/* Footer mini */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              Inicio de sesión
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Hola de nuevo 👋
            </h2>
            <p className="text-white/50 text-sm">
              Inicia sesión para gestionar tu carta digital
            </p>
          </div>

          {oauthError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {params.error === 'access_denied'
                ? 'Autenticación cancelada. Intenta de nuevo.'
                : oauthError}
            </div>
          )}

          <LoginForm redirect={redirectTo} />
        </div>
      </div>
    </main>
  );
}
