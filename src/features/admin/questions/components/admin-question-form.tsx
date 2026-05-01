"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Exam } from "@/features/student/exams/types/exam.types";
import { Question } from "@/features/student/questions/types/question.types";
import {
  createQuestionAction,
  updateQuestionAction,
} from "../lib/actions/save-question.action";
import {
  questionSchema,
  QuestionFormValues,
} from "../lib/schemas/question.schema";
import { QuestionInfoFields } from "./form/question-info-fields";
import { QuestionAnswersFields } from "./form/question-answers-fields";

export function AdminQuestionForm({
  initialData,
  exams,
}: {
  initialData?: Question;
  exams: Exam[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          text: initialData.text,
          examId: initialData.examId,
          answers: initialData.answers.map((a) => ({
            text: a.text,
            isCorrect: !!a.isCorrect,
          })),
        }
      : {
          text: "",
          examId: "",
          answers: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
        },
  });

  const onSubmit = async (values: QuestionFormValues) => {
    setIsSubmitting(true);
    const res = (initialData && initialData.id)
      ? await updateQuestionAction(initialData.id, values)
      : await createQuestionAction(values);
    setIsSubmitting(false);
    if (res.success) {
      toast.success(`Question ${(initialData && initialData.id) ? "updated" : "created"} successfully`);
      router.push(`/admin/exams/${values.examId}`);
    } else toast.error(res.error || "An error occurred");
  };

  const onInvalid = (errors: any) => {
    console.log("--- VALIDATION ERRORS ---");
    console.log(errors);
    console.log("-------------------------");
    
    const findError = (obj: any): string | null => {
      if (!obj) return null;
      if (typeof obj === 'string') return obj;
      if (obj.message) return obj.message;
      if (obj.root?.message) return obj.root.message;
      
      if (typeof obj === 'object') {
        for (const key in obj) {
          const res = findError(obj[key]);
          if (res) return res;
        }
      }
      return null;
    };

    const errorMsg = findError(errors);
    toast.error(errorMsg || "Validation failed - Check Console (F12)");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 py-4 border-b border-gray-200 -mx-8 px-8 mb-6">
        <Link
          href={`/admin/questions/new?mode=bulk${initialData ? `&examId=${initialData.examId}` : ''}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-sm font-medium text-sm hover:bg-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" /> Bulk Add Mode
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-600 rounded-sm font-medium text-sm transition-colors"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#00D084] hover:bg-emerald-600 text-white rounded-sm font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save
              </>
            )}
          </button>
        </div>
      </div>
      <QuestionInfoFields form={form} exams={exams} />
      <QuestionAnswersFields form={form} />
    </form>
  );
}
