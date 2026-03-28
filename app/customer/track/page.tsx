"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/src/application/store/bookingStore";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Navigation,
    Truck,
    CheckCircle2,
    Loader2,
    XCircle,
    ShieldCheck,
    Phone,
    MessageSquare,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerTrackingPage() {
    const router = useRouter();
    const { pickup, dropoff, price, status } = useBookingStore();

    // --- CROSS-TAB SYNC LOGIC ---
    // This ensures that if the Mover accepts the job in another tab, 
    // this page immediately reflects the status change.
    useEffect(() => {
        const syncState = (e: StorageEvent) => {
            if (e.key === "moverspadi-storage") {
                useBookingStore.persist.rehydrate();
            }
        };
        window.addEventListener("storage", syncState);
        return () => window.removeEventListener("storage", syncState);
    }, []);

    const statusConfig: Record<string, { title: string; description: string; color: string; bg: string; icon: any }> = {
        searching: {
            title: "Scanning for Movers",
            description: "Connecting to the nearest available fleet partners...",
            color: "text-blue-400",
            bg: "bg-blue-600",
            icon: Loader2,
        },
        matched: {
            title: "Mover Assigned",
            description: "A professional has been matched and is starting your mission.",
            color: "text-indigo-400",
            bg: "bg-indigo-600",
            icon: Truck,
        },
        "in-progress": {
            title: "Mission In Progress",
            description: "Your goods are securely in transit to the destination.",
            color: "text-amber-400",
            bg: "bg-amber-600",
            icon: Truck,
        },
        completed: {
            title: "Delivery Successful",
            description: "Mission accomplished. Your goods have been delivered.",
            color: "text-emerald-400",
            bg: "bg-emerald-600",
            icon: CheckCircle2,
        },
        cancelled: {
            title: "Request Aborted",
            description: "This booking was terminated and is no longer active.",
            color: "text-rose-400",
            bg: "bg-rose-600",
            icon: XCircle,
        },
    };

    const current = statusConfig[status] || statusConfig.searching;
    const Icon = current.icon;

    if (!pickup && status === 'idle') {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active mission found</p>
                    <button onClick={() => router.push('/customer')} className="px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest">Return to Base</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${current.bg} opacity-10 blur-[120px] pointer-events-none transition-colors duration-1000`} />

            <div className="w-full max-w-lg relative z-10">
                
                {/* Top Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push('/customer')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Exit Tracking
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className={`w-1.5 h-1.5 rounded-full ${current.bg} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Telemetry</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d0d0f] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden"
                >
                    {/* Visual Status Area */}
                    <div className="p-10 flex flex-col items-center text-center border-b border-white/5 relative overflow-hidden">
                        
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={status}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                className="relative z-10"
                            >
                                {/* Searching Radar Effect */}
                                {status === 'searching' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.5, opacity: 0.5 }}
                                                animate={{ scale: 2.5, opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 3, delay: i, ease: "linear" }}
                                                className="absolute w-24 h-24 border border-blue-500/30 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className={`relative z-10 p-6 rounded-[2.5rem] ${current.bg} text-white shadow-2xl mb-6 shadow-${current.bg.split('-')[1]}-500/20`}>
                                    <Icon className={`w-10 h-10 ${status === 'searching' ? 'animate-spin' : 'animate-pulse'}`} />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="relative z-10">
                            <h2 className={`text-3xl font-black tracking-tighter mb-2 ${current.color}`}>
                                {current.title}
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
                                {current.description}
                            </p>
                        </div>
                    </div>

                    {/* Trip Info Section */}
                    <div className="p-8 space-y-8 bg-black/20">
                        
                        {/* Addresses with Lane */}
                        <div className="relative space-y-8">
                            <div className="absolute left-[11px] top-6 bottom-6 w-px border-l border-dashed border-zinc-800" />
                            
                            <div className="flex items-start gap-5">
                                <div className="w-6 h-6 rounded-full bg-blue-600 border-4 border-[#0d0d0f] z-10 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Pickup Location</p>
                                    <p className="text-sm font-bold text-zinc-200 line-clamp-1">{pickup}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="w-6 h-6 rounded-full bg-zinc-700 border-4 border-[#0d0d0f] z-10 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Destination</p>
                                    <p className="text-sm font-bold text-zinc-200 line-clamp-1">{dropoff}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Footer */}
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Fare Paid</p>
                                <p className="text-2xl font-black text-white tracking-tighter">₦{Number(price).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95">
                                    <MessageSquare className="w-5 h-5 text-zinc-400" />
                                </button>
                                <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95">
                                    <Phone className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Secure Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Tracking</span>
                </div>

                {/* Bottom Action (Cancel) */}
                {status === "searching" && (
                    <button className="w-full mt-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-rose-500/30 hover:text-rose-500 transition-colors">
                        Cancel Request
                    </button>
                )}
            </div>
        </div>
    );
}