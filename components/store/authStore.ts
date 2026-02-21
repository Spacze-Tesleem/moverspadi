import { create } from "zustand"

type Role = "customer" | "mover" | "company" | "admin" | null

interface AuthState {
  user: any
  role: Role
  token: string | null
  isAuthenticated: boolean
  login: (user: any, role: Role, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,

  login: (user, role, token) =>
    set({
      user,
      role,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
    }),
}))
