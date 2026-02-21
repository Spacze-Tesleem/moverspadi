"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/components/store/bookingStore";
import MapPreview from "@/components/Map/MapPreview";
import { 
  MapPin, Navigation, ArrowLeft, ChevronRight, Bike, Truck, Car, 
  User, Plus, Info, Crosshair, Circle, CheckCircle2, Map as MapIcon
} from "lucide-react";

const serviceConfigs = {
  dispatch: { icon: Bike, label: "Express Dispatch", color: "text-blue-400", bg: "bg-blue-600", light: "bg-blue-400/10", border: "border-blue-500/20" },
  haulage: { icon: Truck, label: "Heavy Haulage", color: "text-amber-400", bg: "bg-amber-600", light: "bg-amber-400/10", border: "border-amber-500/20" },
  tow: { icon: Car, label: "Roadside Tow", color: "text-rose-400", bg: "bg-rose-600", light: "bg-rose-400/10", border: "border-rose-500/20" },
};

export default function BookServicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = (searchParams.get("service") as string) || "dispatch";
  const config = serviceConfigs[serviceParam as keyof typeof serviceConfigs] || serviceConfigs.dispatch;

  const { setService, setPickup, setDropoff, pickup: savedP, dropoff: savedD } = useBookingStore();
  
  const [pickup, setLocalPickup] = useState(savedP || "");
  const [dropoff, setLocalDropoff] = useState(savedD || "");
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (serviceParam) setService(serviceParam);
  }, [serviceParam, setService]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    setPickup(pickup);
    setDropoff(dropoff);
    router.push("/customer/price");
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </button>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="hidden md:flex items-center gap-3">
               <div className={`p-2 rounded-lg ${config.light} ${config.color}`}>
                  <config.icon className="w-4 h-4" />
               </div>
               <span className="text-sm font-bold tracking-tight">{config.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Booking Progress</span>
                <div className="flex gap-1 mt-1">
                   <div className={`h-1 w-6 rounded-full ${config.bg}`} />
                   <div className="h-1 w-6 rounded-full bg-white/10" />
                   <div className="h-1 w-6 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
              <User className="w-5 h-5 text-zinc-500" />
            </div>
          </div>
        </header>

        {/* CONTENT SPLIT */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: FORM PANEL (DARK CUSTOMER STYLE) */}
          <div className="w-full lg:w-[480px] xl:w-[550px] h-full bg-[#0d0d0f] border-r border-white/5 overflow-y-auto custom-scrollbar flex flex-col relative z-10 shadow-2xl">
            <div className="p-8 md:p-12">
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
              >
                <h1 className="text-3xl font-black tracking-tighter mb-2">Route Details</h1>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  Precision matters. Please provide exact locations to ensure our {config.label} partners can reach you efficiently.
                </p>
              </motion.div>

              <form onSubmit={handleNext} className="space-y-10">
                <div className="relative">
                  {/* Vertical Path Line */}
                  <div className="absolute left-[29px] top-12 bottom-12 w-px border-l-2 border-dashed border-zinc-800" />

                  <div className="space-y-6">
                    {/* Pickup Field */}
                    <div className="relative z-10 group">
                      <label className={`text-[10px] font-black uppercase tracking-widest mb-3 block transition-colors ${focused === 'pickup' ? config.color : 'text-zinc-500'}`}>
                        Collection Point
                      </label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${focused === 'pickup' ? `${config.bg} text-white shadow-lg` : 'bg-zinc-900 text-zinc-600'}`}>
                          <Circle className="w-3 h-3 fill-current" />
                        </div>
                        <input
                          required
                          value={pickup}
                          onChange={(e) => setLocalPickup(e.target.value)}
                          onFocus={() => setFocused('pickup')}
                          onBlur={() => setFocused(null)}
                          placeholder="Where are we picking up?"
                          className={`w-full bg-zinc-900/40 border-2 pl-16 pr-6 py-5 rounded-[22px] font-bold text-white transition-all outline-none placeholder:text-zinc-700 ${focused === 'pickup' ? 'border-white/10 ring-8 ring-white/[0.02] bg-zinc-900' : 'border-transparent hover:bg-zinc-900/60'}`}
                        />
                        <AnimatePresence>
                          {pickup.length > 5 && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className={`w-5 h-5 ${config.color}`} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Dropoff Field */}
                    <div className="relative z-10 group">
                      <label className={`text-[10px] font-black uppercase tracking-widest mb-3 block transition-colors ${focused === 'dropoff' ? config.color : 'text-zinc-500'}`}>
                        Drop-off Destination
                      </label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${focused === 'dropoff' ? `${config.bg} text-white shadow-lg` : 'bg-zinc-900 text-zinc-600'}`}>
                          <Navigation className="w-4 h-4 fill-current" />
                        </div>
                        <input
                          required
                          value={dropoff}
                          onChange={(e) => setLocalDropoff(e.target.value)}
                          onFocus={() => setFocused('dropoff')}
                          onBlur={() => setFocused(null)}
                          placeholder="Destination address..."
                          className={`w-full bg-zinc-900/40 border-2 pl-16 pr-6 py-5 rounded-[22px] font-bold text-white transition-all outline-none placeholder:text-zinc-700 ${focused === 'dropoff' ? 'border-white/10 ring-8 ring-white/[0.02] bg-zinc-900' : 'border-transparent hover:bg-zinc-900/60'}`}
                        />
                        <AnimatePresence>
                          {dropoff.length > 5 && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className={`w-5 h-5 ${config.color}`} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!pickup || !dropoff}
                    className={`w-full py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-2xl ${
                      !pickup || !dropoff 
                        ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                        : `${config.bg} text-white shadow-blue-500/10 hover:brightness-110`
                    }`}
                  >
                    Confirm Route <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Security Badge */}
              <div className={`mt-12 p-6 rounded-[28px] border bg-white/[0.01] ${config.border} flex items-center gap-5`}>
                 <div className={`w-12 h-12 rounded-2xl ${config.light} ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <MapIcon className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-200">Live Optimization</p>
                    <p className="text-xs text-zinc-500 font-medium">Routes are calculated using real-time traffic data.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT: MAP PANEL (LIGHT STYLE) */}
          <div className="hidden lg:block flex-1 relative bg-slate-100">
             <div className="absolute inset-0">
                {/* No filters here - keeping it light and natural */}
                <MapPreview pickup={pickup} dropoff={dropoff} />
             </div>
             
             {/* Map Controls */}
             <div className="absolute top-8 right-8 z-10 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-zinc-600 hover:text-blue-600 transition-all border border-slate-100">
                    <Crosshair className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-zinc-600 hover:text-blue-600 transition-all border border-slate-100">
                    <Plus className="w-5 h-5" />
                </button>
             </div>

             {/* Dynamic Badge for Light Map */}
             <div className="absolute bottom-8 left-8 z-10">
                <div className="bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${config.bg} animate-pulse`} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">GPS Network Active</span>
                </div>
             </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e21; border-radius: 10px; }
      `}</style>
    </div>
  );
}