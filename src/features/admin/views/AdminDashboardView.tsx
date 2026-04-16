"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Users, Truck, Package, DollarSign, Bell,
  Settings, LogOut, Menu, X, ChevronRight, TrendingUp,
  TrendingDown, ShieldCheck, AlertCircle, CheckCircle2,
  Building2, Search, MoreHorizontal, Ban, Eye
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────
const PLATFORM_STATS = [
  { label: "Total Users", value: "12,481", change: "+142 today", up: true, icon: Users },
  { label: "Active Movers", value: "1,204", change: "+18 this week", up: true, icon: Truck },
  { label: "Orders Today", value: "3,892", change: "+9.2% vs yesterday", up: true, icon: Package },
  { label: "Platform Revenue", value: "₦28.4M", change: "-2.1% vs last week", up: false, icon: DollarSign },
];

const RECENT_USERS = [
  { id: "USR-0091", name: "Adaeze Okonkwo", role: "customer", email: "adaeze@mail.com", joined: "2 mins ago", status: "active" },
  { id: "USR-0090", name: "Babatunde Ojo", role: "mover", email: "baba@mail.com", joined: "14 mins ago", status: "active" },
  { id: "USR-0089", name: "Chukwuemeka Ltd", role: "company", email: "info@chukwu.ng", joined: "1 hr ago", status: "pending" },
  { id: "USR-0088", name: "Ngozi Eze", role: "customer", email: "ngozi@mail.com", joined: "3 hrs ago", status: "suspended" },
  { id: "USR-0087", name: "Segun Afolabi", role: "mover", email: "segun@mail.com", joined: "5 hrs ago", status: "active" },
];

const RECENT_ORDERS = [
  { id: "ORD-8821", customer: "Adaeze O.", mover: "Segun A.", route: "Ikeja → Lekki", value: "₦4,200", status: "completed" },
  { id: "ORD-8820", customer: "Babatunde O.", mover: "Emeka D.", route: "Yaba → VI", value: "₦6,800", status: "in-transit" },
  { id: "ORD-8819", customer: "Ngozi E.", mover: "—", route: "Surulere → Ajah", value: "₦9,100", status: "pending" },
  { id: "ORD-8818", customer: "Tunde B.", mover: "Chidi N.", route: "Oshodi → Ikoyi", value: "₦3,500", status: "cancelled" },
];

const ALERTS = [
  { id: 1, type: "warning", message: "Mover USR-0082 has 3 unresolved complaints", time: "5 mins ago" },
  { id: 2, type: "error", message: "Payment gateway timeout — 12 failed transactions", time: "22 mins ago" },
  { id: 3, type: "info", message: "New company registration pending KYC review", time: "1 hr ago" },
  { id: 4, type: "success", message: "System backup completed successfully", time: "2 hrs ago" },
];

type ActiveView = "overview" | "users" | "orders" | "alerts" | "settings";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-600 border-green-200",
  pending: "bg-blue-50 text-blue-600 border-blue-200",
  suspended: "bg-red-50 text-red-600 border-red-200",
  completed: "bg-green-50 text-green-600 border-green-200",
  "in-transit": "bg-blue-50 text-blue-600 border-blue-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const ROLE_STYLES: Record<string, string> = {
  customer: "bg-blue-50 text-blue-600 border-blue-200",
  mover: "bg-blue-50 text-blue-600 border-blue-200",
  company: "bg-blue-50 text-blue-600 border-blue-200",
  admin: "bg-slate-100 text-slate-600 border-slate-200",
};

const ALERT_STYLES: Record<string, { bg: string; icon: React.ComponentType<{ className?: string; size?: number }>; color: string }> = {
  warning: { bg: "bg-blue-50 border-blue-200" },
  error: { bg: "bg-red-50 border-red-200", icon: AlertCircle, color: "text-red-500" },
  info: { bg: "bg-blue-50 border-blue-200", icon: Bell, color: "text-blue-500" },
  success: { bg: "bg-green-50 border-green-200", icon: CheckCircle2, color: "text-green-500" },
};

export default function AdminDashboardView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => { logout(); router.push("/auth/login"); };

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string; size?: number }>; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "users", label: "Users", icon: Users },
    { id: "orders", label: "Orders", icon: Package },
    { id: "alerts", label: "Alerts", icon: Bell, badge: ALERTS.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredUsers = RECENT_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-green-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-white tracking-tight text-sm">MoversPadi</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-red-400">Admin Console</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500"><X size={18} /></button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeView === item.id ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <item.icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-500 font-medium">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5">
            <LogOut size={14} />Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={18} /></button>
            <div>
              <p className="text-xs text-slate-500 font-medium">Admin Console</p>
              <h1 className="text-sm font-bold text-white capitalize">{activeView}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <AnimatePresence mode="wait">

              {/* ── OVERVIEW ── */}
              {activeView === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-white">Platform Overview</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Live metrics across all users and operations</p>
                  </div>

                  {/* KPI cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {PLATFORM_STATS.map((s) => (
                      <div key={s.label} className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 bg-slate-800 rounded-lg"><s.icon className="w-4 h-4 text-slate-400" /></div>
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? "text-green-400" : "text-red-400"}`}>
                            {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {s.change}
                          </div>
                        </div>
                        <p className="text-2xl font-black text-white">{s.value}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Alerts preview */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-white">System Alerts</h3>
                      <button onClick={() => setActiveView("alerts")} className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {ALERTS.slice(0, 3).map((alert) => {
                        const style = ALERT_STYLES[alert.type];
                        return (
                          <div key={alert.id} className="px-6 py-4 flex items-start gap-3">
                            <style.icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-300 font-medium">{alert.message}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{alert.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent users */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-white">Recent Registrations</h3>
                      <button onClick={() => setActiveView("users")} className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {RECENT_USERS.slice(0, 3).map((u) => (
                        <div key={u.id} className="px-6 py-4 flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-400 text-xs shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email} · {u.joined}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border hidden sm:inline-block ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[u.status]}`}>{u.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── USERS ── */}
              {activeView === "users" && (
                <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white">User Management</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {RECENT_USERS.filter(u => u.status === "active").length} active
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users by name, email, or role…"
                      className="w-full bg-slate-900 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-white/5">
                      {filteredUsers.map((u) => (
                        <div key={u.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-400 text-sm shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-white">{u.name}</p>
                              <span className="text-[10px] text-slate-600 font-mono">{u.id}</span>
                            </div>
                            <p className="text-xs text-slate-500">{u.email} · {u.joined}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border hidden md:inline-block ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[u.status]}`}>{u.status}</span>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-slate-600 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredUsers.length === 0 && (
                        <div className="px-6 py-12 text-center text-slate-600 text-sm">No users match your search.</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ORDERS ── */}
              {activeView === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black text-white">All Orders</h2>
                  <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-white/5">
                      {RECENT_ORDERS.map((o) => (
                        <div key={o.id} className="px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${STATUS_STYLES[o.status]}`}>
                            {o.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> :
                             o.status === "cancelled" ? <AlertCircle className="w-5 h-5" /> :
                             <Package className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-white">{o.route}</p>
                              <span className="text-[10px] text-slate-600 font-mono">{o.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Customer: {o.customer} · Mover: {o.mover}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-white">{o.value}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-1 inline-block ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                          </div>
                          <button className="p-2 text-slate-600 hover:text-slate-300 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ALERTS ── */}
              {activeView === "alerts" && (
                <motion.div key="alerts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black text-white">System Alerts</h2>
                  <div className="space-y-3">
                    {ALERTS.map((alert) => {
                      const style = ALERT_STYLES[alert.type];
                      return (
                        <div key={alert.id} className={`flex items-start gap-4 p-5 rounded-2xl border bg-slate-900 border-white/5`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} border`}>
                            <style.icon className={`w-5 h-5 ${style.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                          </div>
                          <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                            Dismiss
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS ── */}
              {activeView === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black text-white">Platform Settings</h2>
                  {[
                    { label: "Admin Accounts", sub: "Manage super admins and moderators", icon: ShieldCheck },
                    { label: "Platform Fees", sub: "Configure commission rates and pricing rules", icon: DollarSign },
                    { label: "KYC & Verification", sub: "Review pending identity verifications", icon: Users },
                    { label: "Notifications", sub: "System-wide alert and email settings", icon: Bell },
                    { label: "Audit Logs", sub: "View all admin actions and system events", icon: Building2 },
                  ].map((item) => (
                    <button key={item.label} className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-all text-left">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
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
