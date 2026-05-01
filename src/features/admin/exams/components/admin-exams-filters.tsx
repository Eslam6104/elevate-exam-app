"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { AdminFiltersWrapper } from "@/features/admin/shared/components/admin-filters-wrapper";
import { AdminSelect } from "@/features/admin/shared/components/admin-select";
import { useTransition, useState, useEffect } from "react";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";

export function AdminExamsFilters({ diplomas }: { diplomas: Diploma[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [diplomaId, setDiplomaId] = useState(searchParams.get("diplomaId") || "all");
  const [immutable, setImmutable] = useState(searchParams.get("immutable") || "all");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (title) params.set("title", title);
    else params.delete("title");

    if (diplomaId && diplomaId !== "all") params.set("diplomaId", diplomaId);
    else params.delete("diplomaId");

    if (immutable && immutable !== "all") params.set("immutable", immutable);
    else params.delete("immutable");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setTitle("");
    setDiplomaId("all");
    setImmutable("all");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const diplomaOptions = [
    { label: "All Diplomas", value: "all" },
    ...diplomas.map(d => ({ label: d.title, value: d.id }))
  ];

  return (
    <AdminFiltersWrapper onApply={handleApply} onClear={handleClear} isLoading={isPending}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 pl-11 pr-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Selects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="text-[13px] text-gray-400 font-medium ml-0.5 uppercase tracking-wide">Diploma</div>
            <AdminSelect
              placeholder="Diploma"
              value={diplomaId}
              options={diplomaOptions}
              onChange={setDiplomaId}
            />
          </div>
          <div className="space-y-1.5">
            <div className="text-[13px] text-gray-400 font-medium ml-0.5 uppercase tracking-wide">Immutability</div>
            <AdminSelect
              placeholder="Immutability"
              value={immutable}
              options={[
                { label: "All", value: "all" },
                { label: "Immutable", value: "true" },
                { label: "Mutable", value: "false" },
              ]}
              onChange={setImmutable}
            />
          </div>
        </div>
      </div>
    </AdminFiltersWrapper>
  );
}
