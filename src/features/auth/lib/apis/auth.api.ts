import axios from "axios";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginApi = (data: {
  username: string;
  password: string;
}) => {
  return authClient.post("/auth/login", data);
};

export const registerApi = (data: any) => {
  return authClient.post("/auth/register", data);
};

export const sendEmailVerificationApi = (email: string) => {
  return authClient.post("/auth/send-email-verification", { email });
};

export const confirmEmailVerificationApi = (data: {
  email: string;
  code: string;
}) => {
  return authClient.post("/auth/confirm-email-verification", data);
};

export const forgotPasswordApi = (data: { email: string; redirectUrl: string }) => {
  return authClient.post<{ message: string; resetToken: string }>(
    "/auth/forgot-password",
    data
  );
};

export const resetPasswordApi = (data: any) => {
  return authClient.post("/auth/reset-password", data);
};