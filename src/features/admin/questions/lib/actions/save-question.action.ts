"use server";
import apiClient from "@/shared/lib/apis/api-client";
import { revalidatePath } from "next/cache";

export const updateQuestionAction = async (id: string, data: any) => {
  try {
    const { text, answers, examId } = data;
    const payload = { text, answers };
    console.log(`Updating question ${id} with payload:`, JSON.stringify(payload, null, 2));
    const response = await apiClient.put(`/questions/${id}`, payload);
    revalidatePath(`/admin/exams/${examId}`);
    revalidatePath(`/admin/questions/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error updating question ${id}:`, error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update question"
    };
  }
};

export const createQuestionAction = async (data: any) => {
  try {
    const { text, examId, answers } = data;
    const payload = { text, examId, answers };
    console.log(`Creating question with payload:`, JSON.stringify(payload, null, 2));
    const response = await apiClient.post(`/questions`, payload);
    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error creating question:`, error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create question"
    };
  }
};
