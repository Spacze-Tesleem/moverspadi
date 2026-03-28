"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth("customer");
  return <>{children}</>;
}
