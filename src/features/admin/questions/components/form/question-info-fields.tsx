"use client";
import { UseFormReturn } from "react-hook-form";
import { Exam } from "@/features/student/exams/types/exam.types";
import { QuestionFormValues } from "../../lib/schemas/question.schema";

interface Props {
  form: UseFormReturn<QuestionFormValues>;
  exams: Exam[];
}

export function QuestionInfoFields({ form, exams }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-[#2B7FFF] text-white p-3 px-6 text-sm font-semibold tracking-wide">Question Information</div>
      <div className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[13px] text-gray-700 font-medium uppercase tracking-wide">Exam</label>
          <select {...register("examId")} className="w-full h-11 px-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] bg-white">
            <option value="">Select exam</option>
            {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
          </select>
          {errors.examId && <p className="text-red-500 text-xs">{errors.examId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] text-gray-700 font-medium uppercase tracking-wide">Question Headline</label>
          <textarea {...register("text")} placeholder="Enter question text" rows={3} className="w-full p-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] resize-none" />
          {errors.text && <p className="text-red-500 text-xs">{errors.text.message}</p>}
        </div>
      </div>
    </div>
  );
}
