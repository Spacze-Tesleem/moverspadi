// Auth API — mapped to backend routes in authRoutes.js
//
// POST /auth/signup                → signup
// POST /auth/verify-otp            → verifyOtp        (signup OTP)
// POST /auth/login                 → login
// POST /auth/verify-login-otp      → verifyLoginOtp   (login OTP)
// POST /auth/forgot-password       → forgotPassword
// POST /auth/reset-password/:token → resetPassword
// POST /auth/logout                → logout

import { apiClient } from "./client";
import type { AuthSession } from "@/src/types/auth/types";

/**
 * Returns true when `err` is a network/connection failure
 * (backend unreachable, cold-start timeout, CORS, etc.)
 * rather than an explicit API error response (4xx / 5xx body).
 */
export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  // Our client always prefixes HTTP error messages with "API "
  if (err.message.startsWith("API ")) return false;
  return true;
}

/**
 * Fire-and-forget ping that wakes the Render free-tier instance so
 * it is ready by the time the user submits a form.
 * Hits the root path since the backend has no dedicated /health endpoint.
 */
export function warmupBackend(): void {
  if (!process.env.NEXT_PUBLIC_API_URL) return;
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/`).catch(() => { /* intentionally silent */ });
}

// ── Payload types ─────────────────────────────────────────────────────────────

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  role: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  companyId?: string;
  accessKey?: string;
  role: string;
}

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

// ── API methods ───────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /auth/signup — registers a new user and triggers a signup OTP */
  signup: (payload: SignupPayload) =>
    apiClient.post<void>("/auth/signup", payload),

  /** POST /auth/verify-otp — confirms the OTP sent after signup */
  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<AuthSession>("/auth/verify-otp", payload),

  /** POST /auth/login — authenticates credentials and triggers a login OTP */
  login: (payload: LoginPayload) =>
    apiClient.post<void>("/auth/login", payload),

  /** POST /auth/verify-login-otp — confirms the OTP sent after login */
  verifyLoginOtp: (payload: VerifyLoginOtpPayload) =>
    apiClient.post<AuthSession>("/auth/verify-login-otp", payload),

  /** POST /auth/forgot-password — sends a password-reset link to the email */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<void>("/auth/forgot-password", payload),

  /** POST /auth/reset-password/:token — sets a new password using the reset token */
  resetPassword: ({ token, ...body }: ResetPasswordPayload) =>
    apiClient.post<void>(`/auth/reset-password/${token}`, body),

  /** POST /auth/logout — invalidates the session token server-side */
  logout: (token: string) =>
    apiClient.post<void>("/auth/logout", {}, { token }),
};
