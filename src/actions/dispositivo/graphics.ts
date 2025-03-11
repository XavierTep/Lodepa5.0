"use server"

import db from "@/lib/db"

// Definición de tipos para los parámetros y respuesta
export type ParameterType =
  | "temperature"
  | "humidity"
  | "co2"
  | "formaldehyde"
  | "vocs"
  | "pm1"
  | "pm25"
  | "pm4"
  | "pm10"
  | "co"
  | "o3"
  | "no2"
  | "iaq"
  | "thermal_indicator"
  | "ventilation_indicator"
  | "covid19"

export type TimeRange = "24h" | "1w" | "2w" | "1m"

export type DataPoint = {
  timestamp: string
  value: number
}

export type GraphicsResponse = {
  data: DataPoint[]
  min: number
  max: number
  med: number
  parameter: string
  unit: string
  startDate: string
  endDate: string
}

// Función para obtener las unidades según el parámetro
const getUnitByParameter = (parameter: ParameterType): string => {
  const units: Record<ParameterType, string> = {
    temperature: "°C",
    humidity: "%",
    co2: "ppm",
    formaldehyde: "ppb",
    vocs: "INDEX",
    pm1: "μg/m³",
    pm25: "μg/m³",
    pm4: "μg/m³",
    pm10: "μg/m³",
    co: "ppm",
    o3: "ppb",
    no2: "ppb",
    iaq: "",
    thermal_indicator: "",
    ventilation_indicator: "",
    covid19: "",
  }
  return units[parameter]
}

// Función para obtener el nombre formateado del parámetro
const getParameterName = (parameter: ParameterType): string => {
  const names: Record<ParameterType, string> = {
    temperature: "Temperatura",
    humidity: "Humedad",
    co2: "CO₂",
    formaldehyde: "Formaldehído",
    vocs: "TVOC",
    pm1: "PM1.0",
    pm25: "PM2.5",
    pm4: "PM4.0",
    pm10: "PM10",
    co: "CO",
    o3: "O₃",
    no2: "NO₂",
    iaq: "IAQ",
    thermal_indicator: "Indicador Térmico",
    ventilation_indicator: "Indicador de Ventilación",
    covid19: "COVID-19",
  }
  return names[parameter]
}

// Función para calcular la fecha de inicio según el rango de tiempo
const getStartDateByTimeRange = (endDate: Date, timeRange: TimeRange): Date => {
  const startDate = new Date(endDate)

  switch (timeRange) {
    case "24h":
      startDate.setDate(startDate.getDate() - 1)
      break
    case "1w":
      startDate.setDate(startDate.getDate() - 7)
      break
    case "2w":
      startDate.setDate(startDate.getDate() - 14)
      break
    case "1m":
      startDate.setMonth(startDate.getMonth() - 1)
      break
  }

  return startDate
}

// Función principal para obtener los datos de la gráfica
export async function getGraphicsData(
  deviceId: string,
  parameter: ParameterType,
  timeRange: TimeRange,
  customStartDate?: string,
  customEndDate?: string,
): Promise<GraphicsResponse> {
  try {
    // Determinar fechas de inicio y fin
    const endDate = customEndDate ? new Date(customEndDate) : new Date()
    const startDate = customStartDate ? new Date(customStartDate) : getStartDateByTimeRange(endDate, timeRange)

    // Formatear fechas para la consulta SQL
    const startDateStr = startDate.toISOString().slice(0, 19).replace("T", " ")
    const endDateStr = endDate.toISOString().slice(0, 19).replace("T", " ")

    // Consulta a la base de datos utilizando la estructura de la tabla "registros"
    const result = await db.query(
      `
      SELECT 
        update_time as timestamp, 
        ${parameter} as value
      FROM 
        registros
      WHERE 
        dispositivo = ?
        AND update_time BETWEEN ? AND ?
      ORDER BY 
        update_time ASC
    `,
      [deviceId, startDateStr, endDateStr],
    )

    // Transformar los resultados de la consulta
    const data = result.map((row: any) => ({
      timestamp: new Date(row.timestamp).toISOString(),
      value: Number.parseFloat(row.value),
    }))

    // Si no hay datos, devolver un error
    if (data.length === 0) {
      throw new Error("No se encontraron datos para los parámetros especificados")
    }

    // Calcular valores estadísticos
    const values = data.map((point) => point.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const med = values.reduce((sum, val) => sum + val, 0) / values.length

    return {
      data,
      min: Number.parseFloat(min.toFixed(1)),
      max: Number.parseFloat(max.toFixed(1)),
      med: Number.parseFloat(med.toFixed(1)),
      parameter: getParameterName(parameter),
      unit: getUnitByParameter(parameter),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }
  } catch (error) {
    console.error("Error al obtener datos de la gráfica:", error)
    throw new Error("No se pudieron obtener los datos de la gráfica")
  }
}

