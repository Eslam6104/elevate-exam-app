import apiClient from "@/shared/lib/apis/api-client";
import { DiplomasResponse } from "../../types/diploma.types";

export const getDiplomasApi = (
  page: number = 1,
  limit: number = 20,
  title?: string,
  immutable?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  let url = `/diplomas?page=${page}&limit=${limit}`;
  if (title) url += `&title=${encodeURIComponent(title)}`;
  if (immutable) url += `&immutable=${immutable}`;
  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortOrder) url += `&sortOrder=${sortOrder}`;
  return apiClient.get<DiplomasResponse>(url);
};
