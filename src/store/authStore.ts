"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole, VerificationStatus } from "@/src/types/auth/types";

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
        set({
          user,
          role,
          token,
          isAuthenticated: true,
          // Supply-side roles start pending until admin approves
          verificationStatus:
            verificationStatus ??
            (role === "customer" || role === "admin" ? "approved" : "pending"),
        }),

      logout: () =>
        set({
          user: null,
          role: null,
          token: null,
          isAuthenticated: false,
          profileComplete: false,
          verificationStatus: "approved",
        }),

      setProfileComplete: (value) => set({ profileComplete: value }),

      setVerificationStatus: (status) => set({ verificationStatus: status }),

      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "moverspadi-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
