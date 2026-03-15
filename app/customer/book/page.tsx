"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Components
import LocationStep from "@/app/customer/components/bookings/LocationStep";
import DetailsStep from "@/app/customer/components/bookings/DetailsStep";
import ScheduleStep from "@/app/customer/components/bookings/ScheduleStep";
import ConfirmStep from "@/app/customer/components/bookings/ConfirmStep";
import { BookingData } from "@/app/types/booking";

const MapPreview = dynamic(() => import("@/components/Map/MapPreview"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900" /> 
});

const steps = ["Location", "Details", "Schedule", "Confirm"];

function BookServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Cast the URL param to the specific type allowed by BookingData
  const typeFromUrl = (searchParams.get("type") || "") as BookingData["serviceType"];

  const [activeStep, setActiveStep] = useState(0);

  const [bookingData, setBookingData] = useState<BookingData>({
    serviceType: typeFromUrl,
    pickup: "",
    pickupCoords: null,
    dropoff: "",
    dropoffCoords: null,
    items: (typeFromUrl === "haulage" || typeFromUrl === "dispatch") ? [{ name: "", qty: 1, weight: "" }] : [],
    vehicleDescription: "",
    passengers: "1",
    vehicleType: "",
    scheduleDate: "",
    scheduleTime: "",
  });

  // Sync if URL changes while on page
  useEffect(() => {
    if (typeFromUrl && bookingData.serviceType !== typeFromUrl) {
      setBookingData(prev => ({ 
        ...prev, 
        serviceType: typeFromUrl,
        items: (typeFromUrl === "haulage" || typeFromUrl === "dispatch") ? [{ name: "", qty: 1, weight: "" }] : []
      }));
    }
  }, [typeFromUrl]);

  const handleNext = () => setActiveStep((s) => s + 1);
  const handlePrev = () => setActiveStep((s) => (s > 0 ? s - 1 : s));

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <div className="w-full lg:w-[520px] bg-[#09090b] border-r border-white/5 flex flex-col h-full shadow-2xl">
        
        {/* Progress Bar */}
        <div className="p-8 pb-4">
          <div className="flex gap-1">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  idx === activeStep 
                    ? "bg-teal-500" 
                    : idx < activeStep 
                      ? "bg-teal-500/30" 
                      : "bg-white/5"
                }`} 
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between px-1">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Step 0{activeStep + 1}</span>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">{steps[activeStep]}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {steps[activeStep] === "Location" && (
            <LocationStep 
                bookingData={bookingData} 
                setBookingData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Details" && (
            <DetailsStep 
                bookingData={bookingData} 
                setBookingData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Schedule" && (
            <ScheduleStep 
                bookingData={bookingData} 
                setBookingData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Confirm" && (
            <ConfirmStep 
                bookingData={bookingData} 
                onPrev={handlePrev} 
                onConfirm={() => router.push("/customer/dashboard")} 
            />
          )}
        </div>
      </div>

      {/* Map Side */}
      <div className="hidden lg:block flex-1 bg-zinc-950 relative">
        <MapPreview pickup={bookingData.pickup} dropoff={bookingData.dropoff} />
        {/* Subtle overlay to make map feel integrated */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_100px_0_100px_-50px_rgba(0,0,0,0.9)]" />
      </div>
    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white/20 uppercase tracking-widest text-[10px] font-black">Initialising System...</div>}>
      <BookServiceContent />
    </Suspense>
  );
}