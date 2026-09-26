import { getExamsAction } from "@/features/student/exams/lib/actions/get-exams.action";
import { getDiplomaByIdAction } from "@/features/student/diplomas/lib/actions/get-diploma-by-id.action";
import ExamsHeader from "@/features/student/exams/components/exams-header";
import ExamsList from "@/features/student/exams/components/exams-list";
import { Exam } from "@/features/student/exams/types/exam.types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiplomaExamsPage({ params }: PageProps) {
  const { id } = await params;
  
  let exams: Exam[] = [];
  let diplomaTitle = "Diploma";

  try {
    const [examsRes, diplomaRes] = await Promise.allSettled([
      getExamsAction(1, 100, undefined, id),
      getDiplomaByIdAction(id)
    ]);

    if (examsRes.status === "fulfilled" && examsRes.value?.payload?.data) {
      exams = examsRes.value.payload.data;
    }

    if (diplomaRes.status === "fulfilled" && diplomaRes.value?.payload?.diploma?.title) {
      diplomaTitle = diplomaRes.value.payload.diploma.title;
    } else if (exams.length > 0 && exams[0].diploma?.title) {
      diplomaTitle = exams[0].diploma.title;
    }
  } catch (error) {
    console.error("Failed to load exams", error);
  }

  return (
    <div className="w-full mx-auto space-y-8 p-4">
      <ExamsHeader diplomaTitle={diplomaTitle} />
      <ExamsList exams={exams} />
    </div>
  );
}
