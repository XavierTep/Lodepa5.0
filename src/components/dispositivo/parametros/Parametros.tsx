"use client"
import { useEffect, useState, useRef } from "react"
import type React from "react"

import ProgressCircle from "./progress-circle"
import { getStatusBatch } from "@/actions/dispositivo/umbrales"

interface ParametrosProps {
  id?: string
}

interface Parametro {
  key: string
  valor: number
  unidad: string
  nombre: string
  color?: "success" | "warning" | "dangerous" | undefined
  info: string
}

// Datos iniciales de parámetros
const parametrosIniciales = [
  {
    key: "temperature",
    valor: 21.3,
    unidad: "°C",
    nombre: "Temperatura",
    info: "Temperatura ambiente en grados Celsius",
  },
  { key: "humidity", valor: 52, unidad: "%", nombre: "Humedad", info: "Porcentaje de humedad relativa en el aire" },
  {
    key: "co2",
    valor: 803,
    unidad: "ppm",
    nombre: "CO₂",
    
    info: "Concentración de dióxido de carbono en partes por millón",
  },
  {
    key: "formaldehyde",
    valor: 50,
    unidad: "ppb",
    nombre: "Formaldehído",
    info: "Concentración de formaldehído en partes por millón",
  },
  {
    key: "vocs",
    valor: 104,
    unidad: "ppm",
    nombre: "TVOC",
    info: "Índice de compuestos orgánicos volátiles totales",
  },
  {
    key: "pm1",
    valor: 2,
    unidad: "μg/m³",
    nombre: "PM1.0",
    info: "Partículas en suspensión con diámetro menor a 1.0 micrómetros",
  },
  {
    key: "pm25",
    valor: 2,
    unidad: "μg/m³",
    nombre: "PM2.5",
    info: "Partículas en suspensión con diámetro menor a 2.5 micrómetros",
  },
  {
    key: "pm4",
    valor: 2,
    unidad: "μg/m³",
    nombre: "PM4.0",
    info: "Partículas en suspensión con diámetro menor a 4.0 micrómetros",
  },
  {
    key: "pm10",
    valor: 2,
    unidad: "μg/m³",
    nombre: "PM10",
    info: "Partículas en suspensión con diámetro menor a 10 micrómetros",
  },
  { key: "co", valor: 0, unidad: "ppm", nombre: "CO", info: "Concentración de ozono en partes por billón" },
  {
    key: "no2",
    valor: 0,
    unidad: "ppm",
    nombre: "NO₂",
    info: "Concentración de dióxido de nitrógeno en partes por billón",
  },
  { key: "o3", valor: 0, unidad: "ppm", nombre: "O₃", info: "Concentración de ozono en partes por billón" },
]

const Parametros: React.FC<ParametrosProps> = ({ id }) => {
  const [parametros, setParametros] = useState<Parametro[]>(parametrosIniciales)
  const [loading, setLoading] = useState(true)
  const [updateTime, setUpdateTime] = useState<string | null>(null)
  const isFirstRender = useRef(true)

  // Función para mapear colores hexadecimales a clases de color
  const hexToColorClass = (hexColor: string): "success" | "warning" | "dangerous" => {
    switch (hexColor) {
      case "#22c55e":
        return "success" // Verde
      case "#eab308":
        return "warning" // Amarillo
      default:
        return "dangerous" // Rojo u otros
    }
  }

  useEffect(() => {
    // Si no hay ID o no es la primera renderización, salir
    if (!id || !isFirstRender.current) return

    // Marcar que ya no es la primera renderización
    isFirstRender.current = false

    const fetchParametros = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/registro/get/${id}/last`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) throw new Error("Error en la respuesta del servidor")

        const data = await response.json()
        console.log({ data })

        // Tomar el último registro del array
        const ultimoRegistro = data.at(-1) // Equivalente a data[data.length - 1]

        // Convertir updateTime en formato de fecha legible
        if (ultimoRegistro.updateTime && Array.isArray(ultimoRegistro.updateTime)) {
          const [year, month, day, hours, minutes, seconds] = ultimoRegistro.updateTime
          setUpdateTime(new Date(year, month - 1, day, hours, minutes, seconds).toLocaleString())
        }

        // Crear una copia de los parámetros iniciales para trabajar con ellos
        const nuevosParametros = parametrosIniciales.map((parametro) => {
          // Se obtiene el nuevo valor o se conserva el valor inicial si no existe en el último registro
          let nuevoValor = ultimoRegistro[parametro.key] ?? parametro.valor
          let nuevaUnidad = parametro.unidad

          if (
            parametro.key === "formaldehyde" ||
            parametro.key === "co" ||
            parametro.key === "o3" ||
            parametro.key === "no2"
          ) {
            nuevoValor = nuevoValor
            nuevaUnidad = "ppm"
          }

          return {
            ...parametro,
            valor: nuevoValor,
            unidad: nuevaUnidad,
          }
        })

        // Preparar datos para obtener los colores
        const parametrosParaUmbrales = nuevosParametros.map((p) => ({
          parametro: p.key,
          valor: p.valor,
        }))

        // Obtener colores usando la acción del servidor
        const colores = await getStatusBatch(parametrosParaUmbrales)

        // Aplicar los colores a los parámetros
        const nuevosParametrosConColor = nuevosParametros.map((parametro) => ({
          ...parametro,
          color: hexToColorClass(colores[parametro.key]),
        }))

        setParametros(nuevosParametrosConColor)
      } catch (error) {
        console.error("Error obteniendo los parámetros:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParametros()
  }, [id]) // Solo depende de id

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Parámetros Ambientales</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {parametros.map((parametro, index) => (
              <ProgressCircle
                key={index}
                valor={parametro.valor}
                unidad={parametro.unidad}
                nombre={parametro.nombre}
                color={parametro.color}
                info={parametro.info}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <span className="text-sm text-gray-500">
            Última actualización: {updateTime ? updateTime : "No disponible"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Parametros

