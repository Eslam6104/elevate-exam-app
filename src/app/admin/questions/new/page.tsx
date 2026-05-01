import { getExamsAction } from "@/features/student/exams/lib/actions/get-exams.action";
import { AdminQuestionForm } from "@/features/admin/questions/components/admin-question-form";
import { AdminBulkQuestionForm } from "@/features/admin/questions/components/admin-bulk-question-form";

export const dynamic = "force-dynamic";

export default async function AdminQuestionNewPage({ searchParams }: { searchParams: Promise<{ examId?: string; mode?: string }> }) {
  const resolvedParams = await searchParams;
  const preSelectedExamId = resolvedParams.examId;
  const isBulk = resolvedParams.mode === "bulk";
  
  let exams: any[] = [];

  try {
    const examsRes = await getExamsAction(1, 50);
    exams = examsRes?.payload?.data || [];
  } catch (error) {
    console.error("Error loading question new page:", error);
  }

  if (isBulk) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Exams</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-500">Bulk Create Questions</span>
        </div>
        <AdminBulkQuestionForm exams={exams} initialExamId={preSelectedExamId} />
      </div>
    );
  }

  const initialData = preSelectedExamId ? { 
    examId: preSelectedExamId,
    text: "",
    answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false }
    ]
  } as any : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="text-blue-500">Create New Question</span>
      </div>

      <AdminQuestionForm exams={exams} initialData={initialData} />
    </div>
  );
}
