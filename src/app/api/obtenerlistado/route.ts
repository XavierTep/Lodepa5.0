import db from '@/lib/db'; // Asegúrate de que db está bien configurado en lib/db.ts o lib/db.js
import { NextResponse } from 'next/server';
import { getSession } from '@/actions/auth/getSession';

function transformData(rows: any[]) {
  const hospitalsMap = new Map();

  rows.forEach((row) => {
    // Buscar o crear el hospital
    if (!hospitalsMap.has(row.id_hospital)) {
      hospitalsMap.set(row.id_hospital, {
        id: row.id_hospital,
        name: row.hospital,
        rooms: new Map(),
      });
    }

    const hospital = hospitalsMap.get(row.id_hospital);

    // Buscar o crear la sala dentro del hospital
    if (!hospital.rooms.has(row.id_sala)) {
      hospital.rooms.set(row.id_sala, {
        id: row.id_sala,
        name: row.n_sala,
        devices: [],
      });
    }

    const room = hospital.rooms.get(row.id_sala);

    // Agregar el dispositivo a la sala
    room.devices.push({
      id: row.id,
      dispositivo: {
        id: row.id_dispositivo,
        ndispositivo: row.n_dispositivo,
        referencia: '', // Agrega referencia si está disponible
      },
      updateTime: parseUpdateTime(row.update_time),
      co2: parseFloat(row.co2),
      covid19: parseFloat(row.covid19),
      humidity: parseFloat(row.humidity),
      iaq: parseFloat(row.iaq),
      pm10: parseFloat(row.pm10),
      pm25: parseFloat(row.pm25),
      temperature: parseFloat(row.temperature),
      vocs: parseFloat(row.vocs),
      thermalIndicator: parseFloat(row.thermal_indicator),
      ventilationIndicator: parseFloat(row.ventilation_indicator),
      co: parseFloat(row.co),
      formaldehyde: parseFloat(row.formaldehyde),
      no2: parseFloat(row.no2),
      o3: parseFloat(row.o3),
      pm1: parseFloat(row.pm1),
      pm4: parseFloat(row.pm4),
    });
  });

  // Convertir Maps a listas y devolver el resultado correcto
  return Array.from(hospitalsMap.values()).map((hospital) => ({
    ...hospital,
    rooms: Array.from(hospital.rooms.values()),
  }));
}

// Función para convertir update_time a la zona horaria de Madrid (España)
function parseUpdateTime(updateTime: string): number[] {
  const date = new Date(updateTime);

  // Convertimos a la zona horaria de Madrid
  const madridTime = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Mantiene el formato 24h
  }).formatToParts(date);

  // Mapeamos cada parte de la fecha a su correspondiente valor numérico
  return [
    Number(madridTime.find((p) => p.type === 'year')?.value),
    Number(madridTime.find((p) => p.type === 'month')?.value),
    Number(madridTime.find((p) => p.type === 'day')?.value),
    Number(madridTime.find((p) => p.type === 'hour')?.value),
    Number(madridTime.find((p) => p.type === 'minute')?.value),
    Number(madridTime.find((p) => p.type === 'second')?.value),
  ];
}

export async function GET() {
  try {
    const { id, rol } = await getSession();
    // Ejecutar la consulta SQL segun el Rol
    let rows: any;
    switch(rol){
      // Si el rol es ADMIN
      case 1:
        [rows] = await db.query(
              `SELECT h.id AS id_hospital, h.hospital, s.id AS id_sala, s.n_sala, d.id AS id_dispositivo, d.n_dispositivo, r.*
              FROM hospitales h
              JOIN salas s ON h.id = s.hospital
              JOIN dispositivos d ON s.id = d.sala
              JOIN registros r ON d.id = r.dispositivo
              WHERE r.update_time = (
                SELECT MAX(r2.update_time)
                FROM registros r2
                WHERE r2.dispositivo = r.dispositivo
              );`
            );
        break;
      // Responsable de Hospital
      case 2:
        [rows] = await db.query(
          `SELECT 
              h.id AS id_hospital, 
              h.hospital, 
              s.id AS id_sala, 
              s.n_sala, 
              d.id AS id_dispositivo, 
              d.n_dispositivo, 
              r.*
          FROM hospitales h
          JOIN usuarios_hospitales uh ON h.id = uh.hospital_id
          JOIN salas s ON h.id = s.hospital
          LEFT JOIN dispositivos d ON s.id = d.sala
          LEFT JOIN registros r ON d.id = r.dispositivo 
          AND r.update_time = (
              SELECT MAX(r2.update_time)
              FROM registros r2
              WHERE r2.dispositivo = d.id
          )
          WHERE uh.usuario_id = ?;
          `,
          [id]
        );
      break;
      // Usuario de la Sala
      case 3:
        [rows] = await db.query(
          `SELECT h.id AS id_hospital, h.hospital, s.id AS id_sala, s.n_sala, d.id AS id_dispositivo, d.n_dispositivo, r.*
            FROM salas s
            JOIN hospitales h ON s.hospital = h.id
            LEFT JOIN dispositivos d ON s.id = d.sala
            LEFT JOIN registros r ON d.id = r.dispositivo
            AND r.update_time = (
                SELECT MAX(r2.update_time)
                FROM registros r2
                WHERE r2.dispositivo = d.id
            )
            WHERE s.id = ?;`,[id]
        );
        break;
    }

    // Transformar los datos correctamente
    const transformedData = transformData(rows);

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener datos' },
      { status: 500 }
    );
  }
}
