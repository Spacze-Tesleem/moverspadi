"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("customer");
  if (!authorized) return null;
  return <>{children}</>;
}
