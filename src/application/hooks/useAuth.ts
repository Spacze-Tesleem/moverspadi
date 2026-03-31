"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import type { UserRole } from "@/src/domain/auth/types";

/**
 * Redirects to /auth/login if the user is not authenticated or does not
 * have the required role. Returns null until the store has rehydrated from
 * localStorage so protected content never flashes before the redirect.
 */
export function useRequireAuth(requiredRole: UserRole) {
  const router = useRouter();
  const { isAuthenticated, role, _hydrated } = useAuthStore();

  const authorized = _hydrated && isAuthenticated && role === requiredRole;

  useEffect(() => {
    if (!_hydrated) return;
    if (!isAuthenticated || role !== requiredRole) {
      router.replace("/auth/login");
    }
  }, [_hydrated, isAuthenticated, role, requiredRole, router]);

  return { authorized, ready: _hydrated };
}
