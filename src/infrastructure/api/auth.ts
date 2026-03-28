// Auth API calls

import { apiClient } from "./client";
import type { AuthSession } from "@/src/domain/auth/types";

interface LoginPayload {
  email?: string;
  password?: string;
  companyId?: string;
  accessKey?: string;
  role: string;
}

interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthSession>("/auth/login", payload),

  signup: (payload: SignupPayload) =>
    apiClient.post<AuthSession>("/auth/signup", payload),

  logout: (token: string) =>
    apiClient.post<void>("/auth/logout", {}, { token }),
};
