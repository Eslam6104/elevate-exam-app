import { Exam } from "../types/exam.types";
import ExamCard from "./exam-card";

interface ExamsListProps {
  exams: Exam[];
}

export default function ExamsList({ exams }: ExamsListProps) {
  if (!exams || exams.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500 text-lg">No exams available for this diploma yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
      
      <div className="text-center pt-8 pb-12">
        <p className="text-gray-500 font-mono text-sm">End of list</p>
      </div>
    </div>
  );
}
