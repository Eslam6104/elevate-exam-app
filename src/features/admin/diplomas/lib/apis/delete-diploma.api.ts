import apiClient from "@/shared/lib/apis/api-client";

export const deleteDiplomaApi = (id: string) => {
  return apiClient.delete(`/diplomas/${id}`);
};
