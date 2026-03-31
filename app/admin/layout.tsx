"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("admin");
  if (!authorized) return null;
  return <>{children}</>;
}
