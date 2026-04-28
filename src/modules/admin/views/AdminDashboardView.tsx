"use client";

import { useState, useEffect, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Users, Truck, Package, Bell,
  Settings, LogOut, Menu, X, ChevronRight,
  ShieldCheck, AlertCircle, CheckCircle2,
  Search, Eye, Filter, Download,
  Clock, Zap, UserPlus,
  Moon, Sun, MoreHorizontal, Ban, CreditCard, Shield,
  ArrowUpRight, Activity, Wallet, Target, ClipboardList,
  XCircle, RefreshCw, AlertTriangle, MapPin,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import type { VerificationStatus } from "@/src/domain/auth/types";
import { adminApi } from "@/src/infrastructure/api/admin";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

// ── Types ─────────────────────────────────────────────────
type ActiveView = "overview" | "users" | "orders" | "verification" | "alerts" | "settings";
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

// ── Static Data ────────────────────────────────────────────
const INITIAL_QUEUE: Applicant[] = [
  { id: "MVR-001", name: "Chidi Okafor",        role: "mover",    email: "chidi@mail.com",  submittedAt: "2 hrs ago",  status: "pending",               avatar: "CO", avatarColor: "bg-cyan-500",    documents: ["Driver's License", "NIN", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"] },
  { id: "PRV-002", name: "Amaka Eze",            role: "provider", email: "amaka@mail.com",  submittedAt: "5 hrs ago",  status: "pending",               avatar: "AE", avatarColor: "bg-violet-500",  documents: ["Driver's License", "Passport", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"] },
  { id: "CMP-003", name: "Zenith Logistics Ltd", role: "company",  email: "info@zenith.ng",  submittedAt: "1 day ago",  status: "pending",               avatar: "ZL", avatarColor: "bg-emerald-500", documents: ["CAC Certificate", "Company Logo", "Premises Photo", "Authorized Signature"] },
  { id: "MVR-004", name: "Emeka Nwosu",          role: "mover",    email: "emeka@mail.com",  submittedAt: "2 days ago", status: "rejected",              avatar: "EN", avatarColor: "bg-rose-500",    documents: ["Driver's License", "NIN", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"], reason: "Vehicle registration document is expired." },
  { id: "PRV-005", name: "Funke Adeyemi",        role: "provider", email: "funke@mail.com",  submittedAt: "3 days ago", status: "resubmission_required", avatar: "FA", avatarColor: "bg-amber-500",   documents: ["Driver's License", "Passport", "Profile Photo", "Selfie", "Home Photo", "Vehicle Registration", "Roadworthiness", "Insurance", "Vehicle Photo"], reason: "Selfie photo is blurry. Please resubmit a clear image." },
  { id: "CMP-006", name: "FastMove Nigeria Ltd", role: "company",  email: "ops@fastmove.ng", submittedAt: "4 days ago", status: "approved",              avatar: "FM", avatarColor: "bg-blue-500",    documents: ["CAC Certificate", "Company Logo", "Premises Photo", "Authorized Signature"] },
];

const PLATFORM_STATS = [
  { label: "Total Revenue", value: "₦28.4M", change: "+12.5%", up: true,  icon: Wallet,   color: "green-600"  },
  { label: "Active Users",  value: "12,481", change: "+8.2%",  up: true,  icon: Users,    color: "violet-500" },
  { label: "Total Orders",  value: "3,892",  change: "+9.2%",  up: true,  icon: Package,  color: "blue-500"   },
  { label: "System Load",   value: "94%",    change: "-2.1%",  up: false, icon: Activity, color: "rose-500"   },
];

const RECENT_USERS = [
  { id: "USR-001", name: "Adaeze Okonkwo",  role: "customer", email: "adaeze@mail.com", status: "active",  avatar: "AO", color: "bg-violet-500" },
  { id: "USR-002", name: "Babatunde Ojo",   role: "mover",    email: "baba@mail.com",   status: "active",  avatar: "BO", color: "bg-cyan-500"   },
  { id: "USR-003", name: "Chukwuemeka Ltd", role: "company",  email: "info@chukwu.ng",  status: "pending", avatar: "CL", color: "bg-amber-500"  },
];

// ── Main export ────────────────────────────────────────────
export default function AdminDashboardView() {
  return (
    <ThemeProvider>
      <AdminDashboardInner />
    </ThemeProvider>
  );
}

function AdminDashboardInner() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDark: D, toggleTheme } = useTheme();
  const token = useAuthStore((s) => s.token);

  const [activeView, setActiveView]           = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen]       = useState(true);

  const [queue, setQueue]                     = useState<Applicant[]>(INITIAL_QUEUE);
  const [queueLoading, setQueueLoading]       = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [actionReason, setActionReason]       = useState("");
  const [actionLoading, setActionLoading]     = useState(false);
  const [actionError, setActionError]         = useState<string | null>(null);
  const [auditLog, setAuditLog]               = useState<{ id: string; action: string; reason: string; admin: string; timestamp: string }[]>([]);

  const [userSearch, setUserSearch]           = useState("");
  const [showInvite, setShowInvite]           = useState(false);
  const [inviteEmail, setInviteEmail]         = useState("");
  const [inviteRole, setInviteRole]           = useState("mover");
  const [inviteSent, setInviteSent]           = useState(false);
  const [orderSearch, setOrderSearch]         = useState("");

  const [adminConfig, setAdminConfig] = useState({
    maintenanceMode: false, newRegistrations: true, orderProcessing: true,
    autoPayout: true, emailAlerts: true, smsNotifications: false, pushNotifications: true,
  });
  const toggleConfig = (k: keyof typeof adminConfig) =>
    setAdminConfig((p) => ({ ...p, [k]: !p[k] }));

  const [adminAlerts, setAdminAlerts] = useState([
    { icon: "AlertCircle",  color: "rose",  title: "Payment Gateway Timeout",    desc: "Paystack webhook failed to respond for 3 consecutive transactions.",        time: "2 mins ago",  read: false },
    { icon: "ShieldCheck",  color: "amber", title: "Unverified Mover Account",   desc: "Mover ID MVR-2291 has completed 4 orders without document verification.",   time: "18 mins ago", read: false },
    { icon: "Activity",     color: "amber", title: "High System Load Detected",  desc: "CPU usage peaked at 94% over the last 15 minutes.",                         time: "34 mins ago", read: false },
    { icon: "CheckCircle2", color: "green", title: "Database Backup Completed",  desc: "Nightly backup completed successfully. 2.4 GB stored to cold storage.",       time: "2 hrs ago",   read: true  },
    { icon: "Zap",          color: "blue",  title: "New Company Registration",   desc: "Chukwuemeka Logistics Ltd submitted onboarding documents for review.",       time: "3 hrs ago",   read: true  },
  ]);
  const markAllReadAlerts = () => setAdminAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const unreadCount = adminAlerts.filter((a) => !a.read).length;

  // Load real verification queue
  useEffect(() => {
    if (!token) return;
    setQueueLoading(true);
    adminApi.getVerificationQueue(token)
      .then((items) => {
        if (items && items.length > 0) {
          setQueue(items.map((item) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            email: item.id,
            submittedAt: item.submittedAt,
            status: item.status,
            documents: [],
            avatar: item.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            avatarColor: "bg-amber-500",
          })));
        }
      })
      .catch(() => { /* backend not ready — keep dummy data */ })
      .finally(() => setQueueLoading(false));
  }, [token]);

  const handleVerificationAction = async (applicantId: string, action: VerificationStatus, reason = "") => {
    setActionLoading(true);
    setActionError(null);
    try {
      if (token) {
        if (action === "approved")              await adminApi.approveVerification(applicantId, token);
        else if (action === "rejected")         await adminApi.rejectVerification(applicantId, reason, token);
        else if (action === "resubmission_required") await adminApi.requestResubmission(applicantId, reason, token);
      }
    } catch { /* optimistic update fallback */ }
    setQueue((prev) => prev.map((a) => a.id === applicantId ? { ...a, status: action, reason } : a));
    setAuditLog((prev) => [{ id: applicantId, action, reason, admin: user?.name ?? "Admin", timestamp: new Date().toLocaleString() }, ...prev]);
    setSelectedApplicant(null);
    setActionReason("");
    setActionLoading(false);
  };

  const pendingCount = queue.filter(a => a.status === "pending").length;

  const navItems = [
    { id: "overview",     label: "Overview",           icon: LayoutGrid,  badge: undefined        },
    { id: "users",        label: "User Management",    icon: Users,       badge: undefined        },
    { id: "orders",       label: "Logistics Engine",   icon: Truck,       badge: undefined        },
    { id: "verification", label: "Verification Queue", icon: ClipboardList, badge: pendingCount > 0 ? String(pendingCount) : undefined },
    { id: "alerts",       label: "System Alerts",      icon: Bell,        badge: "3"              },
    { id: "settings",     label: "Configuration",      icon: Settings,    badge: undefined        },
  ] as const;

  const handleTabChange = (id: ActiveView) => {
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
              <ShieldCheck className="text-white w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <span className={`text-base font-black tracking-tight ${D ? "text-white" : "text-slate-900"}`}>
                Movers<span className="text-green-500">Padi</span>
              </span>
            )}
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
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0">{item.badge}</span>
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
                    {(user?.name ?? "A")[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{user?.name ?? "Admin"}</p>
                  <p className={`text-[10px] truncate ${D ? "text-zinc-500" : "text-slate-400"}`}>Super User Privilege</p>
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
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className={`text-[10px] font-semibold ${D ? "text-zinc-500" : "text-slate-400"}`}>Admin Console · Lagos, NG</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${D ? "bg-white/5 border-white/10 text-zinc-400" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              <Search size={13} />
              <input type="text" placeholder="Global Search..." className="bg-transparent outline-none w-28 font-medium" />
            </div>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${D ? "text-blue-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100"}`}>
              {D ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2 rounded-lg relative transition-all ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className={`hidden sm:block h-5 w-px mx-1 ${D ? "bg-white/10" : "bg-slate-200"}`} />
            <button
              onClick={() => handleTabChange("verification")}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <ClipboardList size={12} /> Review Queue
            </button>
            <button onClick={() => handleTabChange("verification")} className="sm:hidden p-2 bg-blue-600 text-white rounded-xl">
              <ClipboardList size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <AnimatePresence mode="wait">

              {/* ── OVERVIEW ── */}
              {activeView === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div>
                    <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>Platform Overview</h2>
                    <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Real-time operational metrics across MoversPadi.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {PLATFORM_STATS.map((stat, i) => (
                      <div key={i} className={`rounded-2xl p-4 border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2 rounded-xl w-fit mb-3 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <stat.icon size={16} className={`text-${stat.color}`} />
                        </div>
                        <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                          {stat.label}
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${stat.up ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>{stat.change}</span>
                        </div>
                        <h3 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>{stat.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3 pb-4">
                    {/* Recent Dispatch */}
                    <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <div>
                          <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Dispatch</h3>
                          <p className={`text-[11px] ${D ? "text-zinc-600" : "text-slate-400"}`}>Live fleet tracking</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-blue-500/20">
                          Live Map <ArrowUpRight size={12} />
                        </button>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className={`flex items-center gap-4 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shrink-0">
                              <Truck size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>Lekki Toll Gate → Victoria Island</p>
                              <p className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                                <Clock size={10} className="text-blue-500" /> Est. 14 mins
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`text-sm font-black ${D ? "text-blue-400" : "text-blue-600"}`}>₦18,500</p>
                              <span className="text-[9px] font-black text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">ON ROUTE</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Target */}
                    <div className="rounded-2xl bg-gradient-to-b from-violet-600 to-indigo-700 p-6 text-white relative overflow-hidden flex flex-col">
                      <Target size={28} className="mb-4 p-1 bg-white/20 rounded-lg" />
                      <h3 className="text-lg font-black mb-2">Monthly Target</h3>
                      <p className="text-sm opacity-80 mb-6 flex-1 leading-relaxed">You are at 84% of your monthly revenue goal.</p>
                      <div className="space-y-3">
                        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} transition={{ duration: 1.5 }} className="h-full bg-white rounded-full" />
                        </div>
                        <div className="flex justify-between text-[10px] font-black opacity-70">
                          <span>0k</span>
                          <span>84k / 100k Orders</span>
                        </div>
                        <button className="w-full py-3 bg-white text-violet-700 rounded-xl font-bold text-sm hover:bg-violet-50 transition-all">
                          View Analytics
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── USERS ── */}
              {activeView === "users" && (
                <motion.div key="u" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>User Management</h2>
                    <button
                      onClick={() => { setShowInvite(true); setInviteSent(false); setInviteEmail(""); }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all"
                    >
                      <UserPlus size={14} /> Invite Member
                    </button>
                  </div>

                  {showInvite && (
                    <div className={`rounded-2xl border p-5 space-y-3 ${D ? "bg-[#0e0e0e] border-white/10" : "bg-white border-slate-200"}`}>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Invite a Member</p>
                        <button onClick={() => setShowInvite(false)} className={D ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-600"}><X size={16} /></button>
                      </div>
                      {inviteSent ? (
                        <div className="py-6 text-center space-y-2">
                          <CheckCircle2 size={32} className="mx-auto text-green-500" />
                          <p className="text-green-600 font-bold text-sm">Invitation sent to {inviteEmail}</p>
                          <p className={`text-xs ${D ? "text-zinc-500" : "text-slate-400"}`}>They will receive an email with access instructions.</p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>Email Address</label>
                            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com"
                              className={`mt-1 w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${D ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}
                            />
                          </div>
                          <div>
                            <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>Role</label>
                            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                              className={`mt-1 w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${D ? "bg-white/5 border-white/10 text-zinc-200 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}
                            >
                              {["admin", "mover", "company", "customer"].map((r) => (
                                <option key={r} value={r} className={D ? "bg-[#0e0e0e]" : "bg-white"}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button onClick={() => setShowInvite(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
                            <button onClick={() => { if (inviteEmail) setInviteSent(true); }} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">Send Invite</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <p className={`text-xs font-semibold ${D ? "text-zinc-500" : "text-slate-400"}`}>Manage 12,481 accounts</p>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${D ? "bg-white/5 text-zinc-400 border border-white/5" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                        <Search size={12} />
                        <input type="text" placeholder="Search users…" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="bg-transparent outline-none w-28 font-medium" />
                      </div>
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {RECENT_USERS.filter((u) => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map((u, i) => (
                        <div key={i} className={`flex items-center gap-4 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                          <div className={`w-10 h-10 rounded-xl ${u.color} flex items-center justify-center text-white text-sm font-black shrink-0`}>{u.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{u.name}</p>
                            <p className={`text-[11px] font-semibold mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{u.email} · <span className="capitalize">{u.role}</span></p>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>{u.status}</span>
                          <div className="flex items-center gap-1.5">
                            <button className={`p-2 rounded-lg text-xs font-bold transition-all ${D ? "bg-white/5 text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400" : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}>
                              <Eye size={14} />
                            </button>
                            <button className={`p-2 rounded-lg transition-all ${D ? "bg-white/5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400" : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"}`}>
                              <Ban size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {RECENT_USERS.filter((u) => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                        <div className={`px-4 py-8 text-center text-sm ${D ? "text-zinc-600" : "text-slate-400"}`}>No users match your search.</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ORDERS ── */}
              {activeView === "orders" && (
                <motion.div key="or" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Logistics Engine</h2>
                    <div className="flex gap-2">
                      <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                        <Filter size={13} /> Filter
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-500/20 transition-all">
                        <Download size={13} /> Export
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Pending",    value: "142",   color: "amber" },
                      { label: "In Transit", value: "87",    color: "blue"  },
                      { label: "Delivered",  value: "3,601", color: "green" },
                      { label: "Cancelled",  value: "62",    color: "rose"  },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-2xl p-4 border ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                        <p className={`text-2xl font-black text-${s.color}-${D ? "400" : "600"}`}>{s.value}</p>
                        <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Orders</h3>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${D ? "bg-white/5 text-zinc-400 border border-white/5" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                        <Search size={12} /><input type="text" placeholder="Search orders…" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="bg-transparent outline-none w-24 font-medium" />
                      </div>
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {[
                        { id: "ORD-4821", from: "Ikeja",    to: "Lekki",    mover: "Babatunde O.", amount: "₦22,000", status: "In Transit", statusColor: "blue"  },
                        { id: "ORD-4820", from: "Surulere", to: "Ajah",     mover: "Emeka Ltd",    amount: "₦15,500", status: "Delivered",  statusColor: "green" },
                        { id: "ORD-4819", from: "Yaba",     to: "VI",       mover: "Chidi Movers", amount: "₦31,000", status: "Pending",    statusColor: "amber" },
                        { id: "ORD-4818", from: "Oshodi",   to: "Ikorodu",  mover: "FastMove NG",  amount: "₦18,200", status: "Delivered",  statusColor: "green" },
                        { id: "ORD-4817", from: "Gbagada",  to: "Apapa",    mover: "Tunde & Sons", amount: "₦27,500", status: "Cancelled",  statusColor: "rose"  },
                      ].filter((o) => !orderSearch || [o.id, o.from, o.to, o.mover, o.status].some((f) => f.toLowerCase().includes(orderSearch.toLowerCase()))).map((order, i) => (
                        <div key={i} className={`flex items-center gap-4 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                          <div className={`p-2.5 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                            <Package size={15} className={D ? "text-zinc-400" : "text-slate-500"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{order.id}</p>
                            <p className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                              <MapPin size={9} className="text-blue-500" /> {order.from} → {order.to}
                            </p>
                          </div>
                          <div className={`hidden md:block text-xs font-semibold ${D ? "text-zinc-500" : "text-slate-500"}`}>{order.mover}</div>
                          <div className={`text-sm font-black ${D ? "text-zinc-200" : "text-slate-800"}`}>{order.amount}</div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-${order.statusColor}-500/10 text-${order.statusColor}-${D ? "400" : "600"}`}>{order.status}</span>
                          <button className={`p-2 rounded-lg transition-all ${D ? "hover:bg-white/5 text-zinc-500" : "hover:bg-slate-100 text-slate-400"}`}>
                            <Eye size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── VERIFICATION QUEUE ── */}
              {activeView === "verification" && (
                <motion.div key="vq" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Verification Queue</h2>
                      <p className={`text-xs font-semibold mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>{queue.filter(a => a.status === "pending").length} pending · {queue.filter(a => a.status === "resubmission_required").length} resubmitted</p>
                    </div>
                    <div className="flex gap-2">
                      <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                        <Filter size={13} /> Filter
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-500/20 transition-all">
                        <Download size={13} /> Export
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {([
                      { label: "Pending",   status: "pending",               color: "amber"   },
                      { label: "Resubmit",  status: "resubmission_required", color: "orange"  },
                      { label: "Approved",  status: "approved",              color: "green"   },
                      { label: "Rejected",  status: "rejected",              color: "rose"    },
                      { label: "Suspended", status: "suspended",             color: "slate"   },
                    ] as const).map(({ label, status, color }) => (
                      <div key={status} className={`rounded-2xl p-4 border text-center ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                        <p className={`text-2xl font-black text-${color}-${D ? "400" : "600"}`}>{queue.filter(a => a.status === status).length}</p>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Applications</h3>
                      {queueLoading && <RefreshCw size={14} className="animate-spin text-amber-500" />}
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {queue.map((applicant) => (
                        <div key={applicant.id} className={`flex items-center gap-4 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                          <div className={`w-10 h-10 rounded-xl ${applicant.avatarColor} flex items-center justify-center text-white text-sm font-black shrink-0`}>{applicant.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{applicant.name}</p>
                            <p className={`text-[11px] font-semibold mt-0.5 flex items-center gap-2 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                              <span className="capitalize">{applicant.role}</span>
                              <span>·</span>
                              <Clock size={9} /> {applicant.submittedAt}
                            </p>
                          </div>
                          <VerifStatusBadge status={applicant.status} />
                          <button
                            onClick={() => { setSelectedApplicant(applicant); setActionReason(applicant.reason ?? ""); }}
                            className={`p-2 rounded-lg transition-all shrink-0 ${D ? "bg-white/5 text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400" : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600"}`}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit log */}
                  {auditLog.length > 0 && (
                    <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Audit Log</h3>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {auditLog.map((entry, i) => (
                          <div key={i} className="flex items-start gap-4 px-5 py-4">
                            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                              <Shield size={13} className={D ? "text-zinc-400" : "text-slate-500"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>
                                {entry.id} — <span className="capitalize text-amber-500">{entry.action}</span>
                              </p>
                              {entry.reason && <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-500"}`}>"{entry.reason}"</p>}
                              <p className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                                <Clock size={9} /> {entry.timestamp} · {entry.admin}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── ALERTS ── */}
              {activeView === "alerts" && (
                <motion.div key="al" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>System Alerts</h2>
                      <p className={`text-xs font-semibold mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>{unreadCount > 0 ? `${unreadCount} active alert${unreadCount !== 1 ? "s" : ""} require attention` : "All alerts read"}</p>
                    </div>
                    <button
                      onClick={markAllReadAlerts}
                      disabled={unreadCount === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                      <CheckCircle2 size={13} /> Mark All Read
                    </button>
                  </div>

                  <div className="space-y-3 pb-4">
                    {adminAlerts.map((alert, i) => {
                      const IconMap: Record<string, ElementType> = { AlertCircle, ShieldCheck, Activity, CheckCircle2, Zap };
                      const IconComp = IconMap[alert.icon] ?? AlertCircle;
                      return (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`flex gap-4 p-4 rounded-2xl border transition-all ${alert.read ? "opacity-50" : ""} ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2.5 rounded-xl shrink-0 bg-${alert.color}-500/10`}>
                          <IconComp size={18} className={`text-${alert.color}-${D ? "400" : "600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{alert.title}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              {alert.read && <span className="text-[9px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">Read</span>}
                              <span className={`text-[10px] font-semibold whitespace-nowrap flex items-center gap-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                                <Clock size={9} /> {alert.time}
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs mt-0.5 leading-relaxed ${D ? "text-zinc-600" : "text-slate-500"}`}>{alert.desc}</p>
                        </div>
                        <button
                          onClick={() => setAdminAlerts((prev) => prev.map((a, j) => j === i ? { ...a, read: true } : a))}
                          className={`p-2 rounded-lg transition-all self-start shrink-0 ${D ? "text-zinc-600 hover:bg-white/5" : "text-slate-400 hover:bg-slate-100"}`}>
                          <MoreHorizontal size={15} />
                        </button>
                      </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS ── */}
              {activeView === "settings" && (
                <motion.div key="st" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pb-4">
                  <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Configuration</h2>
                  <p className={`text-sm -mt-2 ${D ? "text-zinc-500" : "text-slate-400"}`}>Platform-wide settings and controls</p>

                  {([
                    {
                      title: "Platform Controls", icon: Shield,
                      items: [
                        { label: "Maintenance Mode",  desc: "Take the platform offline for all users",  key: "maintenanceMode"  as const, type: "toggle" as const },
                        { label: "New Registrations", desc: "Allow new users to sign up",               key: "newRegistrations" as const, type: "toggle" as const },
                        { label: "Order Processing",  desc: "Enable order creation and dispatch",       key: "orderProcessing"  as const, type: "toggle" as const },
                      ],
                    },
                    {
                      title: "Payment Settings", icon: CreditCard,
                      items: [
                        { label: "Platform Commission", desc: "Percentage taken from each order",       key: null as null, type: "input" as const, value: "12%" },
                        { label: "Minimum Order Value", desc: "Lowest accepted order amount",           key: null as null, type: "input" as const, value: "₦2,500" },
                        { label: "Auto Payout",         desc: "Automatically pay movers after delivery",key: "autoPayout" as const, type: "toggle" as const },
                      ],
                    },
                    {
                      title: "Notifications", icon: Bell,
                      items: [
                        { label: "Email Alerts",       desc: "Send system alerts to admin email",       key: "emailAlerts"       as const, type: "toggle" as const },
                        { label: "SMS Notifications",  desc: "Send SMS for critical events",            key: "smsNotifications"  as const, type: "toggle" as const },
                        { label: "Push Notifications", desc: "Browser push for real-time alerts",       key: "pushNotifications" as const, type: "toggle" as const },
                      ],
                    },
                  ] as const).map((section, si) => (
                    <div key={si} className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`flex items-center gap-3 px-4 py-3 border-b ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <div className={`p-2 rounded-lg ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <section.icon size={15} className={D ? "text-zinc-400" : "text-slate-500"} />
                        </div>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>{section.title}</h3>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {section.items.map((item, ii) => {
                          const isOn = item.key ? adminConfig[item.key] : false;
                          return (
                            <div key={ii} className="flex items-center justify-between px-5 py-4">
                              <div>
                                <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.label}</p>
                                <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{item.desc}</p>
                              </div>
                              {item.type === "toggle" ? (
                                <button onClick={() => item.key && toggleConfig(item.key)} className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isOn ? "bg-blue-500" : D ? "bg-white/10" : "bg-slate-200"}`}>
                                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${isOn ? "translate-x-5" : "translate-x-0.5"}`} />
                                </button>
                              ) : (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${D ? "bg-white/5 border-white/10 text-zinc-300" : "bg-slate-50 border-slate-100 text-slate-700"}`}>
                                  {"value" in item ? item.value : ""} <ChevronRight size={13} className={D ? "text-zinc-600" : "text-slate-300"} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => { logout(); router.push("/auth/login"); }}
                    className={`w-full py-3.5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${D ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10" : "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"}`}
                  >
                    <LogOut size={15} /> Sign Out of Admin Console
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className={`lg:hidden border-t flex items-center justify-around px-2 py-2 shrink-0 transition-colors ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          {([
            { id: "overview"     as ActiveView, icon: LayoutGrid,   label: "Home"   },
            { id: "users"        as ActiveView, icon: Users,        label: "Users"  },
            { id: "verification" as ActiveView, icon: ClipboardList, label: "Verify", badge: pendingCount > 0 ? pendingCount : undefined },
            { id: "alerts"       as ActiveView, icon: Bell,         label: "Alerts", badge: 3 },
            { id: "settings"     as ActiveView, icon: Settings,     label: "Config" },
          ] as { id: ActiveView; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string; badge?: number }[]).map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-blue-500" : D ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
              >
                <span className="relative">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {item.badge && <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{item.badge}</span>}
                </span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </main>

      {/* ── Verification Action Modal ── */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col ${D ? "bg-[#0e0e0e] border-white/10" : "bg-white border-slate-200"}`}>
                {/* Modal header */}
                <div className={`flex items-center gap-4 p-5 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
                  <div className={`w-11 h-11 rounded-xl ${selectedApplicant.avatarColor} flex items-center justify-center text-white font-black shrink-0`}>{selectedApplicant.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black ${D ? "text-white" : "text-slate-900"}`}>{selectedApplicant.name}</p>
                    <p className={`text-xs font-semibold capitalize mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>{selectedApplicant.role} · {selectedApplicant.email}</p>
                  </div>
                  <VerifStatusBadge status={selectedApplicant.status} />
                  <button onClick={() => setSelectedApplicant(null)} className={`p-2 rounded-lg transition-all ${D ? "text-zinc-500 hover:bg-white/5" : "text-slate-400 hover:bg-slate-100"}`}>
                    <XCircle size={17} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${D ? "text-zinc-500" : "text-slate-400"}`}>Submitted Documents</p>
                    <div className="space-y-2">
                      {selectedApplicant.documents.map((doc) => (
                        <div key={doc} className={`flex items-center justify-between p-3 rounded-xl border ${D ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                            <span className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-700"}`}>{doc}</span>
                          </div>
                          <button className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-1">
                            <Eye size={10} /> View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${D ? "text-zinc-500" : "text-slate-400"}`}>Reason / Note</p>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Explain the action taken for the audit log..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl text-sm font-medium outline-none resize-none transition-all focus:ring-2 focus:ring-blue-500/20 ${D ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600" : "bg-slate-50 border-slate-100 text-slate-700 placeholder:text-slate-400"}`}
                    />
                  </div>
                </div>

                {/* Modal footer */}
                <div className={`p-5 border-t space-y-3 ${D ? "border-white/5" : "border-slate-100"}`}>
                  {actionError && <p className="text-xs font-bold text-red-500 text-center">{actionError}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <button disabled={actionLoading} onClick={() => handleVerificationAction(selectedApplicant.id, "approved", actionReason)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all disabled:opacity-50">
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
                    </button>
                    <button disabled={actionLoading} onClick={() => handleVerificationAction(selectedApplicant.id, "rejected", actionReason)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50">
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                    </button>
                    <button disabled={actionLoading} onClick={() => handleVerificationAction(selectedApplicant.id, "resubmission_required", actionReason)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all disabled:opacity-50">
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} Request Resubmit
                    </button>
                    <button disabled={actionLoading} onClick={() => handleVerificationAction(selectedApplicant.id, "suspended", actionReason)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm transition-all disabled:opacity-50">
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <AlertTriangle size={14} />} Suspend
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Verification Status Badge ─────────────────────────────
function VerifStatusBadge({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { label: string; cls: string }> = {
    pending:               { label: "Pending",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"   },
    approved:              { label: "Approved",  cls: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"   },
    rejected:              { label: "Rejected",  cls: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"           },
    suspended:             { label: "Suspended", cls: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"       },
    resubmission_required: { label: "Resubmit",  cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" },
  };
  const { label, cls } = map[status];
  return <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${cls}`}>{label}</span>;
}
