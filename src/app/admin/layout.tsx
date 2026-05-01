import Sidebar from "@/shared/dashboard/sidebar/sidebar";
import { adminSidebar } from "@/features/admin/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="flex min-h-screen">

      <Sidebar
        items={adminSidebar}
        variant="admin"
      />

      <main className="flex-1 p-8 bg-gray-100">

        {children}

      </main>

    </div>

  );
}