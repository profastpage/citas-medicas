'use client';

import { useState, useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Phone, Mail, Calendar, Droplet, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  documentId: string | null;
  documentType: string | null;
  birthDate: string | null;
  sex: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  bloodType: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  medicalHistory: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  medicalRecordNumber: string | null;
  notes: string | null;
  isActive: boolean;
  appointmentsCount: number;
  filesCount: number;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  patients: Patient[];
}

export function PacientesClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, patients } = props;
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    documentType: 'DNI',
    documentId: '',
    birthDate: '',
    sex: 'M',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    medicalHistory: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  });

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(p =>
      p.fullName.toLowerCase().includes(q) ||
      (p.documentId ?? '').toLowerCase().includes(q) ||
      (p.phone ?? '').toLowerCase().includes(q) ||
      (p.email ?? '').toLowerCase().includes(q) ||
      (p.medicalRecordNumber ?? '').toLowerCase().includes(q)
    );
  }, [patients, search]);

  const calcAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const submit = async () => {
    if (!form.firstName || !form.lastName) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear paciente');
        return;
      }
      toast.success('Paciente creado');
      setDialogOpen(false);
      setForm({
        firstName: '', lastName: '', documentType: 'DNI', documentId: '',
        birthDate: '', sex: 'M', phone: '', email: '', address: '',
        bloodType: '', allergies: '', chronicConditions: '', medicalHistory: '',
        emergencyContact: '', emergencyPhone: '', notes: '',
      });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Pacientes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {patients.length} pacientes registrados
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-sidebar border-border">
              <DialogHeader>
                <DialogTitle>Nuevo paciente</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nombres *</Label>
                  <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Apellidos *</Label>
                  <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Tipo documento</Label>
                  <Select value={form.documentType} onValueChange={v => setForm({ ...form, documentType: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-sidebar border-border">
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">Carnet Extranjería</SelectItem>
                      <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>N° documento</Label>
                  <Input value={form.documentId} onChange={e => setForm({ ...form, documentId: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Fecha nacimiento</Label>
                  <Input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select value={form.sex} onValueChange={v => setForm({ ...form, sex: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-sidebar border-border">
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div className="col-span-2">
                  <Label>Dirección</Label>
                  <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Grupo sanguíneo</Label>
                  <Select value={form.bloodType} onValueChange={v => setForm({ ...form, bloodType: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent className="bg-sidebar border-border">
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contacto emergencia</Label>
                  <Input value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label>Teléfono emergencia</Label>
                  <Input value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div className="col-span-2">
                  <Label>Alergias</Label>
                  <Textarea value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="Penicilina, mariscos..." className="bg-muted/50 border-border" />
                </div>
                <div className="col-span-2">
                  <Label>Enfermedades crónicas</Label>
                  <Textarea value={form.chronicConditions} onChange={e => setForm({ ...form, chronicConditions: e.target.value })} placeholder="Diabetes, hipertensión..." className="bg-muted/50 border-border" />
                </div>
                <div className="col-span-2">
                  <Label>Antecedentes médicos</Label>
                  <Textarea value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <div className="col-span-2">
                  <Label>Notas internas</Label>
                  <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-muted/50 border-border" />
                </div>
              </div>
              <Button onClick={submit} disabled={submitting} className="w-full mt-4 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                {submitting ? 'Guardando...' : 'Crear paciente'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI, teléfono, email o N° historia clínica..."
            className="bg-muted/50 border-border pl-9"
          />
        </div>

        {/* Lista */}
        <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground/70">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay pacientes que mostrar</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map(p => {
                const age = calcAge(p.birthDate);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="p-4 hover:bg-muted/30 cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {p.fullName}
                        {age !== null && (
                          <span className="text-muted-foreground/70 text-xs ml-2">· {age} años</span>
                        )}
                        {p.bloodType && (
                          <span className="ml-2 text-xs text-red-300">· {p.bloodType}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground/70 truncate flex items-center gap-3 mt-0.5">
                        {p.documentId && <span>{p.documentType}: {p.documentId}</span>}
                        {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
                        {p.medicalRecordNumber && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{p.medicalRecordNumber}</span>}
                      </div>
                      {p.allergies && (
                        <div className="text-xs text-amber-300 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          {p.allergies}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-muted-foreground border-border">
                        {p.appointmentsCount} citas
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detalle paciente */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-sidebar border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-sm">
                  {selected.firstName[0]}{selected.lastName[0]}
                </div>
                {selected.fullName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.documentId && (
                  <div><span className="text-muted-foreground/70">{selected.documentType}: </span>{selected.documentId}</div>
                )}
                {selected.birthDate && (
                  <div><span className="text-muted-foreground/70">Nacimiento: </span>{format(new Date(selected.birthDate), 'dd/MM/yyyy', { locale: es })}</div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground/70" />{selected.phone}</div>
                )}
                {selected.email && (
                  <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground/70" />{selected.email}</div>
                )}
                {selected.address && <div className="col-span-2"><span className="text-muted-foreground/70">Dirección: </span>{selected.address}</div>}
                {selected.bloodType && (
                  <div className="flex items-center gap-1"><Droplet className="w-3 h-3 text-red-400" />Grupo: {selected.bloodType}</div>
                )}
                {selected.medicalRecordNumber && (
                  <div className="flex items-center gap-1"><FileText className="w-3 h-3 text-muted-foreground/70" />HC: {selected.medicalRecordNumber}</div>
                )}
              </div>

              {selected.allergies && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-amber-300 text-xs font-semibold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> ALERGIAS
                  </div>
                  <div className="text-sm text-amber-100">{selected.allergies}</div>
                </div>
              )}

              {selected.chronicConditions && (
                <div>
                  <div className="text-muted-foreground/70 text-xs uppercase mb-1">Enfermedades crónicas</div>
                  <div className="text-sm">{selected.chronicConditions}</div>
                </div>
              )}

              {selected.medicalHistory && (
                <div>
                  <div className="text-muted-foreground/70 text-xs uppercase mb-1">Antecedentes</div>
                  <div className="text-sm">{selected.medicalHistory}</div>
                </div>
              )}

              {selected.emergencyContact && (
                <div>
                  <div className="text-muted-foreground/70 text-xs uppercase mb-1">Contacto emergencia</div>
                  <div className="text-sm">{selected.emergencyContact} · {selected.emergencyPhone}</div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <a
                  href={`/dashboard/citas?patientId=${selected.id}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                    <Calendar className="w-4 h-4 mr-2" />
                    Nueva cita
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardShell>
  );
}
