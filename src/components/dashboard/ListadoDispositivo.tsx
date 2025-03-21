import CollapsibleTree from "./Collapsible"
import { getMeasurementRanges } from "@/actions/dispositivo/umbrales";
import { getSession } from "@/actions/auth/getSession";
import { getListado } from "@/actions/hospital/getListado";

const ListadoDispositivo = async () => {
  
  const userSession = await getSession()
  const { id,rol } = userSession  
  const data = await getListado(id,rol);
  const rango = await getMeasurementRanges();
  
  return (
    <CollapsibleTree hospitals={data} rango={rango}/>
  )
}

export default ListadoDispositivo
