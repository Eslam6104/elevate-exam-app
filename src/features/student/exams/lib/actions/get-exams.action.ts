"use server";
import { getExamsApi } from "../apis/get-exams.api";

export const getExamsAction = async (
  page: number = 1,
  limit: number = 20,
  title?: string,
  diplomaId?: string,
  immutable?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const response = await getExamsApi(page, limit, title, diplomaId, immutable, sortBy, sortOrder);
    return response.data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw new Error("Failed to load exams");
  }
};
