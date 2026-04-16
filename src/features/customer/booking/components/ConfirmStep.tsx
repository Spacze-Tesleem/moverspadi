"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookingFormData } from "@/src/types/booking/types";
import {
  CheckCircle2, Car, Calendar, ChevronLeft,
  Loader2, Package, Truck, Wrench, ShieldCheck
} from "lucide-react";

interface Props {
  bookingData: BookingFormData;
  onPrev: () => void;
  onConfirm?: () => void; // Made optional since we handle routing internally now
}

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ride: Car,
  dispatch: Package,
  haulage: Truck,
  tow: Wrench,
};

export default function ConfirmStep({ bookingData, onPrev, onConfirm }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const ServiceIcon = SERVICE_ICONS[bookingData.serviceType] || Car;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API Processing (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Execute any cleanup from parent if needed
    if (onConfirm) onConfirm();

    // 🚀 ROUTE TO PRICE PAGE
    router.push("/customer/price");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Edit Details
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verified</span>
        </div>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Order <span className="text-blue-400">Review</span>
        </h1>
        <p className="text-zinc-500 text-sm">Finalize details to generate pricing.</p>
      </header>

      {/* --- RECEIPT CARD --- */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative shadow-2xl space-y-6">
        
        {/* Route Timeline */}
        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-zinc-800" />
          
          <div className="relative flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 z-10 bg-slate-900">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Origin</p>
              <p className="text-sm font-medium text-white line-clamp-2">{bookingData.pickup}</p>
            </div>
          </div>

          <div className="relative flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 z-10 bg-slate-900">
              <div className="w-2.5 h-2.5 rounded-sm border-2 border-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Destination</p>
              <p className="text-sm font-medium text-white line-clamp-2">{bookingData.dropoff}</p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <ServiceIcon className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Service</span>
            </div>
            <p className="text-sm font-semibold text-white capitalize">{bookingData.vehicleType || bookingData.serviceType}</p>
          </div>
          
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Schedule</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {bookingData.scheduleTime || "Instant Dispatch"}
            </p>
          </div>
        </div>

        {/* Dynamic Details (Manifest) */}
        {bookingData.items?.length > 0 && (
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manifest ({bookingData.items.length})</span>
            </div>
            <div className="space-y-1">
              {bookingData.items.map((item, i) => (
                <div key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-zinc-600" />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- CTA --- */}
      <div className="pt-2">
        <button 
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isSubmitting 
              ? "bg-zinc-800 text-zinc-500 cursor-wait" 
              : "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5"
          }`}
        >
          {isSubmitting ? (
            <>Calculating Fare <Loader2 size={16} className="animate-spin" /></>
          ) : (
            <>Proceed to Pricing <CheckCircle2 size={16} /></>
          )}
        </button>
        
        <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest">
          Next: Fare Estimation & Payment
        </p>
      </div>

    </motion.div>
  );
}