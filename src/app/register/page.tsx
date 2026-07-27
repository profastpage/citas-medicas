'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    clinicName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrarse');
        return;
      }

      toast.success('¡Cuenta creada! Redirigiendo...');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Calendario de citas',
    'Historia clínica digital',
    'Pacientes y médicos',
    'Sin comisiones por cita',
  ];

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Lado izquierdo: beneficios */}
        <div className="hidden lg:block space-y-6 pr-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">CitasPro</span>
          </Link>

          <h1 className="text-4xl font-bold leading-tight">
            Digitaliza tu clínica en{' '}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent">
              menos de 5 minutos
            </span>
          </h1>

          <p className="text-white/60 text-lg">
            El sistema de gestión de citas médicas más completo del Perú.
            Multi-médico, multi-sucursal, con recordatorios automáticos por
            WhatsApp y caja integrada.
          </p>

          <ul className="space-y-3">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-[#0ea5e9]" />
                {f}
              </li>
            ))}
          </ul>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-white/60 mb-1">Plan Free para siempre</p>
            <p className="text-2xl font-bold">
              S/ 0<span className="text-white/40 text-base font-normal">/mes</span>
            </p>
            <p className="text-xs text-white/40 mt-1">
              1 médico · 50 pacientes · 100 citas al mes
            </p>
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <div className="space-y-6">
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">CitasPro</span>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold">Crear cuenta gratis</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Tu nombre completo</Label>
              <Input
                id="fullName"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Dr. Juan Pérez"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Nombre de tu clínica</Label>
              <Input
                id="clinicName"
                required
                value={form.clinicName}
                onChange={e => setForm({ ...form, clinicName: e.target.value })}
                placeholder="Clínica San Juan"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="doctor@clinica.com"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono / WhatsApp (opcional)</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+51 999 888 777"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="bg-white/5 border-white/10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:opacity-90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Crear cuenta gratis
            </Button>

            <p className="text-center text-sm text-white/60">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#0ea5e9] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
