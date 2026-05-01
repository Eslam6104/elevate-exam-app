"use server";
import { getDiplomasApi } from "../apis/get-diplomas.api";

export const getDiplomasAction = async (
  page: number = 1,
  limit: number = 20,
  title?: string,
  immutable?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const response = await getDiplomasApi(page, limit, title, immutable, sortBy, sortOrder);
    return response.data;
  } catch (error) {
    console.error("Error fetching diplomas:", error);
    throw new Error("Failed to load diplomas");
  }
};
