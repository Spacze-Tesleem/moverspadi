// Core auth domain types — no framework dependencies

export type UserRole = "customer" | "mover" | "provider" | "company" | "admin";

/**
 * User account status (backend: users.status)
 *
 * pending   — registered, OTP not yet verified (or awaiting admin action)
 * active    — fully operational account
 * suspended — admin-suspended, cannot log in or transact
 * rejected  — application rejected by admin
 */
export type UserStatus = "pending" | "active" | "suspended" | "rejected";

/**
 * Verification status for supply-side actors (backend: verifications.status)
 *
 * pending                — documents submitted, awaiting admin review
 * approved               — admin approved, can accept jobs
 * rejected               — admin rejected, must resubmit
 * resubmission_required  — admin requested corrected/additional documents
 * suspended              — account suspended post-approval
 */
export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission_required"
  | "suspended";

export interface User {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  status?: UserStatus;
}

export interface AuthSession {
  user: User;
  role: UserRole;
  token: string;
  verificationStatus?: VerificationStatus;
}
