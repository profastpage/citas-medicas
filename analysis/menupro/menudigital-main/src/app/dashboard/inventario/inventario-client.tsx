'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, RefreshCw, Trash2, X, Package, AlertTriangle,
  ArrowDownCircle, ArrowUpCircle, TrendingDown, Settings, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import type { Plan, PlanId } from '@/lib/plans';

interface InventoryItem {
  id: string; name: string; sku: string | null;
  unit: string; stock_current: number; stock_min: number; stock_max: number;
  cost_per_unit: number; supplier: string | null; category: string | null;
  is_active: boolean;
}
interface Recipe {
  id: string; menu_item_id: string; menu_item_name: string;
  quantity_per_dish: number; notes: string | null;
  inventory_item: { id: string; name: string; unit: string } | null;
}
interface Dish { id: string; name: string; }
interface Menu { id: string; name: string; categories: { id: string; name: string; dishes: Dish[] }[]; }

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
  menus: Menu[];
}

export function InventarioClient({ user, plan, isSuperAdmin, menus }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showMovement, setShowMovement] = useState<InventoryItem | null>(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [newItem, setNewItem] = useState({
    name: '', sku: '', unit: 'unidad', stock_current: '0',
    stock_min: '0', stock_max: '0', cost_per_unit: '0', supplier: '', category: '',
  });

  const allDishes: Dish[] = menus.flatMap(m => m.categories.flatMap(c => c.dishes));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, recipesRes] = await Promise.all([
        fetch('/api/inventario'),
        fetch('/api/recetas'),
      ]);
      if (itemsRes.ok) {
        const d = await itemsRes.json();
        setItems(d.items || []);
      }
      if (recipesRes.ok) {
        const d = await recipesRes.json();
        setRecipes(d.recipes || []);
      }
    } catch {
      toast.error('Error cargando inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plan.limits.hasInventory) load();
  }, [plan.limits.hasInventory, load]);

  if (!plan.limits.hasInventory) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="premium"
          userPlan={plan.id as PlanId}
          featureName="Inventario de Insumos"
          featureIcon={<Package className="w-8 h-8 text-[#9d4edd]" />}
          description="Gestiona insumos con stock mínimo y máximo, registra entradas/salidas/ajustes, crea recetas que descuentan stock automáticamente al facturar comandas."
        />
      </DashboardShell>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          sku: newItem.sku || undefined,
          unit: newItem.unit,
          stock_current: parseFloat(newItem.stock_current) || 0,
          stock_min: parseFloat(newItem.stock_min) || 0,
          stock_max: parseFloat(newItem.stock_max) || 0,
          cost_per_unit: parseFloat(newItem.cost_per_unit) || 0,
          supplier: newItem.supplier || undefined,
          category: newItem.category || undefined,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Insumo creado');
      setNewItem({ name: '', sku: '', unit: 'unidad', stock_current: '0', stock_min: '0', stock_max: '0', cost_per_unit: '0', supplier: '', category: '' });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleMovement(item: InventoryItem, type: 'entrada' | 'salida' | 'ajuste' | 'merma', quantity: number, reason: string) {
    try {
      const res = await fetch(`/api/inventario/${item.id}/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movement_type: type,
          quantity,
          reason,
          created_by: 'manual',
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success(`${type} registrada`);
      setShowMovement(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('¿Desactivar este insumo? Se conservará el historial.')) return;
    try {
      const res = await fetch(`/api/inventario/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Insumo desactivado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  const lowStockItems = items.filter(i => i.stock_current <= i.stock_min);
  const filteredItems = filter === 'low' ? lowStockItems : items;

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Inventario</h1>
          <p className="text-white/60 text-sm">
            {items.length} insumos · {lowStockItems.length} con stock bajo
          </p>
        </div>
        <div className="flex gap-2">
          {plan.limits.hasRecipes && (
            <Button variant="outline" size="sm" onClick={() => setShowRecipes(true)}>
              <BookOpen className="w-4 h-4 mr-2" />
              Recetas ({recipes.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            style={{ background: 'linear-gradient(to right, #9d4edd, #c77dff)', color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo insumo
          </Button>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-400 mb-2">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'insumo requiere reposición' : 'insumos requieren reposición'}
              </div>
              <div className="space-y-1">
                {lowStockItems.slice(0, 5).map(item => (
                  <div key={item.id} className="text-sm flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-red-300">
                      {item.stock_current} {item.unit} (mín: {item.stock_min})
                    </span>
                  </div>
                ))}
                {lowStockItems.length > 5 && (
                  <div className="text-xs text-white/50">+ {lowStockItems.length - 5} más…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/60'}`}
        >
          Todos ({items.length})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter === 'low' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/60'}`}
        >
          Stock bajo ({lowStockItems.length})
        </button>
      </div>

      {/* Tabla de insumos */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Cargando inventario…</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Package className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60 mb-2">No tienes insumos registrados</p>
          <Button onClick={() => setShowAdd(true)} style={{ background: '#9d4edd', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />
            Crear primer insumo
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/10">
                <th className="text-left p-3 font-semibold text-white/80">Insumo</th>
                <th className="text-left p-3 font-semibold text-white/80">Categoría</th>
                <th className="text-center p-3 font-semibold text-white/80">Stock actual</th>
                <th className="text-center p-3 font-semibold text-white/80">Mín / Máx</th>
                <th className="text-center p-3 font-semibold text-white/80">Costo unit.</th>
                <th className="text-center p-3 font-semibold text-white/80">Proveedor</th>
                <th className="text-center p-3 font-semibold text-white/80">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map(item => {
                const isLow = item.stock_current <= item.stock_min;
                return (
                  <tr key={item.id} className={`hover:bg-white/[0.02] ${isLow ? 'bg-red-500/5' : ''}`}>
                    <td className="p-3">
                      <div className="font-medium">{item.name}</div>
                      {item.sku && <div className="text-xs text-white/40">SKU: {item.sku}</div>}
                    </td>
                    <td className="p-3 text-white/60">{item.category || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                        {item.stock_current} {item.unit}
                      </span>
                      {isLow && <AlertTriangle className="w-3 h-3 text-red-400 inline ml-1" />}
                    </td>
                    <td className="p-3 text-center text-xs text-white/60">
                      {item.stock_min} / {item.stock_max}
                    </td>
                    <td className="p-3 text-center text-white/60">S/ {item.cost_per_unit.toFixed(2)}</td>
                    <td className="p-3 text-center text-white/60">{item.supplier || '—'}</td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => setShowMovement(item)}
                          className="px-2 py-1 rounded bg-[#9d4edd]/20 text-[#9d4edd] hover:bg-[#9d4edd]/30 text-xs font-semibold"
                          title="Registrar movimiento"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeactivate(item.id)}
                          className="p-1.5 text-white/40 hover:text-red-400"
                          title="Desactivar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nuevo insumo */}
      {showAdd && (
        <Modal title="Nuevo insumo" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <Label>Nombre *</Label>
              <Input required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="bg-white/5 border-white/10" placeholder="Arroz, Pollo, Aceite…" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>SKU</Label>
                <Input value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <Label>Unidad</Label>
                <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="litro">Litro</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="caja">Caja</option>
                  <option value="paquete">Paquete</option>
                  <option value="docena">Docena</option>
                  <option value="lata">Lata</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Stock actual</Label>
                <Input type="number" step="any" value={newItem.stock_current} onChange={(e) => setNewItem({ ...newItem, stock_current: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <Label>Stock mín</Label>
                <Input type="number" step="any" value={newItem.stock_min} onChange={(e) => setNewItem({ ...newItem, stock_min: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <Label>Stock máx</Label>
                <Input type="number" step="any" value={newItem.stock_max} onChange={(e) => setNewItem({ ...newItem, stock_max: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Costo por unidad (S/)</Label>
                <Input type="number" step="any" value={newItem.cost_per_unit} onChange={(e) => setNewItem({ ...newItem, cost_per_unit: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <Label>Proveedor</Label>
                <Input value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div>
              <Label>Categoría</Label>
              <Input value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="bg-white/5 border-white/10" placeholder="Lácteos, Carnes, Verduras…" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)} className="flex-1 bg-transparent border-white/20">Cancelar</Button>
              <Button type="submit" className="flex-1" style={{ background: '#9d4edd', color: 'white' }}>Crear insumo</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal movimiento */}
      {showMovement && (
        <MovementModal
          item={showMovement}
          onClose={() => setShowMovement(null)}
          onSubmit={handleMovement}
        />
      )}

      {/* Modal recetas */}
      {showRecipes && (
        <RecipesModal
          recipes={recipes}
          dishes={allDishes}
          inventoryItems={items}
          onClose={() => setShowRecipes(false)}
          onChange={load}
        />
      )}
    </DashboardShell>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MovementModal({
  item, onClose, onSubmit,
}: {
  item: InventoryItem;
  onClose: () => void;
  onSubmit: (item: InventoryItem, type: 'entrada' | 'salida' | 'ajuste' | 'merma', quantity: number, reason: string) => void;
}) {
  const [type, setType] = useState<'entrada' | 'salida' | 'ajuste' | 'merma'>('entrada');
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('');

  const icons = {
    entrada: <ArrowUpCircle className="w-5 h-5" />,
    salida: <ArrowDownCircle className="w-5 h-5" />,
    ajuste: <Settings className="w-5 h-5" />,
    merma: <TrendingDown className="w-5 h-5" />,
  };

  return (
    <Modal title={`Movimiento: ${item.name}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="bg-white/5 rounded-lg p-3 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-white/60">Stock actual:</span>
            <span className="font-bold">{item.stock_current} {item.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Stock mínimo:</span>
            <span>{item.stock_min} {item.unit}</span>
          </div>
        </div>

        <div>
          <Label>Tipo de movimiento</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['entrada', 'salida', 'ajuste', 'merma'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold border ${
                  type === t ? 'bg-[#9d4edd]/20 border-[#9d4edd]/60 text-[#9d4edd]' : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {icons[t]}
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>
            {type === 'ajuste' ? 'Diferencia (puede ser negativa)' : `Cantidad (${item.unit})`}
          </Label>
          <Input
            type="number"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <Label>Motivo</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={type === 'entrada' ? 'Compra a…' : type === 'salida' ? 'Uso en…' : 'Motivo…'}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent border-white/20">Cancelar</Button>
          <Button
            onClick={() => onSubmit(item, type, parseFloat(quantity) || 0, reason)}
            className="flex-1"
            style={{ background: '#9d4edd', color: 'white' }}
          >
            Registrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function RecipesModal({
  recipes, dishes, inventoryItems, onClose, onChange,
}: {
  recipes: Recipe[];
  dishes: Dish[];
  inventoryItems: InventoryItem[];
  onClose: () => void;
  onChange: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    menu_item_id: '', menu_item_name: '',
    inventory_item_id: '', quantity_per_dish: '1', notes: '',
  });

  async function handleAddRecipe(e: React.FormEvent) {
    e.preventDefault();
    const dish = dishes.find(d => d.id === form.menu_item_id);
    if (!dish || !form.inventory_item_id) {
      toast.error('Selecciona plato e insumo');
      return;
    }
    try {
      const res = await fetch('/api/recetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_item_id: form.menu_item_id,
          menu_item_name: dish.name,
          inventory_item_id: form.inventory_item_id,
          quantity_per_dish: parseFloat(form.quantity_per_dish) || 1,
          notes: form.notes || undefined,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Receta creada');
      setForm({ menu_item_id: '', menu_item_name: '', inventory_item_id: '', quantity_per_dish: '1', notes: '' });
      setShowForm(false);
      onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleDeleteRecipe(id: string) {
    if (!confirm('¿Eliminar esta receta?')) return;
    try {
      const res = await fetch(`/api/recetas/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Receta eliminada');
      onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recetas (plato → insumos)</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="mb-4 text-xs text-white/60 bg-white/5 rounded-lg p-3">
          💡 Las recetas definen qué insumos consume cada plato. Al facturar una comanda, el sistema descuenta automáticamente el stock de cada insumo según la cantidad servida.
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm">
            No tienes recetas configuradas.
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {recipes.map(r => (
              <div key={r.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{r.menu_item_name}</div>
                  <div className="text-xs text-white/60">
                    → {r.inventory_item?.name || 'Insumo eliminado'}: {r.quantity_per_dish} {r.inventory_item?.unit || ''}
                  </div>
                  {r.notes && <div className="text-xs text-amber-400 mt-1">↳ {r.notes}</div>}
                </div>
                <button onClick={() => handleDeleteRecipe(r.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full" style={{ background: '#9d4edd', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" /> Nueva receta
          </Button>
        ) : (
          <form onSubmit={handleAddRecipe} className="space-y-3 bg-white/5 rounded-lg p-3">
            <div>
              <Label>Plato</Label>
              <select
                value={form.menu_item_id}
                onChange={(e) => setForm({ ...form, menu_item_id: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Selecciona un plato…</option>
                {dishes.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Insumo</Label>
              <select
                value={form.inventory_item_id}
                onChange={(e) => setForm({ ...form, inventory_item_id: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Selecciona un insumo…</option>
                {inventoryItems.map(i => (
                  <option key={i.id} value={i.id}>{i.name} ({i.stock_current} {i.unit})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Cantidad por plato</Label>
                <Input
                  type="number" step="any" min="0"
                  value={form.quantity_per_dish}
                  onChange={(e) => setForm({ ...form, quantity_per_dish: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label>Notas</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="bg-white/5 border-white/10"
                  placeholder="Opcional"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 bg-transparent border-white/20">Cancelar</Button>
              <Button type="submit" className="flex-1" style={{ background: '#9d4edd', color: 'white' }}>Crear</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
