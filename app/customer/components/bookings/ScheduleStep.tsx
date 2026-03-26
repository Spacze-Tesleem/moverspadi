"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingData } from "@/app/types/booking";
import { 
  Calendar, Clock, ChevronLeft, ArrowRight, 
  Sunrise, Sun, Moon, CheckCircle2 
} from "lucide-react";

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onPrev: () => void;
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "09:00", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", time: "14:00", icon: Sun },
  { id: "evening", label: "Evening", time: "19:00", icon: Moon },
];

export default function ScheduleStep({ bookingData, setBookingData, onNext, onPrev }: Props) {
  const isValid = bookingData.scheduleDate && bookingData.scheduleTime;

  // Helper to check if a specific time matches a slot
  const isSlotActive = (time: string) => bookingData.scheduleTime === time;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onPrev} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-violet-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scheduling</span>
        </div>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Time <span className="text-violet-400">Frame</span>
        </h1>
        <p className="text-zinc-500 text-sm">Synchronize operation with system clock.</p>
      </header>

      {/* --- MAIN CARD --- */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-6 relative shadow-2xl space-y-8">
        
        {/* DATE SELECTION */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">01. Operation Date</label>
          <div className="relative group">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
            <input 
              type="date"
              value={bookingData.scheduleDate}
              onChange={(e) => setBookingData(prev => ({ ...prev, scheduleDate: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* TIME SELECTION */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">02. Temporal Window</label>
          
          {/* Quick Slots */}
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => {
              const active = isSlotActive(slot.time);
              return (
                <button 
                  key={slot.id} 
                  onClick={() => setBookingData(prev => ({ ...prev, scheduleTime: slot.time }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 group ${
                    active 
                      ? "bg-violet-500/10 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]" 
                      : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900 hover:border-white/10"
                  }`}
                >
                  <slot.icon size={20} className={active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"} />
                  <div className="text-center">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-white" : "text-zinc-500"}`}>{slot.label}</p>
                    <p className="text-[10px] text-zinc-600">{slot.time}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Manual Time Input */}
          <div className="relative mt-3">
             <div className="absolute inset-0 flex items-center" aria-hidden="true">
               <div className="w-full border-t border-white/5"></div>
             </div>
             <div className="relative flex justify-center">
               <span className="bg-[#0e0e0e] px-2 text-[10px] text-zinc-600 uppercase tracking-widest">Or Specific Time</span>
             </div>
          </div>

          <div className="relative group">
            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
            <input 
              type="time"
              value={bookingData.scheduleTime}
              onChange={(e) => setBookingData(prev => ({ ...prev, scheduleTime: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

      </div>

      {/* --- CONFIRMATION BADGE --- */}
      <AnimatePresence>
        {isValid && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center text-black shadow-lg shadow-violet-900/20">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Confirmed Slot</p>
              <p className="text-sm font-semibold text-white">
                {new Date(bookingData.scheduleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                <span className="text-zinc-500 mx-2">|</span>
                {bookingData.scheduleTime}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CTA --- */}
      <div className="pt-2">
        <button 
          disabled={!isValid} 
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isValid 
              ? "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5" 
              : "bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed"
          }`}
        >
          {isValid ? (
            <>Finalize Schedule <ArrowRight size={16} /></>
          ) : (
            "Select Date & Time"
          )}
        </button>
      </div>

    </motion.div>
  );
}