import { getHospitalAllyNumeroSalas } from "@/actions/hospital/getHospital";
import Hospital from "@/components/admin/hospital/Hospital";
<<<<<<< HEAD
import Loading from "@/components/loading/Loading";
import { Suspense } from "react";
=======
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab

export default async function GestionHospitalPage() {
  const hospitales = await getHospitalAllyNumeroSalas();
  return (
<<<<<<< HEAD
    <Suspense fallback={<Loading />}>
      <Hospital hospitales={hospitales} />
    </Suspense>
=======
    <Hospital hospitales={hospitales}/>
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
  );
}