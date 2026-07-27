import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="MenuPro"
                width={36}
                height={36}
                className="rounded-lg"
                style={{ width: 36, height: 36 }}
              />
              <span className="font-bold text-lg">MenuPro</span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Menús digitales profesionales para restaurantes peruanos.
              Sin comisiones, sin contratos, sin complicaciones.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Producto</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Precios</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><Link href="/register" className="hover:text-white">Crear cuenta</Link></li>
              <li><Link href="/login" className="hover:text-white">Iniciar sesión</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="mailto:hola@menupro.app" className="hover:text-white">
                  hola@menupro.app
                </a>
              </li>
              <li>
                <a href="https://wa.me/51987654321" target="_blank" rel="noreferrer" className="hover:text-white">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div>© {new Date().getFullYear()} MenuPro. Todos los derechos reservados.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/70">Términos</a>
            <a href="#" className="hover:text-white/70">Privacidad</a>
            <span className="text-[#d4af37]">Hecho con ♥ en Perú</span>
          </div>
        </div>

        {/* Créditos de desarrollo */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/40">
            Creado &amp; Desarrollado por{' '}
            <a
              href="https://fastpagepro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/60 hover:text-[#d4af37] transition-colors font-medium"
            >
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] bg-clip-text text-transparent font-semibold">
                fastpagepro.com
              </span>
              <svg
                className="w-3 h-3 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
