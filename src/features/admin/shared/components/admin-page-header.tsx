"use client";
import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  total: number;
  page: number;
  totalPages: number;
  actionButton?: ReactNode;
};

export function AdminPageHeader({ total, page, totalPages, actionButton }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = 20; 
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const totalP = totalPages === 0 ? 1 : totalPages;

  const navigatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalP) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 py-5 rounded-t-md border-b">
      <div className="flex items-center gap-6 text-[15px] font-medium text-gray-700">
        <span>{start} - {end} of {total}</span>
        <div className="flex items-stretch border rounded-sm overflow-hidden h-9 shadow-sm">
          <button 
            disabled={page <= 1} 
            onClick={() => navigatePage(page - 1)}
            className="flex items-center justify-center px-2.5 bg-[#E2E8F0] hover:bg-gray-300 disabled:opacity-50 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center px-4 bg-white text-gray-500 border-x text-sm">
            Page {page} of {totalP}
          </div>
          <button 
            disabled={page >= totalP} 
            onClick={() => navigatePage(page + 1)}
            className="flex items-center justify-center px-2.5 bg-[#E2E8F0] hover:bg-gray-300 disabled:opacity-50 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {actionButton}
    </div>
  );
}
