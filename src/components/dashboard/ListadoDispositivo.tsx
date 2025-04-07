import CollapsibleTree from "./Collapsible"
import { getMeasurementRanges } from "@/actions/dispositivo/umbrales";
import { getSession } from "@/actions/auth/getSession";
import { getHospitalAll, getHospitalByUser } from "@/actions/hospital/getHospital";

const ListadoDispositivo = async () => {
  
  const userSession = await getSession()
  const { id,rol } = userSession  
  // const data = await getListado(id,rol);
  const rango = await getMeasurementRanges();
  let data;
  if(rol ===1){
    data = await getHospitalAll();
  }else{
    data = await getHospitalByUser(id);
  }

  return (
    <CollapsibleTree hospitals={data} rango={rango} id={id} rol={rol}/>
  )
}

export default ListadoDispositivo
