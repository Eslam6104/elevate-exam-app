import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/shared/dashboard/sidebar/sidebar";
import { studentSidebar } from "@/features/student/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={studentSidebar as any}
        variant="student"
      />
      <main className="p-8 flex-1">
        {children}
      </main>
    </div>
  );
}