import { AdminPageHeader } from "@/features/admin/shared/components/admin-page-header";
import { getAuditLogsAction } from "@/features/admin/audit-logs/lib/actions/get-audit-logs.action";
import { AdminAuditLogTable } from "@/features/admin/audit-logs/components/table/admin-audit-log-table";
import { AdminAuditLogFilters } from "@/features/admin/audit-logs/components/admin-audit-log-filters";
import { AdminAuditLogClearAll } from "@/features/admin/audit-logs/components/admin-audit-log-clear-all";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; action?: string; userId?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const category = resolvedParams.category;
  const action = resolvedParams.action;
  const userId = resolvedParams.userId;
  const sortBy = resolvedParams.sortBy;
  const sortOrder = resolvedParams.sortOrder;
  const limit = 20;

  // Intercept unsupported sort keys to prevent 400 error
  // The table will handle these locally
  const apiSortBy = (sortBy === "action" || sortBy === "actorEmail" || sortBy === "entityType") 
    ? undefined 
    : sortBy;

  const response = await getAuditLogsAction(page, limit, category, action, userId, apiSortBy, sortOrder);
  const logs = response?.payload?.data || [];
  const meta = response?.payload?.metadata || { page: 1, total: 0, totalPages: 1 };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-gray-500 text-sm font-medium">Audit Log</div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <AdminPageHeader 
          total={meta.total} 
          page={meta.page} 
          totalPages={meta.totalPages} 
          actionButton={<AdminAuditLogClearAll />}
        />
        
        <AdminAuditLogFilters />
        
        <AdminAuditLogTable 
          logs={logs} 
          key={JSON.stringify(resolvedParams)} 
        />
      </div>
    </div>
  );
}
