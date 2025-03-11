import { getDispositivo } from "@/actions/dispositivo/getDispositivo";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import Submenu from "@/components/dispositivo/SubMenu/SubMenu";
//import dynamic from "next/dynamic";

// Carga dinámica del componente Submenu para deshabilitar SSR
//const Submenu = dynamic(() => import('@/components/dispositivo/SubMenu/SubMenu'), { ssr: false });

export default async function DispositivoPage({ params }: any) {
  const { id } = params;
  const disp = await getDispositivo(id);
  console.log(disp);

  return (
  <div className="flex flex-col gap-4 w-full">
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <CircleArrowLeft className="size-8 text-blue-500" />
        </Link>
        <h1 className="text-md font-bold text-blue-500">{disp.n_hospital}</h1>
        <span>/</span>
        <h2 className="text-md text-gray-700">{disp.n_sala}</h2>
        {/* <h3 className="text-sm text-gray-800 font-semibold">{disp.n_dispositivo}</h3> */}
      </div>
      {/* Pasa el parámetro id al componente Submenu */}
    </div>
      <Submenu id={id} />
   </div>
  );
}
