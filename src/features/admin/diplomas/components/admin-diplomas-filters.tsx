"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { AdminFiltersWrapper } from "@/features/admin/shared/components/admin-filters-wrapper";
import { AdminSelect } from "@/features/admin/shared/components/admin-select";
export function AdminDiplomasFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [immutable, setImmutable] = useState(searchParams.get("immutable") || "");
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (title) params.set("title", title); else params.delete("title");
    if (immutable) params.set("immutable", immutable); else params.delete("immutable");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };
  const handleClear = () => {
    setTitle(""); 
    setImmutable("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("title"); 
    params.delete("immutable"); 
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };
  return (
    <AdminFiltersWrapper onApply={handleApply} onClear={handleClear}>
      <div className="space-y-4">
        <div className="relative">
          <input 
            className="flex h-11 w-full rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#2B7FFF] transition-colors pr-10" 
            placeholder="Search by title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <Search className="w-4 h-4 absolute right-4 top-3.5 text-gray-300" />
        </div>
        <div className="w-full md:w-1/3">
          <AdminSelect 
            placeholder="Immutability"
            clearOptionLabel="None"
            value={immutable}
            onChange={setImmutable}
            options={[
              { label: "Immutable", value: "true" },
              { label: "Mutable", value: "false" }
            ]}
          />
        </div>
      </div>
    </AdminFiltersWrapper>
  );
}
