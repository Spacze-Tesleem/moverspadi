"use client";

import { motion } from "framer-motion";
import { BookingData } from "@/app/types/booking";
import { Calendar, Clock, ArrowRight, ArrowLeft, Sunrise, Sun, Moon, CheckCircle2 } from "lucide-react";

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onPrev: () => void;
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "08:00", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", time: "13:00", icon: Sun },
  { id: "evening", label: "Evening", time: "19:00", icon: Moon },
];

export default function ScheduleStep({ bookingData, setBookingData, onNext, onPrev }: Props) {
  const isValid = bookingData.scheduleDate && bookingData.scheduleTime;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-10">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Time <span className="text-teal-400">Frame</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium">Sync your operation with the system clock.</p>
      </div>

      {/* --- DATE PICKER --- */}
      <section className="space-y-4">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">01. Operation Date</label>
        <div className="relative group">
          <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" />
          <input 
            type="date"
            value={bookingData.scheduleDate}
            onChange={(e) => setBookingData(p => ({ ...p, scheduleDate: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-800 p-5 pl-14 rounded-2xl text-sm text-white outline-none focus:border-teal-500 transition-all [color-scheme:dark]"
          />
        </div>
      </section>

      {/* --- TIME SLOTS --- */}
      <section className="space-y-4">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">02. Temporal Window</label>
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map((slot) => {
            const active = bookingData.scheduleTime === slot.time;
            return (
              <button key={slot.id} onClick={() => setBookingData(p => ({ ...p, scheduleTime: slot.time }))}
                className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all duration-300 ${
                  active ? "bg-white text-black border-white shadow-xl" : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <slot.icon size={20} />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-tighter">{slot.label}</p>
                  <p className={`text-[9px] ${active ? "text-black/60" : "text-zinc-600"}`}>{slot.time}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* --- SUMMARY BADGE --- */}
      {isValid && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-black">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Schedule Verified</p>
            <p className="text-sm font-bold text-white">
              {new Date(bookingData.scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {bookingData.scheduleTime}
            </p>
          </div>
        </motion.div>
      )}

      {/* --- FOOTER NAV --- */}
      <footer className="grid grid-cols-5 gap-3 pt-6">
        <button onClick={onPrev} className="col-span-2 py-5 rounded-2xl bg-zinc-900 text-zinc-500 border border-zinc-800 font-bold text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} className="inline mr-2" /> Back
        </button>
        <button disabled={!isValid} onClick={onNext}
          className={`col-span-3 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
            isValid ? "bg-[#1CA7A6] text-white shadow-xl" : "bg-zinc-800 text-zinc-700 cursor-not-allowed"
          }`}
        >
          Finalize Schedule <ArrowRight size={16} className="inline ml-2" />
        </button>
      </footer>
    </motion.div>
  );
}