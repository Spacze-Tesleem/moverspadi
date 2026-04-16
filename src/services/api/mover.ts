// Mover dashboard API — earnings, trips, incoming requests
//
// HOW TO WIRE THE REAL API:
//   1. Set NEXT_PUBLIC_API_URL in .env.local
//   2. Delete the DUMMY DATA blocks and uncomment the real apiClient calls.

import { apiClient } from "./client";

// ── Domain types ──────────────────────────────────────────────────────────────

export interface MoverStats {
  earningsToday: number;
  earningsWeek: number;
  earningsMonth: number;
  tripsCompleted: number;
  rating: number;
  acceptanceRate: number;
}

export interface MoverTrip {
  id: string;
  from: string;
  to: string;
  amount: number;
  time: string;
  date: string;
  status: "completed" | "cancelled" | "in-progress";
  serviceType: string;
  distance: string;
}

export interface IncomingRequest {
  id: string;
  customer: string;
  pickup: string;
  dropoff: string;
  distance: string;
  eta: string;
  price: number;
  service: string;
}

export interface WalletData {
  balance: number;
  pendingPayout: number;
  totalEarned: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "payout";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface EarningsBreakdown {
  daily: { day: string; amount: number }[];
  byService: { service: string; amount: number; count: number }[];
}

// ── DUMMY DATA ────────────────────────────────────────────────────────────────

const DUMMY_STATS: MoverStats = {
  earningsToday: 14500,
  earningsWeek: 68200,
  earningsMonth: 241800,
  tripsCompleted: 142,
  rating: 4.8,
  acceptanceRate: 94,
};

const DUMMY_TRIPS: MoverTrip[] = [
  { id: "T-4421", from: "Ikeja", to: "Lekki Phase 1", amount: 4200, time: "2 hrs ago", date: "Today", status: "completed", serviceType: "Dispatch", distance: "14.2 km" },
  { id: "T-4420", from: "Yaba", to: "Victoria Island", amount: 6800, time: "Yesterday", date: "Yesterday", status: "completed", serviceType: "Ride", distance: "9.8 km" },
  { id: "T-4419", from: "Surulere", to: "Ajah", amount: 9100, time: "2 days ago", date: "Mon, Apr 14", status: "completed", serviceType: "Haulage", distance: "22.5 km" },
  { id: "T-4418", from: "Oshodi", to: "Ikoyi", amount: 3500, time: "3 days ago", date: "Sun, Apr 13", status: "cancelled", serviceType: "Dispatch", distance: "11.1 km" },
  { id: "T-4417", from: "Agege", to: "Apapa", amount: 11200, time: "4 days ago", date: "Sat, Apr 12", status: "completed", serviceType: "Haulage", distance: "18.7 km" },
  { id: "T-4416", from: "Mushin", to: "Lekki Phase 2", amount: 5400, time: "5 days ago", date: "Fri, Apr 11", status: "completed", serviceType: "Ride", distance: "16.3 km" },
];

const DUMMY_WALLET: WalletData = {
  balance: 38450,
  pendingPayout: 12800,
  totalEarned: 241800,
  transactions: [
    { id: "TXN-001", type: "credit", amount: 4200, description: "Trip T-4421 · Dispatch", date: "Today, 2:14 PM", status: "completed" },
    { id: "TXN-002", type: "credit", amount: 6800, description: "Trip T-4420 · Ride", date: "Yesterday, 5:40 PM", status: "completed" },
    { id: "TXN-003", type: "payout", amount: 25000, description: "Bank transfer · GTBank ****4521", date: "Mon, Apr 14", status: "completed" },
    { id: "TXN-004", type: "credit", amount: 9100, description: "Trip T-4419 · Haulage", date: "Mon, Apr 14", status: "completed" },
    { id: "TXN-005", type: "payout", amount: 18000, description: "Bank transfer · GTBank ****4521", date: "Sat, Apr 12", status: "pending" },
    { id: "TXN-006", type: "credit", amount: 11200, description: "Trip T-4417 · Haulage", date: "Sat, Apr 12", status: "completed" },
  ],
};

const DUMMY_EARNINGS: EarningsBreakdown = {
  daily: [
    { day: "Mon", amount: 9100 },
    { day: "Tue", amount: 14200 },
    { day: "Wed", amount: 8600 },
    { day: "Thu", amount: 11800 },
    { day: "Fri", amount: 5400 },
    { day: "Sat", amount: 11200 },
    { day: "Sun", amount: 14500 },
  ],
  byService: [
    { service: "Dispatch", amount: 87400, count: 58 },
    { service: "Haulage",  amount: 96200, count: 41 },
    { service: "Ride",     amount: 48600, count: 35 },
    { service: "Tow",      amount: 9600,  count: 8  },
  ],
};

const DUMMY_INCOMING: IncomingRequest = {
  id: "REQ-9981",
  customer: "Akinwale J.",
  pickup: "23 Bode Thomas St, Surulere, Lagos",
  dropoff: "15 Admiralty Way, Lekki Phase 1",
  distance: "18.4 km",
  eta: "22 mins",
  price: 7800,
  service: "Dispatch",
};

// ─────────────────────────────────────────────────────────────────────────────

export const moverApi = {
  /**
   * Fetch earnings and performance stats for the mover.
   * Real endpoint: GET /mover/stats
   */
  getStats: async (token: string): Promise<MoverStats> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 500));
      return DUMMY_STATS;
    }
    return apiClient.get<MoverStats>("/mover/stats", { token });
  },

  /**
   * Fetch recent trip history.
   * Real endpoint: GET /mover/trips?limit=10
   */
  getTrips: async (token: string): Promise<MoverTrip[]> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 400));
      return DUMMY_TRIPS;
    }
    return apiClient.get<MoverTrip[]>("/mover/trips?limit=10", { token });
  },

  /**
   * Accept an incoming request.
   * Real endpoint: POST /mover/requests/:id/accept
   */
  acceptRequest: async (requestId: string, token: string): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 600));
      return;
    }
    return apiClient.post<void>(`/mover/requests/${requestId}/accept`, {}, { token });
  },

  /**
   * Decline an incoming request.
   * Real endpoint: POST /mover/requests/:id/decline
   */
  declineRequest: async (requestId: string, token: string): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 400));
      return;
    }
    return apiClient.post<void>(`/mover/requests/${requestId}/decline`, {}, { token });
  },

  /**
   * Update the mover's online/offline status.
   * Real endpoint: PUT /mover/status
   */
  setStatus: async (online: boolean, token: string): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 300));
      return;
    }
    return apiClient.put<void>("/mover/status", { online }, { token });
  },

  /**
   * Fetch wallet balance and transaction history.
   * Real endpoint: GET /mover/wallet
   */
  getWallet: async (token: string): Promise<WalletData> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 400));
      return DUMMY_WALLET;
    }
    return apiClient.get<WalletData>("/mover/wallet", { token });
  },

  /**
   * Fetch earnings breakdown by day and service type.
   * Real endpoint: GET /mover/earnings/breakdown
   */
  getEarningsBreakdown: async (token: string): Promise<EarningsBreakdown> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 300));
      return DUMMY_EARNINGS;
    }
    return apiClient.get<EarningsBreakdown>("/mover/earnings/breakdown", { token });
  },

  /**
   * Request a payout to the mover's registered bank account.
   * Real endpoint: POST /mover/wallet/payout
   */
  requestPayout: async (amount: number, token: string): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise((r) => setTimeout(r, 800));
      return;
    }
    return apiClient.post<void>("/mover/wallet/payout", { amount }, { token });
  },

  // Exported for use in dev/testing without a network call
  _dummy: { DUMMY_STATS, DUMMY_TRIPS, DUMMY_INCOMING, DUMMY_WALLET, DUMMY_EARNINGS },
};
