import { getExamByIdAction } from "@/features/student/exams/lib/actions/get-exam-by-id.action";
import { getQuestionsAction } from "@/features/student/questions/lib/actions/get-questions.action";
import { AdminViewHeader } from "@/features/admin/shared/components/admin-view-header";
import { AdminExamDetails } from "@/features/admin/exams/components/admin-exam-details";
import { AdminExamQuestions } from "@/features/admin/exams/components/admin-exam-questions";
import { Ban, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default async function AdminExamViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = extractIdFromSlug(rawId);

  const [examRes, questionsRes] = await Promise.all([
    getExamByIdAction(id),
    getQuestionsAction(id)
  ]);

  const exam = examRes?.payload?.exam;
  const questions = questionsRes?.payload?.questions || [];

  if (!exam) {
    return notFound();
  }

  return (
    <div className="pb-20">
      <AdminViewHeader 
        breadcrumbs={[
          { label: "Exams", href: "/admin/exams" },
          { label: exam.title }
        ]}
        title={exam.title}
        actions={
          <>
            {exam.immutable && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-sm font-medium text-sm border border-gray-200">
                <Ban className="w-4 h-4 text-gray-400" /> Immutable
              </div>
            )}
            <Link 
              href={`/admin/exams/${id}/edit`} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 transition-colors text-white rounded-sm font-medium text-sm shadow-sm"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button 
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-sm font-medium text-sm shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        }
      />
      
      <AdminExamDetails exam={exam} />
      
      <AdminExamQuestions 
        questions={questions} 
      />
    </div>
  );
}
