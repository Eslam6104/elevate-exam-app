"use server";
import { updateDiplomaApi } from "../apis/update-diploma.api";
import { revalidatePath } from "next/cache";

export const updateDiplomaAction = async (id: string, data: { title: string; description: string; image: string }) => {
  try {
    const response = await updateDiplomaApi(id, data);
    revalidatePath("/admin/diplomas");
    revalidatePath(`/admin/diplomas/${id}`);
    revalidatePath("/admin/exams");
    revalidatePath("/student/diplomas");
    revalidatePath(`/student/diplomas/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Failed to update diploma:", error.response?.data || error);
    const apiMsg = error.response?.data?.message || "Failed to update diploma.";
    return { success: false, error: apiMsg };
  }
};
