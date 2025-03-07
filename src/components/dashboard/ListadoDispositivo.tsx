"use client"

import { useEffect, useState } from "react"
import CollapsibleTree from "./Collapsible"

const ListadoDispositivo = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/obtenerlistado")
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (error: any) {
        console.log(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Cargando dispositivos...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <CollapsibleTree hospitals={data} />
  )
}

export default ListadoDispositivo
