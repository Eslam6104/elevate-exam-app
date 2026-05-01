"use client";
import { useState } from "react";
import { useFieldArray, useWatch, UseFormReturn } from "react-hook-form";
import { Trash2, Plus, CheckCircle2, X } from "lucide-react";
import { QuestionFormValues } from "../../lib/schemas/question.schema";

interface Props {
  form: UseFormReturn<QuestionFormValues>;
}

export function QuestionAnswersFields({ form }: Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "answers" });
  const [newAnswerText, setNewAnswerText] = useState("");

  const watchedAnswers = useWatch({ control, name: "answers" }) || fields;

  const handleMarkCorrect = (index: number) => {
    const currentAnswers = form.getValues("answers");
    currentAnswers.forEach((_, i) => {
      form.setValue(`answers.${i}.isCorrect`, i === index, { shouldValidate: true });
    });
  };

  const addNewAnswer = () => {
    if (!newAnswerText.trim()) return;
    append({ text: newAnswerText, isCorrect: false });
    setNewAnswerText("");
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-[#2B7FFF] text-white p-3 px-6 flex justify-between items-center text-sm font-semibold tracking-wide">
        Question Answers
      </div>
      <div className="bg-gray-50 border-b border-gray-100 py-3 px-6 flex justify-between items-center text-[11px] font-bold uppercase text-gray-400">
        <div className="flex-1 pl-12">Body</div>
        <button type="button" onClick={addNewAnswer} className="bg-[#00D084] text-white px-4 py-2 rounded-sm text-xs flex items-center gap-2 hover:bg-emerald-600 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Answer
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {fields.map((field, index) => {
          const isCorrect = !!watchedAnswers[index]?.isCorrect;
          return (
            <div key={field.id} className="p-4 px-6 flex items-center gap-4 hover:bg-gray-50/50">
              <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              <div className="flex-1">
                <input type="hidden" {...register(`answers.${index}.isCorrect`)} />
                <input {...register(`answers.${index}.text`)} className="w-full bg-transparent outline-none text-[14px] text-gray-700" placeholder="Answer body" />
              </div>
              <button 
                type="button" 
                onClick={() => handleMarkCorrect(index)} 
                className={`flex items-center gap-2 px-5 py-2 rounded-sm text-xs font-bold transition-colors ${isCorrect ? 'text-[#00D084]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Correct Answer</> : <><CheckCircle2 className="w-4 h-4 text-gray-300" /> Mark Correct</>}
              </button>
            </div>
          );
        })}
        <div className="p-4 px-6 flex items-center gap-4 bg-emerald-50/20">
          <button type="button" className="p-2 text-gray-300"><X className="w-5 h-5" /></button>
          <input value={newAnswerText} onChange={(e) => setNewAnswerText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewAnswer())} placeholder="Enter answer body" className="flex-1 bg-transparent outline-none text-[14px] text-gray-600 italic" />
          <button type="button" onClick={addNewAnswer} className="bg-[#00D084] text-white p-2 rounded-sm"><Plus className="w-4 h-4" /> Add</button>
        </div>
      </div>
      {errors.answers && <p className="p-4 text-red-500 text-xs text-center border-t">{(errors.answers as any).message || (errors.answers as any).root?.message}</p>}
    </div>
  );
}
