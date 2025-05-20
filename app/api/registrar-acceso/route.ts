import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: NextRequest) {
  // Obtener la IP del usuario
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'desconocida';
  const fecha = new Date().toISOString();

  // Guardar en la base de datos
  const stmt = db.prepare('INSERT INTO accesos (ip, fecha) VALUES (?, ?)');
  stmt.run(ip, fecha);

  return NextResponse.json({ ok: true });
} 