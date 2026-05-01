import apiClient from "@/shared/lib/apis/api-client";
import { Diploma } from "../../types/diploma.types";

export interface SingleDiplomaResponse {
  payload: {
    diploma: Diploma;
  };
}

export const getDiplomaByIdApi = (id: string) => {
  return apiClient.get<SingleDiplomaResponse>(`/diplomas/${id}`);
};
