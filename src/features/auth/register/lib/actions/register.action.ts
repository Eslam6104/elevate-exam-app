import { registerApi } from "@/features/auth/lib/apis/auth.api";

export const registerAction = async (data: any) => {
  try {
    const res = await registerApi(data);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Register failed");
  }
};