"use client";
import { Question } from "@/features/student/questions/types/question.types";
import { AdminActionMenu, ActionOption } from "@/features/admin/shared/components/admin-action-menu";
import { Eye, Edit, Trash2, HelpCircle, CheckCircle2, Circle } from "lucide-react";

interface Props {
  questions: Question[];
  onView: (q: Question) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string, examId: string) => void;
}

export function AdminExamQuestionsTable({ questions, onView, onEdit, onDelete }: Props) {
  const getActions = (q: Question): ActionOption[] => [
    { label: "View Details", icon: Eye, onClick: () => onView(q) },
    { label: "Edit Question", icon: Edit, onClick: () => onEdit(q) },
    { label: "Delete", icon: Trash2, onClick: () => onDelete(q.id, q.examId), isDestructive: true },
  ];

  return (
    <div className="space-y-4 p-6">
      {/* Header Info */}
      <div className="flex justify-between items-center px-1 mb-2">
        <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Question Bank ({questions.length})</span>
        <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
          <div className="w-3 h-3 rounded-full bg-green-500" /> Correct Answer
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.map((q, index) => (
          <div 
            key={q.id} 
            className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
          >
            {/* Action Menu (Fixed Position) */}
            <div className="absolute top-6 right-6">
              <AdminActionMenu actions={getActions(q)} />
            </div>

            <div className="flex gap-5">
              {/* Index/Icon Circle */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm border border-blue-100">
                {index + 1}
              </div>

              {/* Question Content */}
              <div className="flex-1 min-w-0 pr-12">
                <h4 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-relaxed mb-6">
                  {q.text}
                </h4>

                {/* Answers Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.answers.map((answer) => (
                    <div 
                      key={answer.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-[14px] transition-all ${
                        answer.isCorrect 
                          ? "bg-green-50 border-green-200 text-green-700 font-bold shadow-sm" 
                          : "bg-gray-50/50 border-gray-100 text-gray-600 font-medium"
                      }`}
                    >
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 shrink-0 text-gray-300" />
                      )}
                      <span className="truncate">{answer.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Meta Bar (Subtle) */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <span>Created: {new Date(q.createdAt).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span>Type: Multiple Choice</span>
              </div>
              
              <div className="text-[12px] font-bold text-blue-600 group-hover:underline cursor-pointer flex items-center gap-1" onClick={() => onView(q)}>
                <Eye className="w-3.5 h-3.5" /> View Results
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="py-24 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
            <HelpCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">No questions added yet</p>
            <button className="mt-4 text-blue-600 font-black text-sm hover:underline">Add Your First Question</button>
          </div>
        )}
      </div>
    </div>
  );
}
