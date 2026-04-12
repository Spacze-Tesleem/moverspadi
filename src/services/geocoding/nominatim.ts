// Nominatim (OpenStreetMap) geocoding service

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
}

const BASE = "https://nominatim.openstreetmap.org";

export const nominatim = {
  /**
   * Forward geocode: address string → coordinates + suggestions
   */
  search: async (query: string): Promise<GeocodingResult[]> => {
    if (!query.trim()) return [];
    const url = `${BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ng`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) throw new Error("Geocoding request failed");
    return res.json();
  },

  /**
   * Reverse geocode: coordinates → address string
   */
  reverse: async (lat: number, lon: number): Promise<string> => {
    const url = `${BASE}/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) throw new Error("Reverse geocoding request failed");
    const data = await res.json();
    return data.display_name ?? "";
  },
};
