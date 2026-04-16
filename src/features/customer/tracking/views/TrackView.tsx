"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/src/store/bookingStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, CheckCircle2, Loader2, XCircle,
  ShieldCheck, Phone, MessageSquare, X,
  Star, Car, MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";

const MapPreview = dynamic(() => import("@/src/ui/map/MapPreview"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#080808]" />,
});

type StatusKey = "searching" | "matched" | "in-progress" | "completed" | "cancelled";

const STATUS_CONFIG: Record<StatusKey, {
  title: string;
  description: string;
  color: string;
  bg: string;
  dot: string;
  icon: LucideIcon;
}> = {
  searching: {
    title: "Scanning for Movers",
    description: "Connecting to the nearest available fleet partners…",
    color: "text-blue-400",
    bg: "bg-blue-600",
    dot: "bg-blue-500",
    icon: Loader2,
  },
  matched: {
    title: "Mover Assigned",
    description: "A professional has been matched and is on the way.",
    color: "text-violet-400",
    bg: "bg-violet-600",
    dot: "bg-violet-500",
    icon: Truck,
  },
  "in-progress": {
    title: "Mission In Progress",
    description: "Your goods are securely in transit to the destination.",
    color: "text-amber-400",
    bg: "bg-amber-600",
    dot: "bg-amber-500",
    icon: Truck,
  },
  completed: {
    title: "Delivery Successful",
    description: "Mission accomplished. Your goods have been delivered.",
    color: "text-emerald-400",
    bg: "bg-emerald-600",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    title: "Request Cancelled",
    description: "This booking was cancelled and is no longer active.",
    color: "text-rose-400",
    bg: "bg-rose-600",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

// Simulated mover that gets assigned
const SIMULATED_MOVER = {
  id: "M-0042",
  name: "Emeka Okafor",
  phone: "+234 801 234 5678",
  rating: 4.9,
  vehicle: "Toyota Hilux",
  plate: "LND 482 KJ",
  eta: "8 mins",
};

export default function TrackView() {
  const router = useRouter();
  const { pickup, dropoff, price, status, moverInfo, setStatus, setMoverInfo, resetBooking } =
    useBookingStore();

  // Cross-tab sync — reflects mover acceptance from another tab
  useEffect(() => {
    const syncState = (e: StorageEvent) => {
      if (e.key === "moverspadi-booking") {
        useBookingStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", syncState);
    return () => window.removeEventListener("storage", syncState);
  }, []);

  // Simulate the full status progression when searching starts
  useEffect(() => {
    if (status !== "searching") return;

    // After 3.5s → matched (mover assigned)
    const matchTimer = setTimeout(() => {
      setMoverInfo(SIMULATED_MOVER);
      setStatus("matched");
    }, 3500);

    // After 8s → in-progress (mover picked up)
    const progressTimer = setTimeout(() => {
      setStatus("in-progress");
    }, 8000);

    // After 18s → completed
    const completeTimer = setTimeout(() => {
      setStatus("completed");
    }, 18000);

    return () => {
      clearTimeout(matchTimer);
      clearTimeout(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [status, setStatus, setMoverInfo]);

  const handleCancel = () => {
    setStatus("cancelled");
  };

  const handleDone = () => {
    resetBooking();
    router.push("/customer");
  };

  if (status === "idle") {
    return (
      <div className="flex h-screen bg-[#080808] items-center justify-center p-6 text-center font-sans">
        <div className="space-y-4">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active booking</p>
          <button
            onClick={() => router.push("/customer")}
            className="px-6 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const current = STATUS_CONFIG[(status as StatusKey)] ?? STATUS_CONFIG.searching;
  const Icon = current.icon;

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-100 overflow-hidden font-sans selection:bg-violet-500/30">

      {/* --- LEFT PANEL --- */}
      <div className="w-full lg:w-[540px] bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full relative z-20 shadow-2xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Booking</span>
            <span className="text-zinc-700">/</span>
            <span className="font-medium text-white">Live Tracking</span>
          </div>
          <button
            onClick={() => router.push("/customer")}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-10"
          >
            {/* Live badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
                <div className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Encrypted</span>
              </div>
            </div>

            {/* Status icon + title */}
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="relative"
                >
                  {status === "searching" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.5, opacity: 0.5 }}
                          animate={{ scale: 2.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 3, delay: i, ease: "linear" }}
                          className="absolute w-20 h-20 border border-blue-500/30 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                  <div className={`relative z-10 p-5 rounded-[2rem] ${current.bg} text-white shadow-2xl`}>
                    <Icon className={`w-10 h-10 ${status === "searching" ? "animate-spin" : status === "in-progress" ? "animate-bounce" : ""}`} />
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <h2 className={`text-2xl font-black tracking-tighter mb-1 ${current.color}`}>
                    {current.title}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium max-w-[260px] mx-auto leading-relaxed">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mover card — appears when matched */}
            <AnimatePresence>
              {moverInfo && status !== "searching" && status !== "cancelled" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-5 space-y-4"
                >
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Mover</p>

                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <span className="text-lg font-black text-violet-400">
                        {moverInfo.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{moverInfo.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-zinc-400">{moverInfo.rating}</span>
                        <span className="text-zinc-700 mx-1">·</span>
                        <span className="text-xs text-zinc-500">{moverInfo.vehicle}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={`tel:${moverInfo.phone}`}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95"
                      >
                        <Phone size={15} className="text-zinc-400" />
                      </a>
                      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95">
                        <MessageSquare size={15} className="text-zinc-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Car size={11} className="text-zinc-500" />
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Plate</p>
                      </div>
                      <p className="text-xs font-bold text-white">{moverInfo.plate}</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin size={11} className="text-zinc-500" />
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ETA</p>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {status === "in-progress" ? "En route" : moverInfo.eta}
                      </p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={11} className="text-zinc-500" />
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ID</p>
                      </div>
                      <p className="text-xs font-bold text-white">{moverInfo.id}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trip card */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              {/* Route */}
              <div className="p-6 border-b border-white/5">
                <div className="relative space-y-6">
                  <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-zinc-800" />
                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pickup</p>
                      <p className="text-sm font-medium text-white line-clamp-2">{pickup || "Not set"}</p>
                    </div>
                  </div>
                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                      <div className="w-2.5 h-2.5 rounded-sm border-2 border-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Destination</p>
                      <p className="text-sm font-medium text-white line-clamp-2">{dropoff || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fare */}
              <div className="p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Fare</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    ₦{Number(price).toLocaleString()}
                  </p>
                </div>
                {!moverInfo && (
                  <div className="flex gap-2">
                    <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95 opacity-40 cursor-not-allowed">
                      <MessageSquare className="w-5 h-5 text-zinc-400" />
                    </button>
                    <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95 opacity-40 cursor-not-allowed">
                      <Phone className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {status === "searching" && (
              <button
                onClick={handleCancel}
                className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-500/40 hover:text-rose-500 transition-colors"
              >
                Cancel Request
              </button>
            )}

            {status === "completed" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleDone}
                className="w-full py-4 rounded-xl font-semibold text-sm bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                Done — Back to Dashboard
              </motion.button>
            )}

            {status === "cancelled" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleDone}
                className="w-full py-4 rounded-xl font-semibold text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                Back to Dashboard
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 font-medium">
            PadiLogistics Encrypted Booking Protocol v2.4
          </p>
        </div>
      </div>

      {/* --- MAP PANEL (RIGHT) --- */}
      <div className="hidden lg:block flex-1 bg-[#080808] relative">
        <MapPreview pickup={pickup} dropoff={dropoff} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      </div>

    </div>
  );
}
