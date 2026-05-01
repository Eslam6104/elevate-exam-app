import apiClient from "@/shared/lib/apis/api-client";

type UpdateDiplomaPayload = {
  title: string;
  description: string;
  image: string;
};

export const updateDiplomaApi = (id: string, data: UpdateDiplomaPayload) => {
  return apiClient.put(`/diplomas/${id}`, data);
};
