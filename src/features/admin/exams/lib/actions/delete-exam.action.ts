"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const deleteExamAction = async (id: string) => {
  try {
    const response = await apiClient.delete(`/exams/${id}`);
    revalidatePath("/admin/exams");
    revalidatePath("/admin/diplomas");
    revalidatePath("/student/diplomas");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Failed to delete exam:", error.response?.data || error);
    const apiMsg = error.response?.data?.message || "Failed to delete exam.";
    return { success: false, error: apiMsg };
  }
};
