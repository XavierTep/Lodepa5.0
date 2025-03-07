import { NextResponse } from "next/server";
import db from "@/lib/db";

// Función para convertir update_time a la zona horaria de Madrid (España)
function parseUpdateTime(updateTime: string): number[] {
  const date = new Date(updateTime);

  // Convertimos a la zona horaria de Madrid
  const madridTime = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Mantiene el formato 24h
  }).formatToParts(date);

  // Mapeamos cada parte de la fecha a su correspondiente valor numérico
  return [
    Number(madridTime.find((p) => p.type === "year")?.value),
    Number(madridTime.find((p) => p.type === "month")?.value),
    Number(madridTime.find((p) => p.type === "day")?.value),
    Number(madridTime.find((p) => p.type === "hour")?.value),
    Number(madridTime.find((p) => p.type === "minute")?.value),
    Number(madridTime.find((p) => p.type === "second")?.value),
  ];
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar a que se resuelvan los parámetros
    const params = await context.params;

    // Convertir el parámetro id a número (se espera que sea el id del dispositivo)
    const dispositivoId = parseInt(params.id, 10);
    if (isNaN(dispositivoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Ejecutar la consulta SQL usando el id del dispositivo como parámetro
    const [rows]: any[] = await db.query(
      `SELECT r.*, d.id AS dispositivo_id, d.referencia, d.api_key_inbiot, d.n_dispositivo
        FROM registros r
        JOIN dispositivos d ON r.dispositivo = d.id
        WHERE r.dispositivo = ?
        ORDER BY r.update_time DESC
        LIMIT 1;
      `,
      [dispositivoId]
    );

    // Verificar si se encontró algún registro
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Registro no encontrado" },
        { status: 404 }
      );
    }

    // Extraer el resultado
    const row = rows[0];

    // Convertir update_time a la zona horaria de Madrid en formato [YYYY, M, D, H, m, s]
    const updateTimeArray = parseUpdateTime(row.update_time);

    // Estructurar la respuesta en el formato solicitado
    const responseData = [
      {
        id: row.id,
        dispositivo: {
          id: row.dispositivo_id,
          ndispositivo: row.n_dispositivo,
        },
        temperature: parseFloat(row.temperature),
        humidity: parseFloat(row.humidity),
        co2: parseFloat(row.co2),
        formaldehyde: parseFloat(row.formaldehyde),
        vocs: parseFloat(row.vocs),
        pm1: parseFloat(row.pm1),
        pm4: parseFloat(row.pm4),
        pm10: parseFloat(row.pm10),
        pm25: parseFloat(row.pm25),
        co: parseFloat(row.co),
        o3: parseFloat(row.o3),
        no2: parseFloat(row.no2),
        covid19: parseFloat(row.covid19),
        iaq: parseFloat(row.iaq),
        thermalIndicator: parseFloat(row.thermal_indicator),
        ventilationIndicator: parseFloat(row.ventilation_indicator),
        updateTime: updateTimeArray,
      },
    ];

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error("Error al obtener el registro:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener el registro", error: error.message },
      { status: 500 }
    );
  }
}
