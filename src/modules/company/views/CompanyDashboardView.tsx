"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Truck, Users, DollarSign, Bell, Settings,
  LogOut, Menu, X, ChevronRight, TrendingUp, TrendingDown,
  Package, MapPin, Clock, CheckCircle2, Building2, ShieldCheck, Phone, Star
} from "lucide-react";

const FLEET = [
  { id: "VH-001", driver: "Emeka Obi", plate: "LND-421-AA", type: "Van", status: "active", route: "Ikeja → Lekki", load: "82%" },
  { id: "VH-002", driver: "Tunde Adeyemi", plate: "LND-882-BB", type: "Truck", status: "active", route: "Apapa → Ajah", load: "65%" },
  { id: "VH-003", driver: "Chidi Nwosu", plate: "LND-119-CC", type: "Bike", status: "idle", route: "—", load: "0%" },
  { id: "VH-004", driver: "Fatima Bello", plate: "LND-774-DD", type: "Van", status: "maintenance", route: "—", load: "0%" },
  { id: "VH-005", driver: "Seun Alade", plate: "LND-553-EE", type: "Truck", status: "active", route: "VI → Surulere", load: "91%" },
];

const ORDERS = [
  { id: "ORD-5521", client: "Dangote Group", pickup: "Apapa Port", dropoff: "Kano Depot", value: "₦480,000", status: "in-transit", driver: "Tunde A." },
  { id: "ORD-5520", client: "Shoprite NG", pickup: "Ikeja Mall", dropoff: "Lekki Store", value: "₦62,000", status: "completed", driver: "Emeka O." },
  { id: "ORD-5519", client: "GTBank HQ", pickup: "Victoria Island", dropoff: "Abuja Branch", value: "₦210,000", status: "pending", driver: "—" },
  { id: "ORD-5518", client: "Jumia NG", pickup: "Yaba Hub", dropoff: "Surulere", value: "₦18,500", status: "completed", driver: "Seun A." },
];

const STATS = [
  { label: "Revenue (Month)", value: "₦4.2M", change: "+18%", up: true, icon: DollarSign },
  { label: "Active Vehicles", value: "3 / 5", change: "60% fleet", up: true, icon: Truck },
  { label: "Orders (Month)", value: "142", change: "+9 this week", up: true, icon: Package },
  { label: "Avg. Rating", value: "4.7★", change: "-0.1 vs last mo.", up: false, icon: Star },
];

type ActiveView = "overview" | "fleet" | "orders" | "drivers" | "settings";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  idle: "bg-slate-100 text-slate-500 border-slate-200",
  maintenance: "bg-amber-50 text-amber-600 border-amber-200",
  "in-transit": "bg-blue-50 text-blue-600 border-blue-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function CompanyDashboardView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/auth/login"); };

  const navItems: { id: ActiveView; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "fleet", label: "Fleet", icon: Truck },
    { id: "orders", label: "Orders", icon: Package },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 tracking-tight">Movers<span className="text-blue-600">Padi</span></span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400"><X size={18} /></button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeView === item.id ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <item.icon size={17} />{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Company"}</p>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Account</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50">
            <LogOut size={14} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={18} /></button>
            <div>
              <p className="text-xs text-slate-400 font-medium">Company Portal</p>
              <h1 className="text-sm font-bold text-slate-900">{user?.name || "Company Dashboard"}</h1>
            </div>
          </div>
          <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <AnimatePresence mode="wait">

              {activeView === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Operations Overview</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Real-time fleet and logistics summary</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map((s) => (
                      <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 bg-slate-50 rounded-lg"><s.icon className="w-4 h-4 text-slate-500" /></div>
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
                            {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {s.change}
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{s.value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Fleet Status</h3>
                      <button onClick={() => setActiveView("fleet")} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {FLEET.slice(0, 3).map((v) => (
                        <div key={v.id} className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{v.driver}</p>
                            <p className="text-xs text-slate-400">{v.plate} · {v.type}</p>
                          </div>
                          <p className="text-xs text-slate-500 hidden sm:block">{v.route}</p>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Recent Orders</h3>
                      <button onClick={() => setActiveView("orders")} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {ORDERS.slice(0, 3).map((o) => (
                        <div key={o.id} className="px-6 py-4 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{o.client}</p>
                            <p className="text-xs text-slate-400">{o.id} · {o.pickup} → {o.dropoff}</p>
                          </div>
                          <p className="text-sm font-black text-slate-900 hidden sm:block">{o.value}</p>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "fleet" && (
                <motion.div key="fleet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Fleet Management</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">+ Add Vehicle</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Active", count: FLEET.filter(v => v.status === "active").length, cls: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                      { label: "Idle", count: FLEET.filter(v => v.status === "idle").length, cls: "text-slate-600 bg-slate-50 border-slate-100" },
                      { label: "Maintenance", count: FLEET.filter(v => v.status === "maintenance").length, cls: "text-amber-600 bg-amber-50 border-amber-100" },
                    ].map((s) => (
                      <div key={s.label} className={`rounded-xl p-3 text-center border ${s.cls}`}>
                        <p className="text-2xl font-black">{s.count}</p>
                        <p className="text-xs font-bold">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-50">
                      {FLEET.map((v) => (
                        <div key={v.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{v.driver}</p>
                            <p className="text-xs text-slate-400">{v.plate} · {v.type}</p>
                          </div>
                          <div className="hidden md:block text-right">
                            <p className="text-xs text-slate-500">{v.route}</p>
                            <p className="text-xs text-slate-400">Load: {v.load}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Orders</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">+ New Order</button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-50">
                      {ORDERS.map((o) => (
                        <div key={o.id} className="px-6 py-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${STATUS_STYLES[o.status]}`}>
                            {o.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : o.status === "in-transit" ? <MapPin className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-slate-900">{o.client}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{o.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{o.pickup} → {o.dropoff}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Driver: {o.driver}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-slate-900">{o.value}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-1 inline-block ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "drivers" && (
                <motion.div key="drivers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Drivers</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">+ Add Driver</button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-50">
                      {FLEET.map((v) => (
                        <div key={v.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-black text-blue-600 text-sm">
                            {v.driver.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{v.driver}</p>
                            <p className="text-xs text-slate-400">{v.plate} · {v.type}</p>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Phone className="w-4 h-4" /></button>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black text-slate-900">Company Settings</h2>
                  {[
                    { label: "Company Profile", sub: "Business name, address, and contact info", icon: Building2 },
                    { label: "Billing & Invoices", sub: "Payment methods and invoice history", icon: DollarSign },
                    { label: "Team Access", sub: "Manage admin and operator accounts", icon: Users },
                    { label: "Notifications", sub: "Alert preferences for fleet events", icon: Bell },
                    { label: "Security", sub: "Password, 2FA, and access logs", icon: ShieldCheck },
                  ].map((item) => (
                    <button key={item.label} className="w-full bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-200 hover:shadow-sm transition-all text-left shadow-sm">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
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
