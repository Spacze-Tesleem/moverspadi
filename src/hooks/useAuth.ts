"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import type { UserRole } from "@/src/types/auth/types";

/**
 * Redirects to /auth/login if the user is not authenticated or does not
 * have one of the required roles. Accepts a single role or an array of roles.
 * Returns { authorized: false } until Zustand has rehydrated from localStorage
 * so protected content never flashes before the redirect.
 */
export function useRequireAuth(requiredRole: UserRole | UserRole[]) {
  const router = useRouter();
  const { isAuthenticated, role, _hydrated } = useAuthStore();

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const authorized = _hydrated && isAuthenticated && !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (!_hydrated) return;
    if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
      router.replace("/auth/login");
    }
  }, [_hydrated, isAuthenticated, role, router]);

  return { authorized, ready: _hydrated };
}
