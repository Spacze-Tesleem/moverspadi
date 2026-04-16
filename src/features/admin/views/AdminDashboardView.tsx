"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Users, Truck, Package, DollarSign, Bell,
  Settings, LogOut, Menu, X, ChevronRight, TrendingUp,
  TrendingDown, ShieldCheck, AlertCircle, CheckCircle2,
  Building2, Search, MoreHorizontal, Ban, Eye, Filter,
  Download, Calendar, ArrowUpRight, ArrowDownRight,
  Clock, MapPin, Star, Activity, Zap, Target, PieChart,
  BarChart3, UserPlus, ShoppingCart, CreditCard
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────
const PLATFORM_STATS = [
  { label: "Total Users", value: "12,481", change: "+142 today", up: true, icon: Users, percent: "+12.5%", sparkline: [40, 45, 38, 50, 49, 60, 70, 65] },
  { label: "Active Movers", value: "1,204", change: "+18 this week", up: true, icon: Truck, percent: "+8.2%", sparkline: [30, 40, 35, 50, 49, 55, 60, 58] },
  { label: "Orders Today", value: "3,892", change: "+9.2% vs yesterday", up: true, icon: Package, percent: "+9.2%", sparkline: [20, 35, 40, 38, 50, 55, 62, 68] },
  { label: "Platform Revenue", value: "₦28.4M", change: "-2.1% vs last week", up: false, icon: DollarSign, percent: "-2.1%", sparkline: [70, 65, 68, 60, 55, 50, 48, 45] },
];

const QUICK_STATS = [
  { label: "Avg. Response Time", value: "2.4m", icon: Clock, color: "blue" },
  { label: "Customer Satisfaction", value: "94%", icon: Star, color: "yellow" },
  { label: "Active Sessions", value: "1,847", icon: Activity, color: "green" },
  { label: "Completion Rate", value: "87%", icon: Target, color: "purple" },
];

const RECENT_USERS = [
  { id: "USR-0091", name: "Adaeze Okonkwo", role: "customer", email: "adaeze@mail.com", joined: "2 mins ago", status: "active", avatar: "AO", orders: 12, rating: 4.8 },
  { id: "USR-0090", name: "Babatunde Ojo", role: "mover", email: "baba@mail.com", joined: "14 mins ago", status: "active", avatar: "BO", orders: 89, rating: 4.9 },
  { id: "USR-0089", name: "Chukwuemeka Ltd", role: "company", email: "info@chukwu.ng", joined: "1 hr ago", status: "pending", avatar: "CL", orders: 0, rating: 0 },
  { id: "USR-0088", name: "Ngozi Eze", role: "customer", email: "ngozi@mail.com", joined: "3 hrs ago", status: "suspended", avatar: "NE", orders: 5, rating: 3.2 },
  { id: "USR-0087", name: "Segun Afolabi", role: "mover", email: "segun@mail.com", joined: "5 hrs ago", status: "active", avatar: "SA", orders: 156, rating: 5.0 },
];

const RECENT_ORDERS = [
  { id: "ORD-8821", customer: "Adaeze O.", mover: "Segun A.", route: "Ikeja → Lekki", value: "₦4,200", status: "completed", time: "2h ago", distance: "12 km" },
  { id: "ORD-8820", customer: "Babatunde O.", mover: "Emeka D.", route: "Yaba → VI", value: "₦6,800", status: "in-transit", time: "30m ago", distance: "8 km" },
  { id: "ORD-8819", customer: "Ngozi E.", mover: "—", route: "Surulere → Ajah", value: "₦9,100", status: "pending", time: "1h ago", distance: "15 km" },
  { id: "ORD-8818", customer: "Tunde B.", mover: "Chidi N.", route: "Oshodi → Ikoyi", value: "₦3,500", status: "cancelled", time: "4h ago", distance: "6 km" },
];

const ALERTS = [
  { id: 1, type: "warning", message: "Mover USR-0082 has 3 unresolved complaints", time: "5 mins ago", priority: "high" },
  { id: 2, type: "error", message: "Payment gateway timeout — 12 failed transactions", time: "22 mins ago", priority: "critical" },
  { id: 3, type: "info", message: "New company registration pending KYC review", time: "1 hr ago", priority: "medium" },
  { id: 4, type: "success", message: "System backup completed successfully", time: "2 hrs ago", priority: "low" },
];

type ActiveView = "overview" | "users" | "orders" | "alerts" | "settings";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  suspended: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "in-transit": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const ROLE_STYLES: Record<string, string> = {
  customer: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  mover: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  company: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  admin: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const ALERT_STYLES: Record<string, { bg: string; icon: React.ComponentType<{ className?: string; size?: number }>; color: string; border: string }> = {
  warning: { bg: "bg-amber-500/5", icon: AlertCircle, color: "text-amber-400", border: "border-amber-500/20" },
  error: { bg: "bg-rose-500/5", icon: AlertCircle, color: "text-rose-400", border: "border-rose-500/20" },
  info: { bg: "bg-blue-500/5", icon: Bell, color: "text-blue-400", border: "border-blue-500/20" },
  success: { bg: "bg-emerald-500/5", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20" },
};

// Mini Sparkline Component
const Sparkline = ({ data, color = "emerald" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const colorMap: Record<string, string> = {
    emerald: "stroke-emerald-400",
    blue: "stroke-blue-400",
    rose: "stroke-rose-400",
    amber: "stroke-amber-400",
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={colorMap[color] || colorMap.emerald}
      />
    </svg>
  );
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
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-white tracking-tight text-sm">MoversPadi</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-rose-400">Admin Console</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold group ${
                activeView === item.id 
                  ? "bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} className={activeView === item.id ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-rose-500/20">
                  {item.badge}
                </span>
              )}
              {activeView === item.id && (
                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-emerald-400/20 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white text-xs font-black">
                {(user?.name || "Admin").split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 group"
          >
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Admin Console</p>
              <h1 className="text-sm font-black text-white capitalize flex items-center gap-2">
                {activeView}
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
              <Calendar size={14} />
              <span>Last 30 days</span>
            </button>
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-emerald-500/20 group">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <AnimatePresence mode="wait">

              {/* ── OVERVIEW ── */}
              {activeView === "overview" && (
                <motion.div 
                  key="overview" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Platform Overview
                      </h2>
                      <p className="text-sm text-slate-400 mt-1 font-medium">Live metrics across all users and operations</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                      <Download size={14} />
                      Export Report
                    </button>
                  </div>

                  {/* Main KPI cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PLATFORM_STATS.map((s, idx) => (
                      <motion.div 
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden"
                      >
                        {/* Background gradient effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${s.up ? 'bg-emerald-500/10' : 'bg-rose-500/10'} border ${s.up ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                              <s.icon className={`w-4 h-4 ${s.up ? 'text-emerald-400' : 'text-rose-400'}`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${s.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {s.percent}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-3xl font-black text-white tracking-tight">{s.value}</p>
                            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{s.change}</p>
                          </div>

                          {/* Mini sparkline */}
                          <div className="mt-4 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={s.sparkline} color={s.up ? "emerald" : "rose"} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick stats row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {QUICK_STATS.map((stat, idx) => {
                      const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                        blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
                        yellow: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
                        green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                        purple: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
                      };
                      const colors = colorMap[stat.color];
                      
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                          className={`flex items-center gap-3 p-4 rounded-xl border ${colors.bg} ${colors.border} backdrop-blur-sm`}
                        >
                          <stat.icon className={`w-5 h-5 ${colors.text}`} />
                          <div>
                            <p className={`text-lg font-black ${colors.text}`}>{stat.value}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Two column layout */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Recent Activity - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Alerts preview */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/10 transition-all">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                            </div>
                            <h3 className="font-bold text-white">System Alerts</h3>
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-full border border-rose-500/20">
                              {ALERTS.length} active
                            </span>
                          </div>
                          <button 
                            onClick={() => setActiveView("alerts")} 
                            className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-1 group"
                          >
                            View all 
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                        <div className="divide-y divide-white/5">
                          {ALERTS.slice(0, 3).map((alert) => {
                            const style = ALERT_STYLES[alert.type];
                            return (
                              <div key={alert.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group">
                                <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center border ${style.border} shrink-0 group-hover:scale-110 transition-transform`}>
                                  <style.icon className={`w-5 h-5 ${style.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white font-semibold group-hover:text-emerald-400 transition-colors">{alert.message}</p>
                                  <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {alert.time}
                                  </p>
                                </div>
                                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-transparent hover:border-white/10">
                                  Resolve
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/10 transition-all">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                              <Package className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-white">Recent Orders</h3>
                          </div>
                          <button 
                            onClick={() => setActiveView("orders")} 
                            className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-1 group"
                          >
                            View all 
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                        <div className="divide-y divide-white/5">
                          {RECENT_ORDERS.slice(0, 3).map((order) => (
                            <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${STATUS_STYLES[order.status]} shrink-0 group-hover:scale-110 transition-transform`}>
                                {order.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> :
                                 order.status === "cancelled" ? <AlertCircle className="w-5 h-5" /> :
                                 <Package className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{order.route}</p>
                                  <span className="text-[10px] text-slate-600 font-mono px-2 py-0.5 bg-slate-800/50 rounded">{order.id}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {order.distance}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {order.time}
                                  </span>
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-black text-white mb-1">{order.value}</p>
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border inline-block ${STATUS_STYLES[order.status]}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar - Takes 1 column */}
                    <div className="space-y-6">
                      
                      {/* Recent users */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/10 transition-all">
                        <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-slate-800/50 to-transparent">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                              <UserPlus className="w-4 h-4 text-violet-400" />
                            </div>
                            <h3 className="font-bold text-white">New Users</h3>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">Latest registrations</p>
                        </div>
                        <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                          {RECENT_USERS.slice(0, 5).map((u) => (
                            <div key={u.id} className="px-6 py-3 hover:bg-white/[0.02] transition-colors group">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center font-black text-white text-xs shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                                  {u.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{u.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${ROLE_STYLES[u.role]}`}>
                                      {u.role}
                                    </span>
                                    <span className="text-[10px] text-slate-600">•</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{u.joined}</span>
                                  </div>
                                </div>
                                <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : u.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'} shrink-0`} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => setActiveView("users")}
                          className="w-full px-6 py-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 border-t border-white/5 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-1 group"
                        >
                          View all users
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:border-white/10 transition-all">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          Quick Actions
                        </h3>
                        <div className="space-y-2">
                          {[
                            { label: "Generate Report", icon: BarChart3, color: "emerald" },
                            { label: "Review KYC", icon: ShieldCheck, color: "blue" },
                            { label: "Platform Settings", icon: Settings, color: "violet" },
                          ].map((action) => {
                            const colorMap: Record<string, string> = {
                              emerald: "hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400",
                              blue: "hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400",
                              violet: "hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-400",
                            };
                            
                            return (
                              <button 
                                key={action.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 text-slate-400 transition-all text-sm font-semibold group ${colorMap[action.color]}`}
                              >
                                <action.icon className="w-4 h-4" />
                                <span className="flex-1 text-left">{action.label}</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── USERS ── */}
              {activeView === "users" && (
                <motion.div 
                  key="users" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">User Management</h2>
                      <p className="text-sm text-slate-400 mt-1 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        {RECENT_USERS.filter(u => u.status === "active").length} active users
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all border border-white/5 hover:border-white/10">
                        <Filter size={14} />
                        Filter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                        <UserPlus size={14} />
                        Add User
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users by name, email, or role…"
                      className="w-full bg-slate-900 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  {/* User stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total", value: RECENT_USERS.length, color: "slate" },
                      { label: "Active", value: RECENT_USERS.filter(u => u.status === "active").length, color: "emerald" },
                      { label: "Pending", value: RECENT_USERS.filter(u => u.status === "pending").length, color: "amber" },
                      { label: "Suspended", value: RECENT_USERS.filter(u => u.status === "suspended").length, color: "rose" },
                    ].map((stat) => {
                      const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                        slate: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
                        emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                        amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
                        rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
                      };
                      const colors = colorMap[stat.color];
                      
                      return (
                        <div key={stat.label} className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                          <p className={`text-2xl font-black ${colors.text}`}>{stat.value}</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Users table */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="divide-y divide-white/5">
                      {filteredUsers.map((u, idx) => (
                        <motion.div 
                          key={u.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center font-black text-white text-sm shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                            {u.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{u.name}</p>
                              <span className="text-[10px] text-slate-600 font-mono px-2 py-0.5 bg-slate-800/50 rounded">{u.id}</span>
                              {u.rating > 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {u.rating}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{u.email} · {u.joined}</p>
                            {u.orders > 0 && (
                              <p className="text-[10px] text-slate-600 font-medium mt-1">{u.orders} orders completed</p>
                            )}
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${ROLE_STYLES[u.role]}`}>
                              {u.role}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${STATUS_STYLES[u.status]}`}>
                            {u.status}
                          </span>
                          <div className="flex items-center gap-1">
                            <button className="p-2 text-slate-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      {filteredUsers.length === 0 && (
                        <div className="px-6 py-16 text-center">
                          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                          <p className="text-slate-500 text-sm font-semibold">No users match your search.</p>
                          <p className="text-slate-600 text-xs mt-1">Try adjusting your search terms</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ORDERS ── */}
              {activeView === "orders" && (
                <motion.div 
                  key="orders" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">All Orders</h2>
                      <p className="text-sm text-slate-400 mt-1 font-medium">Track and manage all platform orders</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all border border-white/5 hover:border-white/10">
                        <Filter size={14} />
                        Filter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                        <Download size={14} />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Order stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total Today", value: "3,892", icon: ShoppingCart, color: "blue" },
                      { label: "Completed", value: "3,124", icon: CheckCircle2, color: "emerald" },
                      { label: "In Transit", value: "645", icon: Truck, color: "amber" },
                      { label: "Pending", value: "123", icon: Clock, color: "violet" },
                    ].map((stat) => {
                      const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                        blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
                        emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                        amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
                        violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
                      };
                      const colors = colorMap[stat.color];
                      
                      return (
                        <div key={stat.label} className={`p-4 rounded-xl border ${colors.bg} ${colors.border} flex items-center gap-3`}>
                          <stat.icon className={`w-5 h-5 ${colors.text}`} />
                          <div>
                            <p className={`text-xl font-black ${colors.text}`}>{stat.value}</p>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">{stat.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Orders list */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="divide-y divide-white/5">
                      {RECENT_ORDERS.map((o, idx) => (
                        <motion.div 
                          key={o.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${STATUS_STYLES[o.status]} group-hover:scale-110 transition-transform`}>
                            {o.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> :
                             o.status === "cancelled" ? <AlertCircle className="w-6 h-6" /> :
                             o.status === "in-transit" ? <Truck className="w-6 h-6" /> :
                             <Package className="w-6 h-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <p className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{o.route}</p>
                              <span className="text-[10px] text-slate-600 font-mono px-2 py-0.5 bg-slate-800/50 rounded">{o.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Customer: <span className="text-white font-semibold">{o.customer}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Mover: <span className="text-white font-semibold">{o.mover}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-800/50 rounded">
                                <MapPin className="w-3 h-3" />
                                {o.distance}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-800/50 rounded">
                                <Clock className="w-3 h-3" />
                                {o.time}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-black text-white mb-2">{o.value}</p>
                            <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border inline-block ${STATUS_STYLES[o.status]}`}>
                              {o.status}
                            </span>
                          </div>
                          <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ALERTS ── */}
              {activeView === "alerts" && (
                <motion.div 
                  key="alerts" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">System Alerts</h2>
                      <p className="text-sm text-slate-400 mt-1 font-medium">{ALERTS.length} active alerts requiring attention</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={14} />
                      Mark All Read
                    </button>
                  </div>

                  {/* Alert priority stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Critical", value: ALERTS.filter(a => a.priority === "critical").length, color: "rose" },
                      { label: "High", value: ALERTS.filter(a => a.priority === "high").length, color: "amber" },
                      { label: "Medium", value: ALERTS.filter(a => a.priority === "medium").length, color: "blue" },
                      { label: "Low", value: ALERTS.filter(a => a.priority === "low").length, color: "emerald" },
                    ].map((stat) => {
                      const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                        rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
                        amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
                        blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
                        emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                      };
                      const colors = colorMap[stat.color];
                      
                      return (
                        <div key={stat.label} className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                          <p className={`text-2xl font-black ${colors.text}`}>{stat.value}</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">{stat.label} Priority</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Alerts list */}
                  <div className="space-y-3">
                    {ALERTS.map((alert, idx) => {
                      const style = ALERT_STYLES[alert.type];
                      const priorityColors: Record<string, string> = {
                        critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      };
                      
                      return (
                        <motion.div 
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 hover:border-white/10 transition-all group backdrop-blur-sm"
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${style.bg} border ${style.border} group-hover:scale-110 transition-transform`}>
                            <style.icon className={`w-6 h-6 ${style.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex-1">{alert.message}</p>
                              <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-lg border ${priorityColors[alert.priority]}`}>
                                {alert.priority}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {alert.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all border border-emerald-500/20 hover:border-emerald-500/30">
                              Resolve
                            </button>
                            <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS ── */}
              {activeView === "settings" && (
                <motion.div 
                  key="settings" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Platform Settings</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium">Manage platform configuration and preferences</p>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { label: "Admin Accounts", sub: "Manage super admins and moderators", icon: ShieldCheck, color: "emerald" },
                      { label: "Platform Fees", sub: "Configure commission rates and pricing rules", icon: DollarSign, color: "amber" },
                      { label: "KYC & Verification", sub: "Review pending identity verifications", icon: Users, color: "blue" },
                      { label: "Notifications", sub: "System-wide alert and email settings", icon: Bell, color: "violet" },
                      { label: "Audit Logs", sub: "View all admin actions and system events", icon: Building2, color: "rose" },
                      { label: "Analytics", sub: "Configure tracking and reporting settings", icon: PieChart, color: "cyan" },
                    ].map((item, idx) => {
                      const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
                        emerald: { bg: "hover:bg-emerald-500/5", text: "group-hover:text-emerald-400", border: "hover:border-emerald-500/20", iconBg: "bg-emerald-500/10 border-emerald-500/20" },
                        amber: { bg: "hover:bg-amber-500/5", text: "group-hover:text-amber-400", border: "hover:border-amber-500/20", iconBg: "bg-amber-500/10 border-amber-500/20" },
                        blue: { bg: "hover:bg-blue-500/5", text: "group-hover:text-blue-400", border: "hover:border-blue-500/20", iconBg: "bg-blue-500/10 border-blue-500/20" },
                        violet: { bg: "hover:bg-violet-500/5", text: "group-hover:text-violet-400", border: "hover:border-violet-500/20", iconBg: "bg-violet-500/10 border-violet-500/20" },
                        rose: { bg: "hover:bg-rose-500/5", text: "group-hover:text-rose-400", border: "hover:border-rose-500/20", iconBg: "bg-rose-500/10 border-rose-500/20" },
                        cyan: { bg: "hover:bg-cyan-500/5", text: "group-hover:text-cyan-400", border: "hover:border-cyan-500/20", iconBg: "bg-cyan-500/10 border-cyan-500/20" },
                      };
                      const colors = colorMap[item.color];
                      
                      return (
                        <motion.button 
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`w-full bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-2xl p-6 flex items-center gap-4 ${colors.border} ${colors.bg} transition-all text-left group backdrop-blur-sm`}
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${colors.iconBg} group-hover:scale-110 transition-transform`}>
                            <item.icon className={`w-6 h-6 text-slate-400 ${colors.text} transition-colors`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-bold text-white ${colors.text} transition-colors`}>{item.label}</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{item.sub}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}