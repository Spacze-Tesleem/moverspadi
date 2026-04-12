"use client";

import { useRequireAuth } from "@/src/hooks/useAuth";

export default function MoverLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth(["mover", "provider"]);
  if (!authorized) return null;
  return <>{children}</>;
}
