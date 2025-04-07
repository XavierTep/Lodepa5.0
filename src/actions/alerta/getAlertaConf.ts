"use server";

import { executeQuery } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export interface ConfAlerta extends RowDataPacket {
    id: number;
    sala_id: number;
    n_sala:string; //monstrar
    hospital_id:number;
    hospital:string; //monstrar
    usuario_id: number;
    hora_min: number; //monstrar
    hora_max: number; //monstrar
}

export async function getAlertaConfByUsuario(id: number): Promise<ConfAlerta[]> {
    try {
        const [rows] = await executeQuery<ConfAlerta[] & RowDataPacket[]>(
            `SELECT ca.*, s.n_sala,h.id AS hospital_id, h.hospital
                FROM configuracion_alertas ca
                JOIN salas s ON ca.sala_id = s.id
                JOIN hospitales h ON s.hospital = h.id
                WHERE ca.usuario_id = ?;`, [id]
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener roles:", error);
        throw new Error("No se pudieron obtener los roles");
    }
}