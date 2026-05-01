"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const deleteQuestionAction = async (id: string, examId: string) => {
  try {
    const response = await apiClient.delete(`/questions/${id}`);
    revalidatePath(`/admin/exams/${examId}`);
    return { status: true, data: response.data };
  } catch (error: any) {
    console.error(`Error deleting question ${id}:`, error.response?.data || error.message);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to delete question"
    };
  }
};
