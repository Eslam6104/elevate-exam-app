import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Exam } from "@/features/student/exams/types/exam.types";

export function AdminExamDetails({ exam }: { exam: Exam }) {
  const getDisplayUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://exam-app.elevate-bootcamp.cloud/api";
    const origin = baseUrl.replace(/\/api\/?$/, "");
    return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const details = [
    { label: "Title", value: exam.title },
    { label: "Description", value: exam.description },
    { 
      label: "Diploma", 
      value: (
        <Link 
          href={`/admin/diplomas/${exam.diplomaId}`}
          className="flex items-center gap-1.5 text-[#2B7FFF] hover:underline"
        >
          {exam.diploma?.title} <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      ) 
    },
    { label: "Duration", value: `${exam.duration} Minutes` },
    { label: "No. of Questions", value: exam.questionsCount },
  ];

  return (
    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-8 mt-6">
      <div className="space-y-3">
        <div className="text-[13px] text-gray-400 font-medium uppercase tracking-wide">Image</div>
        <div className="relative w-64 h-64 rounded-sm border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
          {exam.image ? (
            <Image 
              src={getDisplayUrl(exam.image)} 
              alt={exam.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
          )}
        </div>
      </div>

      {details.map((detail) => (
        <div key={detail.label} className="space-y-1.5">
          <div className="text-[13px] text-gray-400 font-medium uppercase tracking-wide">{detail.label}</div>
          <div className="text-[15px] text-gray-900 font-medium leading-relaxed max-w-5xl">
            {detail.value}
          </div>
        </div>
      ))}
    </div>
  );
}
