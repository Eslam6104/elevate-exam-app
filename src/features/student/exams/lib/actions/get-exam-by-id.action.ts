"use server";
import { getExamByIdApi } from "../apis/get-exam-by-id.api";

export const getExamByIdAction = async (id: string) => {
  try {
    const response = await getExamByIdApi(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exam ${id}:`, error);
    throw new Error("Failed to load exam details");
  }
};
