// app/dashboard/admin/usuario/[id]/page.tsx

import { getHospitalAll } from "@/actions/hospital/getHospital";
import { getRolAll } from "@/actions/usuario/getRol";
import { getVerUsuariobyId } from "@/actions/usuario/getUsuario";
import EditarUsuario from "@/components/admin/usuario/formulario/EditarUsuario";

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
      <EditarUsuario user={usuario} hospitales={hosp} roles={rol} />
  );
}
