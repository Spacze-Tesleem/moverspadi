"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import {
  moverApi,
  type MoverStats, type MoverTrip,
  type WalletData, type EarningsBreakdown,
} from "@/src/services/api/mover";
import { useBookingStore } from "@/src/store/bookingStore";
import { profileApi } from "@/src/services/api/profile";
import type { UserProfile } from "@/src/types/user/types";
import { formatNaira } from "@/src/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle2, ShieldCheck, Power, User, MapPin,
  History, LogOut, Menu, X, Truck, AlertCircle,
  ToggleLeft, ToggleRight, DollarSign, Zap, Star,
  Upload, BadgeCheck, FileText, Car, CreditCard,
  Wallet, ArrowDownLeft, ArrowUpRight, Clock,
  TrendingUp, Package, Wrench, Navigation, Sun, Moon, Search
} from "lucide-react";
import PendingApprovalView from "@/src/features/auth/views/PendingApprovalView";

// ─── Theme Blobs ───
const DecorativeBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-violet-500/10 blur-[120px]" />
  </div>
);

export default function MoverDashboardView() {
  return <PendingApprovalView approvedDashboard={<MoverDashboardInner />} />;
}

export function MoverDashboardInner() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<MoverStats | null>(null);
  const [trips, setTrips] = useState<MoverTrip[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [onlineStatus, setOnlineStatus] = useState<"online" | "offline">("online");
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [activeTrip, setActiveTrip] = useState<{ stage: "pickup" | "dropoff" } | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const {
    status: customerStatus,
    pickup: customerPickup,
    dropoff: customerDropoff,
    price: customerPrice,
    service: customerService,
    setStatus: setBookingStatus,
    setMoverInfo,
  } = useBookingStore();

  const hasPendingRequest = onlineStatus === "online" && customerStatus === "searching" && !!customerPickup && !activeTrip;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileData, statsData, tripsData, walletData, earningsData] = await Promise.all([
        profileApi.getProfile(token),
        moverApi.getStats(token),
        moverApi.getTrips(token),
        moverApi.getWallet(token),
        moverApi.getEarningsBreakdown(token),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setTrips(tripsData);
      setWallet(walletData);
      setEarnings(earningsData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleStatus = async () => {
    const next = onlineStatus === "online" ? "offline" : "online";
    setOnlineStatus(next as any);
    if (token) await moverApi.setStatus(next === "online", token);
  };

  const handleAccept = () => {
    setActiveTrip({ stage: "pickup" });
    setMoverInfo({
      id: "M-7721",
      name: profile?.fullName ?? "Partner",
      phone: profile?.phone ?? "0800000000",
      rating: 4.8,
      vehicle: "Toyota Hilux",
      plate: "LND-421",
      eta: "5 mins",
    });
    setBookingStatus("matched");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, color: "blue" },
    { id: "jobs", label: "Work Queue", icon: Zap, color: "blue", badge: hasPendingRequest ? "!" : undefined },
    { id: "earnings", label: "Earnings", icon: DollarSign, color: "emerald" },
    { id: "wallet", label: "Wallet", icon: Wallet, color: "emerald" },
    { id: "verification", label: "Verification", icon: ShieldCheck, color: "violet" },
    { id: "profile", label: "Profile", icon: User, color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-blue-500/30">
      <DecorativeBlobs />

      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* ── Sidebar ── */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 p-6 transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl">
            <div className="p-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Truck className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-black tracking-tight text-lg">Mover<span className="text-blue-500">Padi</span></h2>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Partner Console</p>
              </div>
            </div>

            <div className="px-6 mb-6">
              <button
                onClick={handleToggleStatus}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  onlineStatus === "online" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-slate-100 dark:bg-white/5 border-transparent text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Power size={18} />
                  <span className="text-sm font-black uppercase tracking-tighter">{onlineStatus}</span>
                </div>
                {onlineStatus === "online" ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-bold relative group ${
                    activeView === item.id 
                      ? "bg-white dark:bg-zinc-800 shadow-xl text-slate-900 dark:text-white" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} className={activeView === item.id ? `text-${item.color}-500` : ""} />
                  {item.label}
                  {item.badge && <span className="ml-auto bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{item.badge}</span>}
                  {activeView === item.id && <motion.div layoutId="navIndicator" className={`absolute left-0 w-1.5 h-6 bg-${item.color}-500 rounded-full`} />}
                </button>
              ))}
            </nav>

            <div className="p-6">
               <button onClick={() => { logout(); router.push("/auth/login"); }} className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl transition-all">
                 <LogOut size={16} /> END SHIFT
               </button>
            </div>
          </div>
        </aside>

        {/* ── Main Canvas ── */}
        <main className="flex-1 flex flex-col min-w-0 lg:p-6 overflow-hidden">
          <header className="h-24 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-white/20"><Menu size={20} /></button>
              <div>
                <h1 className="text-3xl font-black tracking-tighter capitalize">{activeView}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${onlineStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {onlineStatus === 'online' ? 'Signal Strength: Strong' : 'Shift Inactive'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex p-1.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5">
                <button onClick={() => setTheme("light")} className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white shadow-md text-blue-500' : 'text-slate-400'}`}><Sun size={18}/></button>
                <button onClick={() => setTheme("dark")} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-800 shadow-md text-blue-500' : 'text-slate-400'}`}><Moon size={18}/></button>
              </div>
              <button className="relative p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-white/20 text-slate-500">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white dark:ring-zinc-900" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 pb-12">
            <AnimatePresence mode="wait">

              {/* DASHBOARD VIEW */}
              {activeView === "dashboard" && (
                <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  
                  {/* Performance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                      { label: "Today's Earnings", value: formatNaira(stats?.earningsToday ?? 0), icon: DollarSign, color: "emerald" },
                      { label: "Completion Rate", value: `${stats?.acceptanceRate ?? 0}%`, icon: CheckCircle2, color: "blue" },
                      { label: "Average Rating", value: `${stats?.rating ?? 0} ★`, icon: Star, color: "amber" },
                      { label: "Total Trips", value: stats?.tripsCompleted ?? 0, icon: Package, color: "violet" },
                    ].map((s, i) => (
                      <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-2xl bg-${s.color}-500/10 text-${s.color}-500 group-hover:scale-110 transition-transform`}><s.icon size={20} /></div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-1">{s.value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Earnings Card */}
                    <div className="lg:col-span-2 p-8 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                      <div className="relative z-10 flex flex-col h-full">
                         <div className="flex justify-between items-start mb-8">
                            <div>
                               <p className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] mb-1">Available to Payout</p>
                               <h3 className="text-4xl font-black tracking-tighter">{formatNaira(wallet?.balance ?? 0)}</h3>
                            </div>
                            <Wallet className="opacity-20" size={48} />
                         </div>
                         <div className="flex gap-4 mt-auto">
                            <div className="flex-1 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                               <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Pending</p>
                               <p className="text-lg font-black">{formatNaira(wallet?.pendingPayout ?? 0)}</p>
                            </div>
                            <div className="flex-1 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                               <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Total Earned</p>
                               <p className="text-lg font-black">{formatNaira(wallet?.totalEarned ?? 0)}</p>
                            </div>
                         </div>
                         <button className="w-full mt-6 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-transform">
                            Withdraw to GTBank ****521
                         </button>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
                    </div>

                    {/* Stats List */}
                    <div className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900/40 backdrop-blur-xl border border-white dark:border-white/5 space-y-6">
                       <h3 className="font-black text-lg">Weekly Trend</h3>
                       <div className="flex items-end justify-between h-32 gap-2">
                          {earnings?.daily.map((d, i) => (
                             <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-t-lg relative flex items-end overflow-hidden h-full">
                                   <motion.div 
                                      initial={{ height: 0 }} animate={{ height: `${(d.amount / 50000) * 100}%` }}
                                      className={`w-full bg-blue-500 rounded-t-lg group-hover:bg-emerald-500 transition-colors duration-500`}
                                   />
                                </div>
                                <span className="text-[9px] font-black uppercase text-slate-400">{d.day}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* JOBS VIEW */}
              {activeView === "jobs" && (
                <motion.div key="jobs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {hasPendingRequest ? (
                    <div className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                             <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Incoming Request</span>
                          </div>
                          <span className="text-2xl font-black">{formatNaira(customerPrice)}</span>
                       </div>

                       <div className="space-y-6 mb-8 relative">
                          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-100 dark:bg-zinc-800" />
                          <div className="flex items-start gap-4 relative">
                             <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-blue-500/10"><div className="w-2 h-2 bg-white rounded-full" /></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pickup</p>
                                <p className="text-sm font-bold">{customerPickup}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-4 relative">
                             <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/10"><div className="w-2 h-2 bg-white rounded-md" /></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Destination</p>
                                <p className="text-sm font-bold">{customerDropoff}</p>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => setBookingStatus("searching")} className="py-4 rounded-2xl bg-slate-100 dark:bg-white/5 font-black text-sm transition-all hover:bg-rose-500/10 hover:text-rose-500">Decline</button>
                          <button onClick={handleAccept} className="py-4 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-transform">Accept Trip</button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                       <Navigation size={64} className="text-slate-300 mb-6" />
                       <h3 className="text-xl font-black">No Active Requests</h3>
                       <p className="text-sm text-slate-500 mt-2">Stay online and keep the app open to receive new jobs.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* VERIFICATION VIEW */}
              {activeView === "verification" && (
                <motion.div key="verif" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                   <div className="p-8 rounded-[3rem] bg-violet-600 text-white shadow-2xl shadow-violet-500/20 flex items-center justify-between overflow-hidden relative">
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black tracking-tight mb-2">Compliance Shield</h2>
                        <p className="text-sm opacity-80 max-w-xs font-medium">Verified partners earn 20% more on average and get priority job access.</p>
                      </div>
                      <ShieldCheck size={80} className="opacity-20 relative z-10" />
                      <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { label: "Driver License", icon: FileText, status: "Verified" },
                        { label: "Vehicle Reg", icon: Car, status: "Verified" },
                        { label: "Insurance", icon: ShieldCheck, status: "Pending" },
                        { label: "Roadworthiness", icon: BadgeCheck, status: "Action Required" },
                      ].map((doc, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-violet-500 transition-colors"><doc.icon size={24}/></div>
                              <div>
                                 <p className="text-sm font-black">{doc.label}</p>
                                 <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${doc.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'}`}>{doc.status}</p>
                              </div>
                           </div>
                           <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"><Upload size={18}/></button>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[45] lg:hidden" />
        )}
      </AnimatePresence>
    </div>
  );
}