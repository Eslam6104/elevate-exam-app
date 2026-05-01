"use server";
import { loginService } from "../services/auth.service";

export const loginAction = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const result = await loginService(data);

    return result;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
// action is for
// cookies
// redirect
// security
// logging