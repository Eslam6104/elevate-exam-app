import apiClient from "@/shared/lib/apis/api-client";
import { QuestionsResponse } from "../../types/question.types";

export const getQuestionsApi = (examId: string) => {
  return apiClient.get<QuestionsResponse>(`/questions/exam/${examId}`);
};
