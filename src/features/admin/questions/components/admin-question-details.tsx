import Link from "next/link";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { Question } from "@/features/student/questions/types/question.types";

export function AdminQuestionDetails({ question }: { question: Question }) {
  return (
    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-8 mt-6">
      {/* Question Headline */}
      <div className="space-y-1.5">
        <div className="text-[13px] text-gray-400 font-medium uppercase tracking-wide">Headline</div>
        <div className="text-lg text-gray-900 font-semibold leading-relaxed max-w-5xl">
          {question.text}
        </div>
      </div>

      {/* Exam Link */}
      <div className="space-y-1.5">
        <div className="text-[13px] text-gray-400 font-medium uppercase tracking-wide">Exam</div>
        <div className="text-[15px] text-gray-900 font-medium leading-relaxed max-w-5xl">
          <Link 
            href={`/admin/exams/${question.examId}`}
            className="flex items-center gap-1.5 text-[#2B7FFF] hover:underline"
          >
            {question.exam?.title} <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <div className="text-[13px] text-gray-400 font-medium uppercase tracking-wide">Answers</div>
        <div className="grid grid-cols-1 gap-3">
          {question.answers.map((answer, index) => (
            <div 
              key={answer.id} 
              className={`flex items-center gap-4 p-4 rounded-sm border transition-colors ${answer.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100'}`}
            >
              {answer.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              <div className="flex-1 text-[15px]">
                <span className="text-gray-400 font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                <span className={answer.isCorrect ? 'text-emerald-900 font-medium' : 'text-gray-700'}>{answer.text}</span>
              </div>
              {answer.isCorrect && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Correct</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
