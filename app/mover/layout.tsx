"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function MoverLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth("mover");
  return <>{children}</>;
}
