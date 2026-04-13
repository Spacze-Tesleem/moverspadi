// Auth API calls

import { apiClient } from "./client";
import type { AuthSession } from "@/src/types/auth/types";

/**
 * Returns true when `err` represents a network/connection failure
 * (backend unreachable, Render cold-start timeout, CORS, etc.)
 * as opposed to an explicit API error response (4xx / 5xx body).
 */
export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  // Our client always prefixes HTTP error messages with "API "
  if (err.message.startsWith("API ")) return false;
  // fetch throws TypeError for all network-level failures
  return true;
}

/**
 * Fire-and-forget ping that wakes the Render free-tier instance so
 * it is ready by the time the user actually submits a form.
 */
export function warmupBackend(): void {
  if (!process.env.NEXT_PUBLIC_API_URL) return;
  fetch("/backend/health").catch(() => { /* intentionally silent */ });
}

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
