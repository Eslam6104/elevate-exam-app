import { Question } from "@/features/student/questions/types/question.types";
import { AdminActionMenu, ActionOption } from "@/features/admin/shared/components/admin-action-menu";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";

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
    <div className="w-full">
      {/* Sub-header */}
      <div className="grid grid-cols-[1fr_80px] bg-[#E9ECEF] py-3 px-6 text-[14px] font-bold text-[#495057] items-center">
        <div>Title</div>
        <div className="flex justify-end items-center gap-1">
          Sort <ArrowUpDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {questions.map((q) => (
          <div 
            key={q.id} 
            className="grid grid-cols-[1fr_80px] py-4 px-6 items-center hover:bg-gray-50 transition-colors"
          >
            {/* Title */}
            <div className="text-[15px] text-gray-900 font-medium truncate pr-4">
              {q.text}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <AdminActionMenu actions={getActions(q)} />
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            No questions found.
          </div>
        )}
      </div>
    </div>
  );
}
