"use client";
import { Plus } from "lucide-react";
import { Question } from "@/features/student/questions/types/question.types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteQuestionAction } from "@/features/admin/questions/lib/actions/delete-question.action";
import { AdminExamQuestionsTable } from "./admin-exam-questions-table";
import { slugify, encodeId } from "@/shared/lib/utils/slug";

interface Props {
  questions: Question[];
  onDelete?: (id: string) => void;
}

export function AdminExamQuestions({ questions, onDelete }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getQuestionSlug = (q: Question) => `${slugify(q.text.substring(0, 50))}--${encodeId(q.id)}`;

  const handleDelete = (id: string, examId: string) => {
    toast("Are you sure you want to delete this question?", {
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteQuestionAction(id, examId);
            if (res.status) {
              toast.success("Question deleted successfully");
              onDelete?.(id);
              router.refresh();
            } else toast.error(res.error || "Failed to delete question");
          });
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 mt-8">
      <div className="bg-[#2B7FFF] text-white p-4 px-6 flex justify-between items-center">
        <h3 className="text-base font-semibold tracking-wide">Exam Questions</h3>
        <Link 
          href={`/admin/questions/new?examId=${questions[0]?.examId || ''}`}
          className="flex items-center gap-2 text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Questions
        </Link>
      </div>

      <AdminExamQuestionsTable 
        questions={questions}
        onView={(q) => router.push(`/admin/questions/${getQuestionSlug(q)}`)}
        onEdit={(q) => router.push(`/admin/questions/${getQuestionSlug(q)}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
