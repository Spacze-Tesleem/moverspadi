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
 * Uses the same /backend rewrite as all other API calls so it stays
 * same-origin and avoids CORS. A POST with an empty body to /auth/login
 * returns 400 (missing fields) which is enough to wake the instance.
 */
export function warmupBackend(): void {
  fetch("/backend/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  }).catch(() => { /* intentionally silent */ });
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
  signup: (payload: SignupPayload) =>
    apiClient.post<void>("/auth/signup", {
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      role: payload.role,
    }),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<AuthSession>("/auth/verify-otp", {
      email: payload.email,
      otp_code: payload.otp,
    }),

  login: (payload: LoginPayload) =>
    apiClient.post<void>("/auth/login", {
      email: payload.email,
      password: payload.password,
    }),

  verifyLoginOtp: (payload: VerifyLoginOtpPayload) =>
    apiClient.post<AuthSession>("/auth/verify-login-otp", {
      email: payload.email,
      otp_code: payload.otp,
    }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<void>("/auth/forgot-password", payload),

  resetPassword: ({ token, ...body }: ResetPasswordPayload) =>
    apiClient.post<void>(`/auth/reset-password/${token}`, body),

  logout: (token: string) =>
    apiClient.post<void>("/auth/logout", {}, { token }),
};
