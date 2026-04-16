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
  History, Settings, LogOut, Menu, X, Truck, AlertCircle,
  ToggleLeft, ToggleRight, DollarSign, Zap, Star,
  Upload, BadgeCheck, FileText, Car, CreditCard,
  Wallet, ArrowDownLeft, ArrowUpRight, Clock,
  TrendingUp, Package, Wrench, Navigation,
} from "lucide-react";

type OnlineStatus = "online" | "offline";
type ActiveView = "dashboard" | "jobs" | "history" | "earnings" | "wallet" | "verification" | "profile";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-zinc-800/60 rounded-lg ${className}`} style={style} />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MoverDashboardView() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<MoverStats | null>(null);
  const [trips, setTrips] = useState<MoverTrip[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>("online");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [activeTrip, setActiveTrip] = useState<{ stage: "pickup" | "dropoff" } | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);

  const {
    pickup: customerPickup,
    dropoff: customerDropoff,
    price: customerPrice,
    service: customerService,
    status: customerStatus,
    setStatus: setBookingStatus,
    setMoverInfo,
  } = useBookingStore();

  const hasPendingRequest =
    onlineStatus === "online" &&
    customerStatus === "searching" &&
    !!customerPickup &&
    !activeTrip;

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

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleToggleStatus = async () => {
    const next: OnlineStatus = onlineStatus === "online" ? "offline" : "online";
    setOnlineStatus(next);
    if (token) await moverApi.setStatus(next === "online", token);
  };

  const handleAccept = async () => {
    if (!token) return;
    setActiveTrip({ stage: "pickup" });
    setMoverInfo({
      id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
      name: profile?.fullName ?? "Your Mover",
      phone: profile?.phone ?? "+234 800 000 0000",
      rating: stats?.rating ?? 4.8,
      vehicle: "Toyota Hilux",
      plate: "LND 482 KJ",
      eta: "8 mins",
    });
    setBookingStatus("matched");
  };

  const handleDecline = () => {
    setBookingStatus("searching");
  };

  const handleTripProgress = () => {
    if (activeTrip?.stage === "pickup") {
      setActiveTrip({ stage: "dropoff" });
      setBookingStatus("in-progress");
    } else {
      setActiveTrip(null);
      setBookingStatus("completed");
      fetchData();
    }
  };

  const handlePayout = async () => {
    if (!token || !wallet || wallet.balance < 1000) return;
    setPayoutLoading(true);
    await moverApi.requestPayout(wallet.balance, token);
    setPayoutLoading(false);
    fetchData();
  };

  const handleLogout = () => { logout(); router.push("/auth/login?role=mover"); };

  const displayName = profile?.fullName ?? user?.name ?? "Mover";
  const firstName = displayName.split(" ")[0];

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "dashboard",    label: "Dashboard",    icon: TrendingUp },
    { id: "jobs",         label: "Available Jobs", icon: Zap, badge: hasPendingRequest ? "1" : undefined },
    { id: "history",      label: "Job History",  icon: History },
    { id: "earnings",     label: "Earnings",     icon: DollarSign },
    { id: "wallet",       label: "Wallet",       icon: Wallet },
    { id: "verification", label: "Verification", icon: ShieldCheck, badge: "!" },
    { id: "profile",      label: "Profile",      icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-100 font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight">Movers<span className="text-emerald-500">Padi</span></span>
          <button onClick={() => setMobileMenuOpen(false)} className="ml-auto lg:hidden text-zinc-500"><X size={18} /></button>
        </div>

        <div className="px-4 py-4 border-b border-white/5">
          <button
            onClick={handleToggleStatus}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
              onlineStatus === "online"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <Power size={16} />
              <span className="text-sm font-bold">{onlineStatus === "online" ? "Online" : "Offline"}</span>
            </div>
            {onlineStatus === "online" ? <ToggleRight size={22} className="text-emerald-400" /> : <ToggleLeft size={22} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive ? "bg-white/5 text-white border-l-2 border-blue-500 pl-[10px]" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <User size={14} className="text-zinc-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{profile?.email ?? user?.email ?? "mover"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-bold text-white">Good {getGreeting()}, {firstName}</p>
              <p className="text-[11px] text-zinc-500 tabular-nums">{currentTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              onlineStatus === "online" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-900 border-white/5 text-zinc-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${onlineStatus === "online" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
              {onlineStatus === "online" ? "Online" : "Offline"}
            </div>
            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell size={18} />
              {hasPendingRequest && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">

          {/* Active trip banner */}
          <AnimatePresence>
            {activeTrip && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-emerald-400 mb-1">
                    {activeTrip.stage === "pickup" ? "En route to pickup" : "En route to dropoff"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate max-w-xs">
                    {activeTrip.stage === "pickup" ? customerPickup : customerDropoff}
                  </p>
                </div>
                <button onClick={handleTripProgress}
                  className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all">
                  {activeTrip.stage === "pickup" ? "Arrived at Pickup" : "Complete Trip"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DASHBOARD ── */}
          {activeView === "dashboard" && (
            <DashboardPanel stats={stats} trips={trips} earnings={earnings} wallet={wallet} loading={loading} />
          )}

          {/* ── JOBS ── */}
          {activeView === "jobs" && (
            <JobsPanel
              hasPendingRequest={hasPendingRequest}
              onlineStatus={onlineStatus}
              customerPickup={customerPickup}
              customerDropoff={customerDropoff}
              customerPrice={customerPrice}
              customerService={customerService}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}

          {/* ── HISTORY ── */}
          {activeView === "history" && <HistoryPanel trips={trips} loading={loading} />}

          {/* ── EARNINGS ── */}
          {activeView === "earnings" && <EarningsPanel stats={stats} earnings={earnings} loading={loading} />}

          {/* ── WALLET ── */}
          {activeView === "wallet" && (
            <WalletPanel wallet={wallet} loading={loading} onPayout={handlePayout} payoutLoading={payoutLoading} />
          )}

          {/* ── VERIFICATION ── */}
          {activeView === "verification" && <VerificationPanel displayName={displayName} />}

          {/* ── PROFILE ── */}
          {activeView === "profile" && <ProfilePanel profile={profile} stats={stats} loading={loading} />}

        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Panel ──────────────────────────────────────────────────────────
function DashboardPanel({ stats, trips, earnings, wallet, loading }: {
  stats: import("@/src/services/api/mover").MoverStats | null;
  trips: import("@/src/services/api/mover").MoverTrip[];
  earnings: import("@/src/services/api/mover").EarningsBreakdown | null;
  wallet: import("@/src/services/api/mover").WalletData | null;
  loading: boolean;
}) {
  const maxBar = earnings ? Math.max(...earnings.daily.map((d) => d.amount)) : 1;
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today",      value: stats ? formatNaira(stats.earningsToday)  : null, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "This Week",  value: stats ? formatNaira(stats.earningsWeek)   : null, icon: TrendingUp,  color: "text-blue-400",    bg: "bg-blue-500/10" },
          { label: "Rating",     value: stats ? `${stats.rating} ★`               : null, icon: Star,        color: "text-amber-400",   bg: "bg-amber-500/10" },
          { label: "Acceptance", value: stats ? `${stats.acceptanceRate}%`         : null, icon: Zap,         color: "text-violet-400",  bg: "bg-violet-500/10" },
        ].map((c) => (
          <div key={c.label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{c.label}</p>
              <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon size={13} className={c.color} />
              </div>
            </div>
            {loading ? <Skeleton className="h-7 w-24" /> : <p className={`text-xl font-black ${c.color}`}>{c.value}</p>}
          </div>
        ))}
      </div>

      {/* Wallet snapshot */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">Wallet Balance</p>
          {loading ? <Skeleton className="h-8 w-32" /> : <p className="text-3xl font-black text-white">{formatNaira(wallet?.balance ?? 0)}</p>}
          {!loading && wallet && (
            <p className="text-xs text-zinc-500 mt-1">₦{wallet.pendingPayout.toLocaleString()} pending payout</p>
          )}
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Trips</p>
            {loading ? <Skeleton className="h-5 w-10 mx-auto" /> : <p className="text-lg font-black text-white">{stats?.tripsCompleted ?? 0}</p>}
          </div>
          <div className="w-px bg-white/5" />
          <div className="text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Total Earned</p>
            {loading ? <Skeleton className="h-5 w-20 mx-auto" /> : <p className="text-lg font-black text-emerald-400">{formatNaira(wallet?.totalEarned ?? 0)}</p>}
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-zinc-300 mb-4">This Week</p>
        {loading ? (
          <div className="flex items-end gap-2 h-24">{[60,80,45,90,55,70,100].map((h,i) => <Skeleton key={i} className="flex-1 rounded-t-lg" style={{height:`${h}%`}} />)}</div>
        ) : (
          <div className="flex items-end gap-2 h-24">
            {(earnings?.daily ?? []).map((d) => {
              const pct = Math.round((d.amount / maxBar) * 100);
              const isToday = d.day === ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${pct}%`, background: isToday ? "#3b82f6" : "#27272a" }} />
                  <span className={`text-[9px] font-bold uppercase ${isToday ? "text-blue-400" : "text-zinc-600"}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent trips */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-300">Recent Jobs</p>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{trips.length} total</span>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="flex gap-3"><Skeleton className="w-8 h-8 rounded-full shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-2.5 w-24" /></div><Skeleton className="h-4 w-16" /></div>)}</div>
        ) : (
          <div className="divide-y divide-white/5">
            {trips.slice(0, 4).map((t) => <TripRow key={t.id} trip={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Jobs Panel ───────────────────────────────────────────────────────────────
function JobsPanel({ hasPendingRequest, onlineStatus, customerPickup, customerDropoff, customerPrice, customerService, onAccept, onDecline }: {
  hasPendingRequest: boolean;
  onlineStatus: string;
  customerPickup: string;
  customerDropoff: string;
  customerPrice: number;
  customerService: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Available Jobs</h2>
        <p className="text-sm text-zinc-500">Incoming requests from customers near you.</p>
      </div>

      <AnimatePresence mode="wait">
        {onlineStatus === "offline" ? (
          <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
              <Power size={22} className="text-zinc-600" />
            </div>
            <p className="text-sm font-bold text-zinc-400">You are offline</p>
            <p className="text-xs text-zinc-600 max-w-[220px]">Go online from the sidebar to start receiving job requests.</p>
          </motion.div>
        ) : hasPendingRequest ? (
          <motion.div key="request" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0e0e0e] border border-violet-500/20 rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse" />
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-sm font-bold text-violet-400">New Request</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-1 bg-zinc-900 rounded-lg border border-white/5 capitalize">
                  {customerService}
                </span>
              </div>

              {/* Route */}
              <div className="relative space-y-5">
                <div className="absolute left-[9px] top-3 bottom-3 w-[2px] bg-zinc-800" />
                <div className="relative flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-0.5">Pickup</p>
                    <p className="text-sm font-medium text-zinc-200">{customerPickup}</p>
                  </div>
                </div>
                <div className="relative flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 z-10 bg-[#0e0e0e]">
                    <div className="w-1.5 h-1.5 rounded-sm border border-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-0.5">Destination</p>
                    <p className="text-sm font-medium text-zinc-200">{customerDropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-500">Fare</span>
                <span className="text-xl font-black text-white">{formatNaira(customerPrice)}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={onDecline} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-bold transition-all">
                  Decline
                </button>
                <button onClick={onAccept} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
              <Navigation size={22} className="text-zinc-600" />
            </div>
            <p className="text-sm font-bold text-zinc-400">No requests right now</p>
            <p className="text-xs text-zinc-600 max-w-[220px]">Stay online — new jobs will appear here as customers book.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── History Panel ────────────────────────────────────────────────────────────
function HistoryPanel({ trips, loading }: { trips: import("@/src/services/api/mover").MoverTrip[]; loading: boolean }) {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");
  const filtered = trips.filter((t) => filter === "all" || t.status === filter);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Job History</h2>
        <p className="text-sm text-zinc-500">All your completed and cancelled trips.</p>
      </div>
      <div className="flex gap-2">
        {(["all", "completed", "cancelled"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-white/5"
            }`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="flex gap-3"><Skeleton className="w-10 h-10 rounded-xl shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-48" /><Skeleton className="h-2.5 w-32" /></div><Skeleton className="h-5 w-20" /></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-600 text-sm">No trips found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((t) => <TripRow key={t.id} trip={t} showDate />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Earnings Panel ───────────────────────────────────────────────────────────
function EarningsPanel({ stats, earnings, loading }: {
  stats: import("@/src/services/api/mover").MoverStats | null;
  earnings: import("@/src/services/api/mover").EarningsBreakdown | null;
  loading: boolean;
}) {
  const maxBar = earnings ? Math.max(...earnings.daily.map((d) => d.amount)) : 1;
  const totalByService = earnings?.byService.reduce((s, b) => s + b.amount, 0) ?? 1;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Earnings</h2>
        <p className="text-sm text-zinc-500">Your income breakdown and performance.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Today",      value: stats?.earningsToday,  color: "text-emerald-400" },
          { label: "This Week",  value: stats?.earningsWeek,   color: "text-blue-400" },
          { label: "This Month", value: stats?.earningsMonth,  color: "text-violet-400" },
        ].map((c) => (
          <div key={c.label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">{c.label}</p>
            {loading ? <Skeleton className="h-8 w-28" /> : <p className={`text-2xl font-black ${c.color}`}>{formatNaira(c.value ?? 0)}</p>}
          </div>
        ))}
      </div>

      {/* Daily bar chart */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-zinc-300 mb-5">Daily Breakdown</p>
        {loading ? (
          <div className="flex items-end gap-3 h-32">{[60,80,45,90,55,70,100].map((h,i) => <Skeleton key={i} className="flex-1 rounded-t-lg" style={{height:`${h}%`}} />)}</div>
        ) : (
          <div className="flex items-end gap-3 h-32">
            {(earnings?.daily ?? []).map((d) => {
              const pct = Math.round((d.amount / maxBar) * 100);
              const isToday = d.day === ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">{formatNaira(d.amount)}</span>
                  <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${pct}%`, background: isToday ? "#3b82f6" : "#27272a" }} />
                  <span className={`text-[9px] font-bold uppercase ${isToday ? "text-blue-400" : "text-zinc-600"}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* By service */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-zinc-300 mb-4">By Service Type</p>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <div className="space-y-3">
            {(earnings?.byService ?? []).map((s) => {
              const pct = Math.round((s.amount / totalByService) * 100);
              const colors: Record<string, string> = { Dispatch: "bg-amber-500", Haulage: "bg-violet-500", Ride: "bg-blue-500", Tow: "bg-rose-500" };
              return (
                <div key={s.service}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colors[s.service] ?? "bg-zinc-500"}`} />
                      <span className="text-sm text-zinc-300 font-medium">{s.service}</span>
                      <span className="text-xs text-zinc-600">{s.count} trips</span>
                    </div>
                    <span className="text-sm font-bold text-white">{formatNaira(s.amount)}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[s.service] ?? "bg-zinc-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Trips Completed", value: stats?.tripsCompleted, suffix: "", color: "text-white" },
          { label: "Acceptance Rate", value: stats?.acceptanceRate, suffix: "%", color: "text-emerald-400" },
          { label: "Average Rating",  value: stats?.rating,         suffix: " ★", color: "text-amber-400" },
        ].map((c) => (
          <div key={c.label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">{c.label}</p>
            {loading ? <Skeleton className="h-7 w-16" /> : <p className={`text-2xl font-black ${c.color}`}>{c.value}{c.suffix}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Wallet Panel ─────────────────────────────────────────────────────────────
function WalletPanel({ wallet, loading, onPayout, payoutLoading }: {
  wallet: import("@/src/services/api/mover").WalletData | null;
  loading: boolean;
  onPayout: () => void;
  payoutLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Wallet</h2>
        <p className="text-sm text-zinc-500">Your balance, payouts, and transaction history.</p>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-[#0e0e0e] to-zinc-900/50 border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">Available Balance</p>
            {loading ? <Skeleton className="h-10 w-36" /> : <p className="text-4xl font-black text-white">{formatNaira(wallet?.balance ?? 0)}</p>}
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Wallet size={18} className="text-emerald-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Pending</p>
            {loading ? <Skeleton className="h-5 w-20" /> : <p className="text-sm font-bold text-amber-400">{formatNaira(wallet?.pendingPayout ?? 0)}</p>}
          </div>
          <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Total Earned</p>
            {loading ? <Skeleton className="h-5 w-20" /> : <p className="text-sm font-bold text-emerald-400">{formatNaira(wallet?.totalEarned ?? 0)}</p>}
          </div>
        </div>
        <button
          onClick={onPayout}
          disabled={payoutLoading || loading || (wallet?.balance ?? 0) < 1000}
          className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {payoutLoading ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing…</> : "Request Payout"}
        </button>
        <p className="text-center text-[10px] text-zinc-600">Minimum payout: ₦1,000 · Transfers within 24 hrs</p>
      </div>

      {/* Transactions */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-bold text-zinc-300">Transactions</p>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="flex gap-3"><Skeleton className="w-9 h-9 rounded-xl shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-2.5 w-24" /></div><Skeleton className="h-4 w-16" /></div>)}</div>
        ) : (
          <div className="divide-y divide-white/5">
            {(wallet?.transactions ?? []).map((tx) => {
              const isCredit = tx.type === "credit";
              const isPayout = tx.type === "payout";
              return (
                <div key={tx.id} className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCredit ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-blue-500/10 border border-blue-500/20"
                  }`}>
                    {isCredit ? <ArrowDownLeft size={15} className="text-emerald-400" /> : <ArrowUpRight size={15} className="text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-zinc-500">{tx.date}</p>
                      {tx.status === "pending" && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">Pending</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${isCredit ? "text-emerald-400" : isPayout ? "text-blue-400" : "text-zinc-400"}`}>
                    {isCredit ? "+" : "-"}{formatNaira(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Verification Panel ───────────────────────────────────────────────────────
type VerifStatus = "verified" | "pending" | "rejected" | "not_uploaded";
interface VerifItem { id: string; label: string; hint: string; icon: React.ComponentType<{ className?: string }>; status: VerifStatus; }

const PERSONAL_DOCS: VerifItem[] = [
  { id: "nin",     label: "National ID / NIN",  hint: "Government-issued ID or NIN slip",   icon: CreditCard,  status: "not_uploaded" },
  { id: "photo",   label: "Profile Photo",       hint: "Clear, recent passport photograph", icon: User,        status: "not_uploaded" },
  { id: "address", label: "Proof of Address",    hint: "Utility bill or bank statement",    icon: MapPin,      status: "not_uploaded" },
  { id: "phone",   label: "Phone Verification",  hint: "Linked to your registered number",  icon: BadgeCheck,  status: "pending" },
];
const VEHICLE_DOCS: VerifItem[] = [
  { id: "reg",     label: "Vehicle Registration",       hint: "Certificate of Ownership",           icon: Car,        status: "not_uploaded" },
  { id: "plate",   label: "Plate Number Photo",         hint: "Clear image of front & rear plates", icon: Truck,      status: "not_uploaded" },
  { id: "license", label: "Driver's Licence",           hint: "Valid and not expired",              icon: FileText,   status: "not_uploaded" },
  { id: "insure",  label: "Vehicle Insurance",          hint: "Third-party or comprehensive",       icon: ShieldCheck,status: "not_uploaded" },
  { id: "worth",   label: "Roadworthiness Certificate", hint: "Issued by FRSC or MVAA",             icon: BadgeCheck, status: "not_uploaded" },
];
const VERIF_CFG: Record<VerifStatus, { label: string; cls: string; dot: string }> = {
  verified:     { label: "Verified",     cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  pending:      { label: "Under Review", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400",       dot: "bg-amber-400 animate-pulse" },
  rejected:     { label: "Rejected",     cls: "bg-rose-500/10 border-rose-500/20 text-rose-400",         dot: "bg-rose-400" },
  not_uploaded: { label: "Not Uploaded", cls: "bg-zinc-800 border-white/5 text-zinc-500",                dot: "bg-zinc-600" },
};

function VerifRow({ item }: { item: VerifItem }) {
  const cfg = VERIF_CFG[item.status];
  return (
    <div className="flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
        <item.icon className="w-4 h-4 text-zinc-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-200">{item.label}</p>
        <p className="text-[11px] text-zinc-600 truncate">{item.hint}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
        </span>
        {item.status !== "verified" && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
            <Upload className="w-3 h-3" /> Upload
          </button>
        )}
        {item.status === "verified" && <CheckCircle2 size={18} className="text-emerald-400" />}
      </div>
    </div>
  );
}

function VerificationPanel({ displayName }: { displayName: string }) {
  const done = [...PERSONAL_DOCS, ...VEHICLE_DOCS].filter((d) => d.status === "verified").length;
  const total = PERSONAL_DOCS.length + VEHICLE_DOCS.length;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Verification</h2>
        <p className="text-sm text-zinc-500">Complete your compliance documents to stay active.</p>
      </div>
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-zinc-300">{displayName}</p>
          <span className="text-sm font-black text-white">{pct}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-zinc-600 mt-2">{done} of {total} documents verified</p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Personal Documents</p>
        {PERSONAL_DOCS.map((item) => <VerifRow key={item.id} item={item} />)}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Vehicle Documents</p>
        {VEHICLE_DOCS.map((item) => <VerifRow key={item.id} item={item} />)}
      </div>
    </div>
  );
}

// ─── Profile Panel ────────────────────────────────────────────────────────────
function ProfilePanel({ profile, stats, loading }: {
  profile: UserProfile | null;
  stats: import("@/src/services/api/mover").MoverStats | null;
  loading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Profile</h2>
        <p className="text-sm text-zinc-500">Your identity and vehicle setup.</p>
      </div>

      {/* Avatar + name */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
          <User size={28} className="text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          {loading ? <><Skeleton className="h-5 w-36 mb-2" /><Skeleton className="h-3.5 w-48" /></> : (
            <>
              <p className="text-lg font-black text-white">{profile?.fullName ?? "—"}</p>
              <p className="text-sm text-zinc-500">{profile?.email ?? "—"}</p>
              <p className="text-sm text-zinc-500">{profile?.phone ?? "—"}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Trips",      value: stats?.tripsCompleted, suffix: "",   color: "text-white" },
          { label: "Rating",     value: stats?.rating,         suffix: " ★", color: "text-amber-400" },
          { label: "Acceptance", value: stats?.acceptanceRate, suffix: "%",  color: "text-emerald-400" },
        ].map((c) => (
          <div key={c.label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">{c.label}</p>
            {loading ? <Skeleton className="h-6 w-12 mx-auto" /> : <p className={`text-xl font-black ${c.color}`}>{c.value}{c.suffix}</p>}
          </div>
        ))}
      </div>

      {/* Vehicle */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-300">Vehicle</p>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold">Edit</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Make / Model", value: "Toyota Hilux" },
            { label: "Plate Number", value: "LND 482 KJ" },
            { label: "Year",         value: "2021" },
            { label: "Colour",       value: "White" },
          ].map((f) => (
            <div key={f.label} className="p-3 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-sm font-bold text-zinc-200">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bank account */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-300">Payout Account</p>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold">Edit</button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-white/5">
          <CreditCard size={16} className="text-zinc-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-zinc-200">GTBank · ****4521</p>
            <p className="text-[11px] text-zinc-600">Verified account</p>
          </div>
          <CheckCircle2 size={14} className="text-emerald-400 ml-auto shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Shared TripRow ───────────────────────────────────────────────────────────
function TripRow({ trip, showDate }: { trip: import("@/src/services/api/mover").MoverTrip; showDate?: boolean }) {
  const SERVICE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Dispatch: Package, Haulage: Truck, Ride: Car, Tow: Wrench,
  };
  const Icon = SERVICE_ICONS[trip.serviceType] ?? Package;
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
        trip.status === "completed" ? "bg-emerald-500/10 border-emerald-500/20" :
        trip.status === "cancelled" ? "bg-rose-500/10 border-rose-500/20" : "bg-amber-500/10 border-amber-500/20"
      }`}>
        {trip.status === "completed" ? <CheckCircle2 size={14} className="text-emerald-400" /> :
         trip.status === "cancelled" ? <AlertCircle size={14} className="text-rose-400" /> :
         <Clock size={14} className="text-amber-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{trip.from} → {trip.to}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Icon size={11} className="text-zinc-600 shrink-0" />
          <p className="text-[11px] text-zinc-500">{showDate ? trip.date : trip.time} · {trip.serviceType} · {trip.distance}</p>
        </div>
      </div>
      <span className={`text-sm font-bold shrink-0 ${trip.status === "cancelled" ? "text-zinc-600 line-through" : "text-emerald-400"}`}>
        {formatNaira(trip.amount)}
      </span>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
