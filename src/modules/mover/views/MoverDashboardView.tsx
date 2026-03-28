"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/src/application/store/bookingStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Activity, Zap, DollarSign, CheckCircle2, 
  Navigation, ShieldCheck, Power, User, MapPin,
  MessageSquare, Phone, ChevronRight, Globe, Layers, Cpu
} from "lucide-react";

export default function MoverDashboardView() {
  const { service, pickup, dropoff, price, status, setStatus, resetBooking } = useBookingStore();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncWithTabs = (e: StorageEvent) => {
      if (e.key === "moverspadi-storage") {
        useBookingStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", syncWithTabs);
    return () => window.removeEventListener("storage", syncWithTabs);
  }, []);

  const handleAccept = () => setStatus("matched");

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-400 p-4 md:p-8 font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* --- MESH BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* --- HUD HEADER --- */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-md group-hover:bg-blue-500/40 transition-all rounded-2xl" />
            <div className="relative w-14 h-14 bg-[#0d0d0f] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <User className="w-6 h-6 text-zinc-100" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-zinc-100 text-sm font-bold tracking-tight flex items-center gap-2">
              Unit: Alpha-7 <span className="text-[10px] font-black px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded uppercase">Pro</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">Online</span>
              </div>
              <span className="text-[10px] font-medium text-zinc-600 tracking-tighter tabular-nums">{currentTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-4 bg-[#0d0d0f] hover:bg-[#141417] rounded-2xl border border-white/5 transition-all group relative overflow-hidden">
            <Bell className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
            {status === "searching" && (
               <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            )}
          </button>
          <button 
            onClick={resetBooking} 
            className="flex items-center gap-3 px-6 py-4 bg-[#0d0d0f] hover:bg-rose-500/5 border border-white/5 hover:border-rose-500/20 rounded-2xl transition-all group"
          >
            <Power className="w-4 h-4 text-zinc-600 group-hover:text-rose-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block text-zinc-600 group-hover:text-rose-500">Disconnect</span>
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- SCANNING STATE --- */}
          {(status === "idle" || status === "cancelled") && (
            <motion.div 
              key="idle" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col items-center py-20"
            >
              <div className="relative w-64 h-64 mb-12">
                {/* Circular HUD Elements */}
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 border border-white/[0.03] rounded-full"
                    style={{ margin: i * 30 }}
                  />
                ))}
                
                {/* Rotating Scanner */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-blue-500/10 border-t-blue-500/40"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Cpu className="w-8 h-8 text-blue-500/50 animate-pulse" />
                        <div className="space-y-1 text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 block">Scanning</span>
                            <span className="text-[9px] font-medium text-zinc-700 block uppercase tracking-tighter">Lagos Sector 4</span>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- INCOMING MISSION --- */}
          {status === "searching" && (
            <motion.div 
              key="searching" 
              layoutId="card"
              initial={{ y: 20, opacity: 0, scale: 0.98 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              className="bg-[#0d0d0f] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl relative"
            >
               {/* Animated Header */}
               <div className="p-8 bg-blue-600 relative overflow-hidden group">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-black/20 backdrop-blur-xl rounded-xl border border-white/10">
                            <Zap className="w-5 h-5 fill-white text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Incoming Request</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full text-[10px] font-bold text-white/80 border border-white/10">
                        <Globe className="w-3 h-3" /> GPS VERIFIED
                    </div>
                  </div>
               </div>

               <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex gap-6 relative">
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-zinc-800" />
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Collection Origin</p>
                            <p className="font-bold text-zinc-100 text-sm leading-relaxed antialiased">{pickup}</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center z-10">
                            <Navigation className="w-3 h-3 text-zinc-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Delivery Point</p>
                            <p className="font-bold text-zinc-100 text-sm leading-relaxed antialiased">{dropoff}</p>
                        </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-zinc-900 transition-colors">
                    <div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">Net Revenue</p>
                        <p className="text-4xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">₦{price.toLocaleString()}</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
                        <DollarSign className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                        onClick={handleAccept} 
                        className="group relative py-6 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] overflow-hidden"
                    >
                        <span className="relative z-10">Lock Mission</span>
                        <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform" />
                    </button>
                    <button 
                        onClick={() => setStatus("cancelled")} 
                        className="py-6 bg-[#0d0d0f] text-zinc-500 border border-white/5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:text-rose-500 hover:border-rose-500/30 transition-all"
                    >
                        Ignore
                    </button>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- ACTIVE STAGES --- */}
          {(status === "matched" || status === "in-progress" || status === "completed") && (
             <motion.div 
                key="active"
                layoutId="card"
                className={`bg-[#0d0d0f] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl`}
             >
                <div className={`p-8 flex justify-between items-center ${status === 'completed' ? 'bg-emerald-600' : 'bg-zinc-900'}`}>
                    <div className="flex items-center gap-3 text-white">
                        <Layers className="w-5 h-5 opacity-50" />
                        <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                            {status === 'matched' ? 'Confirmed' : status === 'in-progress' ? 'In Progress' : 'Archived'}
                        </span>
                    </div>
                    {status !== 'completed' && (
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white"><Phone className="w-4 h-4" /></button>
                            <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white"><MessageSquare className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>

                <div className="p-8">
                    {status === 'completed' ? (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Payout Released</h2>
                            <p className="text-zinc-500 text-sm mb-8">Funds successfully added to Alpha-7 wallet.</p>
                            <button 
                                onClick={resetBooking} 
                                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest"
                            >
                                Resume Scanning
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Target Client</p>
                                    <p className="font-bold text-zinc-100 text-lg">Akinwale J.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Mission Reward</p>
                                    <p className="font-black text-2xl text-white tracking-tighter">₦{price.toLocaleString()}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStatus(status === 'matched' ? 'in-progress' : 'completed')} 
                                className={`w-full py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${status === 'matched' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}
                            >
                                {status === 'matched' ? 'Initiate Pickup' : 'Finalize Delivery'} 
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
             </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="max-w-xl mx-auto mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-20">
              <div className="h-px w-12 bg-zinc-500" />
              <div className="flex gap-2">
                  <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              </div>
              <div className="h-px w-12 bg-zinc-500" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-700">MoversPadi OS Core V2.4</span>
      </footer>
    </div>
  );
}