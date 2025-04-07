// app/dashboard/admin/usuario/[id]/page.tsx

import { getHospitalAll } from "@/actions/hospital/getHospital";
import { getRolAll } from "@/actions/usuario/getRol";
import EditarUsuario from "@/components/admin/usuario/formulario/EditarUsuario";
<<<<<<< HEAD
import Loading from "@/components/loading/Loading";
import { Suspense } from "react";
=======
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab



export default async function UsuarioPageCrear() {

    const hosp = await getHospitalAll();
    const rol = await getRolAll();
<<<<<<< HEAD
    const user = {
=======
    const user =  {
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
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
<<<<<<< HEAD
        <Suspense fallback={<Loading />}>
            <EditarUsuario user={user} hospitales={hosp} roles={rol} />
        </Suspense>
=======
        <EditarUsuario user={user} hospitales={hosp} roles={rol} />
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
    );
}
