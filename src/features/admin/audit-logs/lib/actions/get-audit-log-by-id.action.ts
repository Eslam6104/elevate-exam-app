"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { AuditLog } from "../../types/audit-log.types";

export interface AuditLogDetailResponse {
  status: boolean;
  code: number;
  payload: {
    auditLog: AuditLog;
  };
}

export const getAuditLogByIdAction = async (id: string): Promise<AuditLogDetailResponse | null> => {
  try {
    const response = await apiClient.get<AuditLogDetailResponse>(`/admin/audit-logs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching audit log ${id}:`, error);
    return null;
  }
};
