// app/dashboard/admin/usuario/[id]/page.tsx

import Sala from "@/components/admin/sala/Sala";
<<<<<<< HEAD
import Loading from "@/components/loading/Loading";
import { Suspense } from "react";
=======
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab

interface UsuarioPageProps {
  params: Promise<{ id: string }>;
}

export default async function SalasPage({ params }: UsuarioPageProps) {
  const { id } = await params;
  const hospitalId = parseInt(id, 10);
  return (
<<<<<<< HEAD
    <Suspense fallback={<Loading />}>
      <Sala hospitalId={hospitalId} />
    </Suspense>
=======
    <Sala hospitalId={hospitalId} />
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
  );
}
