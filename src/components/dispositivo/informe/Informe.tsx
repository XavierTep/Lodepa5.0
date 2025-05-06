"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Download, Loader2 } from "lucide-react"

interface InformeProps {
  id: string
}

const Informe: React.FC<InformeProps> = ({ id }) => {
  const [loading, setLoading] = useState(false)

  // Fecha de hoy en "YYYY-MM-DD"
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Fecha de mañana: clona 'today' y suma 1 día
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Parámetros dinámicos
  const dispositivo = Number(id)
  const [inicio, setInicio] = useState<string>(todayStr)
  const [fin, setFin] = useState<string>(tomorrowStr)

  const generateReport = async () => {
    setLoading(true)
    try {
      // Construye la ruta dinámica con las fechas del formulario
      const url = `/api/informe/${dispositivo}/${inicio}/${fin}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Error al generar el informe")
      }

      const blob = await response.blob()

      // Crear URL para descarga
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `informe_${dispositivo}_${inicio}_${fin}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generar Informe</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            generateReport()
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha inicio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fecha-inicio"
                  type="date"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha fin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fecha-fin"
                  type="date"
                  value={fin}
                  onChange={(e) => setFin(e.target.value)}
                  required
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generando informe...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generar informe
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* <p className="text-sm text-gray-500 mt-6">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default Informe
