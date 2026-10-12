import { api, authToken } from "./api";

interface LoginResponse {
  token: string;
  expiresIn: string;
}

interface MeResponse {
  role: "owner";
}

export async function login(password: string, signal?: AbortSignal): Promise<void> {
  const { data } = await api.post<LoginResponse>("/auth/login", { password }, { signal });
  authToken.set(data.token);
}

export async function verifySession(signal?: AbortSignal): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/auth/me", { signal });
  return data;
}

export function logout(): void {
  authToken.clear();
}
