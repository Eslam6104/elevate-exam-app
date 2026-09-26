"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { Exam } from "@/features/student/exams/types/exam.types";
import { AdminActionMenu, ActionOption } from "@/features/admin/shared/components/admin-action-menu";
import { AdminSortMenu, SortOption } from "@/features/admin/shared/components/admin-sort-menu";
import { toast } from "sonner";
import { slugify, encodeId } from "@/shared/lib/utils/slug";
import { deleteExamAction } from "../../lib/actions/delete-exam.action";

export function AdminExamsTable({ exams }: { exams: Exam[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions: SortOption[] = [
    { label: "Title", sortBy: "title", sortOrder: "desc", iconType: "text" },
    { label: "Title", sortBy: "title", sortOrder: "asc", iconType: "text" },
    { label: "Questions No.", sortBy: "questionsCount", sortOrder: "desc", iconType: "number" },
    { label: "Questions No.", sortBy: "questionsCount", sortOrder: "asc", iconType: "number" },
    { label: "Newest", sortBy: "createdAt", sortOrder: "desc", iconType: "date" },
    { label: "Newest", sortBy: "createdAt", sortOrder: "asc", iconType: "date" },
  ];

  // Client-side sort for questionsCount since backend doesn't support it well
  const sortedExams = [...exams].sort((a, b) => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    if (sortBy === "questionsCount") {
      return sortOrder === "asc" 
        ? (a.questionsCount || 0) - (b.questionsCount || 0)
        : (b.questionsCount || 0) - (a.questionsCount || 0);
    }
    return 0; // Maintain server-side order for other fields
  });

  const handleDelete = (id: string) => {
    toast("Are you sure you want to delete this exam?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const res = await deleteExamAction(id);
          if (res.success) {
            toast.success("Exam deleted successfully");
            router.refresh();
          } else {
            toast.error(res.error || "Failed to delete exam");
          }
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const getActions = (exam: Exam): ActionOption[] => {
    const slug = `${slugify(exam.title)}--${encodeId(exam.id)}`;
    return [
      { label: "View Details", icon: Eye, onClick: () => router.push(`/admin/exams/${slug}`) },
      { label: "Edit Exam", icon: Edit, onClick: () => router.push(`/admin/exams/${slug}/edit`) },
      { label: "Delete", icon: Trash2, onClick: () => handleDelete(exam.id), isDestructive: true },
    ];
  };

  const getDisplayUrl = (url: string) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (baseUrl && baseUrl.startsWith("http")) {
      const origin = baseUrl.replace(/\/api(\/v1)?\/?$/, "");
      return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
    }
    return url.startsWith("/") ? url : `/${url}`;
  };

  // Define grid columns to match the design: Image, Title, Diploma, Questions, Sort
  const gridTemplate = "grid-cols-[100px_1fr_1fr_150px_80px]";

  return (
    <div className="w-full bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      {/* Table Header */}
      <div className={`grid ${gridTemplate} bg-[#2B7FFF] text-white py-3 px-6 text-[14px] font-bold uppercase tracking-wider items-center`}>
        <div>Image</div>
        <div>Title</div>
        <div>Diploma</div>
        <div>No. of Questions</div>
        <div className="flex justify-end">
          <AdminSortMenu options={sortOptions} />
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {sortedExams.map((exam) => (
          <div key={exam.id} className={`grid ${gridTemplate} py-4 px-6 items-center hover:bg-gray-50 transition-colors group`}>
            {/* Image */}
            <div className="pr-4">
              <div className="relative w-16 h-16 rounded-sm border border-gray-100 overflow-hidden bg-gray-50">
                {exam.image ? (
                  <Image 
                    src={getDisplayUrl(exam.image)} 
                    alt={exam.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <Eye className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="font-medium text-[15px] text-gray-900 pr-4 truncate">
              {exam.title}
            </div>

            {/* Diploma */}
            <div className="text-[14px] text-gray-600 truncate pr-4">
              {exam.diploma?.title || "N/A"}
            </div>

            {/* Questions Count */}
            <div className="text-[14px] text-gray-600 font-medium">
              {exam.questionsCount}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <AdminActionMenu actions={getActions(exam)} />
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-gray-50/40">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2B7FFF] flex items-center justify-center mb-3 shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-gray-800 font-semibold text-base mb-1">
              No exams found matching your filters.
            </p>
            <p className="text-gray-500 text-sm max-w-md mb-5">
              {searchParams.get("diplomaId") && searchParams.get("diplomaId") !== "all"
                ? "This diploma does not have any exams created yet. You can create the first exam now."
                : "Try adjusting your search criteria or create a new exam."}
            </p>
            <Link
              href={
                searchParams.get("diplomaId") && searchParams.get("diplomaId") !== "all"
                  ? `/admin/exams/new?diplomaId=${searchParams.get("diplomaId")}`
                  : "/admin/exams/new"
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D084] hover:bg-emerald-600 text-white rounded-sm text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create New Exam
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
