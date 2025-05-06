// src/app/api/informe/[dispositivo]/[fechainicio]/[fechafin]/route.ts
import path from 'path';
import XlsxPopulate from 'xlsx-populate';
import { getRegistro, Registro } from '@/actions/dispositivo/informe/getRegistro';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: {
    params: {
      dispositivo: string;
      fechainicio: string;
      fechafin: string;
    };
  }
) {
  try {
    // 0) Espera a que context.params resuelva sus valores
    const { dispositivo: dispositivoStr, fechainicio, fechafin } = await context.params;
    const dispositivo = Number(dispositivoStr);

    // 1) Leer plantilla
    const templatePath = path.join(process.cwd(), 'templates', 'plantilla.xlsx');
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    // 2) Seleccionar hoja 'Informe'
    const sheet = workbook.sheet('Informe');
    if (!sheet) throw new Error('Hoja "Informe" no encontrada');

    // 3) Limpiar filas viejas
    const lastRow = sheet.usedRange().endCell().rowNumber();
    if (lastRow > 1) sheet.range(`A2:S${lastRow}`).clear();

    // 4) Consultar la BD con los parámetros dinámicos
    const registros: Registro[] = await getRegistro(dispositivo, fechainicio, fechafin);

    // 5) Poblar A–S
    registros.forEach((r, i) => {
      const row = i + 2;
      sheet.cell(`A${row}`).value(r.id);
      sheet.cell(`B${row}`).value(r.dispositivo);
      sheet.cell(`C${row}`).value(new Date(r.update_time));
      sheet.cell(`D${row}`).value(Number(r.co2));
      sheet.cell(`E${row}`).value(Number(r.covid19));
      sheet.cell(`F${row}`).value(Number(r.humidity));
      sheet.cell(`G${row}`).value(Number(r.iaq));
      sheet.cell(`H${row}`).value(Number(r.pm10));
      sheet.cell(`I${row}`).value(Number(r.pm25));
      sheet.cell(`J${row}`).value(Number(r.temperature));
      sheet.cell(`K${row}`).value(Number(r.vocs));
      sheet.cell(`L${row}`).value(Number(r.thermal_indicator));
      sheet.cell(`M${row}`).value(Number(r.ventilation_indicator));
      sheet.cell(`N${row}`).value(Number(r.co));
      sheet.cell(`O${row}`).value(Number(r.formaldehyde));
      sheet.cell(`P${row}`).value(Number(r.no2));
      sheet.cell(`Q${row}`).value(Number(r.o3));
      sheet.cell(`R${row}`).value(Number(r.pm1));
      sheet.cell(`S${row}`).value(Number(r.pm4));
    });

    // 6) Formato
    sheet.column('C').style('numberFormat', 'dd/mm/yyyy hh:mm');
    ['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S']
      .forEach(col => sheet.column(col).style('numberFormat', '0.00'));

    // 7) Generar buffer binario
    const buf: Buffer = await workbook.outputAsync();
    const uint8 = new Uint8Array(buf);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="informe_${dispositivo}_${fechainicio}_${fechafin}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error generando informe:', error);
    return NextResponse.json({ error: 'Error al generar informe' }, { status: 500 });
  }
}
