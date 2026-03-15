"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoLocationButton from "@/app/customer/components/GeoLocationButton";

type Props = {
  pickup: string;
  dropoff: string;
};

type Location = [number, number];

const DEFAULT_CENTER: Location = [6.5244, 3.3792]; // Lagos

// Custom icons
const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const pickupIcon = createCustomIcon("#10b981"); // Green
const dropoffIcon = createCustomIcon("#ef4444"); // Red

// Component to auto-fit bounds
function MapBounds({
  pickupLocation,
  dropoffLocation,
}: {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      const bounds = L.latLngBounds([pickupLocation, dropoffLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupLocation) {
      map.setView(pickupLocation, 13);
    } else if (dropoffLocation) {
      map.setView(dropoffLocation, 13);
    }
  }, [pickupLocation, dropoffLocation, map]);

  return null;
}

export default function MapPreview({ pickup, dropoff }: Props) {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Geocoder with error handling and rate limiting
  async function geocode(address: string): Promise<Location | null> {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            "User-Agent": "RideBookingApp/1.0", // Required by Nominatim
          },
        }
      );

      if (!res.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await res.json();

      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      return null;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }
      console.error("Geocoding error:", err);
      throw err;
    }
  }

  // Calculate distance between two points (Haversine formula)
  function calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2[0] - loc1[0]) * Math.PI) / 180;
    const dLon = ((loc2[1] - loc1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1[0] * Math.PI) / 180) *
        Math.cos((loc2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);

      try {
        const [pickupLoc, dropoffLoc] = await Promise.all([
          pickup ? geocode(pickup) : null,
          dropoff ? geocode(dropoff) : null,
        ]);

        setPickupLocation(pickupLoc);
        setDropoffLocation(dropoffLoc);

        // Calculate distance
        if (pickupLoc && dropoffLoc) {
          const dist = calculateDistance(pickupLoc, dropoffLoc);
          setDistance(dist);
        } else {
          setDistance(null);
        }

        if (pickup && !pickupLoc) {
          setError("Could not find pickup location");
        } else if (dropoff && !dropoffLoc) {
          setError("Could not find dropoff location");
        }
      } catch (err) {
        setError("Failed to load locations. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce geocoding requests
    const timer = setTimeout(fetchLocations, 500);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [pickup, dropoff]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pickupLocation && (
          <Marker position={pickupLocation} icon={pickupIcon}>
            <Popup>
              <div className="font-semibold">📍 Pickup Location</div>
              <div className="text-sm text-gray-600">{pickup}</div>
            </Popup>
          </Marker>
        )}

        {dropoffLocation && (
          <Marker position={dropoffLocation} icon={dropoffIcon}>
            <Popup>
              <div className="font-semibold">🎯 Dropoff Location</div>
              <div className="text-sm text-gray-600">{dropoff}</div>
            </Popup>
          </Marker>
        )}

        {pickupLocation && dropoffLocation && (
          <Polyline
            positions={[pickupLocation, dropoffLocation]}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        <MapBounds
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm">
          {error}
        </div>
      )}

      {/* Distance info */}
      {distance && !loading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-medium">
          Distance: {distance.toFixed(2)} km
        </div>
      )}
    </div>
  );
}