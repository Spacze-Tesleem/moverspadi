// app/customer/dashboard/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bike,
  Truck,
  Car,
  ArrowRight,
  Package,
  Menu,
  User,
  Plus,
  Download,
  Zap,
  Repeat,
  HomeIcon,
  History,
  Wallet,
  Bell,
  Settings,
  MapPin,
  Wrench,
} from "lucide-react";
import Link from "next/link";

// --- SIDEBAR ITEMS ---
const sidebarItems = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "book", label: "Book Ride", icon: Car },
  { id: "trips", label: "My Trips", icon: History },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

// ✅ FIXED: Use ?type= and correct service names
const services = [
  { 
    id: "dispatch", 
    title: "Bike Dispatch", 
    description: "Quick package delivery", 
    icon: Bike, 
    color: "bg-blue-500", 
    route: "/customer/book?type=dispatch" 
  },
  { 
    id: "haulage", 
    title: "Heavy Haulage", 
    description: "Large cargo transport", 
    icon: Truck, 
    color: "bg-purple-500", 
    route: "/customer/book?type=haulage" 
  },
  { 
    id: "tow", 
    title: "Tow Assistance", 
    description: "24/7 vehicle recovery", 
    icon: Wrench, 
    color: "bg-orange-500", 
    route: "/customer/book?type=tow" 
  },
  { 
    id: "ride", 
    title: "Ride Transport", 
    description: "Car & bus booking", 
    icon: Car, 
    color: "bg-emerald-500", 
    route: "/customer/book?type=ride" 
  },
];

const mockOrders = [
  { code: "ORD-9921", type: "On Demand", stage: "Dispatched", status: "In Transit", created: "Oct 24, 10:15", method: "Bike", location: "Ikeja → Lekki" },
  { code: "ORD-9920", type: "P_Hub_D", stage: "Sorting", status: "Pending", created: "Oct 24, 09:45", method: "Truck", location: "Yaba → Victoria Island" },
  { code: "ORD-9918", type: "On Demand", stage: "Delivered", status: "Successful", created: "Oct 23, 15:20", method: "Bike", location: "Ajah → Ikoyi" },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"demand" | "hub">("demand");

  return (
    <div className="flex h-screen text-white bg-[#0a0a0b] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className="h-full bg-[#0d0d0f] border-r border-white/5 flex flex-col overflow-hidden relative"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">DispatchHub</span>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {sidebarItems.map(item => (
            <button key={item.id} className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors group">
              <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
              <span className="text-sm font-bold text-zinc-400 group-hover:text-white">{item.label}</span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative">

        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-xl">
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>

            {/* Toggle */}
            <div className="p-1 bg-white/5 rounded-xl border border-white/10 flex items-center relative">
              <button onClick={() => setActiveMode("demand")} className={`px-4 py-1.5 text-[10px] font-black flex items-center gap-2 rounded-lg transition-all ${activeMode === 'demand' ? 'text-white bg-white/10' : 'text-zinc-500'}`}>
                <Zap className="w-3 h-3" /> On Demand
              </button>
              <button onClick={() => setActiveMode("hub")} className={`px-4 py-1.5 text-[10px] font-black flex items-center gap-2 rounded-lg transition-all ${activeMode === 'hub' ? 'text-white bg-white/10' : 'text-zinc-500'}`}>
                <Repeat className="w-3 h-3" /> P_Hub_D
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-zinc-400 text-xs font-bold hover:text-white transition-colors">
              <Download className="w-4 h-4" /> Import
            </button>

            <Link 
              href="/customer/book"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-colors"
            >
              <Plus className="w-4 h-4" /> New Order
            </Link>

            {/* PROFILE */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10 hover:border-white/20 transition-colors">
                <User className="w-5 h-5 text-zinc-500" />
              </button>

              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl p-2"
                >
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-sm font-bold">Tesleem</p>
                    <p className="text-xs text-zinc-500">tesleem@email.com</p>
                  </div>
                  <Link href="/customer/profile" className="w-full block text-left px-3 py-2 text-sm hover:bg-white/5 rounded-lg">
                    Profile
                  </Link>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded-lg">Wallet</button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded-lg">Orders</button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded-lg">Support</button>
                  <div className="border-t border-white/5 mt-2 pt-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">Logout</button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* HERO + QUICK ACTION */}
          <section className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Book a delivery now</h2>
                <p className="text-white/80 text-sm mb-6">Track and dispatch riders instantly.</p>
                <Link 
                  href="/customer/book"
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  Book Delivery <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl -ml-24 -mb-24" />
            </div>

            {/* Wallet / Stats */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
              <div className="mb-4">
                <p className="text-xs text-zinc-400">Wallet Balance</p>
                <h3 className="text-2xl font-bold mt-1">₦21,850</h3>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Fund Wallet →</button>
            </div>
          </section>

          {/* QUICK SERVICES */}
          <section className="mb-12">
            <h3 className="text-sm text-zinc-400 font-semibold mb-6">Quick Services</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map(s => (
                <motion.div 
                  key={s.id} 
                  whileHover={{ y: -4, scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(s.route)} 
                  className="bg-zinc-900 border border-white/10 hover:border-white/20 p-5 rounded-2xl cursor-pointer transition-colors group"
                >
                  <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-1">{s.title}</h4>
                  <p className="text-xs text-zinc-500">{s.description}</p>
                  <div className="mt-4 flex items-center text-xs text-zinc-500 group-hover:text-white transition-colors">
                    Book now <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* RECENT ACTIVITY / SHIPMENTS */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm text-zinc-400 font-semibold">Recent Shipments</h3>
              <Link href="/customer/orders" className="text-xs text-blue-400 hover:text-blue-300">
                View all →
              </Link>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl divide-y divide-white/5">
              {mockOrders.map((order, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.status === "Successful" ? "bg-green-500/20" : 
                      order.status === "In Transit" ? "bg-blue-500/20" : "bg-yellow-500/20"
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{order.code}</p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      order.status === "Successful" ? "text-green-400" : 
                      order.status === "In Transit" ? "text-blue-400" : "text-yellow-400"
                    }`}>
                      {order.status}
                    </p>
                    <p className="text-xs text-zinc-500">{order.created}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}