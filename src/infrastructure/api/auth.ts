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

interface VerifyOtpPayload {
  email: string;
  otp: string;
  role: string;
}

interface ResendOtpPayload {
  email: string;
  role: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthSession>("/auth/login", payload),

  signup: (payload: SignupPayload) =>
    apiClient.post<AuthSession>("/auth/signup", payload),

  /** Verify the OTP sent after login or signup. Returns a full auth session. */
  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<AuthSession>("/auth/verify-otp", payload),

  /** Re-send an OTP to the user's email/phone. */
  resendOtp: (payload: ResendOtpPayload) =>
    apiClient.post<void>("/auth/resend-otp", payload),

  logout: (token: string) =>
    apiClient.post<void>("/auth/logout", {}, { token }),
};
