// ============================================================
// GET /api/billing/quote-upgrade?planId=pro|premium|full
// ============================================================
// Calcula el prorrateo de upgrade desde el plan actual al plan destino.
//
// Lógica de prorrateo (MercadoPago no soporta prorrateo nativo, así que
// lo calculamos y lo incluimos como metadata para que el webhook lo aplique):
//
//   1. Si el usuario no tiene plan actual (free) → cargo completo del plan nuevo.
//   2. Si el usuario tiene plan actual y currentPeriodEnd > ahora:
//        - Días restantes = ceil((periodEnd - now) / 1 día)
//        - Valor prorrateado del plan actual = precioActual * (díasRestantes / 30)
//        - Cargo prorrateado = precioNuevo - valorProrrateadoActual
//        - Si el cargo prorrateado < 0 → no hay reembolso (MercadoPago no lo permite
//          automáticamente), pero se registra como crédito para el siguiente ciclo.
//   3. Si currentPeriodEnd <= ahora → cargo completo del plan nuevo.
//
// La respuesta se muestra en el modal de upgrade antes de confirmar.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { PLANS, getPlan, type PlanId } from '@/lib/plans';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const url = new URL(req.url);
  const planId = url.searchParams.get('planId') as PlanId | null;
  if (!planId || !['pro', 'premium', 'full'].includes(planId)) {
    return NextResponse.json({ error: 'planId inválido' }, { status: 400 });
  }

  const targetPlan = PLANS[planId];
  const currentPlan = getPlan(user.plan);

  // Si el plan actual es el mismo → no hay upgrade
  if (currentPlan.id === targetPlan.id) {
    return NextResponse.json({
      currentPlan: { id: currentPlan.id, name: currentPlan.name, price: currentPlan.priceMonthly },
      targetPlan: { id: targetPlan.id, name: targetPlan.name, price: targetPlan.priceMonthly },
      proration: {
        amountDue: 0,
        creditRemaining: 0,
        daysRemaining: 0,
        explanation: 'Ya estás en este plan.',
      },
    });
  }

  // Validar que sea un upgrade real (no downgrade)
  const order: PlanId[] = ['free', 'pro', 'premium', 'full'];
  if (order.indexOf(currentPlan.id as PlanId) > order.indexOf(targetPlan.id)) {
    return NextResponse.json(
      { error: 'No puedes hacer downgrade con este endpoint. Contacta soporte.' },
      { status: 400 }
    );
  }

  const now = new Date();
  const periodEnd = user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : null;
  const daysRemaining = periodEnd
    ? Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Calcular valor prorrateado
  const fullDays = 30; // mes comercial
  let amountDue = targetPlan.priceMonthly; // cargo completo por defecto
  let creditRemaining = 0;
  let explanation = '';

  if (currentPlan.id === 'free' || !periodEnd || daysRemaining <= 0) {
    // Cargo completo del plan nuevo
    amountDue = targetPlan.priceMonthly;
    explanation = `Cargo completo del plan ${targetPlan.name}: S/ ${targetPlan.priceMonthly.toFixed(2)}. Tu primer ciclo empieza hoy y se renueva en 30 días.`;
  } else {
    // Prorrateo real
    const currentValueProrated = currentPlan.priceMonthly * (daysRemaining / fullDays);
    const newAmount = targetPlan.priceMonthly;
    const prorated = newAmount - currentValueProrated;

    if (prorated > 0) {
      amountDue = Math.round(prorated * 100) / 100;
      explanation =
        `Upgrade de ${currentPlan.name} → ${targetPlan.name}. ` +
        `Cargo prorrateado por los ${daysRemaining} días restantes del ciclo actual: ` +
        `S/ ${targetPlan.priceMonthly.toFixed(2)} (nuevo) − S/ ${currentValueProrated.toFixed(2)} (crédito ${currentPlan.name}) = ` +
        `S/ ${amountDue.toFixed(2)} hoy. ` +
        `A partir del ${periodEnd.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })} se cobrará el monto completo mensual de S/ ${targetPlan.priceMonthly.toFixed(2)}.`;
    } else {
      // El plan nuevo es más barato que el crédito del actual → no hay cargo, hay crédito
      amountDue = 0;
      creditRemaining = Math.round(Math.abs(prorated) * 100) / 100;
      explanation =
        `Upgrade con crédito. El valor prorrateado de tu plan actual ` +
        `(S/ ${currentValueProrated.toFixed(2)} por ${daysRemaining} días restantes) ` +
        `cubre el primer ciclo del plan ${targetPlan.name}. ` +
        `No se cobrará nada hoy. ` +
        `A partir del ${periodEnd.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })} ` +
        `se cobrará S/ ${targetPlan.priceMonthly.toFixed(2)}/mes.`;
    }
  }

  return NextResponse.json({
    currentPlan: { id: currentPlan.id, name: currentPlan.name, price: currentPlan.priceMonthly },
    targetPlan: { id: targetPlan.id, name: targetPlan.name, price: targetPlan.priceMonthly },
    proration: {
      amountDue,
      creditRemaining,
      daysRemaining,
      currentPeriodEnd: periodEnd?.toISOString() ?? null,
      explanation,
    },
  });
}
