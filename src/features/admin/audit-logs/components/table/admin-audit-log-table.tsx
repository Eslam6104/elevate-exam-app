"use client";
import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuditLog } from "../../types/audit-log.types";
import { AdminActionMenu } from "@/features/admin/shared/components/admin-action-menu";
import { Eye, Trash2, ExternalLink } from "lucide-react";
import { AdminSortMenu, SortOption } from "@/features/admin/shared/components/admin-sort-menu";
import { deleteAuditLogAction } from "../../lib/actions/delete-audit-log.action";
import { toast } from "sonner";
import { AdminConfirmModal } from "@/features/admin/shared/components/admin-confirm-modal";
import { slugify, encodeId } from "@/shared/lib/utils/slug";

export function AdminAuditLogTable({ logs: initialLogs }: { logs: AuditLog[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState(initialLogs);

  // Client-side sort for fields not supported by backend
  const sortedLogs = [...logs].sort((a, b) => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    if (!sortBy || sortBy === "createdAt") return 0; // Handled by server

    let valA = "";
    let valB = "";

    if (sortBy === "action") {
      valA = a.action;
      valB = b.action;
    } else if (sortBy === "actorEmail") {
      valA = a.actorEmail;
      valB = b.actorEmail;
    } else if (sortBy === "entityType") {
      valA = a.entityType;
      valB = b.entityType;
    }

    if (sortOrder === "asc") {
      return valA.localeCompare(valB);
    } else {
      return valB.localeCompare(valA);
    }
  });
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    startTransition(async () => {
      const res = await deleteAuditLogAction(deleteId);
      if (res.success) {
        toast.success("Log entry deleted successfully");
        setLogs(prev => prev.filter(l => l.id !== deleteId));
      } else {
        toast.error(res.error);
      }
      setDeleteId(null);
    });
  };

  const sortOptions: SortOption[] = [
    { label: "Action", sortBy: "action", sortOrder: "desc", iconType: "text" },
    { label: "Action", sortBy: "action", sortOrder: "asc", iconType: "text" },
    { label: "User", sortBy: "actorEmail", sortOrder: "desc", iconType: "text" },
    { label: "User", sortBy: "actorEmail", sortOrder: "asc", iconType: "text" },
    { label: "Entity", sortBy: "entityType", sortOrder: "desc", iconType: "text" },
    { label: "Entity", sortBy: "entityType", sortOrder: "asc", iconType: "text" },
    { label: "Newest", sortBy: "createdAt", sortOrder: "desc", iconType: "date" },
    { label: "Newest", sortBy: "createdAt", sortOrder: "asc", iconType: "date" },
  ];

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "text-[#00D084]";
      case "UPDATE": return "text-[#FF9800]";
      case "DELETE": return "text-[#F44336]";
      default: return "text-blue-500";
    }
  };

  const getActions = (log: AuditLog) => {
    const slug = `${slugify(log.entityType)}-${slugify(log.action)}--${encodeId(log.id)}`;
    return [
      { label: "View Details", icon: Eye, onClick: () => router.push(`/admin/audit/${slug}`) },
      { label: "Delete Log", icon: Trash2, onClick: () => setDeleteId(log.id), isDestructive: true },
    ];
  };

  // Grid Template: Action, User, Entity, Time, Sort
  const gridTemplate = "grid-cols-[150px_1fr_1fr_180px_80px]";

  return (
    <div className="w-full bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm mb-20">
      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isPending}
        title="Delete Log"
        description="Are you sure you want to delete this log entry?"
      />

      {/* Table Header */}
      <div className={`grid ${gridTemplate} bg-[#2B7FFF] text-white py-3 px-6 text-[14px] font-bold uppercase tracking-wider items-center`}>
        <div>Action</div>
        <div>User</div>
        <div>Entity</div>
        <div>Time</div>
        <div className="flex justify-end">
          <AdminSortMenu options={sortOptions} />
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {sortedLogs.map((log) => (
          <div key={log.id} className={`grid ${gridTemplate} py-4 px-6 items-center hover:bg-gray-50 transition-colors group`}>
            {/* Action */}
            <div className="pr-4">
              <div className={`font-bold text-[14px] ${getActionColor(log.action)}`}>
                {log.action.toUpperCase()}
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5 uppercase tracking-tight">
                Method: {log.httpMethod}
              </div>
            </div>

            {/* User */}
            <div className="pr-4 min-w-0">
              <div className="font-bold text-[14px] text-gray-900 truncate">
                {log.actorUsername}
              </div>
              <div className="text-[12px] text-gray-500 truncate">{log.actorEmail}</div>
              <div className="text-[11px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                {log.actorRole}
              </div>
            </div>

            {/* Entity */}
            <div className="pr-4 min-w-0">
              <div className="font-bold text-[14px] text-gray-800 capitalize">
                {log.entityType}
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-1 flex items-center gap-1 truncate">
                {log.entityId} <ExternalLink className="w-3 h-3" />
              </div>
            </div>

            {/* Time */}
            <div className="pr-4">
              <div className="text-[14px] text-gray-800 font-medium">
                {new Date(log.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
              </div>
              <div className="text-[12px] text-gray-500 mt-0.5">
                {new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <AdminActionMenu actions={getActions(log)} />
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic bg-gray-50/30">
            No activity logs found.
          </div>
        )}
      </div>
    </div>
  );
}
