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
  service: "dispatch",
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
      confirmBooking: (price) => set({ price, status: "searching", moverInfo: null }),
      resetBooking: () => set(initialState),
    }),
    {
      name: "moverspadi-booking",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
