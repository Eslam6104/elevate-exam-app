import apiClient from "@/shared/lib/apis/api-client";
import { ExamsResponse } from "../../types/exam.types";

export const getExamsApi = (
  page: number = 1,
  limit: number = 20,
  title?: string,
  diplomaId?: string,
  immutable?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  let url = `/exams?page=${page}&limit=${limit}`;
  if (title) url += `&title=${encodeURIComponent(title)}`;
  if (diplomaId) url += `&diplomaId=${diplomaId}`;
  if (immutable) url += `&immutable=${immutable}`;
  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortOrder) url += `&sortOrder=${sortOrder}`;
  return apiClient.get<ExamsResponse>(url);
};
