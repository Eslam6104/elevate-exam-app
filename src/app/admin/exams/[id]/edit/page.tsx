import { getExamByIdAction } from "@/features/student/exams/lib/actions/get-exam-by-id.action";
import { getDiplomasAction } from "@/features/student/diplomas/lib/actions/get-diplomas.action";
import { AdminExamForm } from "@/features/admin/exams/components/admin-exam-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminExamEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [examRes, diplomasRes] = await Promise.all([
    getExamByIdAction(id),
    getDiplomasAction()
  ]);

  if (!examRes?.payload?.exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">{examRes.payload.exam.title}</span>
        <span className="text-gray-300">/</span>
        <span className="text-blue-500">Edit</span>
      </div>
      
      <AdminExamForm initialData={examRes.payload.exam} diplomas={diplomasRes?.payload?.data || []} />
    </div>
  );
}
