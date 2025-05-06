'use server';
import  { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export interface Registro extends RowDataPacket{
    id: number;
    dispositivo: number;
    update_time: Date;
    co2: number;
    covid19: number;
    humidity: number;
    iaq: number;
    pm10: number;
    pm25: number;
    temperature: number;
    vocs: number;
    thermal_indicator: number;
    ventilation_indicator: number;
    co: number;
    formaldehyde: number;
    no2: number;
    o3: number;
    pm1: number;
    pm4: number;
}

export async function getRegistro(dispositivo: number, fechaInicio:string, fechaFin:string): Promise<Registro[]>  {
    try {
        const [rows] = await executeQuery<Registro[] & RowDataPacket[]>(
            `SELECT * FROM registros WHERE dispositivo =? AND update_time BETWEEN? AND?`,
            [dispositivo, fechaInicio, fechaFin]
        );
        
        return rows;
    }
    catch (error) {
        console.error("Error al obtener registros:", error);
        throw new Error("No se pudieron obtener los registros");
    }
}