import { supabase } from '../lib/supabaseClient';

async function generarResumenAccesos() {
  try {
    const response = await fetch('http://localhost:3000/api/resumen-accesos', {
      method: 'POST',
    });

    const data = await response.json();
    console.log('Resumen generado:', data);
  } catch (error) {
    console.error('Error al generar resumen:', error);
  }
}

// Ejecutar el script
generarResumenAccesos(); 