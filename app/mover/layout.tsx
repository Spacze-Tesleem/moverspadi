"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function MoverLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("mover");
  if (!authorized) return null;
  return <>{children}</>;
}
