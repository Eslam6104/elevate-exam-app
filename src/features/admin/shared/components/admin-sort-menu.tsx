"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownAZ, ArrowUpAZ, Calendar, ArrowDown, ArrowUp, SortDesc, ArrowUp10, ArrowDown10 } from "lucide-react";

export type SortOption = {
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  iconType: "text" | "date" | "number";
};

type Props = {
  options: SortOption[];
};

export function AdminSortMenu({ options }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const sort = (by: string, order: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sortBy", by); 
    p.set("sortOrder", order);
    router.push(`?${p.toString()}`); 
    setOpen(false);
  };

  const renderIcon = (opt: SortOption) => {
    if (opt.iconType === "text") {
      return opt.sortOrder === "asc" ? <ArrowUpAZ className="w-5 h-5 text-gray-500"/> : <ArrowDownAZ className="w-5 h-5 text-gray-500"/>;
    }
    if (opt.iconType === "number") {
      return opt.sortOrder === "asc" ? <ArrowUp10 className="w-5 h-5 text-gray-500"/> : <ArrowDown10 className="w-5 h-5 text-gray-500"/>;
    }
    // Date
    return (
      <div className="relative">
        <Calendar className="w-5 h-5 text-gray-500"/>
        {opt.sortOrder === "asc" ? (
          <ArrowUp className="w-3 h-3 absolute -bottom-1 -right-1 text-gray-500 bg-white rounded-full"/>
        ) : (
          <ArrowDown className="w-3 h-3 absolute -bottom-1 -right-1 text-gray-500 bg-white rounded-full"/>
        )}
      </div>
    );
  };
  
  return (
    <div className="relative flex items-center gap-1 cursor-pointer select-none" onClick={() => setOpen(!open)}>
      <span className="font-semibold text-gray-700">Sort</span> <SortDesc className="w-4 h-4 text-gray-400" />
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setOpen(false); }}></div>
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-30 text-[15px] text-gray-500 font-normal overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
            {options.map((opt, i) => {
              const isActive = searchParams.get("sortBy") === opt.sortBy && searchParams.get("sortOrder") === opt.sortOrder;
              return (
                <button 
                  key={`${opt.sortBy}-${opt.sortOrder}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sort(opt.sortBy, opt.sortOrder);
                  }} 
                  className={`flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-blue-50 transition-colors ${i !== 0 ? 'border-t border-gray-50' : ''} ${isActive ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    {renderIcon(opt)}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-[14px] ${isActive ? 'text-[#2B7FFF]' : 'text-gray-900'}`}>{opt.label}</div> 
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{opt.sortOrder === 'asc' ? 'Ascending' : 'Descending'}</div>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#2B7FFF]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
