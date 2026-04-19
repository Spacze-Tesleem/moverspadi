"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ActiveBooking, BookingStatus } from "@/src/types/booking/types";

export interface MoverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  plate: string;
  eta: string;
  avatar?: string;
}

interface BookingState extends ActiveBooking {
  moverInfo: MoverInfo | null;
  setService: (service: string) => void;
  setPickup: (pickup: string) => void;
  setDropoff: (dropoff: string) => void;
  setStatus: (status: BookingStatus) => void;
  setMoverInfo: (mover: MoverInfo) => void;
  confirmBooking: (price: number) => void;
  resetBooking: () => void;
}

const initialState: ActiveBooking & { moverInfo: MoverInfo | null } = {
  service: "",
  pickup: "",
  dropoff: "",
  price: 0,
  status: "idle",
  moverInfo: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setService: (service) => set({ service }),
      setPickup: (pickup) => set({ pickup }),
      setDropoff: (dropoff) => set({ dropoff }),
      setStatus: (status) => set({ status }),
      setMoverInfo: (moverInfo) => set({ moverInfo }),
      confirmBooking: (price) => set({ price, status: "pending", moverInfo: null }),
      resetBooking: () => set(initialState),
    }),
    {
      name: "moverspadi-booking",
      storage: createJSONStorage(() => localStorage),
      // Re-hydrate whenever another tab writes to the same localStorage key.
      // This is what allows the mover dashboard (open in a separate tab) to
      // react instantly when a customer confirms a booking.
      onRehydrateStorage: () => () => {
        if (typeof window === "undefined") return;
        window.addEventListener("storage", (e) => {
          if (e.key === "moverspadi-booking" && e.newValue) {
            try {
              const parsed = JSON.parse(e.newValue);
              if (parsed?.state) {
                useBookingStore.setState(parsed.state);
              }
            } catch {
              // ignore malformed storage events
            }
          }
        });
      },
    }
  )
);
