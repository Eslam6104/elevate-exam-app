"use server";
import { deleteDiplomaApi } from "../apis/delete-diploma.api";
import { revalidatePath } from "next/cache";

export const deleteDiplomaAction = async (id: string) => {
  try {
    const response = await deleteDiplomaApi(id);
    revalidatePath("/admin/diplomas");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Failed to delete diploma:", error.response?.data || error);
    const apiMsg = error.response?.data?.message || "Failed to delete diploma.";
    return { success: false, error: apiMsg };
  }
};
