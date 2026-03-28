"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole } from "@/src/domain/auth/types";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, role: UserRole, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,

      login: (user, role, token) =>
        set({ user, role, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, role: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "moverspadi-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
