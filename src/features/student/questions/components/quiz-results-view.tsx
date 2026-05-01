import { RotateCcw, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Question } from "../types/question.types";

interface QuizResultsViewProps {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  correctCount: number;
  incorrectCount: number;
  onRestart: () => void;
}

export default function QuizResultsView({
  questions,
  selectedAnswers,
  correctCount,
  incorrectCount,
  onRestart
}: QuizResultsViewProps) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 font-mono">Results:</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        {/* Chart Side */}
        <div className="w-full md:w-1/3 bg-[#f0f6ff] p-8 rounded-lg flex flex-col items-center justify-center border border-blue-100">
          <div className="relative w-48 h-48 mb-6 transform -rotate-90">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-red-500"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#0cbd70]"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(correctCount / questions.length) * 100}, 100`}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          
          <div className="flex flex-col gap-2 font-mono text-sm w-full font-bold">
            <div className="flex items-center gap-2 text-slate-800">
              <div className="w-4 h-4 bg-[#0cbd70]"></div> Correct: {correctCount}
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <div className="w-4 h-4 bg-red-500"></div> Incorrect: {incorrectCount}
            </div>
          </div>
        </div>

        {/* Questions List Side */}
        <div className="w-full md:w-2/3 max-h-125 overflow-y-auto pr-4 space-y-8 custom-scrollbar">
          {questions.map((q) => {
            const selectedAnswerId = selectedAnswers[q.id];
            return (
              <div key={q.id} className="pb-6 border-b border-slate-100 border-dashed last:border-0">
                <h3 className="text-xl font-bold font-mono text-blue-600 mb-4">{q.text}</h3>
                <div className="space-y-2">
                  {q.answers.map(ans => {
                    const isSelected = selectedAnswerId === ans.id;
                    const isCorrect = ans.isCorrect;

                    let itemClass = "bg-slate-50 text-slate-700 border-transparent";
                    let radioClass = "border-slate-300";
                    let radioInner = null;

                    if (isCorrect) {
                      itemClass = "bg-green-50 border-green-200 text-green-900";
                      radioClass = "border-green-500";
                    } else if (isSelected && !isCorrect) {
                      itemClass = "bg-red-50 border-red-200 text-red-900";
                      radioClass = "border-red-500 bg-red-500 shadow-[inset_0_0_0_4px_#fef2f2]";
                    }

                    return (
                      <div key={ans.id} className={`flex items-center gap-4 p-4 rounded-md border font-mono text-sm ${itemClass}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${radioClass}`}>
                           {radioInner}
                        </div>
                        <span>{ans.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls for Results */}
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <button 
          onClick={onRestart}
          className="flex-1 py-3 bg-slate-200 text-slate-700 font-mono font-medium rounded-md flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
        <Link 
          href="/student/diplomas"
          className="flex-1 py-3 bg-blue-600 text-white font-mono font-medium rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FolderOpen className="w-4 h-4" /> Explore
        </Link>
      </div>
    </div>
  );
}
