"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import type { UserRole } from "@/src/domain/auth/types";

/**
 * Redirects to /auth/login if the user is not authenticated
 * or does not have the required role.
 */
export function useRequireAuth(requiredRole: UserRole) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || role !== requiredRole) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, role, requiredRole, router]);

  return { isAuthenticated, role };
}
