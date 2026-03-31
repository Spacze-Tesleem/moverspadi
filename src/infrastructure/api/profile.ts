// Profile API — GET and PUT for user profile data
//
// HOW TO WIRE THE REAL API:
//   1. Set NEXT_PUBLIC_API_URL in .env.local
//   2. The dummy data blocks are clearly marked — delete them and uncomment
//      the real apiClient calls when the backend endpoints are ready.

import { apiClient } from "./client";
import type { UserProfile, NextOfKin } from "@/src/domain/user/types";

export interface CompleteProfilePayload {
  gender?: string;
  dob?: string;
  emergencyContact?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  guarantorName?: string;
  guarantorPhone?: string;
  documents?: Record<string, boolean>;
}

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// Returned when NEXT_PUBLIC_API_URL is not set. Mirrors the real API shape.
// Replace with real apiClient calls once the backend is ready.
const DUMMY_PROFILE: UserProfile = {
  id: "usr-001",
  fullName: "Demo Mover",
  email: "mover@demo.com",
  phone: "+234 801 234 5678",
  gender: "Male",
  dateOfBirth: "1992-04-15",
  address: "14 Bode Thomas Street, Surulere, Lagos",
  avatarUrl: undefined,
};
// ─────────────────────────────────────────────────────────────────────────────

export const profileApi = {
  /**
   * Fetch the authenticated user's profile.
   * Real endpoint: GET /profile/me
   */
  getProfile: async (token: string): Promise<UserProfile> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 400)); // simulate latency
      return DUMMY_PROFILE;
    }
    return apiClient.get<UserProfile>("/profile/me", { token });
  },

  /**
   * Submit profile completion data after onboarding.
   * Real endpoint: PUT /profile/complete
   */
  completeProfile: async (
    payload: CompleteProfilePayload,
    token: string
  ): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 800));
      return;
    }
    return apiClient.put<void>("/profile/complete", payload, { token });
  },

  /**
   * Update profile fields.
   * Real endpoint: PUT /profile
   */
  updateProfile: async (
    payload: Partial<UserProfile>,
    token: string
  ): Promise<UserProfile> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 600));
      return { ...DUMMY_PROFILE, ...payload };
    }
    return apiClient.put<UserProfile>("/profile", payload, { token });
  },
};
