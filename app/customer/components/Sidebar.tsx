"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  Car,
  History,
  Wallet,
  Book,
  Bell,
  ShieldCheck,
  Settings,
  User,
  Package
} from "lucide-react";

const sidebarItems = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "book", label: "Book Ride", icon: Car },
  { id: "trips", label: "My Trips", icon: History },
  { id: "wallet", label: "Wallet", icon: Wallet, balance: "21,850", color: "text-emerald-400" },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "address", label: "Saved Places", icon: Book },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "support", label: "Support", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  isSidebarOpen,
  activePage,
  setActivePage,
}: any) {
  const router = useRouter();

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="h-full bg-[#0d0d0f] border-r border-white/5 flex flex-col relative z-50"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
          <Package className="text-white w-5 h-5" />
        </div>

        {isSidebarOpen && (
          <span className="text-lg font-black tracking-tighter uppercase">
            Moverspadi
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              router.push(`/customer/${item.id}`);
            }}
            className={`w-full flex items-center gap-4 px-6 py-3 transition-all group
            ${
              activePage === item.id
                ? "bg-blue-600/20 border-l-2 border-blue-500"
                : "hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />

            {isSidebarOpen && (
              <div className="flex flex-col items-start text-sm">
                <span className="font-bold text-zinc-400 group-hover:text-white">
                  {item.label}
                </span>

                {item.balance && (
                  <span className={`text-xs font-black mt-0.5 ${item.color}`}>
                    ₦ {item.balance}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/5">
        <button className="w-full flex items-center gap-3 text-zinc-400 hover:text-white text-sm font-bold">
          <User className="w-4 h-4" />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </motion.aside>
  );
}