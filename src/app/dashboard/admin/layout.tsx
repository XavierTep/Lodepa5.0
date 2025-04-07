import { getSession } from '@/actions/auth/getSession';
import AdminMenu from '@/components/admin/AdminMenu';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const userSession = await getSession();
<<<<<<< HEAD
  if (userSession.rol!==1) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-3 flex flex-col"> 
        <AdminMenu />
        {children}
=======
  if (!userSession) {
    redirect('/login');
  }


  return (
    <div className="container mx-auto px-4 py-3 flex flex-col"> 
        <AdminMenu />
        {children}      
>>>>>>> 915d3132da7852ad6e6eb1e6d35c2378aa245bab
    </div>
  );
}