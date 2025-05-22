import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fechaActual = new Date()
    const mesActual = fechaActual.getMonth() + 1
    const añoActual = fechaActual.getFullYear()
    const nombreTabla = `accesos_${añoActual}_${mesActual.toString().padStart(2, '0')}`

    // 1. Contar accesos del mes actual
    const { count, error: countError } = await supabaseClient
      .from('accesos')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    // 2. Crear tabla del mes actual si no existe
    const { error: createTableError } = await supabaseClient.rpc('crear_tabla_accesos_mes', {
      nombre_tabla: nombreTabla
    })

    if (createTableError) throw createTableError

    // 3. Insertar resumen en la tabla de resúmenes
    const { error: insertError } = await supabaseClient
      .from('resumen_accesos')
      .insert([
        {
          mes: mesActual,
          año: añoActual,
          total_accesos: count || 0,
          fecha_resumen: new Date().toISOString()
        }
      ])

    if (insertError) throw insertError

    // 4. Limpiar tabla de accesos actual
    const { error: deleteError } = await supabaseClient
      .from('accesos')
      .delete()
      .neq('id', 0)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({
        success: true,
        message: `Resumen creado para ${mesActual}/${añoActual}`,
        total_accesos: count
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}) 