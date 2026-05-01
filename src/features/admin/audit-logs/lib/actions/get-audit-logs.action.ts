"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { AuditLogResponse } from "../../types/audit-log.types";

export const getAuditLogsAction = async (
  page: number = 1,
  limit: number = 20,
  category?: string,
  action?: string,
  userId?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<AuditLogResponse | null> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category && category !== "all") params.append("category", category);
    if (action && action !== "all") params.append("action", action);
    if (userId && userId !== "all") params.append("userId", userId);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await apiClient.get<AuditLogResponse>(`/admin/audit-logs?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return null;
  }
};
