"use client";
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import BadgeList from "./BadgeList"

export default function CollapsibleTree({ hospitals,rango }: {hospitals:any;rango:any}) {
  const [expandedHospitals, setExpandedHospitals] = useState<number[]>([])

  const toggleHospital = (hospitalId: number) => {
    setExpandedHospitals((prev) =>
      prev.includes(hospitalId) ? prev.filter((id) => id !== hospitalId) : [...prev, hospitalId],
    )
  }

  return (
    <>
      {hospitals.map((hospital: any) => (
        <div key={hospital.id} className="mb-2">
          {/* Hospital Level */}
          <button
            onClick={() => toggleHospital(hospital.id)}
            className="w-full flex items-center gap-2 p-3 text-lg font-semibold text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${expandedHospitals.includes(hospital.id) ? "rotate-0" : "-rotate-90"
                }`}
            />
            {hospital.name}
          </button>

          {/* Rooms Level */}
          {expandedHospitals.includes(hospital.id) && (
            <div className="ml-6">
              {hospital.rooms.map((room: any) => (
                <div key={room.id} className="mb-2">
                  {/* Devices Level */}
                    <BadgeList
                      data={
                        hospitals
                          .flatMap((hospital: any) => hospital.rooms) // Obtener todas las habitaciones
                          .find((r: any) => r.id === room.id)?.devices ?? [] // Encontrar la habitación y asegurar que devices siempre sea un array
                      }
                      n_sala={room.name}
                      rango={rango}
                    />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}

