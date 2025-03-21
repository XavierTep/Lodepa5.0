"use server";

import { executeQuery } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export interface Sala extends RowDataPacket {
  id: number;
  n_sala: string;
}

export interface SalasDispositivos extends RowDataPacket {
  id_sala: number;
  n_sala: string;
  id_dispositivo: number;
  n_dispositivo: string;
  referencia: string;
  api_key_inbiot: string;
  ultimaActualizacion: Date;
}

export async function getSalaByHospital(id:number): Promise<Sala[]> {
  try {
    const [rows] = await executeQuery<Sala[] & RowDataPacket[]>(
      `SELECT s.id,s.n_sala FROM salas AS s WHERE s.hospital = ?;`,[id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw new Error("No se pudieron obtener los roles");
  }
}

export async function getSalaYDispositivoByHospital(id:number): Promise<SalasDispositivos[]> {
  try {
    const [rows] = await executeQuery<SalasDispositivos[] & RowDataPacket[]>(
      `SELECT 
          s.id AS id_sala,
          s.n_sala,
          d.id AS id_dispositivo,
          d.n_dispositivo,
          d.referencia,
          d.api_key_inbiot,
          MAX(r.update_time) AS ultimaActualizacion
        FROM salas s
        LEFT JOIN dispositivos d ON s.id = d.sala
        LEFT JOIN registros r ON d.id = r.dispositivo
        WHERE s.hospital = ?
        GROUP BY 
          s.id, s.n_sala,
          d.id, d.n_dispositivo, d.referencia, d.api_key_inbiot
          ORDER BY ultimaActualizacion ASC
          ;`,[id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw new Error("No se pudieron obtener los roles");
  }
}