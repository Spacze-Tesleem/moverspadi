"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Truck, Users, DollarSign, Bell, Settings,
  LogOut, Menu, X, ChevronRight, TrendingUp, TrendingDown,
  Package, MapPin, Clock, CheckCircle2, Building2, ShieldCheck, 
  Phone, Star, Activity, ArrowUpRight, Search, Sun, Moon, 
  Filter, MoreHorizontal, Zap
} from "lucide-react";
import PendingApprovalView from "@/src/modules/auth/views/PendingApprovalView";

// ── Mock Data ─────────────────────────────────────────────
const FLEET = [
  { id: "VH-001", driver: "Emeka Obi", plate: "LND-421-AA", type: "Van", status: "active", route: "Ikeja → Lekki", load: "82%", color: "emerald" },
  { id: "VH-002", driver: "Tunde Adeyemi", plate: "LND-882-BB", type: "Truck", status: "active", route: "Apapa → Ajah", load: "65%", color: "emerald" },
  { id: "VH-003", driver: "Chidi Nwosu", plate: "LND-119-CC", type: "Bike", status: "idle", route: "—", load: "0%", color: "slate" },
  { id: "VH-004", driver: "Fatima Bello", plate: "LND-774-DD", type: "Van", status: "maintenance", route: "—", load: "0%", color: "rose" },
  { id: "VH-005", driver: "Seun Alade", plate: "LND-553-EE", type: "Truck", status: "active", route: "VI → Surulere", load: "91%", color: "emerald" },
];

const ORDERS = [
  { id: "ORD-5521", client: "Dangote Group", pickup: "Apapa Port", dropoff: "Kano Depot", value: "₦480k", status: "in-transit", driver: "Tunde A." },
  { id: "ORD-5520", client: "Shoprite NG", pickup: "Ikeja Mall", dropoff: "Lekki Store", value: "₦62k", status: "completed", driver: "Emeka O." },
  { id: "ORD-5519", client: "GTBank HQ", pickup: "VI", dropoff: "Abuja", value: "₦210k", status: "pending", driver: "—" },
];

const STATS = [
  { label: "Revenue (MTD)", value: "₦4.2M", change: "+18%", up: true, icon: DollarSign, color: "emerald" },
  { label: "Fleet Utilization", value: "84%", change: "+5% vs lw", up: true, icon: Truck, color: "cyan" },
  { label: "Order Volume", value: "142", change: "+12", up: true, icon: Package, color: "violet" },
  { label: "Avg. Reliability", value: "4.7★", change: "-0.1", up: false, icon: Star, color: "amber" },
];

type ActiveView = "overview" | "fleet" | "orders" | "drivers" | "settings";

// ── Components ────────────────────────────────────────────

const ThemeToggle = ({ theme, setTheme }: { theme: string, setTheme: (t: "light" | "dark") => void }) => (
  <button 
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm text-slate-500 hover:text-indigo-500 transition-colors"
  >
    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
  </button>
);

export default function CompanyDashboardView() {
  return <PendingApprovalView approvedDashboard={<CompanyDashboardInner />} />;
}

function CompanyDashboardInner() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const navItems = [
    { id: "overview", label: "Operations", icon: LayoutGrid, color: "indigo" },
    { id: "fleet", label: "Fleet Hub", icon: Truck, color: "cyan" },
    { id: "orders", label: "Shipments", icon: Package, color: "emerald" },
    { id: "drivers", label: "Personnel", icon: Users, color: "violet" },
    { id: "settings", label: "Settings", icon: Settings, color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-indigo-500/30">
      
      {/* ── Background Blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="flex h-screen relative z-10 overflow-hidden">
        
        {/* ── Sidebar ── */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 p-6 transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl shadow-indigo-500/5">
            <div className="p-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-black tracking-tighter text-xl">Movers<span className="text-indigo-500">Padi</span></h2>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Enterprise</p>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id as ActiveView); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-sm font-bold relative group ${
                    activeView === item.id 
                      ? "bg-white dark:bg-slate-800 shadow-xl text-indigo-600 dark:text-white" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} className={activeView === item.id ? "text-indigo-500" : "group-hover:scale-110 transition-transform"} />
                  {item.label}
                  {activeView === item.id && (
                    <motion.div layoutId="activePill" className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-6">
              <div className="p-5 rounded-[2rem] bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-xs font-bold mb-1">{user?.name || "Dangote Group"}</p>
                   <button onClick={() => { logout(); router.push("/auth/login"); }} className="flex items-center gap-2 text-[10px] font-black text-rose-400 hover:text-rose-300">
                     <LogOut size={14} /> SIGN OUT
                   </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Canvas ── */}
        <main className="flex-1 flex flex-col min-w-0 lg:p-6 overflow-hidden">
          <header className="h-24 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-white/5"><Menu size={20} /></button>
              <div>
                <h1 className="text-3xl font-black tracking-tighter capitalize">{activeView}</h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Live Operational Node: 12.0.4</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-2.5 backdrop-blur-xl">
                <Search size={16} className="text-slate-400" />
                <input placeholder="Search records..." className="bg-transparent border-none text-xs font-bold w-32 focus:ring-0 outline-none" />
              </div>
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <button className="relative p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5 text-slate-500">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-4 ring-white dark:ring-slate-900" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 pb-12">
            <AnimatePresence mode="wait">

              {/* VIEW: OVERVIEW */}
              {activeView === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {STATS.map((s, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-[2.5rem] bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none relative group overflow-hidden`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-${s.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${s.color}-500/10 text-${s.color}-500`}><s.icon size={22} /></div>
                            <div className={`px-2 py-1 rounded-full text-[10px] font-black ${s.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>{s.change}</div>
                          </div>
                          <h3 className="text-3xl font-black tracking-tighter mb-1">{s.value}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{s.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Fleet Activity */}
                    <div className="lg:col-span-2 p-8 rounded-[3rem] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-sm">
                       <div className="flex items-center justify-between mb-8">
                         <h3 className="font-black text-xl tracking-tight">Active Deployments</h3>
                         <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline" onClick={() => setActiveView("fleet")}>Manage Fleet</button>
                       </div>
                       <div className="space-y-4">
                         {FLEET.slice(0, 3).map((v, i) => (
                           <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-indigo-500/30 transition-all cursor-pointer group">
                             <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                               <Truck size={24} />
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-black">{v.driver}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{v.plate} • {v.route}</p>
                             </div>
                             <div className="text-right">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: v.load }} />
                                 </div>
                                 <span className="text-[10px] font-black">{v.load}</span>
                               </div>
                               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${v.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{v.status}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    {/* Operational Insights */}
                    <div className="p-8 rounded-[3rem] bg-indigo-600 dark:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                      <div className="relative z-10 flex flex-col h-full">
                         <Zap className="mb-6 opacity-60" size={32} />
                         <h3 className="text-2xl font-black tracking-tight mb-2">Fleet Insights</h3>
                         <p className="text-sm opacity-80 mb-8 leading-relaxed">System performance is 12% higher than last week. Maintenance window opens in 3 days.</p>
                         <div className="mt-auto space-y-4">
                            <div className="flex justify-between items-end border-b border-white/20 pb-4">
                              <div><p className="text-2xl font-black">94%</p><p className="text-[10px] font-bold uppercase opacity-60">Avg. Capacity</p></div>
                              <ArrowUpRight className="text-emerald-400" />
                            </div>
                            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:scale-[1.02] transition-transform">Download Manifest</button>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW: FLEET */}
              {activeView === "fleet" && (
                <motion.div key="fl" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Fleet Repository</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-1">5 Vehicles • 3 Operational</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5"><Filter size={18} /></button>
                      <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-500/20">+ Add Vehicle</button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FLEET.map((v, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors"><Truck size={28} /></div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${v.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{v.status}</span>
                        </div>
                        <h4 className="text-lg font-black">{v.plate}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-6 tracking-wide">{v.type} • {v.driver}</p>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase opacity-60"><span>Cargo Load</span><span>{v.load}</span></div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: v.load }} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VIEW: SETTINGS */}
              {activeView === "settings" && (
                <motion.div key="st" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 max-w-2xl">
                   <h2 className="text-2xl font-black tracking-tight mb-6">Enterprise Control</h2>
                   {[
                    { label: "Profile", sub: "Dangote Group Logistics HQ", icon: Building2, color: "indigo" },
                    { label: "Billing", sub: "Payment cycle: 28th of every month", icon: DollarSign, color: "emerald" },
                    { label: "Access Control", sub: "Manage team permission levels", icon: ShieldCheck, color: "violet" },
                   ].map((item, i) => (
                    <button key={i} className="w-full p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] flex items-center gap-4 hover:border-indigo-500/30 hover:shadow-xl transition-all text-left group">
                      <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}><item.icon size={20} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-black">{item.label}</p>
                        <p className="text-xs font-bold text-slate-400">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                   ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[45] lg:hidden" />
      )}
    </div>
  );
}