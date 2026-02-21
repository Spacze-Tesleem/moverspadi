"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type BookingStatus = "idle" | "searching" | "matched" | "in-progress" | "completed" | "cancelled";

interface BookingState {
  service: string;
  pickup: string;
  dropoff: string;
  price: number;
  status: BookingStatus;
  setService: (service: string) => void;
  setPickup: (pickup: string) => void;
  setDropoff: (dropoff: string) => void;
  setStatus: (status: BookingStatus) => void;
  confirmBooking: (price: number) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      service: "dispatch",
      pickup: "",
      dropoff: "",
      price: 0,
      status: "idle",

      setService: (service) => set({ service }),
      setPickup: (pickup) => set({ pickup }),
      setDropoff: (dropoff) => set({ dropoff }),
      setStatus: (status) => set({ status }),

      confirmBooking: (price) =>
        set({
          price,
          status: "searching",
        }),

      resetBooking: () =>
        set({
          service: "dispatch",
          pickup: "",
          dropoff: "",
          price: 0,
          status: "idle",
        }),
    }),
    {
      name: "moverspadi-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getPriceEstimate(service: string): number {
  const serviceMap: Record<string, number> = {
    dispatch: 5000,
    haulage: 45000,
    tow: 15000,
  };
  return serviceMap[service.toLowerCase()] || 5000;
}