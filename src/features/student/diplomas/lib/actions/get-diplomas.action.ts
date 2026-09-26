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
    console.warn("HTTP fetch diplomas failed, using direct db fallback:", error);
    try {
      const { db } = await import("@/lib/backend/db");
      const { paginate } = await import("@/lib/backend/helpers");
      let data = [...db.diplomas];
      if (title) data = data.filter((d) => d.title.toLowerCase().includes(title.toLowerCase()));
      if (immutable) data = data.filter((d) => String(d.immutable) === immutable);
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { status: true, code: 200, payload: paginate(data, page, limit) };
    } catch (fallbackErr) {
      console.error("Direct fallback also failed:", fallbackErr);
      throw new Error("Failed to load diplomas");
    }
  }
};
