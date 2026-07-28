'use client';

import { useState } from 'react';
import { Building2, Plus, Check, ChevronDown, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { usePlanUsage } from './plan-usage-badge';
import { PlanLimitBanner } from './plan-usage-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Clinic {
  id: string;
  name: string;
  slug: string;
  ruc?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  _count?: { patients: number; doctors: number; appointments: number };
}

interface Props {
  clinics: Clinic[];
  activeClinicId: string;
  canCreateMore: boolean;
}

/**
 * Selector de sucursal activa + crear nueva sucursal.
 * Visible en la página /dashboard/clinica y /dashboard.
 */
export function ClinicSwitcher({ clinics, activeClinicId, canCreateMore }: Props) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ruc: '',
    address: '',
    phone: '',
    email: '',
  });

  const activeClinic = clinics.find(c => c.id === activeClinicId);
  const { atLimit } = usePlanUsage();
  const isAtLimit = atLimit('clinics');

  const submit = async () => {
    if (!form.name || form.name.length < 2) {
      toast.error('Nombre de sucursal requerido');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear sucursal');
        return;
      }
      toast.success(`Sucursal "${form.name}" creada`);
      setCreateOpen(false);
      setForm({ name: '', ruc: '', address: '', phone: '', email: '' });
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PlanLimitBanner resource="clinics" label="Sucursales" />

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0ea5e9]" />
              Sucursales
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {clinics.length} sucursal{clinics.length === 1 ? '' : 'es'} registrada{clinics.length === 1 ? '' : 's'}
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isAtLimit}
                className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-sm"
                title={isAtLimit ? 'Límite de sucursales alcanzado. Mejora tu plan.' : 'Crear sucursal'}
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Nueva sucursal</span>
                <span className="sm:hidden">Nueva</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-sidebar border-border">
              <DialogHeader>
                <DialogTitle>Crear nueva sucursal</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="CitasPro Sur"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>RUC</Label>
                    <Input
                      value={form.ruc}
                      onChange={e => setForm({ ...form, ruc: e.target.value })}
                      placeholder="20123456789"
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="01 234 5678"
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Av. Principal 123"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="sucursal@citaspro.pe"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]"
                >
                  {submitting ? 'Creando...' : 'Crear sucursal'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de sucursales */}
        <div className="space-y-2">
          {clinics.map(c => {
            const isActive = c.id === activeClinicId;
            return (
              <div
                key={c.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  isActive
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-border bg-muted/30 hover:bg-muted/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-sky-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate flex items-center gap-2">
                    {c.name}
                    {isActive && (
                      <Badge className="bg-sky-500 text-white text-[10px] py-0 h-4">ACTIVA</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    {c.address ? (
                      <>
                        <MapPin className="w-3 h-3" />
                        {c.address}
                      </>
                    ) : (
                      <span>Sin dirección</span>
                    )}
                    {c._count && (
                      <span className="ml-2 opacity-70">
                        · {c._count.patients} pac · {c._count.doctors} méd
                      </span>
                    )}
                  </div>
                </div>
                {!isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Cambiar sucursal activa: recargar con cookie o query param
                      toast.info('Para cambiar de sucursal, cierra sesión y vuelve a entrar con la nueva');
                    }}
                    className="text-xs"
                  >
                    Activar
                  </Button>
                )}
                {isActive && <Check className="w-5 h-5 text-sky-500 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {isAtLimit && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
            <strong>Límite alcanzado:</strong> Has llegado al máximo de sucursales de tu plan.{' '}
            <a href="/dashboard/billing" className="underline font-bold">Mejora tu plan →</a>
          </div>
        )}
      </div>
    </div>
  );
}
