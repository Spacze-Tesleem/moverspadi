"use client";

import { useRouter } from "next/navigation";
import {
  HomeIcon, Car, History, Wallet, Book,
  Bell, ShieldCheck, Settings, LogOut, Package,
} from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";

const sidebarItems = [
  { id: "home",          label: "Home",            icon: HomeIcon,    route: "/customer" },
  { id: "book",          label: "Book Ride",        icon: Car,         route: "/customer/book" },
  { id: "trips",         label: "Request History",  icon: History,     route: "/customer/history" },
  { id: "wallet",        label: "Wallet",           icon: Wallet,      balance: "21,850", route: "/customer" },
  { id: "address",       label: "Saved Places",     icon: Book,        route: "/customer" },
  { id: "notifications", label: "Notifications",    icon: Bell,        route: "/customer" },
  { id: "support",       label: "Support",          icon: ShieldCheck, route: "/customer" },
  { id: "settings",      label: "Settings",         icon: Settings,    route: "/customer" },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  activePage: string;
  setActivePage: (id: string) => void;
  onClose?: () => void;
}

export default function Sidebar({ isSidebarOpen, activePage, setActivePage, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login?role=customer");
  };

  return (
    <div className="h-full bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-green-500 rounded-lg flex items-center justify-center shrink-0">
          <Package className="text-white w-4 h-4" />
        </div>
        {isSidebarOpen && (
          <span className="text-base font-black tracking-tight text-slate-900">
            Movers<span className="text-green-500">Padi</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                router.push(item.route);
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all group relative ${
                isActive
                  ? "bg-blue-50 border-l-2 border-blue-500 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              {isSidebarOpen && (
                <div className="flex flex-col items-start text-sm min-w-0">
                  <span className={`font-semibold truncate ${isActive ? "text-blue-600" : ""}`}>
                    {item.label}
                  </span>
                  {"balance" in item && item.balance && (
                    <span className="text-xs font-black text-emerald-500 mt-0.5">
                      ₦ {item.balance}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-100 p-4 space-y-2">
        {isSidebarOpen && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-black text-blue-600">
                {(user?.name ?? "U")[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name ?? "Customer"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isSidebarOpen && <span className="font-semibold">Sign out</span>}
        </button>
      </div>
    </div>
  );
}
