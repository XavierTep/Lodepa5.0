'use server';
import  { executeQuery } from '@/lib/db';

interface Dispositivo {
  id: number;
  n_dispositivo: string;
  referencia: string;
  id_sala: number;
  n_sala: string;
  id_hospital: number;
  n_hospital: string;
}

export const getDispositivo = async (id: string) => {
  const [rows]: any[] = await executeQuery(
    `SELECT d.id AS id_dispositivo, d.n_dispositivo,d.referencia,s.id AS id_sala,s.n_sala,h.id AS id_hospital,h.hospital AS n_hospital FROM dispositivos d 
      JOIN salas s ON d.sala = s.id 
      JOIN hospitales h ON s.hospital = h.id
      WHERE d.id = ?
    `,
    [id]
  );
  
  return rows[0] as Dispositivo;
};
