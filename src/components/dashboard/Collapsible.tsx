import { ChevronDown } from "lucide-react"
import { useState } from "react"
import BadgeList from "./BadgeList"

export default function CollapsibleTree({ hospitals }: any) {
  const [expandedHospitals, setExpandedHospitals] = useState<number[]>([])
  const [expandedRooms, setExpandedRooms] = useState<number[]>([])

  const toggleHospital = (hospitalId: number) => {
    setExpandedHospitals((prev) =>
      prev.includes(hospitalId) ? prev.filter((id) => id !== hospitalId) : [...prev, hospitalId],
    )
  }

  const toggleRoom = (roomId: number) => {
    setExpandedRooms((prev) => (prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]))
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
                  <button
                    onClick={() => toggleRoom(room.id)}
                    className="w-full flex items-center gap-2 p-2 text-md font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedRooms.includes(room.id) ? "rotate-0" : "-rotate-90"
                        }`}
                    />
                    {room.name}
                  </button>

                  {/* Devices Level */}
                  {expandedRooms.includes(room.id) && (
                    <BadgeList
                      data={
                        hospitals
                          .flatMap((hospital: any) => hospital.rooms) // Obtener todas las habitaciones
                          .find((r: any) => r.id === room.id)?.devices ?? [] // Encontrar la habitación y asegurar que devices siempre sea un array
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}

