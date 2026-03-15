// app/types/booking.ts

export interface BookingItem {
  name: string;
  qty: number;
  weight: string;
}

export interface BookingData {
  // Service
  serviceType: "ride" | "dispatch" | "haulage" | "tow" | "";

  // Locations
  pickup: string;
  pickupCoords: { lat: number; lng: number } | null;
  dropoff: string;
  dropoffCoords: { lat: number; lng: number } | null;

  // Vehicle
  vehicleType: string;
  vehicleDescription: string;

  // Ride specific
  passengers: string;

  // Dispatch/Haulage specific
  items: BookingItem[];

  // Schedule
  scheduleDate: string;
  scheduleTime: string;
}

export interface BookingData {
  serviceType: "ride" | "dispatch" | "haulage" | "tow" | "";
  pickup: string;
  pickupCoords: { lat: number; lng: number } | null;
  dropoff: string;
  dropoffCoords: { lat: number; lng: number } | null;
  vehicleType: string;
  vehicleDescription: string;
  passengers: string;
  items: BookingItem[];
  scheduleDate: string;
  scheduleTime: string;
}

// Service type definitions for UI
export const SERVICE_TYPES = [
  {
    id: "ride" as const,
    label: "Ride",
    description: "Car or bus transport",
    color: "#1CA7A6"
  },
  {
    id: "dispatch" as const,
    label: "Dispatch",
    description: "Package delivery",
    color: "#F59E0B"
  },
  {
    id: "haulage" as const,
    label: "Haulage",
    description: "Heavy cargo transport",
    color: "#8B5CF6"
  },
  {
    id: "tow" as const,
    label: "Tow",
    description: "Vehicle recovery",
    color: "#EF4444"
  },
] as const;