import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "../types/question.types";

interface QuizActiveViewProps {
  currentQuestion: Question;
  selectedAnswers: Record<string, string>;
  onSelectAnswer: (answerId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuizActiveView({
  currentQuestion,
  selectedAnswers,
  onSelectAnswer,
  onPrevious,
  onNext,
  isSubmitting,
  isFirst,
  isLast
}: QuizActiveViewProps) {
  return (
    <>
      <div className="p-8">
        <h2 className="text-2xl md:text-3xl font-mono text-blue-600 mb-8 font-bold">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.answers?.map((answer) => {
            const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
            return (
              <label 
                key={answer.id} 
                className={`flex items-center gap-4 p-4 rounded-md border cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-slate-50 border-slate-200" 
                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-blue-600" : "border-slate-300"
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  name={`question-${currentQuestion.id}`} 
                  value={answer.id}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(answer.id)}
                  className="hidden"
                />
                <span className="font-mono text-slate-700">{answer.text}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 p-8 pt-4 border-t border-slate-100">
        <button 
          onClick={onPrevious}
          disabled={isFirst || isSubmitting}
          className="flex-1 py-3 bg-slate-200 text-slate-600 font-mono font-medium rounded-md flex items-center justify-center gap-2 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button 
          onClick={onNext}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-blue-600 text-white font-mono font-medium rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLast ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </>
  );
}
