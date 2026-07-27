import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, Calendar, Users, Pill, DollarSign, BarChart3, MessageSquare, Shield, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { PLANS, LIMIT_COMPARISON } from '@/lib/plans';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="border-b border-border/60 backdrop-blur sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">CitasPro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">Funcionalidades</Link>
            <Link href="#planes" className="hover:text-foreground">Planes</Link>
            <Link href="/login" className="hover:text-foreground">Iniciar sesión</Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                Empezar gratis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Nuevo: recordatorios automáticos por WhatsApp
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              El sistema de{' '}
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent">
                citas médicas
              </span>{' '}
              que tu clínica necesita
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Gestiona citas, pacientes, médicos, caja, inventario e historia
              clínica en un solo lugar. Hecho en Perú para consultorios y
              clínicas peruanas. Sin comisiones por cita.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:opacity-90 w-full sm:w-auto">
                  Empezar gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#planes">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted/60 w-full sm:w-auto">
                  Ver planes
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div>
                <div className="text-2xl font-bold">S/ 0</div>
                <div className="text-xs text-muted-foreground/70">Plan Free para siempre</div>
              </div>
              <div className="w-px h-10 bg-muted" />
              <div>
                <div className="text-2xl font-bold">5 min</div>
                <div className="text-xs text-muted-foreground/70">Para configurar</div>
              </div>
              <div className="w-px h-10 bg-muted" />
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-xs text-muted-foreground/70">Comisión por cita</div>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 blur-3xl" />
            <div className="relative bg-sidebar border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-muted-foreground/70">citaspro.pe/dashboard</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground/70">Citas hoy</div>
                    <div className="text-2xl font-bold text-[#0ea5e9]">12</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground/70">Pacientes</div>
                    <div className="text-2xl font-bold text-emerald-400">348</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground/70">Ingresos</div>
                    <div className="text-2xl font-bold text-[#d4af37]">S/ 890</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-muted-foreground/70">Próximas citas</div>
                  {[
                    { time: '09:00', patient: 'María Quispe', doctor: 'Dr. Pérez' },
                    { time: '09:30', patient: 'Juan Rojas', doctor: 'Dra. García' },
                    { time: '10:00', patient: 'Ana Mamani', doctor: 'Dr. Pérez' },
                  ].map((apt, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-[#0ea5e9] font-mono text-xs">{apt.time}</span>
                      <span className="flex-1">{apt.patient}</span>
                      <span className="text-muted-foreground/70 text-xs">{apt.doctor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/60 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground/70 text-sm">
          <span>🏥 Consultorios privados</span>
          <span>👨‍⚕️ Clínicas multidisciplinarias</span>
          <span>🦷 Centros odontológicos</span>
          <span>🧠 Centros psicológicos</span>
          <span>💊 Centros de salud</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Todo lo que tu clínica necesita
          </h2>
          <p className="text-muted-foreground text-lg">
            Una sola plataforma para gestionar todo el flujo médico
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Calendario de citas', desc: 'Vista por día, semana o mes. Arrastra y reasigna. Detección de choques de horario automáticamente.' },
            { icon: Users, title: 'Pacientes', desc: 'Ficha completa: datos demográficos, antecedentes, alergias, historia clínica, archivos adjuntos.' },
            { icon: Stethoscope, title: 'Médicos', desc: 'Gestión por especialidad, horarios de atención, colegiatura, precios de consulta personalizados.' },
            { icon: DollarSign, title: 'Caja y pagos', desc: 'Apertura/cierre de caja, cobros por efectivo, tarjeta, Yape, Plin. Gastos del día. Reporte de ingresos.' },
            { icon: Pill, title: 'Inventario', desc: 'Medicamentos e insumos con stock mínimo. Alertas de vencimiento. Reposición automática.' },
            { icon: MessageSquare, title: 'Recordatorios WhatsApp', desc: 'Mensajes automáticos 24h antes de cada cita. Reduce el no-show hasta 70%.' },
            { icon: BarChart3, title: 'Reportes avanzados', desc: 'Ingresos por médico, servicio, día, hora. Pacientes nuevos vs recurrentes. Ocupación de agenda.' },
            { icon: Shield, title: 'Auditoría', desc: 'Bitácora de todos los cambios: quién, qué, cuándo. Cumple con requisitos de seguridad de datos médicos.' },
            { icon: Users, title: 'Multi-equipo', desc: 'Invita recepcionistas, médicos y administradores con roles y permisos diferenciados.' },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-muted/50 border border-border rounded-2xl p-6 hover:border-[#0ea5e9]/30 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 border border-[#0ea5e9]/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#0ea5e9]" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="px-6 py-20 bg-gradient-to-b from-transparent to-[#0a0a14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planes simples y transparentes</h2>
            <p className="text-muted-foreground text-lg">
              Empieza gratis. Cambia de plan cuando lo necesites. Sin contratos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(PLANS).map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border ${
                  plan.highlight
                    ? 'border-[#d4af37]/40 bg-gradient-to-b from-[#d4af37]/5 to-transparent'
                    : 'border-border bg-muted/30'
                }`}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: plan.color, color: '#0a0a14' }}
                  >
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
                <p className="text-xs text-muted-foreground/70 mb-4">{plan.tagline}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">S/ {plan.priceMonthly}</span>
                  <span className="text-muted-foreground/70 text-sm">/mes</span>
                </div>

                <ul className="space-y-2 text-sm mb-6 min-h-[200px]">
                  {plan.features.slice(0, 8).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button
                    className="w-full"
                    variant={plan.highlight ? 'default' : 'outline'}
                    style={
                      plan.highlight
                        ? { background: plan.color, color: '#0a0a14' }
                        : undefined
                    }
                  >
                    {plan.priceMonthly === 0 ? 'Empezar gratis' : 'Suscribirme'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparativa */}
          <div className="mt-16 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground">Característica</th>
                  <th className="text-center py-3 px-4 text-muted-foreground">Free</th>
                  <th className="text-center py-3 px-4 text-muted-foreground">Pro</th>
                  <th className="text-center py-3 px-4 text-muted-foreground">Premium</th>
                  <th className="text-center py-3 px-4 text-muted-foreground">Full</th>
                </tr>
              </thead>
              <tbody>
                {LIMIT_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="py-3 px-4">
                      <span className="mr-2">{row.icon}</span>
                      {row.label}
                    </td>
                    {row.values.map((v, j) => (
                      <td key={j} className="text-center py-3 px-4">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Empieza hoy mismo.
            <br />
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent">
              Sin tarjeta de crédito.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Únete a las clínicas peruanas que ya gestionan sus citas con CitasPro
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:opacity-90">
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-muted-foreground">CitasPro</span>
            <span>· Hecho por FastPagePro</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">Iniciar sesión</Link>
            <Link href="/register" className="hover:text-foreground">Registro</Link>
            <span>© 2025 CitasPro</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
