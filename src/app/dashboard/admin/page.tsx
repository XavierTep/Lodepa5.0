import { getSession } from "@/actions/auth/getSession";
import { redirect } from "next/navigation";

export default async function AdminPage() {

  const userSession = await getSession()
  const { rol } = userSession

  if (rol !== 1) {
    redirect('/dashboard')
  }


  return (
    <div>
      <h1>Hello AdminPage</h1>
    </div>
  );
}