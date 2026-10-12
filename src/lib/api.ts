import axios, { AxiosError } from "axios";

const tokenKey = "email-studio-owner-token";

export const authToken = {
  get(): string | null {
    try {
      return localStorage.getItem(tokenKey);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(tokenKey, token);
    } catch {
      // The current session can still use the token held by the request interceptor.
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(tokenKey);
    } catch {
      // Storage may be unavailable in privacy-restricted browser contexts.
    }
  },
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401 && authToken.get()) {
      authToken.clear();
      window.dispatchEvent(new Event("email-studio:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isCancel(error)) return "";
  if (error instanceof AxiosError) {
    const body: unknown = error.response?.data;
    if (body && typeof body === "object") {
      const message = "message" in body ? body.message : "error" in body ? body.error : undefined;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (error.message === "Network Error") return "Could not reach the email service. Check your connection and try again.";
  }
  return fallback;
}
