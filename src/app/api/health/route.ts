import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, name: 'CitasPro SaaS', version: '1.0.0' });
}
