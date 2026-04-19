// Admin API — platform stats, user management, verification queue, orders

import { apiClient } from "./client";
import type { UserStatus, VerificationStatus } from "@/src/types/auth/types";
import type { BookingStatus, PaymentStatus, PayoutStatus, VehicleType, ServiceType } from "@/src/types/booking/types";

export interface PlatformStats {
  totalUsers: number;
  activeMovers: number;
  ordersToday: number;
  platformRevenue: number;
  revenueChange: number;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
  joined: string;
  status: UserStatus;
}

export interface AdminOrder {
  id: string;
  customer: string;
  mover: string;
  route: string;
  value: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  serviceType: Exclude<ServiceType, "">;
}

export interface VerificationItem {
  id: string;
  name: string;
  role: "mover" | "provider" | "company";
  submittedAt: string;
  status: VerificationStatus;
}

export interface CommissionRule {
  id: string;
  rate: number;          // e.g. 0.20 for 20%
  serviceType: Exclude<ServiceType, "">;
  active: boolean;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  recipientId: string;
  recipientRole: "mover" | "company";
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: PayoutStatus;
  createdAt: string;
}

// Re-export for convenience
export type { UserStatus, VerificationStatus, BookingStatus, PaymentStatus, PayoutStatus, VehicleType };

export const adminApi = {
  getStats: (token: string) =>
    apiClient.get<PlatformStats>("/admin/stats", { token }),

  getUsers: (token: string, page = 1) =>
    apiClient.get<AdminUser[]>(`/admin/users?page=${page}`, { token }),

  suspendUser: (userId: string, reason: string, token: string) =>
    apiClient.post<void>(`/admin/users/${userId}/suspend`, { reason }, { token }),

  activateUser: (userId: string, token: string) =>
    apiClient.post<void>(`/admin/users/${userId}/activate`, {}, { token }),

  getOrders: (token: string, page = 1) =>
    apiClient.get<AdminOrder[]>(`/admin/orders?page=${page}`, { token }),

  getVerificationQueue: (token: string) =>
    apiClient.get<VerificationItem[]>("/admin/verifications", { token }),

  approveVerification: (id: string, token: string) =>
    apiClient.post<void>(`/admin/verifications/${id}/approve`, {}, { token }),

  rejectVerification: (id: string, reason: string, token: string) =>
    apiClient.post<void>(`/admin/verifications/${id}/reject`, { reason }, { token }),

  requestResubmission: (id: string, reason: string, token: string) =>
    apiClient.post<void>(`/admin/verifications/${id}/resubmit`, { reason }, { token }),

  // Commission rules
  getCommissionRules: (token: string) =>
    apiClient.get<CommissionRule[]>("/admin/commission-rules", { token }),

  setCommissionRule: (rule: Omit<CommissionRule, "id" | "createdAt">, token: string) =>
    apiClient.post<CommissionRule>("/admin/commission-rules", rule, { token }),

  // Payouts
  getPayouts: (token: string, page = 1) =>
    apiClient.get<PayoutRecord[]>(`/admin/payouts?page=${page}`, { token }),

  // Revenue dashboard
  getRevenueBreakdown: (token: string, period: "day" | "week" | "month" = "month") =>
    apiClient.get<{ period: string; gross: number; commission: number; payouts: number }[]>(
      `/admin/revenue?period=${period}`,
      { token }
    ),
};
