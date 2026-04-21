"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Users, Truck, Package, Bell,
  Settings, LogOut, Menu, X, ChevronRight, TrendingUp,
  TrendingDown, ShieldCheck, AlertCircle, CheckCircle2,
  Search, Eye, Filter, Download, Calendar,
  Clock, MapPin, Zap, BarChart3, UserPlus,
  Moon, Sun, MoreHorizontal, Ban, CreditCard, Shield,
  ArrowUpRight, Activity, Wallet, Target, ClipboardList,
  XCircle, RefreshCw, AlertTriangle, FileWarning, ChevronDown,
} from "lucide-react";
import type { VerificationStatus } from "@/src/domain/auth/types";

// ── Types ─────────────────────────────────────────────────
type ActiveView = "overview" | "users" | "orders" | "verification" | "alerts" | "settings";
type Theme = "light" | "dark" | "system";

// ── Verification Queue Data ────────────────────────────────
type ApplicantRole = "mover" | "provider" | "company";

interface Applicant {
  id: string;
  name: string;
  role: ApplicantRole;
  email: string;
  submittedAt: string;
  status: VerificationStatus;
  documents: string[];
  avatar: string;
  avatarColor: string;
  reason?: string;
}

const INITIAL_QUEUE: Applicant[] = [
  { id: "MVR-001", name: "Chidi Okafor",       role: "mover",    email: "chidi@mail.com",    submittedAt: "2 hrs ago",   status: "pending",  avatar: "CO", avatarColor: "bg-cyan-500",    documents: ["Driver's License", "NIN", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"] },
  { id: "PRV-002", name: "Amaka Eze",           role: "provider", email: "amaka@mail.com",    submittedAt: "5 hrs ago",   status: "pending",  avatar: "AE", avatarColor: "bg-violet-500",  documents: ["Driver's License", "Passport", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"] },
  { id: "CMP-003", name: "Zenith Logistics Ltd",role: "company",  email: "info@zenith.ng",    submittedAt: "1 day ago",   status: "pending",  avatar: "ZL", avatarColor: "bg-emerald-500", documents: ["CAC Certificate", "Company Logo", "Premises Photo", "Authorized Signature"] },
  { id: "MVR-004", name: "Emeka Nwosu",         role: "mover",    email: "emeka@mail.com",    submittedAt: "2 days ago",  status: "rejected", avatar: "EN", avatarColor: "bg-rose-500",    documents: ["Driver's License", "NIN", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"], reason: "Vehicle registration document is expired." },
  { id: "PRV-005", name: "Funke Adeyemi",       role: "provider", email: "funke@mail.com",    submittedAt: "3 days ago",  status: "resubmission_required", avatar: "FA", avatarColor: "bg-amber-500",   documents: ["Driver's License", "Passport", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"], reason: "Selfie photo is blurry. Please resubmit a clear image." },
  { id: "CMP-006", name: "FastMove Nigeria Ltd",role: "company",  email: "ops@fastmove.ng",   submittedAt: "4 days ago",  status: "approved", avatar: "FM", avatarColor: "bg-blue-500",    documents: ["CAC Certificate", "Company Logo", "Premises Photo", "Authorized Signature"] },
];

// ── Data with Color Metadata ──────────────────────────────
const PLATFORM_STATS = [
  { label: "Total Revenue", value: "₦28.4M", change: "+12.5%", up: true, icon: Wallet, color: "emerald", gradient: "from-emerald-500/20 to-teal-500/20" },
  { label: "Active Users", value: "12,481", change: "+8.2%", up: true, icon: Users, color: "violet", gradient: "from-violet-500/20 to-purple-500/20" },
  { label: "Total Orders", value: "3,892", change: "+9.2%", up: true, icon: Package, color: "cyan", gradient: "from-cyan-500/20 to-blue-500/20" },
  { label: "System Load", value: "94%", change: "-2.1%", up: false, icon: Activity, color: "rose", gradient: "from-rose-500/20 to-orange-500/20" },
];

const RECENT_USERS = [
  { id: "USR-001", name: "Adaeze Okonkwo", role: "customer", email: "adaeze@mail.com", status: "active", avatar: "AO", color: "bg-violet-500" },
  { id: "USR-002", name: "Babatunde Ojo", role: "mover", email: "baba@mail.com", status: "active", avatar: "BO", color: "bg-cyan-500" },
  { id: "USR-003", name: "Chukwuemeka Ltd", role: "company", email: "info@chukwu.ng", status: "pending", avatar: "CL", color: "bg-amber-500" },
];

// ── Beautiful Background Blobs ────────────────────────────
const DecorativeBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[120px] animate-bounce" style={{ animationDuration: '10s' }} />
  </div>
);

export default function AdminDashboardView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [queue, setQueue] = useState<Applicant[]>(INITIAL_QUEUE);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [auditLog, setAuditLog] = useState<{ id: string; action: string; reason: string; admin: string; timestamp: string }[]>([]);

  const handleVerificationAction = (applicantId: string, action: VerificationStatus, reason = "") => {
    setQueue((prev) =>
      prev.map((a) => a.id === applicantId ? { ...a, status: action, reason } : a)
    );
    setAuditLog((prev) => [{
      id: applicantId,
      action,
      reason,
      admin: "Admin Console",
      timestamp: new Date().toLocaleString(),
    }, ...prev]);
    setSelectedApplicant(null);
    setActionReason("");
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : theme === "dark";
    root.classList.toggle("dark", isDark);
  }, [theme]);

  const navItems = [
    { id: "overview",      label: "Overview",          icon: LayoutGrid,    color: "emerald" },
    { id: "users",         label: "User Management",   icon: Users,         color: "violet" },
    { id: "orders",        label: "Logistics Engine",  icon: Truck,         color: "cyan" },
    { id: "verification",  label: "Verification Queue",icon: ClipboardList, color: "amber", badge: INITIAL_QUEUE.filter(a => a.status === "pending").length },
    { id: "alerts",        label: "System Alerts",     icon: Bell,          color: "rose", badge: 3 },
    { id: "settings",      label: "Configuration",     icon: Settings,      color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-emerald-500/30">
      <DecorativeBlobs />

      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* ── Sidebar: Floating Glass Design ── */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 p-6 transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl shadow-black/5">
            <div className="p-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-black tracking-tight text-lg bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">MoversPadi</h2>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Enterprise Suite</p>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id as ActiveView); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-sm font-bold group relative ${
                    activeView === item.id 
                      ? "bg-white dark:bg-zinc-800 shadow-xl text-slate-900 dark:text-white" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon size={20} className={activeView === item.id ? `text-${item.color}-500` : "group-hover:scale-110 transition-transform"} />
                  {item.label}
                  {item.badge && <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-4 ring-rose-500/20">{item.badge}</span>}
                  
                  {activeView === item.id && (
                    <motion.div layoutId="navGlow" className={`absolute inset-0 bg-${item.color}-500/5 rounded-[1.5rem] blur-md`} />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-6">
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group cursor-pointer">
                <div className="relative z-10 flex flex-col gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">AD</div>
                   <div>
                     <p className="text-xs font-bold">Admin Console</p>
                     <p className="text-[10px] opacity-60">Super User Privilege</p>
                   </div>
                   <button onClick={() => logout()} className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-rose-400 hover:text-rose-300">
                     <LogOut size={14} /> End Session
                   </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Canvas ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:p-6">
          <header className="h-24 flex items-center justify-between px-8">
            <div className="flex items-center gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-white/20"><Menu size={20} /></button>
              <div>
                <h1 className="text-3xl font-black capitalize tracking-tighter text-slate-900 dark:text-white">{activeView}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Real-time Node: Lagos, NG</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="Global Search..." className="bg-transparent border-none text-xs font-bold focus:ring-0 w-32 outline-none" />
              </div>

              <div className="flex p-1.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5">
                {(["light", "dark"] as Theme[]).map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-2 rounded-xl transition-all ${theme === t ? "bg-white dark:bg-zinc-800 shadow-md text-emerald-500" : "text-slate-400"}`}
                  >
                    {t === "light" ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 pb-12">
            <AnimatePresence mode="wait">
              
              {/* ── VIEW: OVERVIEW (Multi-Colored Dashboard) ── */}
              {activeView === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  
                  {/* KPI Cards with Glows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {PLATFORM_STATS.map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}><stat.icon size={24} /></div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>{stat.change}</div>
                          </div>
                          <h3 className="text-3xl font-black tracking-tighter mb-1">{stat.value}</h3>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Activity Column (Cyan/Blue Theme) */}
                    <div className="lg:col-span-2 p-8 rounded-[3rem] bg-white dark:bg-zinc-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="font-black text-xl tracking-tight">Recent Dispatch</h3>
                          <p className="text-xs text-slate-500 font-bold">Live Fleet Tracking</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform">
                          Live Map <ArrowUpRight size={14} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-cyan-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-transform">
                              <Truck size={24} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black">Lekki Toll Gate → Victoria Island</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                <Clock size={12} className="text-cyan-500" /> Estimated 14 mins
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-cyan-600 dark:text-cyan-400">₦18,500</p>
                              <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">ON ROUTE</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Column (Violet Theme) */}
                    <div className="p-8 rounded-[3rem] bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col h-full">
                        <Target className="mb-6 w-10 h-10 p-2 bg-white/20 rounded-xl" />
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Monthly Target</h3>
                        <p className="text-sm text-indigo-100 font-medium mb-8">You are currently at 84% of your monthly revenue goal.</p>
                        
                        <div className="mt-auto space-y-4">
                          <div className="h-4 bg-black/20 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1.5 }} className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                          </div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>0k</span>
                            <span>84,000 / 100,000 Orders</span>
                          </div>
                          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs shadow-xl hover:scale-[1.02] transition-transform">
                            View Analytics
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── VIEW: USERS (Violet-Themed User Management) ── */}
              {activeView === "users" && (
                <motion.div key="u" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-violet-500 text-white shadow-xl shadow-violet-500/20">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">User Directory</h2>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">Manage 12,481 accounts</p>
                    </div>
                    <button className="px-6 py-3 bg-white text-violet-600 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-violet-50 transition-colors shadow-lg">
                      <UserPlus size={16} /> Invite Member
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {RECENT_USERS.map((u, i) => (
                      <motion.div key={i} whileHover={{ y: -5 }} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-white dark:border-white/5 shadow-xl flex flex-col items-center text-center group">
                        <div className={`w-20 h-20 rounded-[2rem] ${u.color} flex items-center justify-center text-white text-xl font-black mb-4 shadow-2xl group-hover:rotate-6 transition-transform`}>{u.avatar}</div>
                        <h4 className="font-black text-lg">{u.name}</h4>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">{u.email}</p>
                        <div className="flex gap-2 w-full mt-auto">
                          <button className="flex-1 py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-violet-500 hover:text-white transition-all">Profile</button>
                          <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Ban size={16} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── VIEW: ORDERS (Logistics Engine) ── */}
              {activeView === "orders" && (
                <motion.div key="or" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-cyan-500 text-white">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Logistics Engine</h2>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">3,892 total orders</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-white/20 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-white/30 transition-colors">
                        <Filter size={14} /> Filter
                      </button>
                      <button className="px-5 py-2.5 bg-white text-cyan-600 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-cyan-50 transition-colors">
                        <Download size={14} /> Export
                      </button>
                    </div>
                  </div>

                  {/* Order Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Pending", value: "142", color: "amber" },
                      { label: "In Transit", value: "87", color: "cyan" },
                      { label: "Delivered", value: "3,601", color: "emerald" },
                      { label: "Cancelled", value: "62", color: "rose" },
                    ].map((s, i) => (
                      <div key={i} className={`p-6 rounded-[2rem] bg-${s.color}-50 dark:bg-${s.color}-500/10 border border-${s.color}-100 dark:border-${s.color}-500/20`}>
                        <p className={`text-3xl font-black text-${s.color}-600 dark:text-${s.color}-400`}>{s.value}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <h3 className="font-black text-lg">Recent Orders</h3>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                        <Search size={14} className="text-slate-400" />
                        <input type="text" placeholder="Search orders..." className="bg-transparent text-xs font-bold outline-none w-28" />
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {[
                        { id: "ORD-4821", from: "Ikeja", to: "Lekki", mover: "Babatunde O.", amount: "₦22,000", status: "In Transit", statusColor: "cyan" },
                        { id: "ORD-4820", from: "Surulere", to: "Ajah", mover: "Emeka Ltd", amount: "₦15,500", status: "Delivered", statusColor: "emerald" },
                        { id: "ORD-4819", from: "Yaba", to: "VI", mover: "Chidi Movers", amount: "₦31,000", status: "Pending", statusColor: "amber" },
                        { id: "ORD-4818", from: "Oshodi", to: "Ikorodu", mover: "FastMove NG", amount: "₦18,200", status: "Delivered", statusColor: "emerald" },
                        { id: "ORD-4817", from: "Gbagada", to: "Apapa", mover: "Tunde & Sons", amount: "₦27,500", status: "Cancelled", statusColor: "rose" },
                      ].map((order, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <Package size={18} className="text-cyan-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black">{order.id}</p>
                            <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                              <MapPin size={10} className="text-cyan-500" /> {order.from} → {order.to}
                            </p>
                          </div>
                          <div className="hidden md:block text-xs font-bold text-slate-500">{order.mover}</div>
                          <div className="text-sm font-black text-slate-900 dark:text-white">{order.amount}</div>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-${order.statusColor}-500/10 text-${order.statusColor}-600 dark:text-${order.statusColor}-400`}>
                            {order.status}
                          </span>
                          <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                            <Eye size={14} className="text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── VIEW: VERIFICATION QUEUE ── */}
              {activeView === "verification" && (
                <motion.div key="vq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                  {/* Header */}
                  <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-amber-500 text-white">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Verification Queue</h2>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">
                        {queue.filter(a => a.status === "pending").length} pending · {queue.filter(a => a.status === "resubmission_required").length} resubmitted
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-white/20 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-white/30 transition-colors">
                        <Filter size={14} /> Filter
                      </button>
                      <button className="px-5 py-2.5 bg-white text-amber-600 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-amber-50 transition-colors">
                        <Download size={14} /> Export
                      </button>
                    </div>
                  </div>

                  {/* Status summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {([
                      { label: "Pending",   status: "pending",   color: "amber" },
                      { label: "Resubmit",  status: "resubmission_required",  color: "orange" },
                      { label: "Approved",  status: "approved",  color: "emerald" },
                      { label: "Rejected",  status: "rejected",  color: "rose" },
                      { label: "Suspended", status: "suspended", color: "slate" },
                    ] as const).map(({ label, status, color }) => (
                      <div key={status} className={`p-4 rounded-[1.5rem] bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-100 dark:border-${color}-500/20 text-center`}>
                        <p className={`text-2xl font-black text-${color}-600 dark:text-${color}-400`}>{queue.filter(a => a.status === status).length}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Applicant list */}
                  <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5">
                      <h3 className="font-black text-lg">Applications</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {queue.map((applicant) => (
                        <div key={applicant.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <div className={`w-11 h-11 rounded-2xl ${applicant.avatarColor} flex items-center justify-center text-white text-sm font-black flex-shrink-0`}>
                            {applicant.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black">{applicant.name}</p>
                            <p className="text-[11px] text-slate-500 font-bold flex items-center gap-2 mt-0.5">
                              <span className="capitalize">{applicant.role}</span>
                              <span className="text-slate-300">·</span>
                              <Clock size={10} className="text-slate-400" /> {applicant.submittedAt}
                            </p>
                          </div>
                          <VerifStatusBadge status={applicant.status} />
                          <button
                            onClick={() => { setSelectedApplicant(applicant); setActionReason(applicant.reason ?? ""); }}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors flex-shrink-0"
                          >
                            <Eye size={15} className="text-slate-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit log */}
                  {auditLog.length > 0 && (
                    <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 dark:border-white/5">
                        <h3 className="font-black text-lg">Audit Log</h3>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {auditLog.map((entry, i) => (
                          <div key={i} className="flex items-start gap-4 px-6 py-4">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Shield size={14} className="text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black">
                                {entry.id} — <span className="capitalize text-amber-600 dark:text-amber-400">{entry.action}</span>
                              </p>
                              {entry.reason && <p className="text-xs text-slate-500 font-medium mt-0.5">"{entry.reason}"</p>}
                              <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                                <Clock size={9} /> {entry.timestamp} · {entry.admin}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detail / action modal */}
                  <AnimatePresence>
                    {selectedApplicant && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setSelectedApplicant(null)}
                          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                          className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden max-h-[90vh] flex flex-col">
                            {/* Modal header */}
                            <div className="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-white/5">
                              <div className={`w-12 h-12 rounded-2xl ${selectedApplicant.avatarColor} flex items-center justify-center text-white font-black`}>
                                {selectedApplicant.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 dark:text-white">{selectedApplicant.name}</p>
                                <p className="text-xs text-slate-500 font-bold capitalize">{selectedApplicant.role} · {selectedApplicant.email}</p>
                              </div>
                              <VerifStatusBadge status={selectedApplicant.status} />
                              <button onClick={() => setSelectedApplicant(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <XCircle size={18} className="text-slate-400" />
                              </button>
                            </div>

                            {/* Documents */}
                            <div className="p-6 overflow-y-auto flex-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Submitted Documents</p>
                              <div className="space-y-2 mb-6">
                                {selectedApplicant.documents.map((doc) => (
                                  <div key={doc} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{doc}</span>
                                    </div>
                                    <button className="text-[10px] font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                                      <Eye size={11} /> View
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Reason input */}
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason / Note (required for reject, resubmit, suspend)</p>
                              <textarea
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                placeholder="Explain the action taken for the audit log..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30 resize-none transition-all"
                              />
                            </div>

                            {/* Action buttons */}
                            <div className="p-6 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-3">
                              <button
                                onClick={() => handleVerificationAction(selectedApplicant.id, "approved", actionReason)}
                                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-colors"
                              >
                                <CheckCircle2 size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleVerificationAction(selectedApplicant.id, "rejected", actionReason)}
                                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500 text-white font-black text-sm hover:bg-rose-600 transition-colors"
                              >
                                <XCircle size={16} /> Reject
                              </button>
                              <button
                                onClick={() => handleVerificationAction(selectedApplicant.id, "resubmission_required", actionReason)}
                                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition-colors"
                              >
                                <RefreshCw size={16} /> Request Resubmit
                              </button>
                              <button
                                onClick={() => handleVerificationAction(selectedApplicant.id, "suspended", actionReason)}
                                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-700 text-white font-black text-sm hover:bg-slate-800 transition-colors"
                              >
                                <AlertTriangle size={16} /> Suspend
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── VIEW: ALERTS (System Alerts) ── */}
              {activeView === "alerts" && (
                <motion.div key="al" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-rose-500 text-white">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">System Alerts</h2>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">3 active alerts require attention</p>
                    </div>
                    <button className="px-6 py-3 bg-white text-rose-600 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-rose-50 transition-colors">
                      <CheckCircle2 size={14} /> Mark All Read
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        type: "critical", icon: AlertCircle, color: "rose",
                        title: "Payment Gateway Timeout",
                        desc: "Paystack webhook failed to respond for 3 consecutive transactions. Manual review required.",
                        time: "2 mins ago",
                      },
                      {
                        type: "warning", icon: ShieldCheck, color: "amber",
                        title: "Unverified Mover Account",
                        desc: "Mover ID MVR-2291 has completed 4 orders without document verification.",
                        time: "18 mins ago",
                      },
                      {
                        type: "warning", icon: Activity, color: "amber",
                        title: "High System Load Detected",
                        desc: "CPU usage peaked at 94% over the last 15 minutes. Consider scaling up.",
                        time: "34 mins ago",
                      },
                      {
                        type: "info", icon: CheckCircle2, color: "emerald",
                        title: "Database Backup Completed",
                        desc: "Nightly backup completed successfully. 2.4 GB stored to cold storage.",
                        time: "2 hrs ago",
                      },
                      {
                        type: "info", icon: Zap, color: "cyan",
                        title: "New Company Registration",
                        desc: "Chukwuemeka Logistics Ltd submitted onboarding documents for review.",
                        time: "3 hrs ago",
                      },
                    ].map((alert, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-5 p-6 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-${alert.color}-100 dark:border-${alert.color}-500/20`}
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-${alert.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                          <alert.icon size={22} className={`text-${alert.color}-500`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <p className="font-black text-sm">{alert.title}</p>
                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                              <Clock size={10} /> {alert.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{alert.desc}</p>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors self-start flex-shrink-0">
                          <MoreHorizontal size={16} className="text-slate-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── VIEW: SETTINGS (Configuration) ── */}
              {activeView === "settings" && (
                <motion.div key="st" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-zinc-800 text-white">
                    <h2 className="text-2xl font-black tracking-tight">Configuration</h2>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">Platform-wide settings and controls</p>
                  </div>

                  {/* Settings Sections */}
                  {[
                    {
                      title: "Platform Controls",
                      icon: Shield,
                      items: [
                        { label: "Maintenance Mode", desc: "Take the platform offline for all users", type: "toggle", value: false },
                        { label: "New Registrations", desc: "Allow new users to sign up", type: "toggle", value: true },
                        { label: "Order Processing", desc: "Enable order creation and dispatch", type: "toggle", value: true },
                      ],
                    },
                    {
                      title: "Payment Settings",
                      icon: CreditCard,
                      items: [
                        { label: "Platform Commission", desc: "Percentage taken from each order", type: "input", value: "12%" },
                        { label: "Minimum Order Value", desc: "Lowest accepted order amount", type: "input", value: "₦2,500" },
                        { label: "Auto Payout", desc: "Automatically pay movers after delivery", type: "toggle", value: true },
                      ],
                    },
                    {
                      title: "Notifications",
                      icon: Bell,
                      items: [
                        { label: "Email Alerts", desc: "Send system alerts to admin email", type: "toggle", value: true },
                        { label: "SMS Notifications", desc: "Send SMS for critical events", type: "toggle", value: false },
                        { label: "Push Notifications", desc: "Browser push for real-time alerts", type: "toggle", value: true },
                      ],
                    },
                  ].map((section, si) => (
                    <div key={si} className="rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 overflow-hidden">
                      <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-white/5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                          <section.icon size={18} className="text-slate-600 dark:text-slate-300" />
                        </div>
                        <h3 className="font-black text-base">{section.title}</h3>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {section.items.map((item, ii) => (
                          <div key={ii} className="flex items-center justify-between px-8 py-5">
                            <div>
                              <p className="text-sm font-black">{item.label}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                            </div>
                            {item.type === "toggle" ? (
                              <button
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${item.value ? "bg-emerald-500" : "bg-slate-200 dark:bg-zinc-700"}`}
                              >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${item.value ? "translate-x-7" : "translate-x-1"}`} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{item.value}</span>
                                <ChevronRight size={14} className="text-slate-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-4 rounded-[2rem] bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                    <LogOut size={16} /> Sign Out of Admin Console
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── Mobile UI Overlays ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[45] lg:hidden" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Verification status badge ─────────────────────────────
function VerifStatusBadge({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { label: string; cls: string }> = {
    pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
    approved:  { label: "Approved",  cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
    rejected:  { label: "Rejected",  cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" },
    suspended: { label: "Suspended", cls: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300" },
    resubmission_required: { label: "Resubmit", cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full flex-shrink-0 ${cls}`}>{label}</span>
  );
}