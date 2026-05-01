import Sidebar from "@/shared/dashboard/sidebar/sidebar";
import { adminSidebar } from "@/features/admin/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role?.toLowerCase() !== "admin") {
    redirect("/student/diplomas");
  }

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