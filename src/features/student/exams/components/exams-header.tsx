import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

interface ExamsHeaderProps {
  diplomaTitle: string;
}

export default function ExamsHeader({ diplomaTitle }: ExamsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="text-sm font-mono text-gray-400">
        <Link href="/student/diplomas" className="hover:text-blue-500 transition-colors">Diplomas</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{diplomaTitle}</span>
        <span className="mx-2">/</span>
        <span className="text-blue-600 font-medium">Exams</span>
      </div>

      {/* Header Bar */}
      <div className="flex items-center gap-4">
        <Link href="/student/diplomas" className="flex items-center justify-center w-12 h-12 bg-white text-blue-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm shrink-0">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        
        <div className="flex-1 flex items-center gap-3 bg-blue-600 text-white p-4 rounded-md shadow-sm">
          <BookOpen className="w-6 h-6 shrink-0" />
          <h1 className="text-2xl font-bold truncate">{diplomaTitle} Exams</h1>
        </div>
      </div>
    </div>
  );
}
