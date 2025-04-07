"use server";
import { executeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function crearActualizarAlerta(alerta: any) {
    const actualizar = alerta.id !== 0;
    try {
    // Crear o actualizar la sala
    if (actualizar) {
      // Actualizar la sala
        await executeQuery(
        `UPDATE configuracion_alertas 
                            SET sala_id = ?, hora_min = ?, hora_max=?
                            WHERE id = ?`,
        [alerta.sala_id, alerta.hora_min, alerta.hora_max, alerta.id]
        );
    } else {
      // Insertar la sala
      //   const [result]: any =
      await executeQuery(
        `INSERT INTO configuracion_alertas (sala_id, usuario_id, hora_min, hora_max) VALUES
	        (?, ?, ?, ?);`,
        [alerta.sala_id, alerta.usuario_id, alerta.hora_min, alerta.hora_max]
      );
    }
  } catch (error) {
    console.error("Error al actualizar alertas:", error);
    throw error;
  } 
  

  if (actualizar) {
    return "Se ha actualizado correctamente";
  } else {
    return "Se ha creado la Alerta ";
  }
}

// Actualizar Conf-Alerta en la base de datos
export async function updateCrearAlerta(formData: FormData) {
  try {
    // Obtener los datos del formulario
    const alerta: any = {
      id: Number(formData.get("id") ?? 0),
      usuario_id: Number(formData.get("usuario_id") ?? 0),
      hospital_id: Number(formData.get("hospital_id") ?? 0),
      sala_id: Number(formData.get("sala_id") ?? 0),
      hora_min: Number(formData.get("hora_min") ?? 0),
      hora_max: Number(formData.get("hora_max") ?? 0),
    };

    console.log(alerta)

    // Validar campos obligatorios
    if (!alerta.sala_id) {
      throw new Error("Faltan campos obligatorios");
    }

    const mensaje = await crearActualizarAlerta(alerta);

    // Revalidar la ruta para actualizar los datos en la UI
    revalidatePath(`/dashboard/alertas`);
    return {
      ok: 1,
      mensaje: mensaje,
    };
  } catch (error) {
    console.error("Error al actualizar alertas:", error);
    // En lugar de devolver un objeto de error, se relanza la excepción
    throw error;
  }
}
