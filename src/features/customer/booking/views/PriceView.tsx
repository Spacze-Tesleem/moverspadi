"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBookingStore } from "@/src/store/bookingStore";
import { bookingApi } from "@/src/services/api/booking";
import { ArrowLeft, ShieldCheck, ChevronRight, Wallet } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-slate-200 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900">Order Summary</h1>
            <p className="text-xs text-slate-400">Review before confirming</p>
          </div>
          <span className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-200 uppercase tracking-wider">
            Insured
          </span>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

          {/* Route */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <div className="w-px h-8 bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
              </div>
              <div className="space-y-4 flex-1 min-w-0">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pickup</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{pickup || "Not set"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Destination</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{dropoff || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Base Fare</span>
              <span className="font-bold text-slate-800">₦{baseAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck size={14} />
                <span className="font-medium">Insurance</span>
              </div>
              <span className="font-bold text-emerald-600">+₦{insurance.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payable</p>
              <p className="text-3xl font-black text-slate-900">₦{total.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment method */}
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <Wallet size={16} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700">Wallet Balance</p>
                <p className="text-[10px] text-slate-400">₦21,850 available</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                Sufficient
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          Confirm Booking
          <ChevronRight size={16} />
        </button>

        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
          By confirming you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
