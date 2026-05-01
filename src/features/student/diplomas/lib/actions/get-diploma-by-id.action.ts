"use server";
import { getDiplomaByIdApi } from "../apis/get-diploma-by-id.api";

export const getDiplomaByIdAction = async (id: string) => {
  try {
    const response = await getDiplomaByIdApi(id);
    return response.data;
  } catch (error) {
    console.error("Failed to get diploma by id:", error);
    throw new Error("Failed to load diploma details.");
  }
};
