"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole, VerificationStatus } from "@/src/domain/auth/types";
import { clearSession } from "@/src/lib/sessionClient";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once the mover/provider/company onboarding wizard is submitted */
  profileComplete: boolean;
  /**
   * Supply-side actors (mover, provider, company) start as "pending" after
   * onboarding submission and become "approved" once an admin reviews them.
   * Customers and admins are always "approved".
   */
  verificationStatus: VerificationStatus;
  /** True once Zustand has rehydrated from localStorage */
  _hydrated: boolean;
  login: (user: User, role: UserRole, token: string, verificationStatus?: VerificationStatus) => void;
  logout: () => void;
  setProfileComplete: (value: boolean) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      profileComplete: false,
      verificationStatus: "approved",
      _hydrated: false,

      login: (user, role, token, verificationStatus) =>
        set((state) => ({
          user,
          role,
          token,
          isAuthenticated: true,
          // Priority order:
          // 1. Backend-provided status (most authoritative)
          // 2. Existing status in store (returning user logging in again)
          // 3. Derived default: customers/admins are always approved;
          //    supply-side roles start pending until admin approves
          verificationStatus:
            verificationStatus ??
            state.verificationStatus ??
            (role === "customer" || role === "admin" ? "approved" : "pending"),
        })),

      logout: () => {
        // Clear the httpOnly session cookie server-side before wiping local state.
        clearSession().catch(() => { /* best-effort — local state is cleared regardless */ });
        set({
          user: null,
          role: null,
          token: null,
          isAuthenticated: false,
          profileComplete: false,
          verificationStatus: "approved",
        });
      },

      setProfileComplete: (value) => set({ profileComplete: value }),

      setVerificationStatus: (status) => set({ verificationStatus: status }),

      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "moverspadi-auth",
      storage: createJSONStorage(() => localStorage),
      // Exclude the token from localStorage — it lives in the httpOnly cookie only.
      // User identity (name, role, etc.) is still persisted for UI hydration.
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        profileComplete: state.profileComplete,
        verificationStatus: state.verificationStatus,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
