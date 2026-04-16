// Core auth domain types — no framework dependencies

export type UserRole = "customer" | "mover" | "provider" | "company" | "admin";

/**
 * pending   — submitted, awaiting admin review
 * approved  — admin approved, can accept jobs
 * rejected  — admin rejected, must re-submit
 */
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface User {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User;
  role: UserRole;
  token: string;
  verificationStatus?: VerificationStatus;
}
