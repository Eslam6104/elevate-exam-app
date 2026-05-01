import { confirmEmailVerificationApi } from "@/features/auth/lib/apis/auth.api";

export const verifyOtpAction = async (email: string, code: string) => {
  try {
    const res = await confirmEmailVerificationApi({ email, code });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Invalid OTP");
  }
};