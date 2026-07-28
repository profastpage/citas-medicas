// ============================================================
// POST /api/appointments/[id]/send-reminder
// ============================================================
// Envía un recordatorio WhatsApp para una cita concreta.
//   - Verifica que el plan tenga `hasWhatsAppReminders` habilitado
//   - Verifica que queden créditos en `reminderCreditsPerMonth`
//   - Registra un AuditLog con action='WHATSAPP_REMINDER_SENT'
//     (este log es el contador canónico para el badge de uso)
//   - En modo DEMO (sin WHATSAPP_API_TOKEN), genera un link wa.me
//     y lo devuelve para que el cliente lo abra.
//   - En modo PROD, llama a la API de WhatsApp Cloud (meta) y
//     devuelve el message_id.
// Costo: $0 para CitasPro — el contador es un simple COUNT en AuditLog.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { assertCanSendWhatsAppReminder, assertFeature } from '@/lib/plan-limits';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica activa' }, { status: 400 });

  const { id } = await params;

  // 1. Verificar feature flag del plan
  const featureErr = assertFeature(user.plan, 'hasWhatsAppReminders', 'Recordatorios WhatsApp');
  if (featureErr) return featureErr;

  // 2. Verificar créditos mensuales
  const limitErr = await assertCanSendWhatsAppReminder(user.plan, clinicId);
  if (limitErr) return limitErr;

  // 3. Cargar la cita + paciente
  const appointment = await db.appointment.findFirst({
    where: { id, clinicId },
    include: {
      patient: true,
      doctor: true,
      service: true,
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
  }

  if (!appointment.patient.phone) {
    return NextResponse.json(
      { error: 'El paciente no tiene número de teléfono registrado' },
      { status: 400 }
    );
  }

  // 4. Construir mensaje
  const fecha = new Date(appointment.appointmentDate).toLocaleString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
  const mensaje =
    `Hola ${appointment.patient.firstName}, le recordamos su cita en la clínica ` +
    `con ${appointment.doctor.fullName}${appointment.service ? ` (${appointment.service.name})` : ''} ` +
    `el ${fecha}. Responda a este mensaje si necesita reprogramar.`;

  // 5. Registrar el envío en AuditLog (contador del plan)
  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'WHATSAPP_REMINDER_SENT',
      entity: 'Appointment',
      entityId: appointment.id,
      description: `Recordatorio WhatsApp enviado a ${appointment.patient.fullName} (tel: ${appointment.patient.phone})`,
    },
  });

  // 6. Generar el link wa.me — el cliente lo abre y envía el mensaje
  //    (en modo PROD con WHATSAPP_API_TOKEN, aquí se llamaría a la Meta API)
  const phoneDigits = appointment.patient.phone.replace(/\D/g, '');
  const phoneWithCountry = phoneDigits.startsWith('51') ? phoneDigits : `51${phoneDigits}`;
  const waLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(mensaje)}`;

  // 7. En modo PROD con token, llamar a la Meta WhatsApp Cloud API
  const waToken = process.env.WHATSAPP_API_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (waToken && waPhoneId) {
    try {
      const metaRes = await fetch(
        `https://graph.facebook.com/v20.0/${waPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${waToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneWithCountry,
            type: 'text',
            text: { body: mensaje },
          }),
        }
      );
      const metaJson = await metaRes.json();
      if (!metaRes.ok) {
        console.error('[WA API]', metaJson);
        // Aun así devolvemos el link wa.me como fallback
        return NextResponse.json({
          ok: true,
          fallback: true,
          waLink,
          warning: 'Meta API falló; usa el link wa.me como respaldo',
          messageId: null,
        });
      }
      return NextResponse.json({
        ok: true,
        messageId: metaJson.messages?.[0]?.id,
        waLink,
      });
    } catch (err) {
      console.error('[WA API error]', err);
      return NextResponse.json({ ok: true, fallback: true, waLink, warning: 'Error de red a Meta API' });
    }
  }

  // Modo demo: devolver el link wa.me
  return NextResponse.json({
    ok: true,
    demo: true,
    waLink,
    message: 'Recordatorio preparado. Abre el link para enviarlo por WhatsApp.',
  });
}
