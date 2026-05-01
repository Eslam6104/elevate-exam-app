"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const bulkCreateQuestionsAction = async (examId: string, questions: any[]) => {
  try {
    console.log(`Bulk creating questions for exam ${examId}:`, JSON.stringify(questions, null, 2));
    const response = await apiClient.post(`/questions/exam/${examId}/bulk`, { questions });
    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error bulk creating questions:`, error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to bulk create questions"
    };
  }
};
