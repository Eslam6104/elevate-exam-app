"use client";
import { getQuestionByIdAction } from "@/features/student/questions/lib/actions/get-question-by-id.action";
import { deleteQuestionAction } from "@/features/admin/questions/lib/actions/delete-question.action";
import { AdminViewHeader } from "@/features/admin/shared/components/admin-view-header";
import { AdminQuestionDetails } from "@/features/admin/questions/components/admin-question-details";
import { Ban, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Question } from "@/features/student/questions/types/question.types";
import { toast } from "sonner";

import { extractIdFromSlug, slugify, encodeId } from "@/shared/lib/utils/slug";

export default function AdminQuestionViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = extractIdFromSlug(rawId);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuestionByIdAction(id).then(res => {
      if (res?.payload?.question) {
        setQuestion(res.payload.question);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Loading...</div>;
  }

  if (!question) {
    return notFound();
  }

  const examSlug = `${slugify(question.exam?.title || "Exam")}--${encodeId(question.examId)}`;

  const handleDelete = () => {
    toast("Are you sure you want to delete this question?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const res = await deleteQuestionAction(id, question.examId);
          if (res.status) {
            toast.success("Question deleted successfully");
            router.push(`/admin/exams/${examSlug}`);
          } else {
            toast.error(res.error || "Failed to delete question");
          }
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };

  return (
    <div className="pb-20">
      <AdminViewHeader 
        breadcrumbs={[
          { label: "Exams", href: "/admin/exams" },
          { label: question.exam?.title || "Exam", href: `/admin/exams/${examSlug}` },
          { label: "Questions", href: `/admin/exams/${examSlug}` },
          { label: question.text }
        ]}
        title={question.text}
        actions={
          <>
            {question.immutable && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-sm font-medium text-sm border border-gray-200">
                <Ban className="w-4 h-4 text-gray-400" /> Immutable
              </div>
            )}
            <Link 
              href={`/admin/questions/${id}/edit`} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 transition-colors text-white rounded-sm font-medium text-sm shadow-sm"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-sm font-medium text-sm shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        }
      />
      
      <AdminQuestionDetails question={question} />
    </div>
  );
}
