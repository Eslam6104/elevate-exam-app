import { getExamsAction } from "@/features/student/exams/lib/actions/get-exams.action";
import ExamsHeader from "@/features/student/exams/components/exams-header";
import ExamsList from "@/features/student/exams/components/exams-list";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiplomaExamsPage({ params }: PageProps) {
  const { id } = await params;
  
  let exams: any[] = [];
  let diplomaTitle = "Diploma";

  try {
    const response = await getExamsAction(1, 100, undefined, id);
    exams = response?.payload?.data || [];
    
    // Extract the diploma title from the first exam if available
    if (exams.length > 0 && exams[0].diploma?.title) {
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
