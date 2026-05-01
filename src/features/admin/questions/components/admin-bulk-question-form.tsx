"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Save, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Exam } from "@/features/student/exams/types/exam.types";
import { bulkCreateQuestionsAction } from "../lib/actions/bulk-create-questions.action";
import { bulkQuestionSchema, BulkQuestionValues } from "../lib/schemas/bulk-question.schema";
import { BulkQuestionTabs } from "./form/bulk-question-tabs";
import { slugify, encodeId } from "@/shared/lib/utils/slug";

export function AdminBulkQuestionForm({ exams, initialExamId }: { exams: Exam[]; initialExamId?: string }) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BulkQuestionValues>({
    resolver: zodResolver(bulkQuestionSchema),
    defaultValues: { examId: initialExamId || "", questions: [{ text: "", answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }] }
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questions" });

  const onSubmit = async (values: BulkQuestionValues) => {
    setIsSubmitting(true);
    const res = await bulkCreateQuestionsAction(values.examId, values.questions);
    setIsSubmitting(false);
    if (res.success) {
      toast.success(`${values.questions.length} questions created successfully`);
      
      // Find the exam to get its title for the slug
      const exam = exams.find(e => e.id === values.examId);
      const slug = exam ? `${slugify(exam.title)}--${encodeId(exam.id)}` : values.examId;
      
      router.push(`/admin/exams/${slug}`);
    } else toast.error(res.error || "An error occurred");
  };

  const onInvalid = (errors: any) => {
    console.error("Bulk Validation Errors:", errors);
    const findError = (obj: any): string | null => {
      if (obj?.message) return obj.message;
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          const msg = findError(obj[key]);
          if (msg) return msg;
        }
      }
      return null;
    };
    const errorMsg = findError(errors);
    toast.error(errorMsg || "Validation failed");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 py-4 border-b border-gray-200 -mx-8 px-8 mb-6">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-[#2B7FFF] text-white rounded-sm font-medium text-sm transition-colors"><Plus className="w-4 h-4 inline mr-2" /> Single Add Mode</button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-sm text-sm"><X className="w-4 h-4 inline mr-2" /> Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[#00D084] text-white rounded-sm text-sm font-bold shadow-sm">{isSubmitting ? "Saving..." : <><Save className="w-4 h-4 inline mr-2" /> Save</>}</button>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 space-y-4">
        <label className="text-[13px] text-gray-700 font-bold uppercase">Exam</label>
        <select {...form.register("examId")} className="w-full h-11 px-4 border border-gray-200 rounded-sm text-sm bg-white outline-none focus:border-[#2B7FFF]">
          <option value="">Select exam</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#2B7FFF] text-white p-3 px-6 text-sm font-semibold uppercase">Questions</div>
        <BulkQuestionTabs count={fields.length} activeId={activeIdx} onSelect={setActiveIdx} onAdd={() => { append({ text: "", answers: [{ text: "", isCorrect: true }] }); setActiveIdx(fields.length); }} onRemove={(i) => { remove(i); if (activeIdx >= i && activeIdx > 0) setActiveIdx(activeIdx - 1); }} />
        
        <div className="p-8 space-y-8" key={activeIdx}>
          {/* Question Headline */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#2B7FFF] text-white p-3 px-6 text-sm font-semibold tracking-wide">Question Information</div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-700 font-medium uppercase tracking-wide">Question Headline</label>
                <textarea {...form.register(`questions.${activeIdx}.text`)} placeholder="Enter question text" rows={3} className="w-full p-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] resize-none" />
                {(form.formState.errors.questions as any)?.[activeIdx]?.text && <p className="text-red-500 text-xs">{(form.formState.errors.questions as any)?.[activeIdx]?.text.message}</p>}
              </div>
            </div>
          </div>

          {/* Question Answers */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#2B7FFF] text-white p-3 px-6 flex justify-between items-center text-sm font-semibold tracking-wide">
              Question Answers
            </div>
            <div className="bg-gray-50 border-b border-gray-100 py-3 px-6 flex justify-between items-center text-[11px] font-bold uppercase text-gray-400">
              <div className="flex-1 pl-12">Body</div>
              <button 
                type="button" 
                onClick={() => {
                  const currentAnswers = form.getValues(`questions.${activeIdx}.answers`) || [];
                  form.setValue(`questions.${activeIdx}.answers`, [...currentAnswers, { text: "", isCorrect: false }]);
                }}
                className="bg-[#00D084] text-white px-4 py-2 rounded-sm text-xs flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Answer
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {(useWatch({ control: form.control, name: `questions.${activeIdx}.answers` }) || []).map((ans: any, ansIdx: number) => {
                const isCorrect = !!ans.isCorrect;
                return (
                  <div key={ansIdx} className="p-4 px-6 flex items-center gap-4 hover:bg-gray-50/50">
                    <button 
                      type="button" 
                      onClick={() => {
                        const current = form.getValues(`questions.${activeIdx}.answers`);
                        form.setValue(`questions.${activeIdx}.answers`, current.filter((_: any, i: number) => i !== ansIdx));
                      }} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input {...form.register(`questions.${activeIdx}.answers.${ansIdx}.text`)} className="w-full bg-transparent outline-none text-[14px] text-gray-700" placeholder="Answer body" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const current = form.getValues(`questions.${activeIdx}.answers`);
                        current.forEach((_: any, i: number) => form.setValue(`questions.${activeIdx}.answers.${i}.isCorrect`, i === ansIdx));
                      }} 
                      className={`flex items-center gap-2 px-5 py-2 rounded-sm text-xs font-bold transition-colors ${isCorrect ? 'text-[#00D084]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Correct Answer</> : <><CheckCircle2 className="w-4 h-4 text-gray-300" /> Mark Correct</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
