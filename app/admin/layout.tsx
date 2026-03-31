"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth("admin");
  return <>{children}</>;
}
