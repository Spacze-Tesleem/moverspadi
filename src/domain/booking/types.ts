// Core booking domain types — no framework dependencies

export type ServiceType = "ride" | "dispatch" | "haulage" | "tow" | "";

export type BookingStatus =
  | "idle"
  | "searching"
  | "matched"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BookingItem {
  name: string;
  qty: number;
  weight: string;
}

/** Full booking form data collected across the 4-step wizard */
export interface BookingFormData {
  serviceType: ServiceType;
  pickup: string;
  pickupCoords: Coordinates | null;
  dropoff: string;
  dropoffCoords: Coordinates | null;
  vehicleType: string;
  vehicleDescription: string;
  passengers: string;
  items: BookingItem[];
  scheduleDate: string;
  scheduleTime: string;
}

/** Confirmed booking stored in state after wizard completion */
export interface ActiveBooking {
  service: string;
  pickup: string;
  dropoff: string;
  price: number;
  status: BookingStatus;
}

export interface ServiceDefinition {
  id: Exclude<ServiceType, "">;
  label: string;
  description: string;
  color: string;
}

export const SERVICE_TYPES: ServiceDefinition[] = [
  {
    id: "ride",
    label: "Ride",
    description: "Car or bus transport",
    color: "#1CA7A6",
  },
  {
    id: "dispatch",
    label: "Dispatch",
    description: "Package delivery",
    color: "#F59E0B",
  },
  {
    id: "haulage",
    label: "Haulage",
    description: "Heavy cargo transport",
    color: "#8B5CF6",
  },
  {
    id: "tow",
    label: "Tow",
    description: "Vehicle recovery",
    color: "#EF4444",
  },
];
