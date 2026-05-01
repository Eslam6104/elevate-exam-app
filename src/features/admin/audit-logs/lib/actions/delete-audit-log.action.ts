"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const deleteAuditLogAction = async (id: string) => {
  try {
    const response = await apiClient.delete(`/admin/audit-logs/${id}`);
    revalidatePath("/admin/audit");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error deleting audit log ${id}:`, error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete audit log"
    };
  }
};
