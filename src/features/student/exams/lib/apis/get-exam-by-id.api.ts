import apiClient from "@/shared/lib/apis/api-client";
import { Exam } from "../../types/exam.types";

export interface ExamDetailResponse {
  status: boolean;
  code: number;
  payload: {
    exam: Exam;
  };
}

export const getExamByIdApi = (id: string) => {
  return apiClient.get<ExamDetailResponse>(`/exams/${id}`);
};
