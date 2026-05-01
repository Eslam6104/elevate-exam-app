"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const createExamAction = async (data: any) => {
  try {
    const response = await apiClient.post("/exams", data);
    revalidatePath("/admin/exams");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating exam:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to create exam" 
    };
  }
};

export const updateExamAction = async (id: string, data: any) => {
  try {
    const response = await apiClient.put(`/exams/${id}`, data);
    revalidatePath("/admin/exams");
    revalidatePath(`/admin/exams/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating exam:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to update exam" 
    };
  }
};
