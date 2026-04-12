"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ActiveBooking, BookingStatus } from "@/src/types/booking/types";

interface BookingState extends ActiveBooking {
  setService: (service: string) => void;
  setPickup: (pickup: string) => void;
  setDropoff: (dropoff: string) => void;
  setStatus: (status: BookingStatus) => void;
  confirmBooking: (price: number) => void;
  resetBooking: () => void;
}

const initialState: ActiveBooking = {
  service: "dispatch",
  pickup: "",
  dropoff: "",
  price: 0,
  status: "idle",
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setService: (service) => set({ service }),
      setPickup: (pickup) => set({ pickup }),
      setDropoff: (dropoff) => set({ dropoff }),
      setStatus: (status) => set({ status }),
      confirmBooking: (price) => set({ price, status: "searching" }),
      resetBooking: () => set(initialState),
    }),
    {
      name: "moverspadi-booking",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
