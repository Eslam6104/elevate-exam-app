"use client";
import { useState, ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type Props = {
  children: ReactNode;
  onApply?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
};

export function AdminFiltersWrapper({ children, onApply, onClear, isLoading }: Props) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)} 
        className="m-6 flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50 text-gray-700 transition-colors font-medium shadow-sm bg-white"
      >
        <SlidersHorizontal className="w-4 h-4" /> Show Filters
      </button>
    );
  }

  return (
    <div className="bg-[#F8FAFC]">
      <div className="flex justify-between items-center bg-[#2B7FFF] text-white p-3 px-6">
        <div className="flex items-center gap-2 font-medium text-[15px]">
          <SlidersHorizontal className="w-4 h-4" /> Search & Filters
        </div>
        <button onClick={() => setOpen(false)} className="flex items-center gap-1.5 text-[13px] hover:bg-white/10 px-2 py-1 rounded transition-colors">
          <X className="w-3.5 h-3.5" /> Hide
        </button>
      </div>
      <div className="p-8 max-w-4xl space-y-8">
        {children}

        {(onApply || onClear) && (
          <div className="flex justify-end items-center gap-4 pt-2">
            {onClear && (
              <button 
                onClick={onClear} 
                disabled={isLoading}
                className="text-[15px] font-semibold text-gray-700 hover:text-black transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            )}
            {onApply && (
              <button 
                onClick={onApply}
                disabled={isLoading}
                className="px-8 py-2.5 text-[15px] font-semibold bg-[#E2E8F0] text-gray-700 hover:bg-gray-300 rounded-sm transition-colors disabled:opacity-50 min-w-30"
              >
                {isLoading ? "Applying..." : "Apply"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
