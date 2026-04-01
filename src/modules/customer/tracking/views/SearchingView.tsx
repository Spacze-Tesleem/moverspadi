"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/src/application/store/bookingStore";
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  X, 
  Loader2,
  ShieldCheck,
  Bike,
  Truck,
  Car
} from "lucide-react";

// Mapping service IDs to icons
const serviceIcons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  dispatch: Bike,
  haulage: Truck,
  tow: Car,
};

// Realistic status messages that cycle during the search
const loadingSteps = [
  "Finding nearby movers...",
  "Optimizing route for traffic...",
  "Checking vehicle availability...",
  "Finalizing your request...",
];

export default function SearchingView() {
  const router = useRouter();
  
  // Zustand State Management (clearBooking removed)
  const { service, pickup, dropoff, price } = useBookingStore();

  const [step, setStep] = useState(0);
  const [isFound, setIsFound] = useState(false);
  
  // Fallback to Bike icon if service is undefined
  const Icon = serviceIcons[service as string] || Bike;

  useEffect(() => {
    // 1. Cycle through the status text steps every 800ms
    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 800);

    // 2. Simulate the backend "finding" a mover after 3.5 seconds
    const timer = setTimeout(() => {
      setIsFound(true);
      clearInterval(stepInterval);
    }, 3500);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 relative overflow-hidden flex flex-col">
      
      {/* --- Animated Radar Background --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i,
                ease: "easeOut",
              }}
              className="absolute w-64 h-64 border border-blue-200 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        
        {/* --- Central Loading Visual --- */}
        <div className="relative mb-12">
          <AnimatePresence mode="wait">
            {!isFound ? (
              <motion.div
                key="searching"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="relative"
              >
                {/* Service Icon Container */}
                <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl shadow-blue-200 flex items-center justify-center relative z-10 border border-white">
                  <Icon className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                </div>
                {/* Outer Rotating Dotted Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-2 border-dashed border-blue-400/30 rounded-[50px]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="found"
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="w-32 h-32 bg-green-500 rounded-[40px] shadow-2xl shadow-green-200 flex items-center justify-center relative z-10"
              >
                <CheckCircle2 className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Header Status Text --- */}
        <div className="text-center space-y-3 mb-12">
          <motion.h1 
            key={isFound ? "found-text" : "loading-text"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black tracking-tight"
          >
            {isFound ? "Mover Found!" : loadingSteps[step]}
          </motion.h1>
          <p className="text-slate-400 font-medium max-w-[280px] mx-auto">
            {isFound 
              ? "A professional mover is being assigned to your route." 
              : "We're matching you with the best rates in your area..."}
          </p>
        </div>

        {/* --- Booking Info Card (Data from Zustand) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-white shadow-xl shadow-slate-200/50"
        >
          <div className="space-y-4">
            {/* Pickup Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{pickup || "Locating..."}</p>
              </div>
            </div>

            {/* Drop-off Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drop-off</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{dropoff || "Locating..."}</p>
              </div>
            </div>

            {/* Price Footer */}
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">Final Total</span>
              </div>
              <span className="text-xl font-black text-slate-900">
                ₦{price ? Number(price).toLocaleString() : "0"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Footer Buttons --- */}
        <div className="mt-12 flex flex-col items-center gap-6">
          {!isFound && (
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors font-semibold text-sm group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Cancel Request
            </button>
          )}
          
          {isFound && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push('/customer/track')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3 group"
            >
              Track Driver Location
              <Loader2 className="w-4 h-4 animate-spin group-hover:hidden" />
              <Navigation className="w-4 h-4 hidden group-hover:block animate-bounce" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}