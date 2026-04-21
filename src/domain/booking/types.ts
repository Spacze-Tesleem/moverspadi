// Core booking domain types — no framework dependencies

/**
 * Service types (backend: service_types table)
 * dispatch  — parcel/package delivery
 * haulage   — heavy cargo / truck
 * tow       — vehicle recovery
 * transport — car or bus passenger transport
 */
export type ServiceType = "dispatch" | "haulage" | "tow" | "transport" | "";

/**
 * Service request status (backend: service_requests.status)
 *
 * pending    — created, awaiting mover match
 * matched    — mover found, not yet accepted
 * accepted   — mover accepted the job
 * in_progress — job underway
 * completed  — job finished and confirmed
 * cancelled  — cancelled by customer or system
 * failed     — could not be completed
 */
export type BookingStatus =
  | "idle"          // local UI only — no active booking
  | "pending"
  | "matched"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

/**
 * Payment status (backend: transactions.status)
 */
export type PaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "refunded"
  | "reversed";

/**
 * Payout status (backend: payouts.status)
 */
export type PayoutStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed";

/**
 * Vehicle types (backend: vehicles.vehicle_type)
 */
export type VehicleType =
  | "motorcycle"
  | "van"
  | "truck"
  | "tow_truck"
  | "private_car"
  | "bus";

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
  vehicleType: VehicleType | "";
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
    id: "dispatch",
    label: "Dispatch",
    description: "Package & parcel delivery",
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
  {
    id: "transport",
    label: "Transport",
    description: "Car or bus passenger transport",
    color: "#1CA7A6",
  },
];

/** Vehicle types available per service */
export const VEHICLE_TYPES_BY_SERVICE: Record<
  Exclude<ServiceType, "">,
  VehicleType[]
> = {
  dispatch:  ["motorcycle", "van"],
  haulage:   ["van", "truck"],
  tow:       ["tow_truck"],
  transport: ["private_car", "bus"],
};

/** Human-readable labels for vehicle types */
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  motorcycle: "Motorcycle",
  van:        "Van",
  truck:      "Truck",
  tow_truck:  "Tow Truck",
  private_car: "Private Car",
  bus:        "Bus",
};
