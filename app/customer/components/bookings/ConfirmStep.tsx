// app/customer/components/bookings/ConfirmStep.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookingData } from "@/app/types/booking";

import {
  CheckCircle,
  MapPin,
  Navigation,
  Car,
  Calendar,
  Clock,
  ChevronLeft,
  Loader2,
  Package,
  Truck,
  Wrench,
} from "lucide-react";

interface Props {
  bookingData: BookingData;
  onPrev: () => void;
}

const SERVICE_ICONS = {
  ride: Car,
  dispatch: Package,
  haulage: Truck,
  tow: Wrench,
};

export default function ConfirmStep({ bookingData, onPrev }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const ServiceIcon =
    SERVICE_ICONS[bookingData.serviceType as keyof typeof SERVICE_ICONS] ||
    Car;

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Simulate API call (replace later with real API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/customer/price");
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
          <CheckCircle size={24} />
        </div>

        <div>
          <div className="text-[10px] font-black text-[#1CA7A6] uppercase tracking-[0.3em] mb-1">
            Step_04
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Confirm
          </h2>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="space-y-4">
        {/* Service Type */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1CA7A6]/20 flex items-center justify-center text-[#1CA7A6]">
              <ServiceIcon size={24} />
            </div>

            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Service
              </p>
              <p className="text-white font-bold capitalize">
                {bookingData.serviceType} Service
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#1CA7A6]/20 flex items-center justify-center text-[#1CA7A6] shrink-0 mt-1">
              <MapPin size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Pickup
              </p>
              <p className="text-white text-sm truncate">
                {bookingData.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 mt-1">
              <Navigation size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Dropoff
              </p>
              <p className="text-white text-sm truncate">
                {bookingData.dropoff}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#1CA7A6]" />
              <span className="text-white text-sm">
                {new Date(bookingData.scheduleDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#1CA7A6]" />
              <span className="text-white text-sm">
                {bookingData.scheduleTime}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle / Details */}
        {bookingData.vehicleType && (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Vehicle
            </p>

            <p className="text-white font-bold capitalize">
              {bookingData.vehicleType}
            </p>

            {/* Ride passengers */}
            {bookingData.passengers && bookingData.serviceType === "ride" && (
              <p className="text-white/60 text-sm mt-1">
                {bookingData.passengers} passenger(s)
              </p>
            )}

            {/* Dispatch / Haulage items */}
            {bookingData.items?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">
                  Items ({bookingData.items.length})
                </p>

                {bookingData.items.map((item, i) => (
                  <p key={i} className="text-white/60 text-sm">
                    • {item.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-10 grid grid-cols-5 gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="col-span-2 flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-white transition-all text-[10px] font-bold uppercase disabled:opacity-50"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="col-span-3 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#1CA7A6] text-white font-bold text-[10px] uppercase transition-all shadow-lg shadow-[#1CA7A6]/20 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle size={14} />
              Confirm Booking
            </>
          )}
        </button>
      </div>

      {/* Terms */}
      <p className="text-center text-white/20 text-[9px] mt-6 uppercase tracking-wider">
        By confirming, you agree to our terms of service
      </p>
    </motion.div>
  );
}