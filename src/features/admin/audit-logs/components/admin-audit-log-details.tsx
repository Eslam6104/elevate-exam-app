"use client";
import { AuditLog } from "../types/audit-log.types";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteAuditLogAction } from "../lib/actions/delete-audit-log.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AdminAuditLogDetails({ log }: { log: AuditLog }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "text-[#00D084]";
      case "UPDATE": return "text-[#FF9800]";
      case "DELETE": return "text-[#F44336]";
      default: return "text-blue-500";
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteAuditLogAction(log.id);
      if (res.success) {
        toast.success("Log entry deleted successfully");
        router.push("/admin/audit");
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
        <Link href="/admin/audit" className="hover:text-blue-600 transition-colors">Audit Log</Link>
        <span>/</span>
        <span className="text-blue-600 capitalize">{log.entityType} {log.action.toLowerCase()} by {log.actorUsername}</span>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
          <div className="space-y-1">
            <h1 className="text-[20px] font-bold text-gray-900 capitalize leading-snug">
              {log.entityType} {log.action.toLowerCase()} By {log.actorUsername}
            </h1>
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <span>Entity:</span>
              <span className="font-medium text-gray-700 capitalize">{log.entityType} [{log.entityId}]</span>
              <ExternalLink className="w-3.5 h-3.5 cursor-pointer hover:text-blue-600" />
            </div>
          </div>
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 bg-[#F44336] hover:bg-red-600 text-white px-5 py-2.5 rounded-sm font-medium text-[15px] transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-20">
            {/* Left Column */}
            <div className="space-y-8">
              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Action</h3>
                <div className={`font-bold text-[16px] ${getActionColor(log.action)}`}>{log.action.toUpperCase()}</div>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Method</h3>
                <div className="font-bold text-[16px] text-gray-700">{log.httpMethod}</div>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">User</h3>
                <div className="space-y-1">
                  <div className="font-bold text-[16px] text-gray-800">{log.actorUsername}</div>
                  <div className="text-[13px] text-gray-500 font-medium">Email: {log.actorEmail}</div>
                  <div className="text-[13px] text-gray-500 font-medium">IP Address: {log.ipAddress}</div>
                  <div className="text-[12px] text-[#F44336] font-extrabold mt-2 uppercase tracking-wide">Role: {log.actorRole}</div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Entity</h3>
                <div className="flex items-center gap-2 font-semibold text-[16px] text-gray-800">
                  <span className="capitalize">{log.entityType}:</span>
                  <span className="text-gray-500 font-mono text-[13px] tracking-tight">{log.entityId}</span>
                  <ExternalLink className="w-4 h-4 text-blue-500 cursor-pointer" />
                </div>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</h3>
                <div className="font-bold text-[16px] text-gray-700">
                  {new Date(log.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
                  <span className="mx-3 text-gray-200">|</span>
                  {new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Updated Fields</h3>
                <div className="text-[16px] text-gray-700 font-semibold italic">
                  {log.metadata?.updatedFields?.join(", ") || "title, description"}
                </div>
              </section>
            </div>
          </div>

          {/* Metadata JSON */}
          <section className="space-y-3 pt-6 border-t border-gray-50">
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Metadata</h3>
            <div className="bg-[#ECEFF1] rounded-sm p-8 overflow-auto font-mono text-[14px] leading-[1.6] text-gray-700 shadow-inner">
              <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
