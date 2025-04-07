// app/dashboard/admin/usuario/[id]/page.tsx

import { getHospitalAll } from "@/actions/hospital/getHospital";
import { getRolAll } from "@/actions/usuario/getRol";
import { getVerUsuariobyId } from "@/actions/usuario/getUsuario";
import EditarUsuario from "@/components/admin/usuario/formulario/EditarUsuario";
<<<<<<< HEAD
import Loading from "@/components/loading/Loading";
import { Suspense } from "react";
=======
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab

interface UsuarioPageProps {
  params: Promise<{ id: string }>;
}

export default async function UsuarioPage({ params }: UsuarioPageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  const [usuario] = await getVerUsuariobyId(userId);
  const hosp = await getHospitalAll();
  const rol = await getRolAll();

  return (
<<<<<<< HEAD
    <Suspense fallback={<Loading />}>
      <EditarUsuario user={usuario} hospitales={hosp} roles={rol} />
    </Suspense>
=======
      <EditarUsuario user={usuario} hospitales={hosp} roles={rol} />
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
  );
}
