"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added router for navigation
import { motion, AnimatePresence } from "framer-motion";
import { BookingData } from "@/app/types/booking";
import {
  ArrowRight, ArrowLeft, Loader2, Car, Package, Truck, Wrench, 
  Locate, Compass, ShieldCheck, Info, X
} from "lucide-react";

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onPrev: () => void;
}

const SERVICES = [
  { id: "ride" as const, label: "Ride", icon: Car },
  { id: "dispatch" as const, label: "Dispatch", icon: Package },
  { id: "haulage" as const, label: "Haulage", icon: Truck },
  { id: "tow" as const, label: "Tow", icon: Wrench },
] as const;

export default function LocationStep({ bookingData, setBookingData, onNext }: Props) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const isValid = 
    bookingData.serviceType !== "" && 
    bookingData.pickup.length > 3 && 
    bookingData.dropoff.length > 3;

  // Address Search Logic
  useEffect(() => {
    const query = activeField === "pickup" ? bookingData.pickup : bookingData.dropoff;
    if (!query || query.length < 4 || !activeField) { setSuggestions([]); return; }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ng`);
        const data = await res.json();
        setSuggestions(data.map((item: any) => item.display_name));
      } catch (err) { console.error(err); } finally { setIsSearching(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [bookingData.pickup, bookingData.dropoff, activeField]);

  const selectService = (id: BookingData["serviceType"]) => {
    setBookingData(prev => ({ 
      ...prev, 
      serviceType: id,
      items: (id === "dispatch" || id === "haulage") ? [{ name: "", qty: 1, weight: "" }] : []
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        setBookingData(prev => ({ 
            ...prev, 
            pickup: data.display_name,
            pickupCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      } finally { setGeoLoading(false); }
    }, () => setGeoLoading(false));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* --- TOP EXIT BAR --- */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <button 
          onClick={() => router.push("/customer")} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* --- HEADER --- */}
      <div>
        <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">
          New <span className="text-teal-400">Request</span>
        </h1>
        <p className="text-zinc-500 text-sm">Select a service and establish your route.</p>
      </div>

      {/* --- SERVICE SELECTOR --- */}
      <div className="grid grid-cols-4 gap-2">
        {SERVICES.map((s) => {
          const active = bookingData.serviceType === s.id;
          return (
            <button key={s.id} onClick={() => selectService(s.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                active ? "bg-white text-black border-white shadow-xl scale-[1.02]" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <s.icon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* --- INPUT GROUP --- */}
      <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8 space-y-10 relative">
        {/* Pickup */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Origin</label>
            {isSearching && activeField === 'pickup' && <Loader2 size={12} className="animate-spin text-teal-400" />}
          </div>
          <div className="relative group">
            <input placeholder="Enter pickup location" value={bookingData.pickup} onFocus={() => setActiveField("pickup")}
              onChange={(e) => setBookingData(prev => ({ ...prev, pickup: e.target.value }))}
              className="w-full bg-black/40 border border-zinc-800 p-5 pl-12 rounded-2xl text-sm text-white focus:border-teal-500 transition-all outline-none"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
            <button type="button" onClick={useCurrentLocation} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-teal-400 hover:bg-zinc-800 transition-all">
              {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Locate size={18} />}
            </button>
          </div>
          {/* Guide Note */}
          <div className="flex items-start gap-2 pt-1 px-1">
            <Compass size={14} className="text-teal-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-500 italic leading-relaxed">
              Use the <span className="text-zinc-300 font-bold">locator icon</span> for instant GPS synchronization. Please ensure your browser location permissions are active.
            </p>
          </div>
        </div>

        {/* Dropoff */}
        <div className="space-y-3">
          <label className="px-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Destination</label>
          <div className="relative">
            <input placeholder="Enter target destination" value={bookingData.dropoff} onFocus={() => setActiveField("dropoff")}
              onChange={(e) => setBookingData(prev => ({ ...prev, dropoff: e.target.value }))}
              className="w-full bg-black/40 border border-zinc-800 p-5 pl-12 rounded-2xl text-sm text-white focus:border-zinc-400 transition-all outline-none"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 bg-white" />
          </div>
        </div>

        {/* Suggestions Overlay */}
        <AnimatePresence>
          {suggestions.length > 0 && activeField && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-x-6 top-full mt-2 z-50 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl"
            >
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setBookingData(prev => ({ ...prev, [activeField]: s })); setSuggestions([]); }}
                  className="w-full p-4 text-left text-xs text-zinc-400 hover:bg-white/5 hover:text-white border-b border-zinc-800 last:border-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CTA FOOTER --- */}
      <footer className="space-y-6 pt-4">
        <button disabled={!isValid} onClick={onNext}
          className={`w-full py-5 rounded-2xl font-bold text-sm transition-all duration-300 ${
            isValid ? "bg-white text-black shadow-2xl hover:scale-[1.01] active:scale-[0.99]" : "bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800"
          }`}
        >
          {isValid ? "Initialize Sequence" : "Define mission route"}
        </button>

        <div className="flex justify-center gap-8 text-zinc-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-teal-900" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Support</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}