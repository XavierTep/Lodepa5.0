"use server"
import  { executeQuery } from "@/lib/db";

export async function getStatus(parametro: string, value: number): Promise<string> {
  const query = `
    SELECT min_good, max_good, min_warning, max_warning
    FROM umbrales
    WHERE parametro = ?
    LIMIT 1;
  `;
  const [rows]: any = await executeQuery(query, [parametro]);

  if (!rows || rows.length === 0) {
    return '#22c55e';
  }

  const { min_good, max_good, min_warning, max_warning } = rows[0];

  if (value >= min_good && value <= max_good) return '#22c55e';
  if (value >= min_warning && value <= max_warning) return '#eab308';
  return '#ef4444';
}


export async function getMeasurementRanges(): Promise<Record<string, any>> {
  const query = `
    SELECT u.parametro, u.min_good, u.max_good, u.min_warning, u.max_warning
    FROM umbrales u;
  `;
  const [rows]: any = await executeQuery(query, []);

  // Transforma los resultados en el objeto con la estructura deseada
  const measurementRanges = rows.reduce((acc: any, row: any) => {
    acc[row.parametro] = {
      good: { min: row.min_good, max: row.max_good },
      warning: { min: row.min_warning, max: row.max_warning },
    };
    return acc;
  }, {});

  return measurementRanges;
}

// Nueva función para obtener los umbrales específicos de un parámetro
export async function getParameterThresholds(parametro: string): Promise<{
  min_good: number
  max_good: number
  min_warning: number
  max_warning: number
} | null> {
  const query = `
    SELECT min_good, max_good, min_warning, max_warning
    FROM umbrales
    WHERE parametro = ?
    LIMIT 1;
  `
  const [rows]: any = await executeQuery(query, [parametro])

  if (!rows || rows.length === 0) {
    return null
  }

  return rows[0]
}
// Nueva acción del servidor para obtener colores para múltiples parámetros
export async function getStatusBatch(
  parametros: Array<{ parametro: string; valor: number }>,
): Promise<Record<string, string>> {
  const resultados: Record<string, string> = {}

  await Promise.all(
    parametros.map(async ({ parametro, valor }) => {
      resultados[parametro] = await getStatus(parametro, valor)
    }),
  )

  return resultados
}
