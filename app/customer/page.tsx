"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bike, Truck, Car, ArrowRight, Package, ShieldCheck, 
  Sparkles, Clock, Star, Search, Bell, User, 
  Wallet, History, FileText, Book, Settings, 
  Plus, LayoutGrid, Menu, MoreHorizontal, ChevronDown,
  Zap, Repeat, Download
} from "lucide-react";

// --- Types & Data ---
const sidebarItems = [
  { id: "wallet", label: "Wallet", icon: Wallet, balance: "21,850", color: "text-emerald-400" },
  { id: "history", label: "Order History", icon: History },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "address", label: "Address Book", icon: Book },
  { id: "settings", label: "Settings", icon: Settings },
];

const services = [
  { id: "dispatch", title: "Bike Dispatch", icon: Bike, color: "text-blue-400", gradient: "from-blue-600/20", route: "/customer/book?service=dispatch" },
  { id: "haulage", title: "Heavy Haulage", icon: Truck, color: "text-amber-400", gradient: "from-amber-600/20", route: "/customer/book?service=haulage" },
  { id: "tow", title: "Tow Assistance", icon: Car, color: "text-rose-400", gradient: "from-rose-600/20", route: "/customer/book?service=tow" },
];

const mockOrders = [
  { code: "ORD-9921", type: "On Demand", stage: "Dispatched", status: "In Transit", created: "Oct 24, 10:15", method: "Bike" },
  { code: "ORD-9920", type: "P_Hub_D", stage: "Sorting", status: "Pending", created: "Oct 24, 09:45", method: "Truck" },
  { code: "ORD-9918", type: "On Demand", stage: "Delivered", status: "Successful", created: "Oct 23, 15:20", method: "Bike" },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMode, setActiveMode] = useState<"demand" | "hub">("demand");

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="h-full bg-[#0d0d0f] border-r border-white/5 flex flex-col relative z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">Moverspadi</span>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-all group relative"
            >
              <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              <div className="flex flex-col items-start text-sm">
                <span className="font-bold text-zinc-400 group-hover:text-white">{item.label}</span>
                {item.balance && (
                  <span className={`text-xs font-black mt-0.5 ${item.color}`}>₦ {item.balance}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>
            
            {/* Toggle Switcher */}
            <div className="p-1 bg-white/5 rounded-xl border border-white/10 flex items-center relative">
              <button 
                onClick={() => setActiveMode("demand")}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest z-10 transition-colors flex items-center gap-2 ${activeMode === 'demand' ? 'text-white' : 'text-zinc-500'}`}
              >
                <Zap className="w-3 h-3" /> On Demand
              </button>
              <button 
                onClick={() => setActiveMode("hub")}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest z-10 transition-colors flex items-center gap-2 ${activeMode === 'hub' ? 'text-white' : 'text-zinc-500'}`}
              >
                <Repeat className="w-3 h-3" /> P_Hub_D
              </button>
              <motion.div 
                animate={{ x: activeMode === 'demand' ? 4 : '100%', left: activeMode === 'demand' ? 0 : -4 }}
                className="absolute h-[80%] w-[48%] bg-white/10 border border-white/20 rounded-lg -z-0 shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-zinc-400 text-xs font-bold hover:text-white transition-colors">
              <Download className="w-4 h-4" /> Import
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" /> New Order
            </motion.button>
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10 ml-2">
              <User className="w-5 h-5 text-zinc-500" />
            </div>
          </div>
        </header>

        {/* MAIN SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          
          {/* QUICK SERVICE CARDS */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Quick Services</h2>
              <div className="h-px flex-1 bg-white/5 mx-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(service.route)}
                  className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[28px] flex items-center gap-5 cursor-pointer hover:bg-zinc-900/60 transition-all duration-300"
                >
                  <div className={`p-4 rounded-2xl bg-zinc-800/50 border border-white/5 ${service.color} group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium">Click to initiate booking</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* DATA TABLE */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Recent Shipments</h2>
              <div className="flex gap-2">
                {["Code", "Stage", "Status"].map(f => (
                  <button key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">
                    + {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Code</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Type</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Stage</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Created At</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {mockOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5 text-sm font-black text-blue-400">{order.code}</td>
                        <td className="px-6 py-5 text-xs font-bold text-zinc-400">{order.type}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-zinc-200">{order.stage}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            order.status === 'Successful' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-xs font-medium text-zinc-500">{order.created}</td>
                        <td className="px-8 py-5 text-right font-bold text-zinc-300 text-sm">{order.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center px-8">
                <span className="text-xs text-zinc-500 font-medium">Viewing 3 active shipments</span>
                <div className="flex gap-2">
                   <button className="px-4 py-1.5 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Prev</button>
                   <button className="px-4 py-1.5 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Next</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e21; border-radius: 10px; }
      `}</style>
    </div>
  );
}