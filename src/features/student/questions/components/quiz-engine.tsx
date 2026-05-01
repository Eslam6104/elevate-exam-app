"use client";

import { useState, useEffect } from "react";
import { Question } from "../types/question.types";
import { submitExamAction } from "../lib/actions/submit-exam.action";
import { toast } from "sonner";
import QuizActiveView from "./quiz-active-view";
import QuizResultsView from "./quiz-results-view";

interface QuizEngineProps {
  questions: Question[];
  examId: string;
}

export default function QuizEngine({ questions, examId }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setStartedAt(new Date().toISOString());
  }, []);

  useEffect(() => {
    if (showResults) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center bg-white shadow-sm rounded-md">No questions found.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const progressPercentage = showResults ? 100 : ((currentIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else handleSubmit();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      return toast.error("Please answer all questions before submitting.");
    }
    setIsSubmitting(true);
    toast.loading("Submitting exam...", { id: "submit" });

    const answersPayload = Object.entries(selectedAnswers).map(([qId, aId]) => ({
      questionId: qId, answerId: aId
    }));

    const result = await submitExamAction({ examId, answers: answersPayload, startedAt });

    if (result.success) {
      toast.success("Exam submitted successfully!", { id: "submit" });
      setShowResults(true);
    } else {
      toast.error(result.error || "Failed to submit exam", { id: "submit" });
    }
    setIsSubmitting(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0); setSelectedAnswers({}); setStartedAt(new Date().toISOString());
    setTimeLeft(20 * 60); setShowResults(false);
  };

  let correctCount = 0;
  if (showResults) {
    questions.forEach(q => {
      const correctAns = q.answers.find(a => a.isCorrect);
      if (correctAns && selectedAnswers[q.id] === correctAns.id) correctCount++;
    });
  }

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-slate-100 gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-sm font-mono text-slate-500 mb-2">
            <span>{questions[0]?.exam?.title} - Quiz</span>
            <span>Question <span className="text-blue-600 font-bold">{showResults ? questions.length : currentIndex + 1}</span> of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {!showResults && (
          <div className="shrink-0 flex items-center justify-center relative w-16 h-16 text-slate-700">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - timeLeft / (20 * 60))}
                className="text-blue-600 transition-all duration-1000 linear" />
            </svg>
            <span className="absolute text-xs font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!showResults ? (
        <QuizActiveView
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          onSelectAnswer={handleSelectAnswer}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSubmitting={isSubmitting}
          isFirst={currentIndex === 0}
          isLast={currentIndex === questions.length - 1}
        />
      ) : (
        <QuizResultsView
          questions={questions}
          selectedAnswers={selectedAnswers}
          correctCount={correctCount}
          incorrectCount={questions.length - correctCount}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
