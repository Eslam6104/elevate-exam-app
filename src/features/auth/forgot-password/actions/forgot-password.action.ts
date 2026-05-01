"use server";

import { forgotPasswordApi } from "@/features/auth/lib/apis/auth.api";

export const forgotPasswordAction = async (data: { email: string; redirectUrl: string }) => {
  try {
    const response = await forgotPasswordApi(data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset link"
    );
  }
};
