import { getQuestionsAction } from "@/features/student/questions/lib/actions/get-questions.action";
import QuizHeader from "@/features/student/questions/components/quiz-header";
import QuizEngine from "@/features/student/questions/components/quiz-engine";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamQuestionsPage({ params }: PageProps) {
  const { id } = await params;
  
  let questions: any[] = [];
  let examTitle = "Exam";

  try {
    const response = await getQuestionsAction(id);
    questions = response?.payload?.questions || [];
    
    if (questions.length > 0 && questions[0].exam?.title) {
      examTitle = questions[0].exam.title;
    }
  } catch (error) {
    console.error("Failed to load questions", error);
  }

  return (
    <div className="w-full mx-auto space-y-4 p-4">
      <QuizHeader examTitle={examTitle} />
      <QuizEngine questions={questions} examId={id} />
    </div>
  );
}
