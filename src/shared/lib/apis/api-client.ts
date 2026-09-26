import axios from "axios";
import { getSession } from "next-auth/react";
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Client-side in browser
  if (typeof window !== "undefined") {
    if (envUrl && envUrl.trim() !== "") {
      return envUrl;
    }
    return "/api/v1";
  }

  // Server-side (Node.js runtime / Server Actions / SSR)
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }

  const pathPrefix = envUrl && envUrl.startsWith("/") ? envUrl : "/api/v1";

  if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith("http")) {
    const origin = process.env.NEXTAUTH_URL.replace(/\/$/, "");
    return `${origin}${pathPrefix}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${pathPrefix}`;
  }

  const port = process.env.PORT || 3000;
  return `http://127.0.0.1:${port}${pathPrefix}`;
}

// api client for the whole project  
const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0",
  },
});

apiClient.interceptors.request.use(async (config) => {
  config.baseURL = getApiBaseUrl();
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