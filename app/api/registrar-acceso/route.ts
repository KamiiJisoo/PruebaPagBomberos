import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const { error } = await supabase
      .from('accesos')
      .insert([
        { 
          ip: 'localhost', // En producción, obtendrías la IP real
          fecha: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al registrar acceso:', error);
    return NextResponse.json(
      { error: 'Error al registrar acceso' },
      { status: 500 }
    );
  }
} 