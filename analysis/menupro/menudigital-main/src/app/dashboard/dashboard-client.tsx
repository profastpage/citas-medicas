'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Plus,
  ExternalLink,
  Pencil,
  QrCode,
  Trash2,
  Eye,
  Sparkles,
  Loader2,
  Globe,
  BarChart3,
  CreditCard,
  Download,
  Upload,
  MoreVertical,
  LayoutDashboard,
  Copy,
  Crown,
  Upload as UploadIcon,
} from 'lucide-react';
import type { Plan } from '@/lib/plans';
import type { MenuData } from '@/lib/menu-utils';
import {
  detectFileType,
} from '@/lib/import-export';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { InstallAppButton } from '@/components/pwa/install-app-button';
import { isPlanAtLeast, type PlanId } from '@/lib/plans';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  menus: MenuData[];
  isSuperAdmin?: boolean;
}

export function DashboardClient({ user, plan, menus, isSuperAdmin = false }: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const router = useRouter();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const importFileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importTarget, setImportTarget] = useState<string | null>(null);

  async function handleCreate() {
    if (!newName.trim()) {
      toast.error('Ingresa un nombre');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      toast.success('Menú creado');
      router.push(`/dashboard/${data.menu.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar el menú "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/menus/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error');
      toast.success('Menú eliminado');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleExport(menuId: string, menuName: string, format: string) {
    try {
      const res = await fetch(`/api/menus/${menuId}/export?format=${format}`);
      if (!res.ok) throw new Error('Error exportando');
      const blob = await res.blob();
      const ext = format === 'excel' ? 'xls' : format === 'word' ? 'doc' : format;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = menuName.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '-');
      a.download = `${safeName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exportado como .${ext}`);
    } catch {
      toast.error('Error al exportar');
    }
  }

  async function handleImport(menuId: string) {
    setImportTarget(menuId);
    importFileRef.current?.click();
  }

  async function processImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !importTarget) return;

    setImporting(true);
    try {
      const text = await file.text();
      const fileType = detectFileType(file.name, text);

      if (fileType === 'unknown') {
        toast.error('Formato no reconocido. Usa JSON, CSV o Excel.');
        setImporting(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/menus/${importTarget}/import`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error importando');

      toast.success(data.message || `Importados: ${data.imported?.categories} categorías, ${data.imported?.dishes} platos`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setImporting(false);
      setImportTarget(null);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  }

  async function copyLink(slug: string) {
    try {
      await navigator.clipboard.writeText(`${origin}/r/${slug}`);
      toast.success('Enlace copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  const canCreate = plan.limits.maxMenus === -1 || menus.length < plan.limits.maxMenus;

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      {/* Page title row */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 truncate">Mis menús</h1>
          <p className="text-white/60 text-sm sm:text-base">
            {menus.length} {menus.length === 1 ? 'menú creado' : 'menús creados'} · Plan {plan.name}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={!canCreate}
              className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:opacity-90 font-semibold flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo menú</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#15152a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Crear nuevo menú</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del restaurante</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: La Parrilla del Chef"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e]"
              >
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Crear menú
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Import file input (hidden) */}
      <input
        ref={importFileRef}
        type="file"
        accept=".json,.csv,.xls,.xlsx"
        className="hidden"
        onChange={processImport}
      />

      {/* Loading import */}
      {importing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#15152a] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
            <div className="text-center">
              <div className="font-semibold">Importando menú...</div>
              <div className="text-sm text-white/50">Procesando archivo</div>
            </div>
          </div>
        </div>
      )}

      {!canCreate && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
            <div>
              <div className="font-semibold">Has alcanzado el límite del plan Free</div>
              <div className="text-sm text-white/60">
                Upgrade a Pro para crear menús ilimitados por S/35/mes
              </div>
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] flex-shrink-0"
          >
            <a href="/dashboard/billing">Ver planes</a>
          </Button>
        </div>
      )}

      {menus.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aún no tienes menús</h3>
          <p className="text-white/60 mb-6 px-4">
            Crea tu primer menú digital en menos de 5 minutos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all"
            >
              {/* Preview header */}
              <div
                className="h-32 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${menu.color}, ${menu.color}99)`,
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-lg line-clamp-1">{menu.name}</div>
                    {menu.slogan && (
                      <div className="text-xs opacity-80 line-clamp-1">{menu.slogan}</div>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      menu.is_published
                        ? 'bg-black/30 text-white'
                        : 'bg-black/40 text-white/60'
                    }`}
                  >
                    {menu.is_published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <button
                  onClick={() => copyLink(menu.slug)}
                  className="flex items-center gap-2 text-xs text-white/50 mb-3 hover:text-[#d4af37] transition-colors text-left w-full"
                  title="Copiar enlace"
                >
                  <Eye className="w-3 h-3 flex-shrink-0" />
                  <span className="flex-shrink-0">{menu.views_count} visitas</span>
                  <span className="text-white/30">·</span>
                  <span className="truncate">{origin}/r/{menu.slug}</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    <a href={`/dashboard/${menu.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </a>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/5"
                        aria-label="Más opciones"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#15152a] border-white/10">
                      {menu.is_published && (
                        <DropdownMenuItem asChild className="text-white focus:bg-white/5 focus:text-white">
                          <a href={`/r/${menu.slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver público
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => copyLink(menu.slug)}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar enlace
                      </DropdownMenuItem>
                      {plan.limits.hasQR && menu.is_published && (
                        <DropdownMenuItem asChild className="text-white focus:bg-white/5 focus:text-white">
                          <a href={`/dashboard/${menu.id}/qr`}>
                            <QrCode className="w-4 h-4 mr-2" />
                            Código QR
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => handleImport(menu.id)}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Importar platos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => handleExport(menu.id, menu.name, 'json')}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(menu.id, menu.name, 'csv')}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(menu.id, menu.name, 'excel')}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(menu.id, menu.name, 'word')}
                        className="text-white focus:bg-white/5 focus:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Word
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => handleDelete(menu.id, menu.name)}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner de upgrade cuando está cerca del límite de menús */}
      {plan.limits.maxMenus !== -1 && menus.length >= plan.limits.maxMenus - 1 && (
        <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-r from-[#d4af37]/10 to-[#9d4edd]/10 border border-[#d4af37]/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="font-bold text-white">
                {menus.length >= plan.limits.maxMenus
                  ? `Has alcanzado el límite de ${plan.limits.maxMenus} menú(s) del plan ${plan.name}`
                  : `Estás usando ${menus.length} de ${plan.limits.maxMenus} menús del plan ${plan.name}`}
              </div>
              <div className="text-sm text-white/60 mt-0.5">
                {plan.id === 'free' && 'Sube a Pro (S/ 35/mes) para tener 3 menús y 3 fotos por plato.'}
                {plan.id === 'pro' && 'Sube a Premium (S/ 99/mes) para tener 10 menús, 5 fotos por plato y white label.'}
                {plan.id === 'premium' && 'Sube a Full (S/ 199/mes) para menús ilimitados, 10 fotos por plato y multi-sucursal.'}
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] font-bold text-sm hover:opacity-90 transition"
          >
            <Sparkles className="w-4 h-4" />
            Subir de plan
          </Link>
        </div>
      )}

      {/* Banner instalar app (PWA) — visible para todos, con copy según plan */}
      <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-r from-[#ff6b35]/10 to-[#9d4edd]/10 border border-[#ff6b35]/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff6b35]/20 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-[#ff6b35]" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2 flex-wrap">
              Instala MenuPro en tu celular o desktop
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: `${plan.color}25`,
                  color: plan.color,
                  border: `1px solid ${plan.color}40`,
                }}
              >
                Plan {plan.name}
              </span>
            </div>
            <div className="text-sm text-white/60 mt-0.5">
              {plan.id === 'free' && 'Acceso rápido desde tu pantalla de inicio. El modo offline requiere plan Premium.'}
              {plan.id === 'pro' && 'PWA optimizada con carga instantánea. Sube a Premium para modo offline real.'}
              {plan.id === 'premium' && 'PWA con modo offline — tus mozos pueden tomar comandas sin internet.'}
              {plan.id === 'full' && 'PWA Premium con Background Sync — comandas offline se envían automáticamente.'}
            </div>
          </div>
        </div>
        <InstallAppButton
          variant="dashboard"
          size="md"
          style="solid"
          planId={plan.id}
          className="flex-shrink-0"
        />
      </div>

      {/* Quick tips */}
      {menus.length > 0 && menus.length <= 2 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <UploadIcon className="w-4 h-4 text-[#d4af37]" />
              Importa rápido
            </div>
            <div className="text-white/50">
              Sube tu carta en CSV o JSON para llenar tu menú en segundos.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#d4af37]" />
              Exporta en Excel
            </div>
            <div className="text-white/50">
              Descarga tu menú en Excel, Word, CSV o JSON para compartir.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              Dominio propio
            </div>
            <div className="text-white/50">
              Usa tu propio dominio (midominio.com) con el plan Full. Sin branding.
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
