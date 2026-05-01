"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const clearAllAuditLogsAction = async () => {
  try {
    const response = await apiClient.delete("/admin/audit-logs");
    revalidatePath("/admin/audit");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error clearing all audit logs:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to clear audit logs"
    };
  }
};
