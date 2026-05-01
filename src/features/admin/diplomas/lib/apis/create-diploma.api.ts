import apiClient from "@/shared/lib/apis/api-client";

type CreateDiplomaPayload = {
  title: string;
  description: string;
  image: string;
};

export const createDiplomaApi = (data: CreateDiplomaPayload) => {
  return apiClient.post("/diplomas", data);
};
