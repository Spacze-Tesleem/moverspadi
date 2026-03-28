"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

// Components
import LocationStep from "@/src/modules/customer/components/booking/LocationStep";
import DetailsStep from "@/src/modules/customer/components/booking/DetailsStep";
import ScheduleStep from "@/src/modules/customer/components/booking/ScheduleStep";
import ConfirmStep from "@/src/modules/customer/components/booking/ConfirmStep";
import { BookingFormData } from "@/src/domain/booking/types";

// Map loads dynamically to avoid SSR issues
const MapPreview = dynamic(() => import("@/src/components/map/MapPreview"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#080808]" /> 
});

const steps = ["Location", "Details", "Schedule", "Confirm"];

function BookServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Cast URL param to specific type
  const typeFromUrl = (searchParams.get("type") || "") as BookingFormData["serviceType"];

  const [activeStep, setActiveStep] = useState(0);

  const [bookingData, setBookingData] = useState<BookingFormData>({
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

  // Sync state if URL changes
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
    <div className="flex h-screen bg-[#080808] text-zinc-100 overflow-hidden font-sans selection:bg-violet-500/30">
      
      {/* --- FORM PANEL (LEFT) --- */}
      <div className="w-full lg:w-[540px] bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full relative z-20 shadow-2xl">
        
        {/* Header / Breadcrumbs */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">New Request</span>
            <span className="text-zinc-700">/</span>
            <span className="font-medium text-white">{steps[activeStep]}</span>
          </div>
          <button 
            onClick={() => router.push("/customer")}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar (Minimalist) */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex gap-1.5 h-1">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 rounded-full transition-all duration-500 ${
                  idx === activeStep 
                    ? "bg-violet-500" 
                    : idx < activeStep 
                      ? "bg-violet-500/30" 
                      : "bg-white/5"
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {steps[activeStep] === "Location" && (
            <LocationStep 
                bookingData={bookingData} 
                setBookingFormData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Details" && (
            <DetailsStep 
                bookingData={bookingData} 
                setBookingFormData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Schedule" && (
            <ScheduleStep 
                bookingData={bookingData} 
                setBookingFormData={setBookingData} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
          )}
          
          {steps[activeStep] === "Confirm" && (
            <ConfirmStep 
                bookingData={bookingData} 
                onPrev={handlePrev} 
                onConfirm={() => router.push("/customer")} 
            />
          )}
        </div>
        
        {/* Footer Info (Optional) */}
        <div className="p-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 font-medium">
            PadiLogistics Encrypted Booking Protocol v2.4
          </p>
        </div>
      </div>

      {/* --- MAP PANEL (RIGHT) --- */}
      <div className="hidden lg:block flex-1 bg-[#080808] relative">
        <MapPreview pickup={bookingData.pickup} dropoff={bookingData.dropoff} />
        
        {/* Gradient Overlay for seamless blending */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-50" />
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-[#080808] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 text-xs font-medium tracking-wide">INITIALIZING WORKSPACE...</span>
      </div>
    }>
      <BookServiceContent />
    </Suspense>
  );
}