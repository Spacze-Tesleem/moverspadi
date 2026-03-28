"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bike, Truck, Car, ArrowUpRight, Package, LayoutGrid,
  CreditCard, Bell, Settings, Search, ChevronDown,
  Users, Wrench, Menu, X, PanelLeftClose, PanelLeftOpen,
  LogOut
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/src/modules/customer/shared/Sidebar";

// --- MOCK DATA ---
const navItems = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "orders", label: "Orders", icon: Package },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const services = [
  { id: "dispatch", label: "Dispatch", icon: Bike, desc: "Lightweight delivery", color: "text-orange-400", bg: "bg-orange-500/10", route: "/customer/book?type=dispatch" },
  { id: "ride", label: "Ride", icon: Car, desc: "Passenger transport", color: "text-blue-400", bg: "bg-blue-500/10", route: "/customer/book?type=ride" },
  { id: "haulage", label: "Haulage", icon: Truck, desc: "Heavy logistics", color: "text-purple-400", bg: "bg-purple-500/10", route: "/customer/book?type=haulage" },
  { id: "tow", label: "Towing", icon: Wrench, desc: "Vehicle recovery", color: "text-pink-400", bg: "bg-pink-500/10", route: "/customer/book?type=tow" },
];

const transactions = [
  { id: "TRX-8821", entity: "Logistics Hub A", date: "Just now", amount: "-₦3,500", status: "processing" },
  { id: "TRX-8820", entity: "Wallet Top-up", date: "2 hrs ago", amount: "+₦50,000", status: "completed" },
  { id: "TRX-8819", entity: "Ride to Airport", date: "Yesterday", amount: "-₦8,200", status: "completed" },
];

const activeOrders = [
  { id: "ORD-9921", route: "Ikeja → Lekki", type: "Bike", status: "In Transit", eta: "15 mins" },
  { id: "ORD-9920", route: "Yaba → VI", type: "Truck", status: "Loading", eta: "45 mins" },
];

export default function CustomerDashboardView() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on resize if screen gets big
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("https://api.yourapp.com/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, []);

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-100 font-sans selection:bg-violet-500/30 overflow-hidden">
      
      {/* --- MOBILE OVERLAY BACKDROP --- */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isSidebarOpen ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {/* <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
              <span className="font-bold text-white text-lg">M</span>
            </div>
            <span className={`font-bold text-sm tracking-tight whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0 lg:hidden"}`}>
              Movers<span className="text-green-500">padi</span>
            </span>
          </div> */}
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-zinc-500">
            <X size={20} />
          </button>
        </div>

        <Sidebar isSidebarOpen={isSidebarOpen} activePage={activeTab} setActivePage={setActiveTab} />

        {/* Navigation */}
        {/* <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive ? "bg-white/5 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0 lg:hidden"}`}>
                  {item.label}
                </span>
                
                {isActive && !isSidebarOpen && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                )}
                
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                )}
              </button>
            );
          })}
        </nav> */}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex p-4 border-t border-white/5 justify-end">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-zinc-600 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 shrink-0" />
            <div className={`overflow-hidden transition-all duration-200 ${!isSidebarOpen && "lg:w-0 lg:opacity-0"}`}>
              <p className="text-xs font-medium text-white truncate">{user?.fullName || "Loading..."}</p>
              <p className="text-[10px] text-zinc-500 truncate">Enterprise</p>
            </div>
            <ChevronDown size={14} className={`text-zinc-600 ml-auto shrink-0 transition-all duration-200 ${!isSidebarOpen && "lg:hidden"}`} />
          </div>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#080808]">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-30">
          
          <div className="flex items-center gap-4 flex-1">
             {/* Mobile Hamburger */}
             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
               <Menu size={20} />
             </button>

             {/* Search Bar */}
             <div className="relative w-full max-w-md group hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors" size={16} />
               <input 
                 placeholder="Search orders, transactions..." 
                 className="w-full bg-zinc-900/50 border border-white/5 rounded-lg pl-10 pr-12 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                 <span className="text-[10px] text-zinc-600 border border-white/5 px-1.5 py-0.5 rounded">⌘</span>
                 <span className="text-[10px] text-zinc-600 border border-white/5 px-1.5 py-0.5 rounded">K</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="h-6 w-px bg-white/10 mx-1" />
            <Link href="/customer/book" className="hidden sm:flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-bold transition-all">
              <div className="bg-black/10 p-0.5 rounded-full"><LayoutGrid size={10} /></div>
              New Request
            </Link>
            {/* Mobile Only New Request Icon */}
            <Link href="/customer/book" className="sm:hidden p-2 bg-white text-black rounded-lg">
              <LayoutGrid size={18} />
            </Link>
          </div>
        </header>

        {/* DASHBOARD CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* BENTO GRID HERO */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              
              {/* Card 1: Balance */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                    <CreditCard size={18} className="text-zinc-400" />
                  </div>
                  <button className="text-xs text-zinc-500 hover:text-white transition-colors">Manage</button>
                </div>
                <div className="mt-4">
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Total Balance</p>
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-3xl font-semibold text-white tracking-tight">₦21,850</h2>
                    <span className="text-sm text-zinc-600">.00</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Active Orders */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                    <Package size={18} className="text-zinc-400" />
                  </div>
                   <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="mt-4">
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Active Operations</p>
                  <div className="space-y-2">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 truncate max-w-[120px]">{order.route}</span>
                        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">{order.eta}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Promo / Upsell */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-center items-start border border-white/10">
                 <div className="relative z-10">
                   <h3 className="font-semibold text-lg mb-1">Priority Fleet</h3>
                   <p className="text-indigo-100 text-xs mb-4 max-w-[200px] leading-relaxed">Upgrade to Enterprise tier for reduced latency and dedicated support.</p>
                   <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium px-4 py-2 rounded-lg transition-all">
                     View Plans
                   </button>
                 </div>
                 <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              </div>

            </section>

            {/* SERVICES GRID */}
            <section>
              <h3 className="text-sm font-medium text-zinc-400 mb-4 px-1">Quick Launch</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {services.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => router.push(s.route)}
                    className="group bg-[#0e0e0e] border border-white/5 p-4 rounded-xl hover:border-white/10 cursor-pointer transition-all hover:bg-zinc-900"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-lg ${s.bg}`}>
                        <s.icon size={18} className={s.color} />
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white">{s.label}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SPLIT VIEW: TRANSACTIONS & STATUS */}
            <section className="grid lg:grid-cols-3 gap-6">
              
              {/* Recent Transactions */}
              <div className="lg:col-span-2 bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-300">Recent Transactions</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {transactions.map((trx) => (
                    <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${trx.status === 'processing' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-zinc-800 border-zinc-700'}`}>
                          {trx.status === 'processing' ? <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-zinc-500" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{trx.entity}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{trx.date} • {trx.id}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${trx.amount.startsWith("+") ? "text-emerald-400" : "text-white"}`}>
                        {trx.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5 text-center">
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full py-1">View All</button>
                </div>
              </div>

              {/* Mini Status */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6 h-fit">
                 <h3 className="text-sm font-medium text-zinc-300 mb-6">System Status</h3>
                 <div className="space-y-6 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-zinc-800" />
                    {[
                      { label: "Dispatch Engine", status: "Operational", color: "bg-emerald-500" },
                      { label: "Payment Gateway", status: "Operational", color: "bg-emerald-500" },
                      { label: "GPS Telemetry", status: "Degraded", color: "bg-amber-500" },
                      { label: "Hub Sync", status: "Operational", color: "bg-emerald-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 relative z-10">
                        <div className={`w-4 h-4 rounded-full border-2 border-[#0e0e0e] shrink-0 ${item.color}`} />
                        <div className="flex-1 flex justify-between">
                          <span className="text-xs text-zinc-400">{item.label}</span>
                          <span className={`text-[10px] uppercase font-bold ${item.status === 'Degraded' ? 'text-amber-500' : 'text-emerald-500'}`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

            </section>

          </div>
        </div>
      </main>
    </div>
  );
}