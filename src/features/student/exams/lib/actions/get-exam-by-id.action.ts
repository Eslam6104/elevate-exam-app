"use server";
import { getExamByIdApi } from "../apis/get-exam-by-id.api";

export const getExamByIdAction = async (id: string) => {
  try {
    const response = await getExamByIdApi(id);
    return response.data;
  } catch (error) {
    console.warn(`HTTP fetch exam ${id} failed, using direct db fallback:`, error);
    try {
      const { db } = await import("@/lib/backend/db");
      const exam = db.exams.find((e) => e.id === id);
      if (!exam) throw new Error("Exam not found");
      const diploma = db.diplomas.find((d) => d.id === exam.diplomaId);
      return { status: true, code: 200, payload: { exam: { ...exam, questionsCount: db.questions.filter((q) => q.examId === exam.id).length, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: exam.diplomaId, title: "Unknown" } } } };
    } catch {
      throw new Error("Failed to load exam details");
    }
  }
};
