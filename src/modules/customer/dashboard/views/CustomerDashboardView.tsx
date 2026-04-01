"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike, Truck, Car, ArrowUpRight, Package, LayoutGrid,
  CreditCard, Bell, Search, Wrench, Menu, X,
  PanelLeftClose, PanelLeftOpen, ChevronRight, Sun, Moon,
} from "lucide-react";
import Link from "next/link";
import Sidebar, { type SidebarTabId } from "@/src/modules/customer/shared/Sidebar";
import { useAuthStore } from "@/src/application/store/authStore";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

// ── Inline tab panels ─────────────────────────────────────────────────────────
import WalletPanel        from "@/src/modules/customer/dashboard/panels/WalletPanel";
import SavedPlacesPanel   from "@/src/modules/customer/dashboard/panels/SavedPlacesPanel";
import NotificationsPanel from "@/src/modules/customer/dashboard/panels/NotificationsPanel";
import SupportPanel       from "@/src/modules/customer/dashboard/panels/SupportPanel";
import SettingsPanel      from "@/src/modules/customer/dashboard/panels/SettingsPanel";

// ── Inline versions of History and Profile ────────────────────────────────────
import HistoryView  from "@/src/modules/customer/history/views/HistoryView";
import ProfileView  from "@/src/modules/customer/profile/views/ProfileView";

// ── Mock data ─────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "dispatch", label: "Dispatch", icon: Bike,   desc: "Lightweight delivery",  color: "text-orange-500", bg: "bg-orange-50",   bgDark: "bg-orange-500/10", border: "border-orange-100", borderDark: "border-orange-500/20", route: "/customer/book?type=dispatch" },
  { id: "ride",     label: "Ride",     icon: Car,    desc: "Passenger transport",   color: "text-blue-500",   bg: "bg-blue-50",     bgDark: "bg-blue-500/10",   border: "border-blue-100",   borderDark: "border-blue-500/20",   route: "/customer/book?type=ride" },
  { id: "haulage",  label: "Haulage",  icon: Truck,  desc: "Heavy logistics",       color: "text-violet-500", bg: "bg-violet-50",   bgDark: "bg-violet-500/10", border: "border-violet-100", borderDark: "border-violet-500/20", route: "/customer/book?type=haulage" },
  { id: "tow",      label: "Towing",   icon: Wrench, desc: "Vehicle recovery",      color: "text-rose-500",   bg: "bg-rose-50",     bgDark: "bg-rose-500/10",   border: "border-rose-100",   borderDark: "border-rose-500/20",   route: "/customer/book?type=tow" },
];

const TRANSACTIONS = [
  { id: "TRX-8821", entity: "Logistics Hub A", date: "Just now",   amount: "-₦3,500",  status: "processing" },
  { id: "TRX-8820", entity: "Wallet Top-up",   date: "2 hrs ago",  amount: "+₦50,000", status: "completed" },
  { id: "TRX-8819", entity: "Ride to Airport", date: "Yesterday",  amount: "-₦8,200",  status: "completed" },
];

const ACTIVE_ORDERS = [
  { id: "ORD-9921", route: "Ikeja → Lekki", eta: "15 mins" },
  { id: "ORD-9920", route: "Yaba → VI",     eta: "45 mins" },
];

const SYSTEM_STATUS = [
  { label: "Dispatch Engine",  ok: true  },
  { label: "Payment Gateway",  ok: true  },
  { label: "GPS Telemetry",    ok: false },
  { label: "Hub Sync",         ok: true  },
];

// ── Tab titles ────────────────────────────────────────────────────────────────

const TAB_TITLES: Record<SidebarTabId, string> = {
  home:          "Dashboard",
  book:          "Book a Ride",
  trips:         "Request History",
  wallet:        "Wallet",
  saved:         "Saved Places",
  notifications: "Notifications",
  support:       "Support",
  settings:      "Settings",
};

// ── Root export wraps with ThemeProvider ──────────────────────────────────────

export default function CustomerDashboardView() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  );
}

// ── Inner component (has access to useTheme) ──────────────────────────────────

function DashboardInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isDark: D, toggleTheme } = useTheme();

  const [activeTab,        setActiveTab]     = useState<SidebarTabId>("home");
  const [isSidebarOpen,    setSidebarOpen]   = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstName = (user?.name ?? "there").split(" ")[0];

  // Tabs that navigate away (book uses router.push)
  const handleTabChange = (id: SidebarTabId) => {
    if (id === "book") { router.push("/customer/book"); return; }
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-200 ${D ? "bg-[#080808] text-zinc-100" : "bg-slate-50 text-slate-800"}`}>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        ${isSidebarOpen ? "lg:w-64" : "lg:w-[72px]"}
        shadow-xl lg:shadow-none
      `}>
        {/* Mobile close row */}
        <div className={`lg:hidden flex items-center justify-end px-4 py-3 border-b ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>
          <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-lg ${D ? "text-zinc-500 hover:text-zinc-200" : "text-slate-400 hover:text-slate-700"}`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Desktop collapse toggle */}
        <div className={`hidden lg:flex border-t p-3 justify-end ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className={`h-14 lg:h-16 border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0 transition-colors duration-200 ${
          D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className={`lg:hidden p-2 rounded-lg transition-colors ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              <Menu size={20} />
            </button>

            {/* Page title on mobile */}
            <span className={`lg:hidden text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>
              {TAB_TITLES[activeTab]}
            </span>

            {/* Search on desktop */}
            <div className={`relative w-full max-w-xs group hidden lg:block`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500 ${D ? "text-zinc-600" : "text-slate-400"}`} size={15} />
              <input
                placeholder="Search orders, transactions…"
                className={`w-full rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all ${
                  D
                    ? "bg-white/5 border border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
                    : "bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3">
            {/* Theme toggle — visible in header on mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${D ? "text-amber-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {D ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className={`p-2 rounded-lg transition-all relative ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div className={`hidden sm:block h-5 w-px mx-1 ${D ? "bg-white/10" : "bg-slate-200"}`} />

            <Link
              href="/customer/book"
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <LayoutGrid size={12} /> New Request
            </Link>
            <Link href="/customer/book" className="sm:hidden p-2 bg-blue-600 text-white rounded-xl">
              <LayoutGrid size={18} />
            </Link>
          </div>
        </header>

        {/* ── Tab content ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* HOME */}
          {activeTab === "home" && (
            <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5 lg:py-6 space-y-6">
              <div>
                <h1 className={`text-xl lg:text-2xl font-black ${D ? "text-white" : "text-slate-900"}`}>
                  Good {getGreeting()}, {firstName} 👋
                </h1>
                <p className={`text-sm mt-0.5 ${D ? "text-zinc-500" : "text-slate-500"}`}>Here&apos;s what&apos;s happening with your logistics today.</p>
              </div>

              {/* Stats */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                {/* Balance */}
                <div className={`rounded-2xl p-5 flex flex-col justify-between border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                      <CreditCard size={16} className={D ? "text-zinc-400" : "text-slate-500"} />
                    </div>
                    <button
                      onClick={() => handleTabChange("wallet")}
                      className={`text-xs font-semibold transition-colors ${D ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-700"}`}
                    >
                      Manage
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>Wallet Balance</p>
                    <div className="flex items-baseline gap-1">
                      <h2 className={`text-2xl lg:text-3xl font-black tracking-tight ${D ? "text-white" : "text-slate-900"}`}>₦21,850</h2>
                      <span className={`text-sm ${D ? "text-zinc-600" : "text-slate-400"}`}>.00</span>
                    </div>
                  </div>
                </div>

                {/* Active orders */}
                <div className={`rounded-2xl p-5 flex flex-col justify-between border transition-all hover:shadow-sm ${D ? "bg-[#0e0e0e] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-100"}`}>
                      <Package size={16} className={D ? "text-zinc-400" : "text-slate-500"} />
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  </div>
                  <div className="mt-4">
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${D ? "text-zinc-600" : "text-slate-400"}`}>Active Orders</p>
                    <div className="space-y-1.5">
                      {ACTIVE_ORDERS.map((o) => (
                        <div key={o.id} className="flex items-center justify-between text-xs">
                          <span className={`truncate max-w-[130px] font-medium ${D ? "text-zinc-300" : "text-slate-600"}`}>{o.route}</span>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold whitespace-nowrap ml-2">{o.eta}</span>
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
                    <p className="text-blue-100 text-xs leading-relaxed mb-4 max-w-[180px]">Dedicated support and reduced wait times.</p>
                    <button className="bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl transition-all">View Plans</button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                </div>
              </section>

              {/* Quick launch */}
              <section>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${D ? "text-zinc-600" : "text-slate-500"}`}>Quick Launch</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => router.push(s.route)}
                      className={`group rounded-2xl p-4 border transition-all text-left hover:shadow-md ${
                        D
                          ? `bg-[#0e0e0e] ${s.borderDark} hover:border-white/20`
                          : `bg-white ${s.border} hover:border-slate-300`
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl ${D ? s.bgDark : s.bg}`}>
                          <s.icon size={18} className={s.color} />
                        </div>
                        <ArrowUpRight size={15} className={`transition-colors ${D ? "text-zinc-700 group-hover:text-zinc-400" : "text-slate-300 group-hover:text-slate-500"}`} />
                      </div>
                      <h4 className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{s.label}</h4>
                      <p className={`text-[11px] mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{s.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Transactions + Status */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 pb-6">
                <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
                  <div className={`px-5 py-4 border-b flex items-center justify-between ${D ? "border-white/5" : "border-slate-100"}`}>
                    <h3 className={`text-sm font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>Recent Transactions</h3>
                    <button onClick={() => handleTabChange("wallet")} className={`text-xs font-semibold flex items-center gap-1 ${D ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-700"}`}>
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className={`divide-y ${D ? "divide-white/5" : "divide-slate-100"}`}>
                    {TRANSACTIONS.map((trx) => (
                      <div key={trx.id} className={`px-5 py-4 flex items-center justify-between transition-colors ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 ${
                            trx.status === "processing"
                              ? D ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200"
                              : D ? "bg-white/5 border-white/10"          : "bg-slate-100 border-slate-200"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${trx.status === "processing" ? "bg-amber-500 animate-pulse" : D ? "bg-zinc-600" : "bg-slate-400"}`} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{trx.entity}</p>
                            <p className={`text-[11px] ${D ? "text-zinc-600" : "text-slate-400"}`}>{trx.date} · {trx.id}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold shrink-0 ml-3 ${trx.amount.startsWith("+") ? "text-emerald-500" : D ? "text-zinc-300" : "text-slate-800"}`}>
                          {trx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 ${D ? "border-white/5" : "border-slate-200"}`}>
                  <h3 className={`text-sm font-bold mb-5 ${D ? "text-zinc-300" : "text-slate-700"}`}>System Status</h3>
                  <div className="space-y-4 relative">
                    <div className={`absolute left-[7px] top-2 bottom-2 w-px ${D ? "bg-white/5" : "bg-slate-100"}`} />
                    {SYSTEM_STATUS.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 relative z-10">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 shadow-sm shrink-0 ${
                          item.ok
                            ? D ? "bg-emerald-500 border-[#0e0e0e]" : "bg-emerald-500 border-white"
                            : D ? "bg-amber-400 border-[#0e0e0e]"  : "bg-amber-400 border-white"
                        }`} />
                        <div className="flex-1 flex justify-between items-center min-w-0">
                          <span className={`text-xs truncate ${D ? "text-zinc-400" : "text-slate-600"}`}>{item.label}</span>
                          <span className={`text-[10px] font-bold uppercase ml-2 shrink-0 ${item.ok ? "text-emerald-500" : "text-amber-500"}`}>
                            {item.ok ? "OK" : "Degraded"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TRIPS */}
          {activeTab === "trips" && (
            <div className="h-full">
              <HistoryView isDark={D} embedded />
            </div>
          )}

          {/* WALLET */}
          {activeTab === "wallet" && (
            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-5 lg:py-6 pb-8">
              <h1 className={`text-xl font-black mb-5 ${D ? "text-white" : "text-slate-900"}`}>Wallet</h1>
              <WalletPanel isDark={D} />
            </div>
          )}

          {/* SAVED PLACES */}
          {activeTab === "saved" && (
            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-5 lg:py-6 pb-8">
              <h1 className={`text-xl font-black mb-5 ${D ? "text-white" : "text-slate-900"}`}>Saved Places</h1>
              <SavedPlacesPanel isDark={D} />
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-5 lg:py-6 pb-8">
              <h1 className={`text-xl font-black mb-5 ${D ? "text-white" : "text-slate-900"}`}>Notifications</h1>
              <NotificationsPanel isDark={D} />
            </div>
          )}

          {/* SUPPORT */}
          {activeTab === "support" && (
            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-5 lg:py-6 pb-8">
              <h1 className={`text-xl font-black mb-5 ${D ? "text-white" : "text-slate-900"}`}>Support</h1>
              <SupportPanel isDark={D} />
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-5 lg:py-6 pb-8">
              <h1 className={`text-xl font-black mb-5 ${D ? "text-white" : "text-slate-900"}`}>Settings</h1>
              <SettingsPanel isDark={D} />
            </div>
          )}

          {/* PROFILE — rendered inline when navigated from sidebar */}
          {activeTab === "home" ? null : null /* profile is accessed via /customer/profile */}
        </div>

        {/* Mobile bottom nav */}
        <nav className={`lg:hidden border-t flex items-center justify-around px-2 py-2 shrink-0 transition-colors ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          {([
            { id: "home",          icon: LayoutGrid, label: "Home"    },
            { id: "book",          icon: Car,        label: "Book"    },
            { id: "trips",         icon: Package,    label: "History" },
            { id: "notifications", icon: Bell,       label: "Alerts"  },
            { id: "settings",      icon: CreditCard, label: "More"    },
          ] as { id: SidebarTabId; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string }[]).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "text-blue-500"
                    : D ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"
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
