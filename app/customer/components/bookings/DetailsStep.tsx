"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingData } from "@/app/types/booking";
import {
  Bike, Truck, Car, Bus, Package, ChevronLeft, ArrowRight,
  Settings, Trash2, Plus, Info, AlertCircle
} from "lucide-react";

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onPrev: () => void;
}

// --- SHARED: VEHICLE CARD ---
const VehicleCard = ({ label, icon: Icon, active, onClick }: { label: string, icon: any, active: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 group ${
      active
        ? "bg-violet-500/10 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700"
    }`}
  >
    <Icon size={28} className={`transition-colors ${active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
    <span className={`text-xs font-semibold ${active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="active-vehicle" className="absolute inset-0 border-2 border-violet-500/50 rounded-2xl" />
    )}
  </button>
);

// --- FORM: DISPATCH / HAULAGE ---
const DispatchForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const items = bookingData.items || [];
  const isHaulage = bookingData.serviceType === "haulage";

  const updateItem = (idx: number, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], name: value };
    setBookingData(prev => ({ ...prev, items: updated }));
  };

  const addItem = () => {
    setBookingData(prev => ({ ...prev, items: [...items, { name: "", qty: 1, weight: "" }] }));
  };

  const removeItem = (idx: number) => {
    setBookingData(prev => ({ ...prev, items: items.filter((_, i) => i !== idx) }));
  };

  const isValid = items.length > 0 && items.every(i => i.name.trim().length > 0) && bookingData.vehicleType;

  return (
    <div className="space-y-8">
      {/* Vehicle Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Asset Selection</label>
        <div className={`grid ${isHaulage ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
          {!isHaulage ? (
            <>
              <VehicleCard label="Motorbike" icon={Bike} active={bookingData.vehicleType === 'bike'} onClick={() => setBookingData(p => ({ ...p, vehicleType: 'bike' }))} />
              <VehicleCard label="Delivery Van" icon={Package} active={bookingData.vehicleType === 'van'} onClick={() => setBookingData(p => ({ ...p, vehicleType: 'van' }))} />
            </>
          ) : (
            <VehicleCard label="Heavy Truck" icon={Truck} active={bookingData.vehicleType === 'truck'} onClick={() => setBookingData(p => ({ ...p, vehicleType: 'truck' }))} />
          )}
        </div>
      </div>

      {/* Manifest */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manifest</label>
          <span className="text-[10px] text-zinc-600">{items.length} Items</span>
        </div>
        
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                  <input
                    placeholder="Item description (e.g. Documents, Box)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-8 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all"
                    value={item.name}
                    onChange={(e) => updateItem(idx, e.target.value)}
                  />
                </div>
                {items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button onClick={addItem} className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-xs font-medium text-zinc-500 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2">
            <Plus size={14} /> Add Line Item
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button disabled={!isValid} onClick={onNext} className={`w-full py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? "bg-white text-black hover:bg-zinc-200 shadow-lg" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"}`}>
          {isValid ? <>Confirm Manifest <ArrowRight size={16} /></> : "Complete Details"}
        </button>
      </div>
    </div>
  );
};

// --- FORM: RIDE ---
const RideForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const isValid = bookingData.vehicleType && parseInt(bookingData.passengers) > 0;

  return (
    <div className="space-y-8">
      {/* Vehicle Type */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Comfort Level</label>
        <div className="grid grid-cols-2 gap-3">
          <VehicleCard label="Private Car" icon={Car} active={bookingData.vehicleType === 'car'} onClick={() => setBookingData(p => ({ ...p, vehicleType: 'car' }))} />
          <VehicleCard label="Bus / Coaster" icon={Bus} active={bookingData.vehicleType === 'bus'} onClick={() => setBookingData(p => ({ ...p, vehicleType: 'bus' }))} />
        </div>
      </div>

      {/* Passengers & Notes */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passengers</label>
          <div className="relative">
             <input
               type="number" min="1"
               value={bookingData.passengers}
               onChange={(e) => setBookingData(p => ({ ...p, passengers: e.target.value }))}
               className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all"
             />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Special Instructions</label>
          <textarea
            placeholder="E.g. Extra luggage, Child seat required..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all resize-none h-24"
            value={bookingData.vehicleDescription || ""}
            onChange={(e) => setBookingData(p => ({ ...p, vehicleDescription: e.target.value }))}
          />
        </div>
      </div>

      <div className="pt-4">
        <button disabled={!isValid} onClick={onNext} className={`w-full py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? "bg-white text-black hover:bg-zinc-200 shadow-lg" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"}`}>
          {isValid ? <>Proceed to Schedule <ArrowRight size={16} /></> : "Select Vehicle & Passengers"}
        </button>
      </div>
    </div>
  );
};

// --- FORM: TOW ---
const TowForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const isValid = (bookingData.vehicleDescription?.length ?? 0) > 5;

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-3">
        <Info className="text-amber-500 shrink-0" size={18} />
        <p className="text-xs text-amber-200/70 leading-relaxed">
          Please describe the vehicle and the nature of the breakdown to help us dispatch the correct tow truck.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Incident Report</label>
        <textarea
          placeholder="Vehicle Model, Color, Fault (e.g. Toyota Camry, Silver, Engine failure)..."
          className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none leading-relaxed"
          value={bookingData.vehicleDescription || ""}
          onChange={(e) => setBookingData(p => ({ ...p, vehicleDescription: e.target.value, vehicleType: 'tow-truck' }))}
        />
      </div>

      <div className="pt-4">
        <button disabled={!isValid} onClick={onNext} className={`w-full py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? "bg-white text-black hover:bg-zinc-200 shadow-lg" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"}`}>
          {isValid ? <>Request Recovery <ArrowRight size={16} /></> : "Describe Incident"}
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DetailsStep({ bookingData, setBookingData, onNext, onPrev }: Props) {
  const service = bookingData.serviceType;

  const renderForm = () => {
    if (service === "dispatch" || service === "haulage") return <DispatchForm {...{ bookingData, setBookingData, onNext, onPrev }} />;
    if (service === "ride") return <RideForm {...{ bookingData, setBookingData, onNext, onPrev }} />;
    if (service === "tow") return <TowForm {...{ bookingData, setBookingData, onNext, onPrev }} />;
    
    // Fallback/Error state
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><AlertCircle /></div>
        <div>
          <p className="text-white font-medium">Configuration Error</p>
          <p className="text-zinc-500 text-xs">Service type data is missing.</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{service} Config</span>
          <Settings size={14} className="text-violet-500" />
        </div>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Service <span className="text-violet-400">Details</span>
        </h1>
        <p className="text-zinc-500 text-sm">Specify parameters for the selected operation.</p>
      </header>

      {/* Dynamic Content */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-6 relative shadow-2xl">
        {renderForm()}
      </div>

    </motion.div>
  );
}