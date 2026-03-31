"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, DollarSign, CheckCircle2, Navigation, ShieldCheck,
  Power, User, MapPin, MessageSquare, Phone, ChevronRight,
  Zap, TrendingUp, Clock, Star, Package, ToggleLeft,
  ToggleRight, History, Settings, LogOut, Menu, X,
  Truck, AlertCircle
} from "lucide-react";

const EARNINGS = [
  { label: "Today", value: "₦14,500" },
  { label: "This Week", value: "₦68,200" },
  { label: "This Month", value: "₦241,800" },
];

const RECENT_TRIPS = [
  { id: "T-4421", from: "Ikeja", to: "Lekki Phase 1", amount: "₦4,200", time: "2 hrs ago", status: "completed" },
  { id: "T-4420", from: "Yaba", to: "Victoria Island", amount: "₦6,800", time: "Yesterday", status: "completed" },
  { id: "T-4419", from: "Surulere", to: "Ajah", amount: "₦9,100", time: "2 days ago", status: "completed" },
  { id: "T-4418", from: "Oshodi", to: "Ikoyi", amount: "₦3,500", time: "3 days ago", status: "cancelled" },
];

const INCOMING_REQUEST = {
  id: "REQ-9981",
  customer: "Akinwale J.",
  pickup: "23 Bode Thomas St, Surulere, Lagos",
  dropoff: "15 Admiralty Way, Lekki Phase 1",
  distance: "18.4 km",
  eta: "22 mins",
  price: 7800,
  service: "Dispatch",
};

type OnlineStatus = "online" | "offline";
type ActiveView = "dashboard" | "trips" | "earnings" | "settings";

export default function MoverDashboardView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>("online");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [incomingRequest, setIncomingRequest] = useState<typeof INCOMING_REQUEST | null>(null);
  const [activeTrip, setActiveTrip] = useState<null | { stage: "pickup" | "dropoff" }>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (onlineStatus !== "online" || incomingRequest || activeTrip) return;
    const t = setTimeout(() => setIncomingRequest(INCOMING_REQUEST), 3000);
    return () => clearTimeout(t);
  }, [onlineStatus, incomingRequest, activeTrip]);

  const handleAccept = () => { setIncomingRequest(null); setActiveTrip({ stage: "pickup" }); };
  const handleDecline = () => setIncomingRequest(null);
  const handleTripProgress = () => {
    if (activeTrip?.stage === "pickup") setActiveTrip({ stage: "dropoff" });
    else setActiveTrip(null);
  };
  const handleLogout = () => { logout(); router.push("/auth/login"); };

  const navItems: { id: ActiveView; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: Zap },
    { id: "trips", label: "My Trips", icon: History },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#050506] text-zinc-300 font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0b] border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white tracking-tight">Movers<span className="text-green-500">Padi</span></span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-zinc-500"><X size={18} /></button>
        </div>

        <div className="px-4 py-4 border-b border-white/5">
          <button
            onClick={() => setOnlineStatus(s => s === "online" ? "offline" : "online")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${onlineStatus === "online" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-900 border-white/5 text-zinc-500"}`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${onlineStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-600"}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{onlineStatus === "online" ? "Online" : "Offline"}</span>
            </div>
            {onlineStatus === "online" ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeView === item.id ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
              <item.icon size={17} />{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Mover"}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-zinc-500 font-medium">4.8 rating</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/5">
            <LogOut size={14} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#050506]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-zinc-500"><Bell size={18} /></button>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Good {new Date().getHours() < 12 ? "morning" : "afternoon"}</p>
              <h1 className="text-sm font-bold text-white">{user?.name || "Mover"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 hidden sm:block">{currentTime}</span>
            <button className="relative p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <Bell size={17} />
              {incomingRequest && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="wait">

              {activeView === "dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <AnimatePresence>
                    {incomingRequest && (
                      <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0d0d0f] border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white">
                            <Zap className="w-4 h-4 fill-white" />
                            <span className="text-xs font-black uppercase tracking-widest">New Request</span>
                          </div>
                          <span className="text-xs text-blue-200 font-bold">{incomingRequest.service}</span>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1 pt-1">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              <div className="w-px h-8 bg-zinc-700" />
                              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-white/20" />
                            </div>
                            <div className="space-y-3 flex-1">
                              <div>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5">Pickup</p>
                                <p className="text-sm font-semibold text-zinc-100">{incomingRequest.pickup}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5">Dropoff</p>
                                <p className="text-sm font-semibold text-zinc-100">{incomingRequest.dropoff}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <Navigation className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{incomingRequest.distance}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{incomingRequest.eta}</span>
                            </div>
                            <div className="ml-auto">
                              <span className="text-2xl font-black text-white">₦{incomingRequest.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <button onClick={handleAccept} className="py-3.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all">Accept</button>
                            <button onClick={handleDecline} className="py-3.5 bg-zinc-900 text-zinc-400 border border-white/5 rounded-xl font-black text-xs uppercase tracking-widest hover:text-rose-400 hover:border-rose-500/20 transition-all">Decline</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {activeTrip && (
                      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className={`rounded-2xl border overflow-hidden ${activeTrip.stage === "pickup" ? "bg-[#0d0d0f] border-blue-500/30" : "bg-[#0d0d0f] border-emerald-500/30"}`}>
                        <div className={`px-6 py-3 flex items-center justify-between ${activeTrip.stage === "pickup" ? "bg-blue-600" : "bg-emerald-600"}`}>
                          <span className="text-xs font-black uppercase tracking-widest text-white">
                            {activeTrip.stage === "pickup" ? "En Route to Pickup" : "En Route to Dropoff"}
                          </span>
                          <div className="flex gap-2">
                            <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><Phone className="w-3.5 h-3.5" /></button>
                            <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><MessageSquare className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Customer</p>
                              <p className="font-bold text-white">{INCOMING_REQUEST.customer}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Payout</p>
                              <p className="text-2xl font-black text-white">₦{INCOMING_REQUEST.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <button onClick={handleTripProgress}
                            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTrip.stage === "pickup" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                            {activeTrip.stage === "pickup" ? "Confirm Pickup" : "Complete Delivery"}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-3 gap-3">
                    {EARNINGS.map((e) => (
                      <div key={e.label} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2">{e.label}</p>
                        <p className="text-lg font-black text-white">{e.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Trips Today", value: "7", icon: Package, color: "text-blue-400" },
                      { label: "Acceptance", value: "94%", icon: CheckCircle2, color: "text-emerald-400" },
                      { label: "Rating", value: "4.8★", icon: Star, color: "text-yellow-400" },
                      { label: "Online hrs", value: "6.2h", icon: Clock, color: "text-violet-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                        <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                        <p className="text-xl font-black text-white">{s.value}</p>
                        <p className="text-[10px] text-zinc-600 font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {!incomingRequest && !activeTrip && onlineStatus === "online" && (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="relative w-24 h-24 mb-6">
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="absolute inset-0 bg-blue-500/10 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Navigation className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-sm font-bold text-zinc-400">Scanning for requests…</p>
                      <p className="text-xs text-zinc-600 mt-1">Lagos Sector 4</p>
                    </div>
                  )}

                  {onlineStatus === "offline" && (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <Power className="w-7 h-7 text-zinc-600" />
                      </div>
                      <p className="text-sm font-bold text-zinc-500">You are offline</p>
                      <p className="text-xs text-zinc-700 mt-1">Toggle online to receive requests</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeView === "trips" && (
                <motion.div key="trips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-lg font-black text-white">Trip History</h2>
                  <div className="space-y-3">
                    {RECENT_TRIPS.map((trip) => (
                      <div key={trip.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${trip.status === "completed" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                          {trip.status === "completed" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white">{trip.from} → {trip.to}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{trip.id} · {trip.time}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-white">{trip.amount}</p>
                          <p className={`text-[10px] font-bold uppercase mt-0.5 ${trip.status === "completed" ? "text-emerald-500" : "text-rose-500"}`}>{trip.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === "earnings" && (
                <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <h2 className="text-lg font-black text-white">Earnings</h2>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Total Earned (All Time)</p>
                    <p className="text-4xl font-black tracking-tight">₦1,284,500</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <TrendingUp className="w-4 h-4 text-blue-200" />
                      <span className="text-xs text-blue-200 font-medium">+12.4% vs last month</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {EARNINGS.map((e) => (
                      <div key={e.label} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2">{e.label}</p>
                        <p className="text-lg font-black text-white">{e.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Payout Schedule</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Available for withdrawal", value: "₦68,200", highlight: true },
                        { label: "Pending clearance", value: "₦14,500", highlight: false },
                        { label: "Next payout date", value: "Jan 15, 2025", highlight: false },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-xs text-zinc-500">{row.label}</span>
                          <span className={`text-sm font-bold ${row.highlight ? "text-emerald-400" : "text-white"}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all">
                      Withdraw Funds
                    </button>
                  </div>
                </motion.div>
              )}

              {activeView === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-lg font-black text-white">Settings</h2>
                  {[
                    { label: "Profile & Documents", sub: "Update personal info and ID", icon: User },
                    { label: "Vehicle Details", sub: "Manage your registered vehicle", icon: Truck },
                    { label: "Notifications", sub: "Configure alert preferences", icon: Bell },
                    { label: "Security", sub: "Password and 2FA settings", icon: ShieldCheck },
                  ].map((item) => (
                    <button key={item.label} className="w-full bg-[#0e0e0e] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors text-left">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </button>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
