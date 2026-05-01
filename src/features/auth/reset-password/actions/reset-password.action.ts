"use server";
import { resetPasswordApi } from "@/features/auth/lib/apis/auth.api";

export const resetPasswordAction = async (data: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await resetPasswordApi(data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};
