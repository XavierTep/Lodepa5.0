import CollapsibleTree from "./Collapsible"
import { getMeasurementRanges } from "@/actions/dispositivo/umbrales";
import { getSession } from "@/actions/auth/getSession";
<<<<<<< HEAD
import { getHospitalAll, getHospitalByUser } from "@/actions/hospital/getHospital";
=======
import { getListado } from "@/actions/hospital/getListado";
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab

const ListadoDispositivo = async () => {
  
  const userSession = await getSession()
  const { id,rol } = userSession  
<<<<<<< HEAD
  // const data = await getListado(id,rol);
  const rango = await getMeasurementRanges();
  let data;
  if(rol ===1){
    data = await getHospitalAll();
  }else{
    data = await getHospitalByUser(id);
  }

=======
  const data = await getListado(id,rol);
  const rango = await getMeasurementRanges();
  
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
  return (
    <CollapsibleTree hospitals={data} rango={rango} id={id} rol={rol}/>
  )
}

export default ListadoDispositivo
