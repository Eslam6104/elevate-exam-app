"use server";
import { getQuestionByIdApi } from "../apis/get-question-by-id.api";

export const getQuestionByIdAction = async (id: string) => {
  try {
    const response = await getQuestionByIdApi(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    throw new Error("Failed to load question details");
  }
};
