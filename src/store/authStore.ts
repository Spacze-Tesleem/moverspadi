"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole } from "@/src/types/auth/types";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once the mover/company onboarding wizard is submitted */
  profileComplete: boolean;
  /** True once Zustand has rehydrated from localStorage */
  _hydrated: boolean;
  login: (user: User, role: UserRole, token: string) => void;
  logout: () => void;
  setProfileComplete: (value: boolean) => void;
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
      _hydrated: false,

      login: (user, role, token) =>
        set({ user, role, token, isAuthenticated: true }),

      logout: () =>
        set({
          user: null,
          role: null,
          token: null,
          isAuthenticated: false,
          profileComplete: false,
        }),

      setProfileComplete: (value) => set({ profileComplete: value }),

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
