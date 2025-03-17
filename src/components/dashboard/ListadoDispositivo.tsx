import { getListado } from "@/actions/hospital/getListado"
import CollapsibleTree from "./Collapsible"
import { getMeasurementRanges } from "@/actions/dispositivo/umbrales";

const ListadoDispositivo = async () => {
  const data = await getListado();
  const rango = await getMeasurementRanges();
  return (
    <CollapsibleTree hospitals={data} rango={rango}/>
  )
}

export default ListadoDispositivo
