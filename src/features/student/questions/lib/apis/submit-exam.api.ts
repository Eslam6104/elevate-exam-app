import apiClient from "@/shared/lib/apis/api-client";
import { SubmissionPayload, SubmissionResponse } from "../../types/question.types";

export const submitExamApi = (payload: SubmissionPayload) => {
  return apiClient.post<SubmissionResponse>('/submissions', payload);
};
