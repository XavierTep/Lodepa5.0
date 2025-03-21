// app/dashboard/admin/usuario/[id]/page.tsx

import { getHospitalAll } from "@/actions/hospital/getHospital";
import { getRolAll } from "@/actions/usuario/getRol";
import EditarUsuario from "@/components/admin/usuario/formulario/EditarUsuario";



export default async function UsuarioPageCrear() {

    const hosp = await getHospitalAll();
    const rol = await getRolAll();
    const user =  {
        id: 0,
        apellido: "",
        email: "",
        nombre: "",
        telefono: "",
        password: "",
        rol: { id: 0, rol: "" },
        hospitales: [],
    }

    return (
        <EditarUsuario user={user} hospitales={hosp} roles={rol} />
    );
}
