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
    const priceMap: Record<string, number> = {
      ride: 3500,
      dispatch: 5000,
      haulage: 45000,
      tow: 15000,
    };
    return priceMap[serviceType] ?? 5000;
  },
};
