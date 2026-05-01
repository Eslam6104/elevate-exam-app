import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/apis/api-client";
import { ProfileResponse } from "../types";

export interface RequestEmailChangePayload {
  newEmail: string;
}

export interface ConfirmEmailChangePayload {
  code: string;
}

export const useRequestEmailChangeMutation = () => {
  return useMutation({
    mutationFn: async (payload: RequestEmailChangePayload) => {
      const { data } = await apiClient.post("/users/email/request", payload);
      return data;
    },
  });
};

export const useConfirmEmailChangeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ConfirmEmailChangePayload) => {
      const { data } = await apiClient.post<{ message: string; user: ProfileResponse["user"] }>(
        "/users/email/confirm",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
