"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminFiltersWrapper } from "@/features/admin/shared/components/admin-filters-wrapper";
import { AdminSelect } from "@/features/admin/shared/components/admin-select";
import { useTransition, useState } from "react";

export function AdminAuditLogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [action, setAction] = useState(searchParams.get("action") || "all");
  const [user, setUser] = useState(searchParams.get("userId") || "all");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    if (action && action !== "all") params.set("action", action);
    else params.delete("action");

    if (user && user !== "all") params.set("userId", user);
    else params.delete("userId");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setCategory("all");
    setAction("all");
    setUser("all");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <AdminFiltersWrapper onApply={handleApply} onClear={handleClear} isLoading={isPending}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <div className="text-[13px] text-gray-400 font-medium ml-0.5 uppercase tracking-wide">Category</div>
          <AdminSelect
            placeholder="Category"
            value={category}
            options={[
              { label: "All Categories", value: "all" },
              { label: "Diploma", value: "DIPLOMA" },
              { label: "Exam", value: "EXAM" },
              { label: "Question", value: "QUESTION" },
              { label: "User", value: "USER" },
            ]}
            onChange={setCategory}
          />
        </div>
        <div className="space-y-1.5">
          <div className="text-[13px] text-gray-400 font-medium ml-0.5 uppercase tracking-wide">Action</div>
          <AdminSelect
            placeholder="Action"
            value={action}
            options={[
              { label: "All Actions", value: "all" },
              { label: "Create", value: "CREATE" },
              { label: "Update", value: "UPDATE" },
              { label: "Delete", value: "DELETE" },
              { label: "Login", value: "LOGIN" },
            ]}
            onChange={setAction}
          />
        </div>
        <div className="space-y-1.5">
          <div className="text-[13px] text-gray-400 font-medium ml-0.5 uppercase tracking-wide">User</div>
          <AdminSelect
            placeholder="User"
            value={user}
            options={[
              { label: "All Users", value: "all" },
            ]}
            onChange={setUser}
          />
        </div>
      </div>
    </AdminFiltersWrapper>
  );
}
