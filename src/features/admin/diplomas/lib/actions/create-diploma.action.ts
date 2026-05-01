"use server";
import { createDiplomaApi } from "../apis/create-diploma.api";
import { revalidatePath } from "next/cache";

export const createDiplomaAction = async (data: { title: string; description: string; image: string }) => {
  try {
    const response = await createDiplomaApi(data);
    revalidatePath("/admin/diplomas");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Failed to create diploma:", error.response?.data || error);
    const apiMsg = error.response?.data?.message || "Failed to create diploma.";
    return { success: false, error: apiMsg };
  }
};
