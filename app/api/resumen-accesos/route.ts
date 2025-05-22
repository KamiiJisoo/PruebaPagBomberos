import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();
    const nombreTabla = `accesos_${añoActual}_${mesActual.toString().padStart(2, '0')}`;

    // 1. Contar accesos del mes actual
    const { count, error: countError } = await supabase
      .from('accesos')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 2. Crear tabla del mes actual si no existe
    const { error: createTableError } = await supabase.rpc('crear_tabla_accesos_mes', {
      nombre_tabla: nombreTabla
    });

    if (createTableError) throw createTableError;

    // 3. Insertar resumen en la tabla de resúmenes
    const { error: insertError } = await supabase
      .from('resumen_accesos')
      .insert([
        {
          mes: mesActual,
          año: añoActual,
          total_accesos: count || 0,
          fecha_resumen: new Date().toISOString()
        }
      ]);

    if (insertError) throw insertError;

    // 4. Limpiar tabla de accesos actual
    const { error: deleteError } = await supabase
      .from('accesos')
      .delete()
      .neq('id', 0); // Esto eliminará todos los registros

    if (deleteError) throw deleteError;

    return NextResponse.json({ 
      success: true, 
      message: `Resumen creado para ${mesActual}/${añoActual}`,
      total_accesos: count
    });
  } catch (error) {
    console.error('Error al crear resumen de accesos:', error);
    return NextResponse.json(
      { error: 'Error al crear resumen de accesos' },
      { status: 500 }
    );
  }
} 