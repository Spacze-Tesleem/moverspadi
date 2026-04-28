"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import {
  moverApi,
  type MoverStats,
  type WalletData, type EarningsBreakdown,
} from "@/src/infrastructure/api/mover";
import { useBookingStore, startBookingStoreSync } from "@/src/application/store/bookingStore";
import { profileApi } from "@/src/infrastructure/api/profile";
import type { UserProfile } from "@/src/domain/user/types";
import { formatNaira } from "@/src/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle2, ShieldCheck, Power, User, LogOut,
  Menu, X, Truck, ToggleLeft, ToggleRight, DollarSign,
  Zap, Star, Upload, BadgeCheck, FileText, Car,
  Wallet, Navigation, TrendingUp, Package,
  Sun, Moon, PanelLeftClose, PanelLeftOpen, Settings,
} from "lucide-react";
import PendingApprovalView from "@/src/modules/auth/views/PendingApprovalView";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

export default function MoverDashboardView() {
  return (
    <ThemeProvider>
      <PendingApprovalView approvedDashboard={<MoverDashboardInner />} />
    </ThemeProvider>
  );
}

export function MoverDashboardInner() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const { isDark: D, toggleTheme } = useTheme();

  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [stats, setStats]       = useState<MoverStats | null>(null);
  const [wallet, setWallet]     = useState<WalletData | null>(null);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [loading, setLoading]   = useState(true);

  const [onlineStatus, setOnlineStatus]   = useState<"online" | "offline">("online");
  const [activeView, setActiveView]       = useState("dashboard");
  const [activeTrip, setActiveTrip]       = useState<{ stage: "pickup" | "dropoff" } | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen]   = useState(true);

  const {
    status: customerStatus,
    pickup: customerPickup,
    dropoff: customerDropoff,
    price: customerPrice,
    setStatus: setBookingStatus,
    setMoverInfo,
  } = useBookingStore();

  const hasPendingRequest =
    onlineStatus === "online" && customerStatus === "pending" && !!customerPickup && !activeTrip;

  useEffect(() => startBookingStoreSync(), []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileData, statsData, walletData, earningsData] = await Promise.all([
        profileApi.getProfile(token),
        moverApi.getStats(token),
        moverApi.getWallet(token),
        moverApi.getEarningsBreakdown(token),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setWallet(walletData);
      setEarnings(earningsData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleStatus = async () => {
    const next: "online" | "offline" = onlineStatus === "online" ? "offline" : "online";
    setOnlineStatus(next);
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
    { id: "dashboard",    label: "Dashboard",    icon: TrendingUp  },
    { id: "jobs",         label: "Work Queue",   icon: Zap,         badge: hasPendingRequest ? "1" : undefined },
    { id: "earnings",     label: "Earnings",     icon: DollarSign  },
    { id: "wallet",       label: "Wallet",       icon: Wallet      },
    { id: "verification", label: "Verification", icon: ShieldCheck },
    { id: "profile",      label: "Profile",      icon: User        },
    { id: "settings",     label: "Settings",     icon: Settings    },
  ];

  const firstName = (user?.name ?? profile?.fullName ?? "there").split(" ")[0];

  const handleTabChange = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-200 ${D ? "bg-[#080808] text-zinc-100" : "bg-[#f5f7fb] text-slate-800"}`}>

      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        ${isSidebarOpen ? "lg:w-64" : "lg:w-[72px]"}
        shadow-xl lg:shadow-none
      `}>
        <div className={`lg:hidden flex items-center justify-end px-4 py-3 border-b ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>
          <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-lg ${D ? "text-zinc-500 hover:text-zinc-200" : "text-slate-400 hover:text-slate-700"}`}>
            <X size={20} />
          </button>
        </div>

        <div className={`flex-1 flex flex-col border-r overflow-hidden transition-colors duration-200 ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>

          {/* Logo */}
          <div className={`px-4 py-4 flex items-center gap-3 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-green-500 rounded-lg flex items-center justify-center shrink-0">
              <Truck className="text-white w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <span className={`text-base font-black tracking-tight ${D ? "text-white" : "text-slate-900"}`}>
                Movers<span className="text-green-500">Padi</span>
              </span>
            )}
          </div>

          {/* Online status toggle */}
          <div className={`px-3 py-3 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
            <button
              onClick={handleToggleStatus}
              title={!isSidebarOpen ? (onlineStatus === "online" ? "Go Offline" : "Go Online") : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                onlineStatus === "online"
                  ? D ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700"
                  : D ? "text-zinc-500 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Power className="w-4 h-4 shrink-0" />
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span className="capitalize">{onlineStatus}</span>
                  {onlineStatus === "online" ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </div>
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all group relative ${
                    isActive
                      ? D ? "bg-white/5 border-l-2 border-blue-500 text-blue-400"
                           : "bg-blue-50 border-l-2 border-blue-500 text-blue-600"
                      : D ? "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                           : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-500" : D ? "text-zinc-500 group-hover:text-zinc-300" : "text-slate-400 group-hover:text-slate-600"}`} />
                  {isSidebarOpen && (
                    <>
                      <span className="text-sm font-semibold truncate flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shrink-0">{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className={`border-t p-3 space-y-1 ${D ? "border-white/5" : "border-slate-100"}`}>
            <button
              onClick={toggleTheme}
              title={!isSidebarOpen ? (D ? "Light mode" : "Dark mode") : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${D ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
            >
              {D ? <Sun className="w-4 h-4 shrink-0 text-blue-400" /> : <Moon className="w-4 h-4 shrink-0 text-slate-400" />}
              {isSidebarOpen && <span>{D ? "Light Mode" : "Dark Mode"}</span>}
            </button>

            {isSidebarOpen && (
              <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-50"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${D ? "bg-blue-500/20" : "bg-blue-100"}`}>
                  <span className={`text-xs font-black ${D ? "text-blue-400" : "text-blue-600"}`}>
                    {(user?.name ?? "M")[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{user?.name ?? "Mover"}</p>
                  <p className={`text-[10px] truncate ${D ? "text-zinc-500" : "text-slate-400"}`}>{user?.email ?? ""}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => { logout(); router.push("/auth/login"); }}
              title={!isSidebarOpen ? "Sign out" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${D ? "text-zinc-500 hover:text-red-500 hover:bg-red-500/5" : "text-slate-500 hover:text-red-500 hover:bg-red-50"}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span className="font-semibold">Sign out</span>}
            </button>
          </div>
        </div>

        {/* Desktop collapse toggle */}
        <div className={`hidden lg:flex border-t border-r p-3 justify-end ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className={`h-14 lg:h-16 border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0 transition-colors duration-200 ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className={`lg:hidden p-2 rounded-lg transition-colors ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className={`text-sm lg:text-base font-black ${D ? "text-white" : "text-slate-900"}`}>
                {navItems.find(n => n.id === activeView)?.label ?? activeView}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${onlineStatus === "online" ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                <p className={`text-[10px] font-semibold ${D ? "text-zinc-500" : "text-slate-400"}`}>{onlineStatus === "online" ? "Online · accepting jobs" : "Offline"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${D ? "text-blue-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100"}`}>
              {D ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2 rounded-lg relative transition-all ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 lg:px-6 py-5 lg:py-6">
            <AnimatePresence mode="wait">

              {/* DASHBOARD */}
              {activeView === "dashboard" && (
                <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div>
                    <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>
                      Good {getGreeting()}, {firstName} 👋
                    </h2>
                    <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Here&apos;s your shift summary for today.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {[
                      { label: "Today's Earnings", value: formatNaira(stats?.earningsToday ?? 0), icon: DollarSign, color: "green-600" },
                      { label: "Completion Rate",  value: `${stats?.acceptanceRate ?? 0}%`,       icon: CheckCircle2, color: "blue-500" },
                      { label: "Avg Rating",        value: `${stats?.rating ?? 0} ★`,              icon: Star,         color: "amber-500" },
                      { label: "Total Trips",       value: String(stats?.tripsCompleted ?? 0),    icon: Package,      color: "violet-500" },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-2xl p-5 border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2 rounded-xl w-fit mb-3 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <s.icon size={16} className={`text-${s.color}`} />
                        </div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.label}</p>
                        <h3 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>{s.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4 lg:gap-5 pb-6">
                    <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-5 py-4 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Wallet Overview</h3>
                      </div>
                      <div className={`p-5 ${D ? "bg-[#0e0e0e]" : "bg-white"}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>Available Balance</p>
                        <h2 className={`text-3xl lg:text-4xl font-black tracking-tight mb-5 ${D ? "text-white" : "text-slate-900"}`}>{formatNaira(wallet?.balance ?? 0)}</h2>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: "Pending",      value: formatNaira(wallet?.pendingPayout ?? 0) },
                            { label: "Total Earned", value: formatNaira(wallet?.totalEarned ?? 0) },
                          ].map((item) => (
                            <div key={item.label} className={`p-3 rounded-xl ${D ? "bg-white/5" : "bg-slate-50"}`}>
                              <p className={`text-[10px] font-semibold uppercase ${D ? "text-zinc-600" : "text-slate-400"}`}>{item.label}</p>
                              <p className={`text-sm font-black mt-0.5 ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-500/20">
                          Withdraw Earnings
                        </button>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                      <h3 className={`text-sm font-bold mb-5 ${D ? "text-zinc-300" : "text-slate-700"}`}>Weekly Trend</h3>
                      <div className="flex items-end justify-between h-28 gap-1.5">
                        {(earnings?.daily ?? [{ day: "M", amount: 0 }, { day: "T", amount: 0 }, { day: "W", amount: 0 }, { day: "T", amount: 0 }, { day: "F", amount: 0 }, { day: "S", amount: 0 }, { day: "S", amount: 0 }]).map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                            <div className="w-full h-full flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(6, ((d.amount || 0) / 50000) * 100)}%` }}
                                transition={{ delay: i * 0.04 }}
                                className={`w-full rounded-t-md group-hover:bg-green-500 transition-colors duration-300 ${D ? "bg-blue-500/70" : "bg-blue-500"}`}
                              />
                            </div>
                            <span className={`text-[9px] font-bold uppercase ${D ? "text-zinc-600" : "text-slate-400"}`}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* JOBS */}
              {activeView === "jobs" && (
                <motion.div key="jobs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Work Queue</h2>
                  {hasPendingRequest ? (
                    <div className={`rounded-2xl border-2 border-blue-500 p-6 shadow-sm shadow-blue-500/10 ${D ? "bg-[#0e0e0e]" : "bg-white"}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                          </span>
                          <span className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">Incoming Request</span>
                        </div>
                        <span className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>{formatNaira(customerPrice)}</span>
                      </div>
                      <div className="space-y-3 mb-6">
                        {[
                          { label: "Pickup",      value: customerPickup  },
                          { label: "Destination", value: customerDropoff },
                        ].map((item) => (
                          <div key={item.label} className={`p-4 rounded-xl ${D ? "bg-white/5" : "bg-slate-50"}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${D ? "text-zinc-500" : "text-slate-400"}`}>{item.label}</p>
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setBookingStatus("cancelled")} className={`py-3.5 rounded-xl font-bold text-sm transition-all ${D ? "bg-white/5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400" : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500"}`}>Decline</button>
                        <button onClick={handleAccept} className="py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm shadow-blue-500/20 transition-all">Accept Trip</button>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center justify-center py-24 text-center rounded-2xl border ${D ? "border-white/5 bg-[#0e0e0e]" : "border-slate-200 bg-white"}`}>
                      <Navigation size={48} className={`mb-4 ${D ? "text-zinc-700" : "text-slate-200"}`} />
                      <h3 className={`text-lg font-black ${D ? "text-zinc-400" : "text-slate-500"}`}>No Active Requests</h3>
                      <p className={`text-sm mt-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>Stay online to receive new job requests.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* VERIFICATION */}
              {activeView === "verification" && (
                <motion.div key="verif" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Verification</h2>
                  <div className={`rounded-2xl p-5 border flex items-start gap-4 ${D ? "bg-green-500/5 border-green-500/20" : "bg-green-50 border-green-100"}`}>
                    <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-green-700 dark:text-green-400">Compliance Shield</p>
                      <p className={`text-xs mt-0.5 ${D ? "text-green-400/70" : "text-green-600/80"}`}>Verified partners earn 20% more and get priority job access.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "Driver License",       icon: FileText,    status: "Verified" },
                      { label: "Vehicle Registration", icon: Car,         status: "Verified" },
                      { label: "Insurance",            icon: ShieldCheck, status: "Pending" },
                      { label: "Roadworthiness",       icon: BadgeCheck,  status: "Action Required" },
                    ].map((doc, i) => (
                      <div key={i} className={`rounded-2xl p-4 border flex items-center justify-between transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                            <doc.icon size={16} className={D ? "text-zinc-400" : "text-slate-500"} />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{doc.label}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${doc.status === "Verified" ? "text-green-500" : "text-amber-500"}`}>{doc.status}</p>
                          </div>
                        </div>
                        <button className={`p-2 rounded-xl transition-all ${D ? "hover:bg-white/5 text-zinc-500" : "hover:bg-slate-100 text-slate-400"}`}>
                          <Upload size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* EARNINGS / WALLET / PROFILE / SETTINGS — placeholder */}
              {["earnings", "wallet", "profile", "settings"].includes(activeView) && (
                <motion.div key={activeView} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className={`text-xl font-black mb-6 ${D ? "text-white" : "text-slate-900"}`}>{navItems.find(n => n.id === activeView)?.label}</h2>
                  <div className={`rounded-2xl p-12 border flex flex-col items-center justify-center text-center ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                    <Zap size={40} className={`mb-3 ${D ? "text-zinc-700" : "text-slate-300"}`} />
                    <p className={`text-sm font-bold ${D ? "text-zinc-500" : "text-slate-400"}`}>Coming soon</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className={`lg:hidden border-t flex items-center justify-around px-2 py-2 shrink-0 transition-colors ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          {[
            { id: "dashboard",    icon: TrendingUp  },
            { id: "jobs",         icon: Zap         },
            { id: "earnings",     icon: DollarSign  },
            { id: "verification", icon: ShieldCheck },
            { id: "profile",      icon: User        },
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-blue-500" : D ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
