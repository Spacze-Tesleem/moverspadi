"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  CreditCard, ArrowDownLeft, ArrowUpRight, Phone, Mail,
  Edit, Lock, Globe, BellRing, Calendar, History,
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

  const [moverSettings, setMoverSettings] = useState({
    newJobAlerts: true, payoutConfirm: true, appUpdates: false,
    twoFactor: false, locationSharing: true, profileVisibility: true,
    offlineByDefault: false, soundAlerts: true,
  });
  const toggleSetting = (k: keyof typeof moverSettings) =>
    setMoverSettings((p) => ({ ...p, [k]: !p[k] }));

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", vehicle: "Toyota Hilux · LND-421" });

  const [showWithdraw, setShowWithdraw]   = useState(false);
  const [withdrawBank, setWithdrawBank]   = useState("");
  const [withdrawAcct, setWithdrawAcct]   = useState("");
  const [withdrawAmt, setWithdrawAmt]     = useState("");
  const [withdrawDone, setWithdrawDone]   = useState(false);

  const [docStatus, setDocStatus] = useState<Record<string, string>>({
    "Driver License":       "Verified",
    "Vehicle Registration": "Verified",
    "Insurance":            "Pending",
    "Roadworthiness":       "Action Required",
  });

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
            <div className={`hidden sm:block h-5 w-px mx-1 ${D ? "bg-white/10" : "bg-slate-200"}`} />
            <button
              onClick={() => handleTabChange("jobs")}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <Zap size={12} /> Find Jobs
            </button>
            <button onClick={() => handleTabChange("jobs")} className="sm:hidden p-2 bg-blue-600 text-white rounded-xl">
              <Zap size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <AnimatePresence mode="wait">

              {/* DASHBOARD */}
              {activeView === "dashboard" && (
                <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
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
                      <div key={i} className={`rounded-2xl p-4 border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2 rounded-xl w-fit mb-3 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <s.icon size={16} className={`text-${s.color}`} />
                        </div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.label}</p>
                        <h3 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>{s.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3 pb-4">
                    <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Wallet Overview</h3>
                      </div>
                      <div className={`p-5 ${D ? "bg-[#0e0e0e]" : "bg-white"}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>Available Balance</p>
                        <h2 className={`text-3xl lg:text-4xl font-black tracking-tight mb-3 ${D ? "text-white" : "text-slate-900"}`}>{formatNaira(wallet?.balance ?? 0)}</h2>
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

                    <div className={`rounded-2xl border p-4 ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                      <h3 className={`text-sm font-bold mb-3 ${D ? "text-zinc-300" : "text-slate-700"}`}>Weekly Trend</h3>
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
                  <div className={`rounded-2xl p-4 border flex items-start gap-4 ${D ? "bg-green-500/5 border-green-500/20" : "bg-green-50 border-green-100"}`}>
                    <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-green-700 dark:text-green-400">Compliance Shield</p>
                      <p className={`text-xs mt-0.5 ${D ? "text-green-400/70" : "text-green-600/80"}`}>Verified partners earn 20% more and get priority job access.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {([
                      { label: "Driver License",       icon: FileText    },
                      { label: "Vehicle Registration", icon: Car         },
                      { label: "Insurance",            icon: ShieldCheck },
                      { label: "Roadworthiness",       icon: BadgeCheck  },
                    ] as { label: string; icon: React.ElementType }[]).map((doc, i) => {
                      const status = docStatus[doc.label] ?? "Pending";
                      const isVerified = status === "Verified";
                      const isUnderReview = status === "Under Review";
                      const statusColor = isVerified ? "text-green-500" : isUnderReview ? "text-blue-500" : "text-amber-500";
                      return (
                        <div key={i} className={`rounded-2xl p-4 border flex items-center justify-between transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                              <doc.icon size={16} className={D ? "text-zinc-400" : "text-slate-500"} />
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{doc.label}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{status}</p>
                            </div>
                          </div>
                          <label className={`p-2 rounded-xl transition-all cursor-pointer ${D ? "hover:bg-white/5 text-zinc-500 hover:text-zinc-300" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`} title="Upload document">
                            <Upload size={16} />
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={() =>
                                setDocStatus((prev) => ({ ...prev, [doc.label]: "Under Review" }))
                              }
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <p className={`text-xs text-center ${D ? "text-zinc-600" : "text-slate-400"}`}>
                    Accepted formats: PDF, JPG, PNG · Max 5 MB per document
                  </p>
                </motion.div>
              )}

              {/* ── EARNINGS ── */}
              {activeView === "earnings" && (
                <motion.div key="earnings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pb-4">
                  <div>
                    <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>Earnings</h2>
                    <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Your income breakdown and payout history.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Today",    value: formatNaira(stats?.earningsToday ?? 0),  icon: Zap,       color: "green-600"  },
                      { label: "This Week", value: formatNaira(stats?.earningsWeek ?? 0),    icon: Calendar,  color: "blue-500"   },
                      { label: "This Month",value: formatNaira(stats?.earningsMonth ?? 0),   icon: TrendingUp,color: "violet-500" },
                      { label: "All Time",  value: formatNaira(wallet?.totalEarned ?? 0),    icon: Star,      color: "amber-500"  },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-2xl p-4 border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2 rounded-xl w-fit mb-3 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <s.icon size={15} className={`text-${s.color}`} />
                        </div>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.label}</p>
                        <h3 className={`text-lg font-black ${D ? "text-white" : "text-slate-900"}`}>{s.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3">
                    <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Weekly Trend</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600`}>+14% vs last week</span>
                      </div>
                      <div className={`p-4 ${D ? "bg-[#0e0e0e]" : "bg-white"}`}>
                        <div className="flex items-end justify-between h-28 gap-1.5">
                          {(earnings?.daily ?? [
                            { day: "M", amount: 12000 }, { day: "T", amount: 18500 }, { day: "W", amount: 9000 },
                            { day: "T", amount: 22000 }, { day: "F", amount: 31000 }, { day: "S", amount: 14500 }, { day: "S", amount: 8000 },
                          ]).map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                              <div className="w-full h-full flex items-end">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(6, ((d.amount || 0) / 35000) * 100)}%` }}
                                  transition={{ delay: i * 0.04, duration: 0.4 }}
                                  className={`w-full rounded-t-md group-hover:bg-green-500 transition-colors duration-300 ${D ? "bg-blue-500/70" : "bg-blue-500"}`}
                                />
                              </div>
                              <span className={`text-[9px] font-bold uppercase ${D ? "text-zinc-600" : "text-slate-400"}`}>{d.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Payouts</h3>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {[
                          { label: "Trip #T-8821", time: "Today 3:20 PM",    amount: "+₦8,500" },
                          { label: "Trip #T-8820", time: "Today 11:05 AM",   amount: "+₦12,200" },
                          { label: "Trip #T-8819", time: "Yesterday 4:45 PM",amount: "+₦6,750" },
                          { label: "Trip #T-8818", time: "Yesterday 1:10 PM",amount: "+₦9,000" },
                        ].map((p, i) => (
                          <div key={i} className={`flex items-center justify-between px-4 py-3 ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                            <div>
                              <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-700"}`}>{p.label}</p>
                              <p className={`text-[11px] ${D ? "text-zinc-600" : "text-slate-400"}`}>{p.time}</p>
                            </div>
                            <span className="text-sm font-black text-green-600">{p.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── WALLET ── */}
              {activeView === "wallet" && (
                <motion.div key="wallet" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pb-4 max-w-2xl">
                  <div>
                    <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>Wallet</h2>
                    <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Manage your earnings and withdrawals.</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-3xl font-black tracking-tight mb-4">{formatNaira(wallet?.balance ?? 0)}</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: "Pending Payout", value: formatNaira(wallet?.pendingPayout ?? 0) },
                        { label: "Total Earned",   value: formatNaira(wallet?.totalEarned ?? 0)   },
                      ].map((item) => (
                        <div key={item.label} className="p-3 bg-white/10 rounded-xl">
                          <p className="text-[10px] font-bold text-blue-200 uppercase">{item.label}</p>
                          <p className="text-base font-black mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setShowWithdraw(true); setWithdrawDone(false); }} className="w-full py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all">
                      Withdraw to Bank
                    </button>
                    <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {showWithdraw && (
                    <div className={`rounded-2xl border p-5 space-y-3 ${D ? "bg-[#0e0e0e] border-white/10" : "bg-white border-slate-200"}`}>
                      <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Withdraw to Bank</p>
                      {withdrawDone ? (
                        <div className="py-6 text-center space-y-2">
                          <CheckCircle2 size={32} className="mx-auto text-green-500" />
                          <p className="text-green-600 font-bold text-sm">Withdrawal request submitted!</p>
                          <p className={`text-xs ${D ? "text-zinc-500" : "text-slate-400"}`}>Funds arrive in 1–2 business days.</p>
                        </div>
                      ) : (
                        <>
                          {[
                            { label: "Bank Name",       val: withdrawBank,  set: setWithdrawBank, placeholder: "e.g. GTBank"       },
                            { label: "Account Number",  val: withdrawAcct,  set: setWithdrawAcct, placeholder: "10-digit number"    },
                            { label: "Amount (₦)",      val: withdrawAmt,   set: setWithdrawAmt,  placeholder: "Enter amount"       },
                          ].map((f) => (
                            <div key={f.label}>
                              <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>{f.label}</label>
                              <input
                                value={f.val} onChange={(e) => f.set(e.target.value)}
                                placeholder={f.placeholder}
                                className={`mt-1 w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${D ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}
                              />
                            </div>
                          ))}
                          <div className="flex gap-3 pt-1">
                            <button onClick={() => setShowWithdraw(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
                            <button
                              onClick={() => { if (withdrawBank && withdrawAcct && withdrawAmt) setWithdrawDone(true); }}
                              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                            >Confirm Withdrawal</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Add Bank Account",    icon: CreditCard, color: "blue-500",   action: () => setShowWithdraw(true)  },
                      { label: "Transaction History", icon: History,    color: "violet-500", action: () => {}                     },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action} className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2.5 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <item.icon size={16} className={`text-${item.color}`} />
                        </div>
                        <span className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Transactions</h3>
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {(wallet?.transactions ?? [
                        { id: "TXN-001", type: "credit", amount: 4200,  description: "Trip T-4421 · Dispatch",          date: "Today, 2:14 PM"    },
                        { id: "TXN-002", type: "credit", amount: 6800,  description: "Trip T-4420 · Transport",         date: "Yesterday, 5:40 PM"},
                        { id: "TXN-003", type: "payout", amount: 25000, description: "Bank transfer · GTBank ****4521", date: "Mon, Apr 14"       },
                        { id: "TXN-004", type: "credit", amount: 9100,  description: "Trip T-4419 · Haulage",          date: "Mon, Apr 14"       },
                        { id: "TXN-005", type: "credit", amount: 11200, description: "Trip T-4417 · Haulage",          date: "Sat, Apr 12"       },
                      ]).map((trx, i) => {
                        const isCredit = trx.type === "credit";
                        return (
                          <div key={i} className={`flex items-center gap-3 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCredit ? D ? "bg-green-500/10" : "bg-green-50" : D ? "bg-white/5" : "bg-slate-100"}`}>
                              {isCredit
                                ? <ArrowDownLeft size={14} className="text-green-600" />
                                : <ArrowUpRight size={14} className={D ? "text-zinc-400" : "text-slate-500"} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{trx.description}</p>
                              <p className={`text-[11px] ${D ? "text-zinc-600" : "text-slate-400"}`}>{trx.date}</p>
                            </div>
                            <span className={`text-sm font-black shrink-0 ${isCredit ? "text-green-600" : D ? "text-zinc-300" : "text-slate-700"}`}>
                              {isCredit ? "+" : "-"}₦{trx.amount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PROFILE ── */}
              {activeView === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pb-4 max-w-2xl">
                  <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>My Profile</h2>

                  <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${D ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                      {(user?.name ?? profile?.fullName ?? "M")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-black ${D ? "text-white" : "text-slate-900"}`}>{user?.name ?? profile?.fullName ?? "Mover"}</h3>
                      <p className={`text-sm ${D ? "text-zinc-500" : "text-slate-400"}`}>{user?.email ?? ""}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-xs font-black text-amber-500">
                          <Star size={12} fill="currentColor" /> {stats?.rating ?? "4.8"}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${onlineStatus === "online" ? "bg-green-500/10 text-green-600" : D ? "bg-white/5 text-zinc-500" : "bg-slate-100 text-slate-500"}`}>
                          {onlineStatus === "online" ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setProfileForm({ name: user?.name ?? profile?.fullName ?? "", phone: profile?.phone ?? "", vehicle: "Toyota Hilux · LND-421" }); setEditingProfile(true); }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20 shrink-0"
                    >
                      <Edit size={13} /> Edit Profile
                    </button>
                  </div>

                  {editingProfile && (
                    <div className={`rounded-2xl border p-5 space-y-3 ${D ? "bg-[#0e0e0e] border-white/10" : "bg-white border-slate-200"}`}>
                      <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Edit Profile</p>
                      {[
                        { label: "Full Name", key: "name"    as const, placeholder: "Your full name"   },
                        { label: "Phone",     key: "phone"   as const, placeholder: "+234 800 000 0000" },
                        { label: "Vehicle",   key: "vehicle" as const, placeholder: "e.g. Toyota Hilux · LND-421" },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>{f.label}</label>
                          <input
                            value={profileForm[f.key]}
                            onChange={(e) => setProfileForm((p) => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className={`mt-1 w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${D ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}
                          />
                        </div>
                      ))}
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setEditingProfile(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
                        <button onClick={() => setEditingProfile(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">Save Changes</button>
                      </div>
                    </div>
                  )}

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Personal Information</h3>
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {[
                        { icon: User,  label: "Full Name", value: user?.name ?? profile?.fullName ?? "—" },
                        { icon: Mail,  label: "Email",     value: user?.email ?? "—" },
                        { icon: Phone, label: "Phone",     value: profile?.phone ?? "—" },
                        { icon: Truck, label: "Vehicle",   value: "Toyota Hilux · LND-421" },
                      ].map((row, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3 ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                          <div className={`p-2 rounded-lg shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                            <row.icon size={14} className={D ? "text-zinc-500" : "text-slate-400"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-600" : "text-slate-400"}`}>{row.label}</p>
                            <p className={`text-sm font-semibold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Performance</h3>
                    </div>
                    <div className={`p-4 grid grid-cols-3 gap-3 ${D ? "bg-[#0e0e0e]" : "bg-white"}`}>
                      {[
                        { label: "Trips",      value: String(stats?.tripsCompleted ?? 0), color: "blue-500"  },
                        { label: "Rating",     value: `${stats?.rating ?? "4.8"} ★`,      color: "amber-500" },
                        { label: "Acceptance", value: `${stats?.acceptanceRate ?? 0}%`,    color: "green-600" },
                      ].map((s, i) => (
                        <div key={i} className={`rounded-xl p-3 text-center ${D ? "bg-white/5" : "bg-slate-50"}`}>
                          <p className={`text-lg font-black text-${s.color}`}>{s.value}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS ── */}
              {activeView === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pb-4 max-w-2xl">
                  <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>Settings</h2>

                  {([
                    {
                      title: "Notifications", icon: BellRing,
                      items: [
                        { label: "New Job Alerts",       sub: "Get notified when a nearby trip request arrives", key: "newJobAlerts"      as const },
                        { label: "Payout Confirmations", sub: "Receive alerts when earnings are transferred",    key: "payoutConfirm"     as const },
                        { label: "App Updates",          sub: "Stay informed about platform improvements",       key: "appUpdates"        as const },
                      ],
                    },
                    {
                      title: "Privacy & Security", icon: Lock,
                      items: [
                        { label: "Two-Factor Auth",   sub: "Add an extra layer of security to your account",   key: "twoFactor"         as const },
                        { label: "Location Sharing",  sub: "Allow real-time GPS tracking during active trips",  key: "locationSharing"   as const },
                        { label: "Profile Visibility",sub: "Let customers see your profile while matched",      key: "profileVisibility" as const },
                      ],
                    },
                    {
                      title: "Preferences", icon: Globe,
                      items: [
                        { label: "Dark Mode",          sub: "Toggle between light and dark interface",          key: null as null },
                        { label: "Offline by Default", sub: "Start app in offline mode each session",           key: "offlineByDefault"  as const },
                        { label: "Sound Alerts",       sub: "Play a sound when new trip requests arrive",       key: "soundAlerts"       as const },
                      ],
                    },
                  ] as const).map((section, si) => (
                    <div key={si} className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`flex items-center gap-3 px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <div className={`p-1.5 rounded-lg ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <section.icon size={14} className={D ? "text-zinc-400" : "text-slate-500"} />
                        </div>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>{section.title}</h3>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {section.items.map((item, ii) => {
                          const isOn = item.key ? moverSettings[item.key] : D;
                          return (
                            <div key={ii} className="flex items-center justify-between px-4 py-3">
                              <div>
                                <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.label}</p>
                                <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{item.sub}</p>
                              </div>
                              <button
                                onClick={item.key ? () => toggleSetting(item.key!) : toggleTheme}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ml-4 ${isOn ? "bg-blue-500" : D ? "bg-white/10" : "bg-slate-200"}`}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${isOn ? "translate-x-5" : "translate-x-0.5"}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => { logout(); router.push("/auth/login"); }}
                    className={`w-full py-3 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${D ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10" : "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"}`}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className={`lg:hidden border-t flex items-center justify-around px-2 py-2 shrink-0 transition-colors ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          {([
            { id: "dashboard",    icon: TrendingUp,  label: "Home"   },
            { id: "jobs",         icon: Zap,         label: "Jobs"   },
            { id: "earnings",     icon: DollarSign,  label: "Earn"   },
            { id: "verification", icon: ShieldCheck, label: "Verify" },
            { id: "profile",      icon: User,        label: "Profile"},
          ] as { id: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string }[]).map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-blue-500" : D ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{item.label}</span>
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
