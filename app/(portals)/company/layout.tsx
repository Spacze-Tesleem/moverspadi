"use client";

import { useRequireAuth } from "@/src/hooks/useAuth";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("company");
  if (!authorized) return null;
  return <>{children}</>;
}
