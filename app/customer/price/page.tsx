"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBookingStore } from "@/src/application/store/bookingStore";
import { bookingApi } from "@/src/infrastructure/api/booking";
const getPriceEstimate = bookingApi.getPriceEstimate;
import { ArrowLeft, ShieldCheck, ChevronRight, Wallet, Clock } from "lucide-react";

export default function PricePage() {
  const router = useRouter();
  const { service, pickup, dropoff, confirmBooking } = useBookingStore();

  const baseAmount = getPriceEstimate(service);
  const insurance = Math.floor(baseAmount * 0.02);
  const total = baseAmount + insurance;

  const handleConfirm = () => {
    confirmBooking(total);
    router.push("/customer/track");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-6 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-[#0d0d0f] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 bg-blue-600/10 border-b border-white/5 flex justify-between items-center">
           <h2 className="text-xl font-black uppercase italic tracking-tighter">Order Summary</h2>
           <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20">INSURED</div>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
             <div><p className="text-[10px] text-zinc-500 font-black uppercase mb-1">Pickup</p><p className="font-bold text-sm truncate">{pickup}</p></div>
             <div><p className="text-[10px] text-zinc-500 font-black uppercase mb-1">Destination</p><p className="font-bold text-sm truncate">{dropoff}</p></div>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl space-y-3">
             <div className="flex justify-between text-sm font-medium text-zinc-400"><span>Base Fare</span><span>₦{baseAmount.toLocaleString()}</span></div>
             <div className="flex justify-between text-sm font-medium text-emerald-400"><span>Insurance</span><span>+₦{insurance.toLocaleString()}</span></div>
             <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <p className="text-xs font-black uppercase text-zinc-500">Total Payable</p>
                <p className="text-4xl font-black text-white">₦{total.toLocaleString()}</p>
             </div>
          </div>
          <button onClick={handleConfirm} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20">
            Confirm Booking
          </button>
        </div>
      </motion.div>
    </div>
  );
}