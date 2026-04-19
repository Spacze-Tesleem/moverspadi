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
    }
  )
);

/**
 * Polls localStorage every second and syncs the store if the persisted
 * value has changed. This is what lets the mover dashboard (a separate
 * browser tab) react when a customer confirms a booking — the storage
 * event API is unreliable for same-origin cross-tab updates in some
 * browsers, so polling is the safe fallback.
 *
 * Call this once inside the mover dashboard component.
 */
export function startBookingStoreSync() {
  if (typeof window === "undefined") return () => {};

  const STORAGE_KEY = "moverspadi-booking";
  let lastValue = localStorage.getItem(STORAGE_KEY);

  const id = setInterval(() => {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current !== lastValue) {
      lastValue = current;
      if (current) {
        try {
          const parsed = JSON.parse(current);
          if (parsed?.state) {
            useBookingStore.setState(parsed.state);
          }
        } catch {
          // ignore malformed data
        }
      }
    }
  }, 1000);

  // Also listen for the storage event (fires reliably across different
  // browser windows, even if not always across same-window tabs).
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed?.state) {
          useBookingStore.setState(parsed.state);
        }
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    clearInterval(id);
    window.removeEventListener("storage", onStorage);
  };
}
