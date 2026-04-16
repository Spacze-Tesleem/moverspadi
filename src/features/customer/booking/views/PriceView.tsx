"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useBookingStore } from "@/src/store/bookingStore";
import { bookingApi } from "@/src/services/api/booking";
import {
  ChevronLeft,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  X,
} from "lucide-react";

const MapPreview = dynamic(() => import("@/src/ui/map/MapPreview"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#080808]" />,
});

const getPriceEstimate = bookingApi.getPriceEstimate;

export default function PriceView() {
  const router = useRouter();
  const { service, pickup, dropoff, confirmBooking } = useBookingStore();

  const baseAmount = getPriceEstimate(service);
  const insurance  = Math.floor(baseAmount * 0.02);
  const total      = baseAmount + insurance;

  const handleConfirm = () => {
    confirmBooking(total);
    router.push("/customer/track");
  };

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-100 overflow-hidden font-sans selection:bg-violet-500/30">

      {/* --- FORM PANEL (LEFT) --- */}
      <div className="w-full lg:w-[540px] bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full relative z-20 shadow-2xl">

        {/* Header / Breadcrumb */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">New Request</span>
            <span className="text-zinc-700">/</span>
            <span className="font-medium text-white">Fare Summary</span>
          </div>
          <button
            onClick={() => router.push("/customer")}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar — step 4 of 4 complete */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex gap-1.5 h-1">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="flex-1 rounded-full bg-violet-500/30"
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
          >
            {/* Section header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Edit Details
              </button>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Insured</span>
              </div>
            </div>

            <header>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                Fare <span className="text-violet-400">Summary</span>
              </h1>
              <p className="text-zinc-500 text-sm">Review your order before confirming.</p>
            </header>

            {/* Receipt card */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">

              {/* Route */}
              <div className="p-6 border-b border-white/5">
                <div className="relative space-y-6">
                  <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-zinc-800" />

                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pickup</p>
                      <p className="text-sm font-medium text-white line-clamp-2">{pickup || "Not set"}</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                      <div className="w-2.5 h-2.5 rounded-sm border-2 border-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Destination</p>
                      <p className="text-sm font-medium text-white line-clamp-2">{dropoff || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Base Fare</span>
                  <span className="font-semibold text-white">₦{baseAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <ShieldCheck size={14} />
                    <span className="font-medium">Insurance</span>
                  </div>
                  <span className="font-semibold text-emerald-500">+₦{insurance.toLocaleString()}</span>
                </div>

                <div className="h-px w-full bg-white/5" />

                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Payable</p>
                  <p className="text-3xl font-black text-white">₦{total.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment method */}
              <div className="px-6 pb-6">
                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                  <Wallet size={16} className="text-zinc-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-300">Wallet Balance</p>
                    <p className="text-[10px] text-zinc-600">₦21,850 available</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    Sufficient
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-xl font-semibold text-sm bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Confirm Booking
                <CheckCircle2 size={16} />
              </button>
              <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest">
                Next: Live Tracking
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 font-medium">
            PadiLogistics Encrypted Booking Protocol v2.4
          </p>
        </div>
      </div>

      {/* --- MAP PANEL (RIGHT) --- */}
      <div className="hidden lg:block flex-1 bg-[#080808] relative">
        <MapPreview pickup={pickup} dropoff={dropoff} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      </div>

    </div>
  );
}
