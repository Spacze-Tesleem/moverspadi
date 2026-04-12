// Company API — fleet, orders, drivers, earnings

import { apiClient } from "./client";

export interface CompanyStats {
  revenueMonth: number;
  activeVehicles: number;
  totalVehicles: number;
  ordersMonth: number;
  avgRating: number;
}

export interface Vehicle {
  id: string;
  driver: string;
  plate: string;
  type: string;
  status: "active" | "idle" | "maintenance";
  route: string;
  load: string;
}

export interface CompanyOrder {
  id: string;
  client: string;
  pickup: string;
  dropoff: string;
  value: string;
  status: "in-transit" | "completed" | "pending" | "cancelled";
  driver: string;
}

export interface CompanyDriver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string | null;
  status: "active" | "inactive" | "suspended";
}

export const companyApi = {
  getStats: (token: string) =>
    apiClient.get<CompanyStats>("/company/stats", { token }),

  getFleet: (token: string) =>
    apiClient.get<Vehicle[]>("/company/fleet", { token }),

  getOrders: (token: string, page = 1) =>
    apiClient.get<CompanyOrder[]>(`/company/orders?page=${page}`, { token }),

  getDrivers: (token: string) =>
    apiClient.get<CompanyDriver[]>("/company/drivers", { token }),

  assignDriverToVehicle: (driverId: string, vehicleId: string, token: string) =>
    apiClient.post<void>("/company/assign", { driverId, vehicleId }, { token }),

  addVehicle: (data: Omit<Vehicle, "id" | "status" | "route" | "load">, token: string) =>
    apiClient.post<Vehicle>("/company/fleet", data, { token }),
};
