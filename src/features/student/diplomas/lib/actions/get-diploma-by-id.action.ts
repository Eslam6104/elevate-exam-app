"use server";
import { getDiplomaByIdApi } from "../apis/get-diploma-by-id.api";

export const getDiplomaByIdAction = async (id: string) => {
  try {
    const response = await getDiplomaByIdApi(id);
    return response.data;
  } catch (error) {
    console.warn("HTTP fetch diploma by id failed, using direct db fallback:", error);
    try {
      const { db } = await import("@/lib/backend/db");
      const diploma = db.diplomas.find((d) => d.id === id);
      if (!diploma) throw new Error("Diploma not found");
      return { status: true, code: 200, payload: { diploma } };
    } catch {
      throw new Error("Failed to load diploma details.");
    }
  }
};
