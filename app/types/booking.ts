// Re-export from canonical domain types.
// Import directly from @/src/domain/booking/types in new code.
export type {
  BookingItem,
  BookingFormData,
  BookingStatus,
  ServiceType,
  Coordinates,
  ActiveBooking,
  ServiceDefinition,
} from "@/src/domain/booking/types";

export { SERVICE_TYPES } from "@/src/domain/booking/types";

// Legacy alias — remove once all consumers use BookingFormData
export type { BookingFormData as BookingData } from "@/src/domain/booking/types";