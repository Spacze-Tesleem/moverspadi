"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBookingStore, getPriceEstimate } from "@/components/store/bookingStore";
import { ArrowLeft, ReceiptText, ShieldCheck, ChevronRight, Info } from "lucide-react";

export default function PricePage() {
  const router = useRouter();
  const { service, pickup, dropoff, confirmBooking } = useBookingStore();

  const baseAmount = getPriceEstimate(service);
  const insurance = Math.floor(baseAmount * 0.02);
  const total = baseAmount + insurance;

  const handleConfirm = () => {
    confirmBooking(total);
    router.push("/customer/searching");
  };

  if (!service || !pickup) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6">
      <div className="max-w-xl mx-auto pt-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 mb-8 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-blue-50/50 border-b border-slate-50 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <ReceiptText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-600 uppercase text-sm">Booking Summary</span>
             </div>
             <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-green-600 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> INSURED
             </div>
          </div>

          <div className="p-8">
            <div className="space-y-6 mb-10 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup</span>
                <span className="font-semibold text-slate-700 truncate max-w-[200px]">{pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination</span>
                <span className="font-semibold text-slate-700 truncate max-w-[200px]">{dropoff}</span>
              </div>
              <div className="h-px bg-slate-50" />
              <div className="flex justify-between">
                <span className="text-slate-400">Base Fare</span>
                <span className="font-semibold text-slate-700">₦{baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-1 text-slate-400">
                  Insurance <Info className="w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-700">₦{insurance.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 mb-8 flex justify-between items-center">
              <span className="font-bold text-slate-500">Total</span>
              <span className="text-3xl font-black text-blue-600">₦{total.toLocaleString()}</span>
            </div>

            <button onClick={handleConfirm} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
              Confirm Booking <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}