"use client";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { AdminConfirmModal } from "@/features/admin/shared/components/admin-confirm-modal";
import { clearAllAuditLogsAction } from "../lib/actions/clear-all-audit-logs.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AdminAuditLogClearAll() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClearAll = () => {
    startTransition(async () => {
      const res = await clearAllAuditLogsAction();
      if (res.success) {
        toast.success("All logs cleared successfully");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#F44336] hover:bg-red-600 text-white px-5 py-2.5 rounded-sm font-medium text-[15px] transition-colors shadow-sm"
      >
        <Trash2 className="w-4 h-4" /> Clear All Logs
      </button>

      <AdminConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleClearAll}
        isLoading={isPending}
        title="Are you sure you want to clear all logs?"
        description="This action is permanent and will remove all history from the database."
        confirmText="Yes, clear all"
      />
    </>
  );
}
