"use client";
import { getExamByIdAction } from "@/features/student/exams/lib/actions/get-exam-by-id.action";
import { getQuestionsAction } from "@/features/student/questions/lib/actions/get-questions.action";
import { AdminViewHeader } from "@/features/admin/shared/components/admin-view-header";
import { AdminExamDetails } from "@/features/admin/exams/components/admin-exam-details";
import { AdminExamQuestions } from "@/features/admin/exams/components/admin-exam-questions";
import { Ban, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Exam } from "@/features/student/exams/types/exam.types";
import { Question } from "@/features/student/questions/types/question.types";
import { toast } from "sonner";

import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default function AdminExamViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = extractIdFromSlug(rawId);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getExamByIdAction(id),
      getQuestionsAction(id)
    ]).then(([examRes, questionsRes]) => {
      if (examRes?.payload?.exam) {
        setExam(examRes.payload.exam);
      }
      setQuestions(questionsRes?.payload?.questions || []);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Loading...</div>;
  }

  if (!exam) {
    return notFound();
  }

  const handleDelete = () => {
    toast("Are you sure you want to delete this exam?", {
      action: {
        label: "Delete",
        onClick: async () => {
          // TODO: Implement delete exam action when available
          toast.info("Delete action not implemented on backend yet");
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
              onClick={handleDelete}
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
        onDelete={(id) => setQuestions(prev => prev.filter(q => q.id !== id))} 
      />
    </div>
  );
}
