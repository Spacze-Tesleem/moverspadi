"use client";

/**
 * Transport Provider dashboard.
 *
 * Providers share the same operational UI as independent movers once approved.
 * The pending-approval gate runs with role="provider" so the correct checklist
 * items and resubmit path (/provider/onboarding) are shown.
 */

import PendingApprovalView from "@/src/features/auth/views/PendingApprovalView";
import { MoverDashboardInner } from "./MoverDashboardView";

export default function ProviderDashboardView() {
  return <PendingApprovalView approvedDashboard={<MoverDashboardInner />} />;
}
