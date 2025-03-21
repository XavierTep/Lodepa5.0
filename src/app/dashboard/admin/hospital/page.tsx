import { getHospitalAllyNumeroSalas } from "@/actions/hospital/getHospital";
import Hospital from "@/components/admin/hospital/Hospital";

export default async function GestionHospitalPage() {
  const hospitales = await getHospitalAllyNumeroSalas();
  return (
    <Hospital hospitales={hospitales}/>
  );
}