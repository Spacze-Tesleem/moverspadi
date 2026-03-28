"use client";

import { Navigation, Loader2, Crosshair, Target } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onLocationFound: (address: string) => void;
};

export default function GeoLocationButton({ onLocationFound }: Props) {
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("System Error: Geolocation protocol not supported by browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data = await res.json();

          if (data?.display_name) {
            onLocationFound(data.display_name);
          } else {
            alert("Signal Lost: Could not resolve physical address.");
          }
        } catch (err) {
          console.error(err);
          alert("Network Error: Location lookup failed.");
        }

        setLoading(false);
      },
      () => {
        alert("Permission Denied: Unable to access GPS data.");
        setLoading(false);
      }
    );
  };

  return (
    <button
      onClick={getLocation}
      disabled={loading}
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] transition-all hover:bg-[#1CA7A6]/10 hover:border-[#1CA7A6]/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="relative">
        {loading ? (
          <Loader2 size={14} className="text-[#1CA7A6] animate-spin" />
        ) : (
          <>
            <Navigation size={14} className="text-[#1CA7A6] group-hover:rotate-45 transition-transform duration-300" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[#1CA7A6] rounded-full"
            />
          </>
        )}
      </div>

      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#1CA7A6] transition-colors">
        {loading ? (
          <span className="flex items-center gap-1">
            Establishing Sync<span className="animate-pulse">...</span>
          </span>
        ) : (
          "Acquire Current Coordinates"
        )}
      </span>

      {/* Subtle Technical metadata border */}
      <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Target size={8} className="text-[#1CA7A6]" />
      </div>
    </button>
  );
}