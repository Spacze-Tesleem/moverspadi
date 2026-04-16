"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { moverApi, type MoverStats, type MoverTrip, type IncomingRequest } from "@/src/services/api/mover";
import { useBookingStore } from "@/src/store/bookingStore";
import { profileApi } from "@/src/services/api/profile";
import type { UserProfile } from "@/src/types/user/types";
import { formatNaira } from "@/src/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle2, ShieldCheck, Power, User, MapPin,
  Phone, ChevronRight, TrendingUp, Clock, Star, Package,
  History, Settings, LogOut, Menu, X, Truck, AlertCircle,
  ToggleLeft, ToggleRight, DollarSign, Zap,
  Upload, BadgeCheck, FileText, Car, CreditCard,
} from "lucide-react";

type OnlineStatus = "online" | "offline";
type ActiveView = "dashboard" | "trips" | "earnings" | "verification" | "settings";

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800 rounded-lg ${className}`} />;
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function MoverDashboardView() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<MoverStats | null>(null);
  const [trips, setTrips] = useState<MoverTrip[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>("online");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [incomingRequest, setIncomingRequest] = useState<IncomingRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<{ stage: "pickup" | "dropoff" } | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Shared booking state — used to push mover info to the customer's TrackView
  const { setStatus: setBookingStatus, setMoverInfo } = useBookingStore();

  // ── Fetch dashboard data ────────────────────────────────────────────────────
  // To swap in the real API: set NEXT_PUBLIC_API_URL in .env.local.
  // moverApi and profileApi will automatically use real endpoints instead of
  // the dummy data defined in src/services/api/mover.ts and profile.ts.
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileData, statsData, tripsData] = await Promise.all([
        profileApi.getProfile(token),
        moverApi.getStats(token),
        moverApi.getTrips(token),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setTrips(tripsData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Clock
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate incoming request after 3s when online
  useEffect(() => {
    if (onlineStatus !== "online" || incomingRequest || activeTrip) return;
    const t = setTimeout(() => {
      setIncomingRequest(moverApi._dummy.DUMMY_INCOMING);
    }, 3000);
    return () => clearTimeout(t);
  }, [onlineStatus, incomingRequest, activeTrip]);

  const handleToggleStatus = async () => {
    const next: OnlineStatus = onlineStatus === "online" ? "offline" : "online";
    setOnlineStatus(next);
    if (token) await moverApi.setStatus(next === "online", token);
  };

  const handleAccept = async () => {
    if (!incomingRequest || !token) return;
    await moverApi.acceptRequest(incomingRequest.id, token);
    setActiveTrip({ stage: "pickup" });
    setIncomingRequest(null);

    // Push mover info + matched status into the shared booking store so the
    // customer's TrackView reflects the acceptance immediately (cross-tab via
    // localStorage persistence).
    setMoverInfo({
      id: incomingRequest.id,
      name: profile?.fullName ?? "Your Mover",
      phone: profile?.phone ?? "+234 800 000 0000",
      rating: stats?.rating ?? 4.8,
      vehicle: "Toyota Hilux",
      plate: "LND 482 KJ",
      eta: incomingRequest.eta,
    });
    setBookingStatus("matched");
  };

  const handleDecline = async () => {
    if (!incomingRequest || !token) return;
    await moverApi.declineRequest(incomingRequest.id, token);
    setIncomingRequest(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login?role=mover");
  };

  const displayName = profile?.fullName ?? user?.name ?? "Mover";
  const firstName = displayName.split(" ")[0];

  // ── Nav items ───────────────────────────────────────────────────────────────
  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "dashboard",    label: "Dashboard",    icon: Package },
    { id: "trips",        label: "Trip History", icon: History },
    { id: "earnings",     label: "Earnings",     icon: DollarSign },
    { id: "verification", label: "Verification", icon: ShieldCheck, badge: "!" },
    { id: "settings",     label: "Settings",     icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-100 font-sans overflow-hidden">

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-green-600 rounded-lg flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight">Movers<span className="text-green-500">Padi</span></span>
          <button onClick={() => setMobileMenuOpen(false)} className="ml-auto lg:hidden text-zinc-500">
            <X size={18} />
          </button>
        </div>

        {/* Online toggle */}
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
            {onlineStatus === "online"
              ? <ToggleRight size={22} className="text-emerald-400" />
              : <ToggleLeft size={22} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-white/5 text-white border-l-2 border-blue-500 pl-[10px]"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
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

        {/* Profile snippet */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <User size={14} className="text-zinc-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{profile?.email ?? user?.email ?? "mover"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
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
              onlineStatus === "online"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 border-white/5 text-zinc-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${onlineStatus === "online" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
              {onlineStatus === "online" ? "Online" : "Offline"}
            </div>
            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* ── Incoming request modal ─────────────────────────────────────── */}
          <AnimatePresence>
            {incomingRequest && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-[#0e0e0e] border border-violet-500/30 rounded-2xl p-5 shadow-xl shadow-violet-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-sm font-bold text-violet-400">New Request</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{incomingRequest.id}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-300">{incomingRequest.pickup}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={14} className="text-rose-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-300">{incomingRequest.dropoff}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
                  <span>{incomingRequest.distance}</span>
                  <span>·</span>
                  <span>{incomingRequest.eta}</span>
                  <span>·</span>
                  <span>{incomingRequest.service}</span>
                  <span className="ml-auto text-lg font-black text-white">{formatNaira(incomingRequest.price)}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDecline} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-bold transition-all">
                    Decline
                  </button>
                  <button onClick={handleAccept} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                    Accept
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Active trip banner ─────────────────────────────────────────── */}
          <AnimatePresence>
            {activeTrip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-400 mb-1">
                      {activeTrip.stage === "pickup" ? "En route to pickup" : "En route to dropoff"}
                    </p>
                    <p className="text-xs text-zinc-500">{moverApi._dummy.DUMMY_INCOMING.pickup}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (activeTrip.stage === "pickup") {
                        setActiveTrip({ stage: "dropoff" });
                      } else {
                        setActiveTrip(null);
                        fetchData(); // refresh stats after trip completes
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {activeTrip.stage === "pickup" ? "Arrived at Pickup" : "Complete Trip"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Verification panel ─────────────────────────────────────────── */}
          {activeView === "verification" && (
            <VerificationPanel displayName={displayName} />
          )}

          {/* ── Stats cards (only on dashboard) ───────────────────────────── */}
          {activeView === "dashboard" && (<>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {[
              { label: "Today", value: stats ? formatNaira(stats.earningsToday) : null, icon: DollarSign, color: "text-emerald-400" },
              { label: "This Week", value: stats ? formatNaira(stats.earningsWeek) : null, icon: TrendingUp, color: "text-blue-400" },
              { label: "Rating", value: stats ? `${stats.rating} ★` : null, icon: Star, color: "text-amber-400" },
              { label: "Acceptance", value: stats ? `${stats.acceptanceRate}%` : null, icon: Zap, color: "text-violet-400" },
            ].map((card) => (
              <div key={card.label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{card.label}</p>
                  <card.icon size={14} className={card.color} />
                </div>
                {loading
                  ? <Skeleton className="h-7 w-24" />
                  : <p className={`text-xl font-black ${card.color}`}>{card.value}</p>}
              </div>
            ))}
          </section>

          {/* ── Trip history ───────────────────────────────────────────────── */}
          <section className="bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-300">Recent Trips</h3>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all</button>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="p-8 text-center text-zinc-600 text-sm">No trips yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {trips.map((trip) => (
                  <div key={trip.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                      trip.status === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : trip.status === "cancelled"
                        ? "bg-rose-500/10 border-rose-500/20"
                        : "bg-amber-500/10 border-amber-500/20"
                    }`}>
                      {trip.status === "completed"
                        ? <CheckCircle2 size={14} className="text-emerald-400" />
                        : trip.status === "cancelled"
                        ? <AlertCircle size={14} className="text-rose-400" />
                        : <Clock size={14} className="text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {trip.from} → {trip.to}
                      </p>
                      <p className="text-[11px] text-zinc-500">{trip.time} · {trip.serviceType} · {trip.id}</p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${
                      trip.status === "cancelled" ? "text-zinc-600 line-through" : "text-emerald-400"
                    }`}>
                      {formatNaira(trip.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
          </>)}

        </div>
      </main>
    </div>
  );
}

// ─── Verification Panel ────────────────────────────────────────────────────────

type VerifStatus = "verified" | "pending" | "rejected" | "not_uploaded";

interface VerifItem {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  status: VerifStatus;
}

const PERSONAL_DOCS: VerifItem[] = [
  { id: "nin",     label: "National ID / NIN",   hint: "Government-issued ID or NIN slip",    icon: CreditCard, status: "not_uploaded" },
  { id: "photo",   label: "Profile Photo",        hint: "Clear, recent passport photograph",  icon: User,       status: "not_uploaded" },
  { id: "address", label: "Proof of Address",     hint: "Utility bill or bank statement",     icon: MapPin,     status: "not_uploaded" },
  { id: "phone",   label: "Phone Verification",   hint: "Linked to your registered number",   icon: Phone,      status: "pending" },
];

const VEHICLE_DOCS: VerifItem[] = [
  { id: "reg",    label: "Vehicle Registration",        hint: "Certificate of Ownership",           icon: Car,       status: "not_uploaded" },
  { id: "plate",  label: "Plate Number Photo",          hint: "Clear image of front & rear plates", icon: Truck,     status: "not_uploaded" },
  { id: "license",label: "Driver's Licence",            hint: "Valid and not expired",              icon: FileText,  status: "not_uploaded" },
  { id: "insure", label: "Vehicle Insurance",           hint: "Third-party or comprehensive",       icon: ShieldCheck,status: "not_uploaded" },
  { id: "worth",  label: "Roadworthiness Certificate",  hint: "Issued by FRSC or MVAA",             icon: BadgeCheck, status: "not_uploaded" },
];

const STATUS_CONFIG: Record<VerifStatus, { label: string; className: string; dot: string }> = {
  verified:    { label: "Verified",     className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  pending:     { label: "Under Review", className: "bg-amber-500/10 border-amber-500/20 text-amber-400",   dot: "bg-amber-400 animate-pulse" },
  rejected:    { label: "Rejected",     className: "bg-rose-500/10 border-rose-500/20 text-rose-400",     dot: "bg-rose-400" },
  not_uploaded:{ label: "Not Uploaded", className: "bg-zinc-800 border-white/5 text-zinc-500",             dot: "bg-zinc-600" },
};

function VerifRow({ item }: { item: VerifItem }) {
  const cfg = STATUS_CONFIG[item.status];
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
        <span className={`hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        {item.status !== "verified" && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95">
            <Upload className="w-3 h-3" /> Upload
          </button>
        )}
        {item.status === "verified" && (
          <CheckCircle2 size={18} className="text-emerald-400" />
        )}
      </div>
    </div>
  );
}

function VerificationPanel({ displayName }: { displayName: string }) {
  const personalDone = PERSONAL_DOCS.filter((d) => d.status === "verified").length;
  const vehicleDone  = VEHICLE_DOCS.filter((d) => d.status === "verified").length;
  const totalDone    = personalDone + vehicleDone;
  const total        = PERSONAL_DOCS.length + VEHICLE_DOCS.length;
  const pct          = Math.round((totalDone / total) * 100);

  return (
    <div className="space-y-6 pb-6">
      {/* Header card */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <ShieldCheck size={22} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Account Verification</h2>
            <p className="text-[11px] text-zinc-500">Complete verification to unlock full platform access</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-white">{pct}%</p>
            <p className="text-[10px] text-zinc-600">{totalDone}/{total} docs</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct < 100 && (
          <p className="text-xs text-zinc-600 mt-2">
            Hi <span className="text-zinc-400 font-semibold">{displayName.split(" ")[0]}</span>, upload the required documents below to get verified.
          </p>
        )}
      </div>

      {/* Personal Details */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-zinc-500" />
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Personal Details</h3>
          <span className="text-[10px] text-zinc-600 ml-auto">{personalDone}/{PERSONAL_DOCS.length} verified</span>
        </div>
        <div className="space-y-2">
          {PERSONAL_DOCS.map((item) => <VerifRow key={item.id} item={item} />)}
        </div>
      </section>

      {/* Vehicle Details */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Car size={14} className="text-zinc-500" />
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vehicle Details</h3>
          <span className="text-[10px] text-zinc-600 ml-auto">{vehicleDone}/{VEHICLE_DOCS.length} verified</span>
        </div>
        <div className="space-y-2">
          {VEHICLE_DOCS.map((item) => <VerifRow key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
