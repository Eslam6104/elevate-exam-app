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
    console.warn("HTTP fetch exams failed, using direct db fallback:", error);
    try {
      const { db } = await import("@/lib/backend/db");
      const { paginate } = await import("@/lib/backend/helpers");
      let data = db.exams.map((e) => {
        const diploma = db.diplomas.find((d) => d.id === e.diplomaId);
        return { ...e, questionsCount: db.questions.filter((q) => q.examId === e.id).length, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: e.diplomaId, title: "Unknown" } };
      });
      if (title) data = data.filter((e) => e.title.toLowerCase().includes(title.toLowerCase()));
      if (diplomaId) data = data.filter((e) => e.diplomaId === diplomaId);
      if (immutable) data = data.filter((e) => String(e.immutable) === immutable);
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { status: true, code: 200, payload: paginate(data, page, limit) };
    } catch (fallbackErr) {
      console.error("Direct fallback failed:", fallbackErr);
      throw new Error("Failed to load exams");
    }
  }
};
