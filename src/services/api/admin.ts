// Admin API — platform stats, user management, verification queue, orders

import { apiClient } from "./client";

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
  status: "active" | "pending" | "suspended";
}

export interface AdminOrder {
  id: string;
  customer: string;
  mover: string;
  route: string;
  value: string;
  status: "completed" | "in-transit" | "pending" | "cancelled";
}

export interface VerificationItem {
  id: string;
  name: string;
  type: "mover" | "company";
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

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
};
