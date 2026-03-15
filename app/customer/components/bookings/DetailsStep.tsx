// app/customer/components/bookings/DetailsStep.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookingData } from "@/app/types/booking";
import {
  Bike,
  Truck as TruckIcon,
  Car,
  Bus,
  Package,
  ChevronLeft,
  ArrowRight,
  Settings2,
  Trash2,
  AlertTriangle,
  Plus,
} from "lucide-react";

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onPrev: () => void;
}

// ============ SHARED COMPONENTS ============

interface VehicleCardProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const VehicleCard = ({ label, icon: Icon, active, onClick, color = "#1CA7A6" }: VehicleCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`aspect-[4/3] rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
      active
        ? `border-[${color}] bg-[${color}]/10 shadow-[0_0_25px_rgba(28,167,166,0.15)]`
        : "border-white/5 bg-white/5 hover:bg-white/10"
    }`}
    style={{
      borderColor: active ? color : undefined,
      backgroundColor: active ? `${color}15` : undefined,
    }}
  >
    <Icon size={32} style={{ color: active ? color : "rgba(255,255,255,0.2)" }} />
    <span
      className={`text-[10px] font-black uppercase tracking-[0.15em] ${
        active ? "text-white" : "text-white/40"
      }`}
    >
      {label}
    </span>
  </button>
);

const NextButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 mt-8 ${
      disabled
        ? "bg-white/5 text-white/20 cursor-not-allowed"
        : "bg-[#1CA7A6] text-white shadow-xl shadow-[#1CA7A6]/20 active:scale-[0.98]"
    }`}
  >
    Continue <ArrowRight size={16} />
  </button>
);

// ============ DISPATCH / HAULAGE FORM ============
const DispatchForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const items = bookingData.items || [];
  const isHaulage = bookingData.serviceType === "haulage";

  const updateItem = (idx: number, field: string, value: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setBookingData((prev) => ({ ...prev, items: updated }));
  };

  const addItem = () => {
    setBookingData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: 1, weight: "" }],
    }));
  };

  const removeItem = (idx: number) => {
    setBookingData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const isValid =
    items.length > 0 &&
    items.every((i) => i.name.trim().length > 0) &&
    bookingData.vehicleType;

  return (
    <div className="space-y-8">
      {/* Vehicle Selection */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Select Vehicle
        </label>
        <div className={`grid ${isHaulage ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
          {!isHaulage ? (
            <>
              <VehicleCard
                label="Bike"
                icon={Bike}
                active={bookingData.vehicleType === "bike"}
                onClick={() => setBookingData((prev) => ({ ...prev, vehicleType: "bike" }))}
              />
              <VehicleCard
                label="Van"
                icon={Package}
                active={bookingData.vehicleType === "van"}
                onClick={() => setBookingData((prev) => ({ ...prev, vehicleType: "van" }))}
              />
            </>
          ) : (
            <VehicleCard
              label="Heavy Truck"
              icon={TruckIcon}
              active={bookingData.vehicleType === "truck"}
              onClick={() => setBookingData((prev) => ({ ...prev, vehicleType: "truck" }))}
              color="#8B5CF6"
            />
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Items to Transport ({items.length})
        </label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <input
                placeholder={`Item ${idx + 1} (e.g. Sofa, Box of Books)`}
                className="flex-1 bg-white/5 p-4 rounded-xl text-white text-sm outline-none border border-white/5 focus:border-[#1CA7A6] transition-all placeholder:text-white/20"
                value={item.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full border border-dashed border-white/10 p-4 rounded-xl text-white/40 text-xs font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add Another Item
          </button>
        </div>
      </div>

      <NextButton onClick={onNext} disabled={!isValid} />
    </div>
  );
};

// ============ RIDE FORM ============
const RideForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const passengers = parseInt(bookingData.passengers || "0");
  const isValid = bookingData.vehicleType && passengers > 0;

  return (
    <div className="space-y-8">
      {/* Vehicle Selection */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Select Ride Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <VehicleCard
            label="Private Car"
            icon={Car}
            active={bookingData.vehicleType === "car"}
            onClick={() => setBookingData((prev) => ({ ...prev, vehicleType: "car" }))}
          />
          <VehicleCard
            label="Bus / Coaster"
            icon={Bus}
            active={bookingData.vehicleType === "bus"}
            onClick={() => setBookingData((prev) => ({ ...prev, vehicleType: "bus" }))}
          />
        </div>
      </div>

      {/* Passenger Count */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Number of Passengers
        </label>
        <input
          type="number"
          min="1"
          max="50"
          placeholder="Enter number of passengers"
          className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#1CA7A6] transition-all placeholder:text-white/20"
          value={bookingData.passengers || ""}
          onChange={(e) => setBookingData((prev) => ({ ...prev, passengers: e.target.value }))}
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Additional Notes <span className="text-white/15">(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Heavy luggage, child seat needed"
          className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#1CA7A6] transition-all placeholder:text-white/20"
          value={bookingData.vehicleDescription || ""}
          onChange={(e) => setBookingData((prev) => ({ ...prev, vehicleDescription: e.target.value }))}
        />
      </div>

      <NextButton onClick={onNext} disabled={!isValid} />
    </div>
  );
};

// ============ TOW FORM ============
const TowForm = ({ bookingData, setBookingData, onNext }: Props) => {
  const isValid = (bookingData.vehicleDescription?.trim().length ?? 0) > 5;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Vehicle Details to Tow
        </label>
        <textarea
          placeholder="Please provide:&#10;• Vehicle Make/Model (e.g., Toyota Camry 2020)&#10;• Color&#10;• Nature of the fault (e.g., Engine failure, flat tires)"
          className="w-full h-48 bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-[#EF4444] transition-all resize-none placeholder:text-white/20"
          value={bookingData.vehicleDescription || ""}
          onChange={(e) =>
            setBookingData((prev) => ({
              ...prev,
              vehicleDescription: e.target.value,
              vehicleType: "tow-truck",
            }))
          }
        />
        <p className="text-[10px] text-white/20">
          Minimum 6 characters required. Currently: {bookingData.vehicleDescription?.length || 0}
        </p>
      </div>

      <NextButton onClick={onNext} disabled={!isValid} />
    </div>
  );
};

// ============ ERROR STATE ============
const ServiceTypeError = ({ onPrev }: { onPrev: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="p-8 border border-dashed border-red-500/30 rounded-2xl text-center bg-red-500/5"
  >
    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
      <AlertTriangle size={32} className="text-red-500" />
    </div>

    <p className="text-red-400 text-lg font-bold mb-2">Service Type Not Selected</p>
    <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
      Please go back to Step 1 and select a service type before continuing.
    </p>

    <button
      type="button"
      onClick={onPrev}
      className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 mx-auto"
    >
      <ChevronLeft size={16} />
      Go Back to Step 1
    </button>
  </motion.div>
);

// ============ MAIN EXPORT ============
export default function DetailsStep({ bookingData, setBookingData, onNext, onPrev }: Props) {
  const service = bookingData.serviceType;

  const renderForm = () => {
    if (!service) {
      return <ServiceTypeError onPrev={onPrev} />;
    }

    switch (service) {
      case "dispatch":
      case "haulage":
        return (
          <DispatchForm
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case "tow":
        return (
          <TowForm
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case "ride":
        return (
          <RideForm
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      default:
        return <ServiceTypeError onPrev={onPrev} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#1CA7A6]/10 flex items-center justify-center text-[#1CA7A6]">
          <Settings2 size={24} />
        </div>
        <div>
          <div className="text-[10px] font-black text-[#1CA7A6] uppercase tracking-[0.3em] mb-1">
            Step_02
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Details
          </h2>
        </div>
      </div>

      {/* Service Badge */}
      {service && (
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1CA7A6]/10 border border-[#1CA7A6]/20">
          <div className="w-2 h-2 rounded-full bg-[#1CA7A6] animate-pulse" />
          <span className="text-[10px] font-bold text-[#1CA7A6] uppercase tracking-widest">
            {service} Service
          </span>
        </div>
      )}

      {/* Form */}
      {renderForm()}

      {/* Back Button */}
      {service && (
        <button
          type="button"
          onClick={onPrev}
          className="mt-8 flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mx-auto hover:text-white transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
      )}
    </motion.div>
  );
}