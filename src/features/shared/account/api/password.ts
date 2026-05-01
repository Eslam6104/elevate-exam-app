import { useMutation } from "@tanstack/react-query";
import apiClient from "@/shared/lib/apis/api-client";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const { data } = await apiClient.post("/users/change-password", payload);
      return data;
    },
  });
};
