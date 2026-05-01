import { getExamsAction } from "@/features/student/exams/lib/actions/get-exams.action";
import { getDiplomasAction } from "@/features/student/diplomas/lib/actions/get-diplomas.action";
import { AdminPageHeader } from "@/features/admin/shared/components/admin-page-header";
import { AdminExamsFilters } from "@/features/admin/exams/components/admin-exams-filters";
import { AdminExamsTable } from "@/features/admin/exams/components/table/admin-exams-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; title?: string; diplomaId?: string; immutable?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const title = resolvedParams.title || undefined;
  const diplomaId = resolvedParams.diplomaId || undefined;
  const immutable = resolvedParams.immutable || undefined;
  const sortBy = resolvedParams.sortBy || undefined;
  const sortOrder = resolvedParams.sortOrder || undefined;
  const limit = 20;

  // Fetch Exams and Diplomas (for filters)
  let examsResponse;
  let diplomasResponse;
  
  try {
    // We pass undefined for sortBy if it's questionsCount to prevent backend 400 error
    // The table will handle questionsCount sorting locally
    const apiSortBy = sortBy === "questionsCount" ? undefined : sortBy;

    [examsResponse, diplomasResponse] = await Promise.all([
      getExamsAction(page, limit, title, diplomaId, immutable, apiSortBy, sortOrder),
      getDiplomasAction(1, 100)
    ]);
  } catch (error) {
    console.error("Failed to load admin exams data", error);
  }

  const exams = examsResponse?.payload?.data || [];
  const meta = examsResponse?.payload?.metadata || { page: 1, total: 0, totalPages: 1 };
  const diplomas = diplomasResponse?.payload?.data || [];

  return (
    <div className="space-y-6">
      <div className="text-gray-500 text-sm font-medium">Exams</div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <AdminPageHeader 
          total={meta.total} 
          page={meta.page} 
          totalPages={meta.totalPages} 
          actionButton={
            <Link href="/admin/exams/new" className="flex items-center gap-2 bg-[#00D084] hover:bg-emerald-500 text-white px-5 py-2.5 rounded-sm font-medium text-[15px] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Create New Exam
            </Link>
          }
        />
        
        <AdminExamsFilters diplomas={diplomas} />
        
        <AdminExamsTable exams={exams} />
      </div>
    </div>
  );
}
