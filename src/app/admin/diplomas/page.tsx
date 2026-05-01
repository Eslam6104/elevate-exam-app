import { getDiplomasAction } from "@/features/student/diplomas/lib/actions/get-diplomas.action";
import { AdminPageHeader } from "@/features/admin/shared/components/admin-page-header";
import { AdminDiplomasFilters } from "@/features/admin/diplomas/components/admin-diplomas-filters";
import { AdminDiplomasTable } from "@/features/admin/diplomas/components/table/admin-diplomas-table";
import { Plus } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function AdminDiplomasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; title?: string; immutable?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const title = resolvedParams.title || undefined;
  const immutable = resolvedParams.immutable || undefined;
  const sortBy = resolvedParams.sortBy || undefined;
  const sortOrder = resolvedParams.sortOrder || undefined;
  const limit = 50;
  let response;
  try {
    response = await getDiplomasAction(page, limit, title, immutable, sortBy, sortOrder);
  } catch (error) {
    console.error("Failed to load admin diplomas", error);
  }

  const diplomas = response?.payload?.data || [];
  console.log("SERVER CONSOLE - DIPLOMAS ARRAY:", diplomas.length, "items loaded");
  
  const meta = response?.payload?.metadata || { page: 1, total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="text-gray-500 text-sm">Diplomas</div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <AdminPageHeader 
          total={meta.total} 
          page={meta.page} 
          totalPages={meta.totalPages} 
          actionButton={
            <Link href="/admin/diplomas/new" className="flex items-center gap-2 bg-[#00D084] hover:bg-emerald-500 text-white px-5 py-2.5 rounded-sm font-medium text-[15px] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add New Diploma
            </Link>
          }
        />
        <AdminDiplomasFilters />
        <AdminDiplomasTable diplomas={diplomas} />
      </div>
    </div>
  );
}
