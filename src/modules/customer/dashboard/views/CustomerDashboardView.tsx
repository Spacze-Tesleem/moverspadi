"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike, Truck, Car, ArrowUpRight, Package, LayoutGrid,
  CreditCard, Bell, Search, Wrench, Menu, X,
  PanelLeftClose, PanelLeftOpen, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/src/modules/customer/shared/Sidebar";
import { useAuthStore } from "@/src/application/store/authStore";

// ── Mock data ─────────────────────────────────────────────────────────────────

const services = [
  { id: "dispatch", label: "Dispatch",  icon: Bike,  desc: "Lightweight delivery",  color: "text-orange-500", bg: "bg-orange-50",   border: "border-orange-100", route: "/customer/book?type=dispatch" },
  { id: "ride",     label: "Ride",      icon: Car,   desc: "Passenger transport",   color: "text-blue-500",   bg: "bg-blue-50",     border: "border-blue-100",   route: "/customer/book?type=ride" },
  { id: "haulage",  label: "Haulage",   icon: Truck, desc: "Heavy logistics",       color: "text-violet-500", bg: "bg-violet-50",   border: "border-violet-100", route: "/customer/book?type=haulage" },
  { id: "tow",      label: "Towing",    icon: Wrench,desc: "Vehicle recovery",      color: "text-rose-500",   bg: "bg-rose-50",     border: "border-rose-100",   route: "/customer/book?type=tow" },
];

const transactions = [
  { id: "TRX-8821", entity: "Logistics Hub A", date: "Just now",   amount: "-₦3,500",  status: "processing" },
  { id: "TRX-8820", entity: "Wallet Top-up",   date: "2 hrs ago",  amount: "+₦50,000", status: "completed" },
  { id: "TRX-8819", entity: "Ride to Airport", date: "Yesterday",  amount: "-₦8,200",  status: "completed" },
];

const activeOrders = [
  { id: "ORD-9921", route: "Ikeja → Lekki",  type: "Bike",  status: "In Transit", eta: "15 mins" },
  { id: "ORD-9920", route: "Yaba → VI",       type: "Truck", status: "Loading",    eta: "45 mins" },
];

const systemStatus = [
  { label: "Dispatch Engine",  status: "Operational", ok: true },
  { label: "Payment Gateway",  status: "Operational", ok: true },
  { label: "GPS Telemetry",    status: "Degraded",    ok: false },
  { label: "Hub Sync",         status: "Operational", ok: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomerDashboardView() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab,        setActiveTab]        = useState("home");
  const [isSidebarOpen,    setSidebarOpen]       = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen]    = useState(false);

  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isSidebarOpen ? "lg:w-64" : "lg:w-[72px]"}
        `}
      >
        {/* Mobile close button row */}
        <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            activePage={activeTab}
            setActivePage={setActiveTab}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Desktop collapse toggle */}
        <div className="hidden lg:flex bg-white border-t border-slate-100 p-3 justify-end">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 lg:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Search — hidden on very small screens */}
            <div className="relative w-full max-w-xs group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={15} />
              <input
                placeholder="Search orders, transactions…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3">
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:block h-5 w-px bg-slate-200 mx-1" />
            <Link
              href="/customer/book"
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-200"
            >
              <LayoutGrid size={12} />
              New Request
            </Link>
            <Link href="/customer/book" className="sm:hidden p-2 bg-blue-600 text-white rounded-xl">
              <LayoutGrid size={18} />
            </Link>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5 lg:py-6 space-y-6">

            {/* Welcome */}
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900">
                Good {getGreeting()}, {firstName} 👋
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your logistics today.</p>
            </div>

            {/* ── Stats row ──────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">

              {/* Balance */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <CreditCard size={16} className="text-slate-500" />
                  </div>
                  <button className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-colors">Manage</button>
                </div>
                <div className="mt-4">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Wallet Balance</p>
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">₦21,850</h2>
                    <span className="text-sm text-slate-400">.00</span>
                  </div>
                </div>
              </div>

              {/* Active orders */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Package size={16} className="text-slate-500" />
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                </div>
                <div className="mt-4">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Orders</p>
                  <div className="space-y-1.5">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 truncate max-w-[130px] font-medium">{order.route}</span>
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold whitespace-nowrap ml-2">
                          {order.eta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Upgrade</p>
                  <h3 className="font-black text-lg leading-tight mb-2">Priority Fleet</h3>
                  <p className="text-blue-100 text-xs leading-relaxed mb-4 max-w-[180px]">
                    Dedicated support and reduced wait times with Enterprise.
                  </p>
                  <button className="bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl transition-all">
                    View Plans
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
              </div>
            </section>

            {/* ── Quick launch ───────────────────────────────────────────── */}
            <section>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Launch</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(s.route)}
                    className={`group bg-white border ${s.border} rounded-2xl p-4 hover:shadow-md hover:border-slate-300 cursor-pointer transition-all text-left`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2.5 rounded-xl ${s.bg}`}>
                        <s.icon size={18} className={s.color} />
                      </div>
                      <ArrowUpRight size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{s.label}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Transactions + Status ───────────────────────────────────── */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 pb-6">

              {/* Transactions */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Recent Transactions</h3>
                  <Link href="/customer/history" className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1">
                    View all <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {transactions.map((trx) => (
                    <div key={trx.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 ${
                          trx.status === "processing"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-slate-100 border-slate-200"
                        }`}>
                          {trx.status === "processing"
                            ? <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{trx.entity}</p>
                          <p className="text-[11px] text-slate-400">{trx.date} · {trx.id}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ml-3 ${
                        trx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-800"
                      }`}>
                        {trx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System status */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-5">System Status</h3>
                <div className="space-y-4 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-100" />
                  {systemStatus.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 relative z-10">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm shrink-0 ${
                        item.ok ? "bg-emerald-500" : "bg-amber-400"
                      }`} />
                      <div className="flex-1 flex justify-between items-center min-w-0">
                        <span className="text-xs text-slate-600 truncate">{item.label}</span>
                        <span className={`text-[10px] font-bold uppercase ml-2 shrink-0 ${
                          item.ok ? "text-emerald-600" : "text-amber-500"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          </div>
        </div>

        {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
        <nav className="lg:hidden border-t border-slate-200 bg-white flex items-center justify-around px-2 py-2 shrink-0">
          {[
            { id: "home",  icon: LayoutGrid, label: "Home",    route: "/customer" },
            { id: "book",  icon: Car,        label: "Book",    route: "/customer/book" },
            { id: "trips", icon: Package,    label: "History", route: "/customer/history" },
            { id: "profile", icon: CreditCard, label: "Profile", route: "/customer/profile" },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); router.push(item.route); }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
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
