// Booking API calls

import { apiClient } from "./client";
import type { BookingFormData, ActiveBooking } from "@/src/domain/booking/types";

export const bookingApi = {
  create: (data: BookingFormData, token: string) =>
    apiClient.post<ActiveBooking>("/bookings", data, { token }),

  getById: (id: string, token: string) =>
    apiClient.get<ActiveBooking>(`/bookings/${id}`, { token }),

  cancel: (id: string, token: string) =>
    apiClient.delete<void>(`/bookings/${id}`, { token }),

  getPriceEstimate: (serviceType: string): number => {
    // Base fares in NGN — real pricing comes from the backend quote endpoint.
    // These are UI-only estimates shown before payment confirmation.
    const priceMap: Record<string, number> = {
      dispatch:  5000,
      haulage:   45000,
      tow:       15000,
      transport: 3500,
    };
    return priceMap[serviceType] ?? 5000;
  },
};
