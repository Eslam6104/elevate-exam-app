import { getAuditLogByIdAction } from "@/features/admin/audit-logs/lib/actions/get-audit-log-by-id.action";
import { AdminAuditLogDetails } from "@/features/admin/audit-logs/components/admin-audit-log-details";
import { notFound } from "next/navigation";
import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default async function AdminAuditLogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = extractIdFromSlug(rawId);
  const response = await getAuditLogByIdAction(id);
  const log = response?.payload?.auditLog;

  if (!log) notFound();

  return <AdminAuditLogDetails log={log} />;
}
