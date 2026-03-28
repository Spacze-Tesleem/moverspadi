"use client";

import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth("company");
  return <>{children}</>;
}
