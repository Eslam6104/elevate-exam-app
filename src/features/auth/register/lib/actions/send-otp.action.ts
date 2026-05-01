import { sendEmailVerificationApi } from "@/features/auth/lib/apis/auth.api";

export const sendOtpAction = async (email: string) => {
  try {
    const res = await sendEmailVerificationApi(email);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to send OTP");
  }
};