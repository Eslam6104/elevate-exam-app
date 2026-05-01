"use server";
import { getQuestionsApi } from "../apis/get-questions.api";

export const getQuestionsAction = async (examId: string) => {
  try {
    const response = await getQuestionsApi(examId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching questions for exam ${examId}:`, error);
    throw new Error("Failed to load questions");
  }
};
