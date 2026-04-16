"use client";

import { useRequireAuth } from "@/src/hooks/useAuth";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("provider");
  if (!authorized) return null;
  return <>{children}</>;
}
