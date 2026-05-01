import { getDiplomasAction } from "@/features/student/diplomas/lib/actions/get-diplomas.action";
import { AdminExamForm } from "@/features/admin/exams/components/admin-exam-form";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";

export const dynamic = "force-dynamic";

export default async function AdminExamNewPage() {
  let diplomas: Diploma[] = [];
  try {
    const res = await getDiplomasAction();
    diplomas = res?.payload?.data || [];
  } catch (error) {
    console.error("Error fetching diplomas:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="text-blue-500">Create New Exam</span>
      </div>
      
      <AdminExamForm diplomas={diplomas} />
    </div>
  );
}
