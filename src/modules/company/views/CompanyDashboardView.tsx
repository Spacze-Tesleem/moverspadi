"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Truck, Users, DollarSign, Bell, Settings,
  LogOut, Menu, X, ChevronRight, TrendingUp,
  Package, Clock, CheckCircle2, Building2, ShieldCheck,
  Star, ArrowUpRight, Filter, Zap, Sun, Moon,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import PendingApprovalView from "@/src/modules/auth/views/PendingApprovalView";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

// ── Mock Data ──────────────────────────────────────────────
const FLEET = [
  { id: "VH-001", driver: "Emeka Obi",       plate: "LND-421-AA", type: "Van",   status: "active",      route: "Ikeja → Lekki",   load: "82%" },
  { id: "VH-002", driver: "Tunde Adeyemi",   plate: "LND-882-BB", type: "Truck", status: "active",      route: "Apapa → Ajah",    load: "65%" },
  { id: "VH-003", driver: "Chidi Nwosu",     plate: "LND-119-CC", type: "Bike",  status: "idle",        route: "—",               load: "0%"  },
  { id: "VH-004", driver: "Fatima Bello",    plate: "LND-774-DD", type: "Van",   status: "maintenance", route: "—",               load: "0%"  },
  { id: "VH-005", driver: "Seun Alade",      plate: "LND-553-EE", type: "Truck", status: "active",      route: "VI → Surulere",   load: "91%" },
];

const STATS = [
  { label: "Revenue (MTD)",     value: "₦4.2M", change: "+18%",      up: true,  icon: DollarSign, color: "green-600"  },
  { label: "Fleet Utilization", value: "84%",   change: "+5% vs lw", up: true,  icon: Truck,      color: "blue-500"   },
  { label: "Order Volume",      value: "142",   change: "+12",        up: true,  icon: Package,    color: "violet-500" },
  { label: "Avg. Reliability",  value: "4.7★",  change: "-0.1",      up: false, icon: Star,       color: "amber-500"  },
];

type ActiveView = "overview" | "fleet" | "orders" | "drivers" | "settings";

export default function CompanyDashboardView() {
  return (
    <ThemeProvider>
      <PendingApprovalView approvedDashboard={<CompanyDashboardInner />} />
    </ThemeProvider>
  );
}

function CompanyDashboardInner() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDark: D, toggleTheme } = useTheme();

  const [activeView, setActiveView]           = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen]       = useState(true);

  const navItems: { id: ActiveView; label: string; icon: typeof LayoutGrid }[] = [
    { id: "overview",  label: "Operations", icon: LayoutGrid  },
    { id: "fleet",     label: "Fleet Hub",  icon: Truck       },
    { id: "orders",    label: "Shipments",  icon: Package     },
    { id: "drivers",   label: "Personnel",  icon: Users       },
    { id: "settings",  label: "Settings",   icon: Settings    },
  ];

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
              <Building2 className="text-white w-4 h-4" />
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
                    <span className="text-sm font-semibold truncate">{item.label}</span>
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
                    {(user?.name ?? "C")[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{user?.name ?? "Company"}</p>
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
            <h1 className={`text-sm lg:text-base font-black ${D ? "text-white" : "text-slate-900"}`}>
              {navItems.find(n => n.id === activeView)?.label ?? activeView}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${D ? "text-blue-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100"}`}>
              {D ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2 rounded-lg relative transition-all ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className={`hidden sm:block h-5 w-px mx-1 ${D ? "bg-white/10" : "bg-slate-200"}`} />
            <button
              onClick={() => handleTabChange("orders")}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <Package size={12} /> New Shipment
            </button>
            <button onClick={() => handleTabChange("orders")} className="sm:hidden p-2 bg-blue-600 text-white rounded-xl">
              <Package size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {activeView === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div>
                    <h2 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>Operations Overview</h2>
                    <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Live operational snapshot for your fleet.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {STATS.map((s, i) => (
                      <div key={i} className={`rounded-2xl p-4 border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className={`p-2 rounded-xl w-fit mb-3 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                          <s.icon size={16} className={`text-${s.color}`} />
                        </div>
                        <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>
                          {s.label}
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${s.up ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>{s.change}</span>
                        </div>
                        <h3 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>{s.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3 pb-4">
                    {/* Active Deployments */}
                    <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                      <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                        <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Active Deployments</h3>
                        <button onClick={() => handleTabChange("fleet")} className="text-[11px] font-bold text-blue-500 hover:underline">Manage Fleet</button>
                      </div>
                      <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                        {FLEET.filter(v => v.status === "active").map((v, i) => (
                          <div key={i} className={`flex items-center gap-4 px-4 py-3 transition-all hover:shadow-sm ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                            <div className={`p-2.5 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                              <Truck size={18} className={D ? "text-zinc-400" : "text-slate-500"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{v.driver}</p>
                              <p className={`text-[11px] font-semibold truncate mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{v.plate} · {v.route}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1.5 justify-end mb-1.5">
                                <div className={`w-16 h-1.5 rounded-full overflow-hidden ${D ? "bg-white/10" : "bg-slate-200"}`}>
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: v.load }} />
                                </div>
                                <span className={`text-[10px] font-black ${D ? "text-zinc-500" : "text-slate-500"}`}>{v.load}</span>
                              </div>
                              <span className="text-[9px] font-black bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase">{v.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fleet Insights */}
                    <div className="rounded-2xl bg-gradient-to-b from-blue-600 to-blue-800 p-6 text-white relative overflow-hidden flex flex-col">
                      <Zap size={28} className="mb-4 opacity-60" />
                      <h3 className="text-lg font-black mb-2">Fleet Insights</h3>
                      <p className="text-sm opacity-80 mb-6 leading-relaxed flex-1">System performance is 12% higher than last week. Maintenance window opens in 3 days.</p>
                      <div className={`p-4 rounded-xl mb-4 ${D ? "bg-white/10" : "bg-white/20"}`}>
                        <p className="text-xs opacity-70 uppercase font-bold mb-0.5">Avg. Capacity</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black">94%</span>
                          <ArrowUpRight size={16} className="text-green-300" />
                        </div>
                      </div>
                      <button className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                        Download Manifest
                      </button>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FLEET HUB */}
              {activeView === "fleet" && (
                <motion.div key="fl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                    <div>
                      <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Fleet Repository</h2>
                      <p className={`text-xs font-semibold mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>5 Vehicles · 3 Operational</p>
                    </div>
                    <div className="flex gap-2">
                      <button className={`p-2.5 rounded-xl border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                        <Filter size={16} />
                      </button>
                      <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all">
                        + Add Vehicle
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {FLEET.map((v, i) => (
                      <div key={i} className={`rounded-2xl border p-4 transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                            <Truck size={20} className={D ? "text-zinc-400" : "text-slate-500"} />
                          </div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                            v.status === "active"      ? "bg-green-500/10 text-green-600" :
                            v.status === "idle"        ? "bg-slate-500/10 text-slate-500" :
                                                         "bg-red-500/10 text-red-500"
                          }`}>{v.status}</span>
                        </div>
                        <h4 className={`text-base font-black ${D ? "text-white" : "text-slate-900"}`}>{v.plate}</h4>
                        <p className={`text-xs font-semibold mb-4 mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>{v.type} · {v.driver}</p>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                            <span className={D ? "text-zinc-600" : "text-slate-400"}>Cargo Load</span>
                            <span className={D ? "text-zinc-400" : "text-slate-600"}>{v.load}</span>
                          </div>
                          <div className={`h-1.5 rounded-full overflow-hidden ${D ? "bg-white/10" : "bg-slate-100"}`}>
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: v.load }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SHIPMENTS */}
              {activeView === "orders" && (
                <motion.div key="ord" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Shipments</h2>
                  <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-100"}`}>
                      <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Orders</h3>
                    </div>
                    <div className={`divide-y ${D ? "bg-[#0e0e0e] divide-white/5" : "bg-white divide-slate-100"}`}>
                      {[
                        { id: "ORD-5521", client: "Dangote Group",  pickup: "Apapa Port",  dropoff: "Kano Depot",   value: "₦480k", status: "in-transit", driver: "Tunde A." },
                        { id: "ORD-5520", client: "Shoprite NG",    pickup: "Ikeja Mall",  dropoff: "Lekki Store",  value: "₦62k",  status: "completed",  driver: "Emeka O." },
                        { id: "ORD-5519", client: "GTBank HQ",      pickup: "VI",          dropoff: "Abuja",        value: "₦210k", status: "pending",    driver: "—" },
                      ].map((order, i) => (
                        <div key={i} className={`flex items-center gap-4 px-4 py-3 transition-all ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                          <div className={`p-2.5 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                            <Package size={16} className={D ? "text-zinc-400" : "text-slate-500"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{order.id} · {order.client}</p>
                            <p className={`text-[11px] font-semibold mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{order.pickup} → {order.dropoff}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-sm font-black ${D ? "text-zinc-200" : "text-slate-800"}`}>{order.value}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              order.status === "completed"  ? "bg-green-500/10 text-green-600" :
                              order.status === "in-transit" ? "bg-blue-500/10 text-blue-500"  :
                                                              "bg-amber-500/10 text-amber-600"
                            }`}>{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PERSONNEL */}
              {activeView === "drivers" && (
                <motion.div key="drv" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className={`text-xl font-black mb-4 ${D ? "text-white" : "text-slate-900"}`}>Personnel</h2>
                  <div className={`rounded-2xl p-12 border flex flex-col items-center justify-center text-center ${D ? "bg-[#0e0e0e] border-white/5" : "bg-white border-slate-200"}`}>
                    <Users size={40} className={`mb-3 ${D ? "text-zinc-700" : "text-slate-300"}`} />
                    <p className={`text-sm font-bold ${D ? "text-zinc-500" : "text-slate-400"}`}>Driver management coming soon</p>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS */}
              {activeView === "settings" && (
                <motion.div key="st" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 max-w-2xl">
                  <h2 className={`text-xl font-black ${D ? "text-white" : "text-slate-900"}`}>Settings</h2>
                  {[
                    { label: "Company Profile",  sub: "Update your company name and details",  icon: Building2,   color: "blue-500"   },
                    { label: "Billing",          sub: "Payment cycle: 28th of every month",    icon: TrendingUp,  color: "green-600"  },
                    { label: "Access Control",   sub: "Manage team permission levels",          icon: ShieldCheck, color: "violet-500" },
                  ].map((item, i) => (
                    <button key={i} className={`w-full p-5 border rounded-2xl flex items-center gap-4 transition-all text-left group hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                      <div className={`p-2.5 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
                        <item.icon size={18} className={`text-${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{item.sub}</p>
                      </div>
                      <ChevronRight size={16} className={D ? "text-zinc-600" : "text-slate-300"} />
                    </button>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className={`lg:hidden border-t flex items-center justify-around px-2 py-2 shrink-0 transition-colors ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          {([
            { id: "overview" as ActiveView,  icon: LayoutGrid, label: "Ops"      },
            { id: "fleet"    as ActiveView,  icon: Truck,      label: "Fleet"    },
            { id: "orders"   as ActiveView,  icon: Package,    label: "Orders"   },
            { id: "drivers"  as ActiveView,  icon: Users,      label: "People"   },
            { id: "settings" as ActiveView,  icon: Settings,   label: "Settings" },
          ] as { id: ActiveView; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string }[]).map((item) => {
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
