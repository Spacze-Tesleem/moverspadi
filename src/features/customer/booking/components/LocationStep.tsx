"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookingFormData } from "@/src/types/booking/types";
import {
  ArrowRight, X, Loader2, Car, Package, Truck, Wrench, 
  Locate, MapPin, ArrowUpDown, History, Star, Navigation
} from "lucide-react";

interface Props {
  bookingData: BookingFormData;
  setBookingFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}

const SERVICES = [
  { id: "ride" as const, label: "Ride", icon: Car, gradient: "from-blue-500 to-cyan-500" },
  { id: "dispatch" as const, label: "Dispatch", icon: Package, gradient: "from-green-500 to-green-600" },
  { id: "haulage" as const, label: "Haulage", icon: Truck, gradient: "from-blue-500 to-blue-600" },
  { id: "tow" as const, label: "Recovery", icon: Wrench, gradient: "from-red-500 to-rose-500" },
] as const;

const SAVED_PLACES = [
  { label: "Home", address: "12B Admiralty Way, Lekki", icon: Star },
  { label: "Office", address: "The Wings Complex, VI", icon: Navigation },
  { label: "Gym", address: "Ikoyi Club 1938", icon: History },
];

export default function LocationStep({ bookingData, setBookingFormData, onNext }: Props) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const isValid = 
    bookingData.serviceType !== "" && 
    bookingData.pickup.length > 3 && 
    bookingData.dropoff.length > 3;

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const query = activeField === "pickup" ? bookingData.pickup : bookingData.dropoff;
    if (!query || query.length < 4 || !activeField) { setSuggestions([]); return; }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ng`);
        const data: Array<{ display_name: string }> = await res.json();
        setSuggestions(data.map((item) => item.display_name));
      } catch (err) { console.error(err); }
    }, 600);
    return () => clearTimeout(timer);
  }, [bookingData.pickup, bookingData.dropoff, activeField]);

  // --- ACTIONS ---
  const selectService = (id: BookingFormData["serviceType"]) => {
    setBookingFormData(prev => ({ 
      ...prev, 
      serviceType: id,
      items: (id === "dispatch" || id === "haulage") ? [{ name: "", qty: 1, weight: "" }] : []
    }));
  };

  const swapLocations = () => {
    setBookingFormData(prev => ({ ...prev, pickup: prev.dropoff, dropoff: prev.pickup }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        setBookingFormData(prev => ({ 
            ...prev, 
            pickup: data.display_name,
            pickupCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      } finally { setGeoLoading(false); }
    }, () => setGeoLoading(false));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-white tracking-tight">
          Where to?
        </h1>
        <button 
          onClick={() => router.push("/customer")}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-zinc-400" />
        </button>
      </div>

      {/* --- SERVICE PILLS --- */}
      <div className="grid grid-cols-4 gap-2">
        {SERVICES.map((s) => {
          const active = bookingData.serviceType === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectService(s.id)}
              className={`relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                active ? "bg-zinc-900 shadow-lg shadow-black/50" : "bg-transparent hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.div 
                  layoutId="activeGlow" 
                  className={`absolute inset-0 bg-gradient-to-b ${s.gradient} opacity-10`} 
                />
              )}
              <div className={`relative z-10 transition-colors ${active ? "text-white" : "text-zinc-500"}`}>
                <s.icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`relative z-10 text-[10px] font-medium tracking-wide ${active ? "text-white" : "text-zinc-500"}`}>
                {s.label}
              </span>
              {active && (
                <motion.div 
                  layoutId="activeBar"
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-gradient-to-r ${s.gradient}`} 
                />
              )}
            </button>
          )
        })}
      </div>

      {/* --- ROUTE MODULE --- */}
      <div className="relative bg-[#0F1115] border border-white/5 rounded-3xl p-1 shadow-2xl">
        
        {/* SWAP BUTTON (Floating) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <button 
            onClick={swapLocations}
            className="w-8 h-8 rounded-full bg-[#1A1D24] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>

        {/* INPUTS CONTAINER */}
        <div className="space-y-[1px]">
          
          {/* PICKUP */}
          <div className="relative group bg-[#16181D] rounded-t-[20px] rounded-b-lg p-4 flex items-start gap-4 transition-colors hover:bg-[#1A1D24]">
            <div className="mt-1 flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <div className="w-[1px] h-8 bg-gradient-to-b from-green-500/50 to-transparent" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-blue-500/70 mb-1">Pickup Location</label>
              <input 
                value={bookingData.pickup}
                onFocus={() => setActiveField("pickup")}
                onChange={(e) => setBookingFormData(prev => ({ ...prev, pickup: e.target.value }))}
                placeholder="Current Location"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
              />
            </div>
            {/* Geo Button hidden on mobile, visible on focus or desktop */}
            <button onClick={useCurrentLocation} className="text-zinc-600 hover:text-green-400 transition-colors mt-2 mr-10">
              {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
            </button>
          </div>

          {/* DROPOFF */}
          <div className="relative group bg-[#16181D] rounded-b-[20px] rounded-t-lg p-4 flex items-start gap-4 transition-colors hover:bg-[#1A1D24]">
            <div className="mt-1 flex flex-col items-center gap-1">
              <div className="w-[1px] h-2 bg-gradient-to-b from-transparent to-blue-500/50" />
              <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-blue-500/70 mb-1">Destination</label>
              <input 
                value={bookingData.dropoff}
                onFocus={() => setActiveField("dropoff")}
                onChange={(e) => setBookingFormData(prev => ({ ...prev, dropoff: e.target.value }))}
                placeholder="Where to?"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
              />
            </div>
          </div>

        </div>

        {/* SUGGESTIONS (Floating below) */}
        <AnimatePresence>
          {suggestions.length > 0 && activeField && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute left-0 right-0 top-[100%] mt-2 z-50 bg-[#16181D]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
            >
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setBookingFormData(prev => ({ ...prev, [activeField]: s })); setSuggestions([]); }}
                  className="w-full p-4 text-left text-xs text-zinc-300 hover:bg-white/10 hover:text-white border-b border-white/5 last:border-0 flex items-start gap-3"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 opacity-50" />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- SAVED PLACES --- */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-medium text-zinc-500">Saved Places</span>
          <button className="text-[10px] text-blue-500 hover:text-green-400">Edit</button>
        </div>
        <div className="flex flex-col gap-2">
          {SAVED_PLACES.map((place) => (
            <button 
              key={place.label}
              onClick={() => setBookingFormData(prev => ({ ...prev, [activeField || 'dropoff']: place.address }))}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-white/10 transition-colors">
                <place.icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{place.label}</p>
                <p className="text-[10px] text-zinc-600">{place.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- CTA --- */}
      <div className="pt-2">
        <button 
          disabled={!isValid} 
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isValid 
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:scale-[1.02] active:scale-[0.98]" 
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {isValid ? (
            <>Continue <ArrowRight size={16} /></>
          ) : (
            "Select Route"
          )}
        </button>
      </div>

    </motion.div>
  );
}