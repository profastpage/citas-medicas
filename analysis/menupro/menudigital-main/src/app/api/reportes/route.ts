import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/reportes
 * Reportes avanzados — solo plan Full.
 *
 * Query params:
 *   ?from=2024-01-01     → fecha inicio (ISO date)
 *   ?to=2024-12-31       → fecha fin (ISO date)
 *   ?branch_id=xxx       → filtrar por sucursal
 *   ?type=resumen        → (default) KPIs + 4 vistas combinadas
 *
 * Devuelve:
 *  - kpis: total_ventas, num_comandas, ticket_promedio, num_mesas_usadas
 *  - por_mozo: [{ waiter_id, waiter_name, num_comandas, total_ventas, ticket_promedio }]
 *  - por_plato: [{ menu_item_id, menu_item_name, cantidad, total_ventas, num_comandas }]
 *  - por_sucursal: [{ branch_id, branch_name, num_comandas, total_ventas }] (si multi-branch)
 *  - por_hora: [{ hora: 0-23, num_comandas, total_ventas }]
 *  - por_dia: [{ fecha, num_comandas, total_ventas }] (últimos 30 días)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasAdvancedReports) {
    return NextResponse.json(
      { error: 'Requiere plan Full', upgradeRequired: true },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const branchId = url.searchParams.get('branch_id');

  // Default: últimos 30 días
  const endDate = to ? new Date(to) : new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  startDate.setHours(0, 0, 0, 0);

  // Query base: órdenes facturadas o entregadas en rango
  let baseQuery = supabase
    .from('orders')
    .select(`
      id, order_number, status, total, subtotal, currency, created_at,
      table_id, waiter_id, branch_id,
      table:tables(id, number, name),
      waiter:waiters(id, full_name),
      branch:branches(id, name),
      items:order_items(id, menu_item_id, menu_item_name, menu_item_price, quantity)
    `)
    .eq('owner_id', user.id)
    .in('status', ['facturada', 'entregada'])
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (branchId) baseQuery = baseQuery.eq('branch_id', branchId);

  const { data: orders, error } = await baseQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ords = (orders || []) as any[];

  // ───── KPIs ─────
  const totalVentas = ords.reduce((s, o) => s + Number(o.total || 0), 0);
  const numComandas = ords.length;
  const ticketPromedio = numComandas > 0 ? totalVentas / numComandas : 0;
  const mesasUsadas = new Set(ords.map(o => o.table_id).filter(Boolean)).size;

  // ───── Por mozo ─────
  const porMozoMap = new Map<string, { waiter_id: string; waiter_name: string; num_comandas: number; total_ventas: number }>();
  for (const o of ords) {
    if (!o.waiter_id) continue;
    const key = o.waiter_id;
    const existing = porMozoMap.get(key) || {
      waiter_id: key,
      waiter_name: o.waiter?.full_name || 'Sin nombre',
      num_comandas: 0,
      total_ventas: 0,
    };
    existing.num_comandas += 1;
    existing.total_ventas += Number(o.total || 0);
    porMozoMap.set(key, existing);
  }
  const por_mozo = Array.from(porMozoMap.values())
    .map(m => ({ ...m, ticket_promedio: m.num_comandas > 0 ? m.total_ventas / m.num_comandas : 0 }))
    .sort((a, b) => b.total_ventas - a.total_ventas);

  // ───── Por plato ─────
  const porPlatoMap = new Map<string, { menu_item_id: string; menu_item_name: string; cantidad: number; total_ventas: number; num_comandas: number }>();
  for (const o of ords) {
    for (const it of o.items || []) {
      if (it.status === 'cancelado') continue;
      const key = it.menu_item_id || it.menu_item_name;
      const existing = porPlatoMap.get(key) || {
        menu_item_id: key,
        menu_item_name: it.menu_item_name,
        cantidad: 0,
        total_ventas: 0,
        num_comandas: 0,
      };
      existing.cantidad += Number(it.quantity || 0);
      existing.total_ventas += Number(it.menu_item_price || 0) * Number(it.quantity || 0);
      existing.num_comandas += 1;
      porPlatoMap.set(key, existing);
    }
  }
  const por_plato = Array.from(porPlatoMap.values())
    .sort((a, b) => b.cantidad - a.cantidad);

  // ───── Por sucursal ─────
  const porSucursalMap = new Map<string, { branch_id: string | null; branch_name: string; num_comandas: number; total_ventas: number }>();
  for (const o of ords) {
    const key = o.branch_id || 'main';
    const existing = porSucursalMap.get(key) || {
      branch_id: o.branch_id,
      branch_name: o.branch?.name || 'Sucursal principal',
      num_comandas: 0,
      total_ventas: 0,
    };
    existing.num_comandas += 1;
    existing.total_ventas += Number(o.total || 0);
    porSucursalMap.set(key, existing);
  }
  const por_sucursal = Array.from(porSucursalMap.values())
    .sort((a, b) => b.total_ventas - a.total_ventas);

  // ───── Por hora del día (0-23) ─────
  const porHoraArr = Array.from({ length: 24 }, (_, h) => ({
    hora: h,
    num_comandas: 0,
    total_ventas: 0,
  }));
  for (const o of ords) {
    const h = new Date(o.created_at).getHours();
    porHoraArr[h].num_comandas += 1;
    porHoraArr[h].total_ventas += Number(o.total || 0);
  }
  const por_hora = porHoraArr;

  // ───── Por día (últimos 30 días o rango) ─────
  const porDiaMap = new Map<string, { fecha: string; num_comandas: number; total_ventas: number }>();
  for (const o of ords) {
    const d = new Date(o.created_at);
    const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const existing = porDiaMap.get(fecha) || { fecha, num_comandas: 0, total_ventas: 0 };
    existing.num_comandas += 1;
    existing.total_ventas += Number(o.total || 0);
    porDiaMap.set(fecha, existing);
  }
  const por_dia = Array.from(porDiaMap.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));

  // ───── Por tipo de orden ─────
  const porTipoMap = new Map<string, { tipo: string; num_comandas: number; total_ventas: number }>();
  for (const o of ords) {
    const tipo = o.order_type || 'mesa';
    const existing = porTipoMap.get(tipo) || { tipo, num_comandas: 0, total_ventas: 0 };
    existing.num_comandas += 1;
    existing.total_ventas += Number(o.total || 0);
    porTipoMap.set(tipo, existing);
  }
  const por_tipo = Array.from(porTipoMap.values()).sort((a, b) => b.total_ventas - a.total_ventas);

  return NextResponse.json({
    rango: {
      from: startDate.toISOString(),
      to: endDate.toISOString(),
      dias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    },
    kpis: {
      total_ventas: Number(totalVentas.toFixed(2)),
      num_comandas: numComandas,
      ticket_promedio: Number(ticketPromedio.toFixed(2)),
      num_mesas_usadas: mesasUsadas,
      num_platos_vendidos: por_plato.reduce((s, p) => s + p.cantidad, 0),
    },
    por_mozo,
    por_plato: por_plato.slice(0, 50), // top 50
    por_sucursal,
    por_hora,
    por_dia,
    por_tipo,
  });
}
