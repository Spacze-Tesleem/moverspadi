// Core auth domain types — no framework dependencies

export type UserRole = "customer" | "mover" | "company" | "admin";

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
}
