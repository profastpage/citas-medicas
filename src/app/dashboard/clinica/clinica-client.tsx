'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Save, Plus, Trash2, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin?: boolean;
  clinic: {
    id: string;
    name: string;
    slug: string;
    ruc: string;
    address: string;
    phone: string;
    email: string;
    currency: string;
    themeColor: string;
    brandingText: string;
    isWhiteLabel: boolean;
    logoUrl: string;
  };
  specialties: Array<{ id: string; name: string }>;
}

export function ClinicaClient(props: Props) {
  const { user, plan, isSuperAdmin, clinic } = props;
  const [form, setForm] = useState(clinic);
  const [saving, setSaving] = useState(false);
  const [specialties, setSpecialties] = useState(props.specialties);
  const [newSpecialty, setNewSpecialty] = useState('');

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clinics/${clinic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al guardar');
        return;
      }
      toast.success('Clínica actualizada');
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const addSpecialty = async () => {
    if (!newSpecialty.trim()) return;
    try {
      const res = await fetch('/api/specialties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSpecialty.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error');
        return;
      }
      setSpecialties([...specialties, data.specialty]);
      setNewSpecialty('');
      toast.success('Especialidad añadida');
    } catch {
      toast.error('Error de conexión');
    }
  };

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinic.name} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Configuración de la clínica</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Datos generales, branding y especialidades
          </p>
        </div>

        {/* Datos generales */}
        <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0ea5e9]" />
            Datos generales
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre de la clínica</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div>
              <Label>RUC</Label>
              <Input value={form.ruc} onChange={e => setForm({ ...form, ruc: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div>
              <Label>Moneda</Label>
              <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="bg-muted/50 border-border" />
            </div>
            <div>
              <Label>URL pública (slug)</Label>
              <Input value={form.slug} disabled className="bg-muted/50 border-border opacity-60" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#d4af37]" />
            Branding
          </h2>
          {plan.limits.hasCustomBranding ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Texto de marca</Label>
                <Input value={form.brandingText} onChange={e => setForm({ ...form, brandingText: e.target.value })} className="bg-muted/50 border-border" />
              </div>
              <div>
                <Label>Color de tema</Label>
                <div className="flex gap-2">
                  <Input type="color" value={form.themeColor} onChange={e => setForm({ ...form, themeColor: e.target.value })} className="w-16 h-10 p-1 bg-muted/50 border-border" />
                  <Input value={form.themeColor} onChange={e => setForm({ ...form, themeColor: e.target.value })} className="bg-muted/50 border-border" />
                </div>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="whiteLabel"
                  checked={form.isWhiteLabel && plan.limits.hasWhiteLabel}
                  disabled={!plan.limits.hasWhiteLabel}
                  onChange={e => setForm({ ...form, isWhiteLabel: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="whiteLabel" className="cursor-pointer">
                  White label {plan.limits.hasWhiteLabel ? '(ocultar marca CitasPro)' : '(requiere plan Premium)'}
                </Label>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/70">
              El branding personalizado está disponible en el plan Pro o superior.
            </p>
          )}
        </div>

        {/* Especialidades */}
        <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold">Especialidades médicas</h2>
          <div className="flex flex-wrap gap-2">
            {specialties.map(s => (
              <span key={s.id} className="px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm flex items-center gap-2">
                {s.name}
              </span>
            ))}
            {specialties.length === 0 && (
              <p className="text-sm text-muted-foreground/70">Sin especialidades. Crea la primera abajo.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSpecialty}
              onChange={e => setNewSpecialty(e.target.value)}
              placeholder="Nueva especialidad (ej. Cardiología)"
              className="bg-muted/50 border-border"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
            />
            <Button onClick={addSpecialty} variant="outline" className="border-border">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
