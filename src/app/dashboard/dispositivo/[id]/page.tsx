
import { getDispositivo } from "@/actions/dispositivo/getDispositivo"
import { CircleArrowLeft } from "lucide-react"
import Link from "next/link"



export default async function DispositivoPage({ params }: any) {
  const { id } = params

  const disp = await getDispositivo(id)
  return (

    <div className="flex items-center justify-center gap-2">
      <Link href="/dashboard">
        <CircleArrowLeft className="size-8 text-blue-500" />
      </Link>
      <h1 className="text-md font-bold text-blue-500">{disp.n_hospital}</h1>
      <h2 className="text-md text-gray-700 ">{disp.n_sala}</h2>
      <h3 className="text-sm text-gray-800  font-semibold">
        {disp.n_dispositivo}
      </h3>
    </div>

  )
}
