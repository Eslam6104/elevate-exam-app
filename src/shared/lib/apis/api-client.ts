import axios from "axios";
import { getSession } from "next-auth/react";
// api client for th whole project  
const apiClient = axios.create({
    // axios instance giving him header and base url
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0",
  },
});

apiClient.interceptors.request.use(async (config) => {
  let token = undefined;

  if (typeof window !== "undefined") {
    // Client-side
    const session = await getSession();
    token = session?.token;
  } else {
    // Server-side
    try {
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth");
      const session = await getServerSession(authOptions);
      token = session?.token;
    } catch (error) {
      console.error("Failed to get session on server side", error);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;