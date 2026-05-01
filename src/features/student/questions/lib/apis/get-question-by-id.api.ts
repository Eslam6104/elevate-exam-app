import apiClient from "@/shared/lib/apis/api-client";
import { Question } from "../../types/question.types";

export interface QuestionDetailResponse {
  status: boolean;
  code: number;
  payload: {
    question: Question;
  };
}

export const getQuestionByIdApi = (id: string) => {
  return apiClient.get<QuestionDetailResponse>(`/questions/${id}`);
};
