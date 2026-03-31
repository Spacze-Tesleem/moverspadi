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
  status: "completed" | "cancelled" | "in-progress";
  serviceType: string;
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
  { id: "T-4421", from: "Ikeja", to: "Lekki Phase 1", amount: 4200, time: "2 hrs ago", status: "completed", serviceType: "Dispatch" },
  { id: "T-4420", from: "Yaba", to: "Victoria Island", amount: 6800, time: "Yesterday", status: "completed", serviceType: "Ride" },
  { id: "T-4419", from: "Surulere", to: "Ajah", amount: 9100, time: "2 days ago", status: "completed", serviceType: "Haulage" },
  { id: "T-4418", from: "Oshodi", to: "Ikoyi", amount: 3500, time: "3 days ago", status: "cancelled", serviceType: "Dispatch" },
];

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

  // Exported for use in dev/testing without a network call
  _dummy: { DUMMY_STATS, DUMMY_TRIPS, DUMMY_INCOMING },
};
