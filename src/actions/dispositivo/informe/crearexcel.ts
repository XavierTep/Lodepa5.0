import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { getRegistro } from "./getRegistro";

export async function crearexcel() {
    try {
      
    
  // Crear un nuevo libro
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Informe');

  // Agregar datos
  const datos = await getRegistro(9, "2025-04-23", "2025-04-24")

  datos.forEach((fila) => worksheet.addRow(fila));

  // Guardar archivo
  await workbook.xlsx.writeFile('informe.xlsx');
  console.log('Archivo informe.xlsx creado.');
    } catch (error) {    
        console.error("Error al generar informe:", error);
        throw new Error("No se pudieron generar el informe");
    }
}

