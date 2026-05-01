import { getQuestionByIdAction } from "@/features/student/questions/lib/actions/get-question-by-id.action";
import { getExamsAction } from "@/features/student/exams/lib/actions/get-exams.action";
import { AdminQuestionForm } from "@/features/admin/questions/components/admin-question-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default async function AdminQuestionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = extractIdFromSlug(rawId);
  
  let question: any = null;
  let exams: any[] = [];

  try {
    const [questionRes, examsRes] = await Promise.allSettled([
      getQuestionByIdAction(id),
      getExamsAction(1, 50) 
    ]);
    
    if (questionRes.status === "fulfilled") {
      question = questionRes.value?.payload?.question;
    }
    if (examsRes.status === "fulfilled") {
      exams = examsRes.value?.payload?.data || [];
    }
  } catch (error) {
    console.error("Error loading question edit page:", error);
  }

  if (!question) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="text-blue-500">Edit Question</span>
      </div>

      <AdminQuestionForm initialData={question} exams={exams} />
    </div>
  );
}
