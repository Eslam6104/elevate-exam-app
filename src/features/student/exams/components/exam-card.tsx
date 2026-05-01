"use client";

import { useState } from "react";
import { Exam } from "../types/exam.types";
import { Clock, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative flex flex-col md:flex-row items-start gap-6 p-6 bg-[#f4f7f9] hover:bg-[#eef3f7] transition-all shadow-sm">
      
      {/* Icon / Image - Smaller Size */}
      <div className="w-16 h-16 flex-none bg-[#e0efff] border border-[#b3d4ff] flex items-center justify-center p-2">
        <img
          src={exam.image || "/placeholder.jpg"}
          alt={exam.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=Ex";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
          <h2 className="text-xl font-bold font-mono text-blue-600 truncate">
            {exam.title}
          </h2>
          
          <div className="flex items-center gap-3 text-sm text-gray-700 font-mono shrink-0">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> {exam.questionsCount} Questions
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {exam.duration} minutes
            </span>
          </div>
        </div>

        <div className="text-gray-500 text-sm leading-relaxed font-mono mt-1 relative">
          <p className={isExpanded ? "" : "line-clamp-2"}>
            {exam.description}
          </p>
          {!isExpanded && exam.description && exam.description.length > 100 && (
            <span 
              onClick={() => setIsExpanded(true)}
              className="absolute bottom-0 right-0 bg-[#f4f7f9] group-hover:bg-[#eef3f7] pl-2 font-bold text-gray-900 cursor-pointer"
            >
              ... See More
            </span>
          )}
          {isExpanded && (
             <span 
             onClick={() => setIsExpanded(false)}
             className="block mt-2 font-bold text-gray-900 cursor-pointer"
           >
             Show Less
           </span>
          )}
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute right-6 bottom-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        <Link 
          href={`/student/exams/${exam.id}`}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-sm font-mono text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          START <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
    </div>
  );
}
