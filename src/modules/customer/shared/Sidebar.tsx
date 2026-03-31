"use client";

import {
  HomeIcon, Car, History, Wallet, BookMarked,
  Bell, ShieldCheck, Settings, LogOut, Package,
  Sun, Moon, X,
} from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";
import { useTheme } from "@/src/context/ThemeContext";
import { useRouter } from "next/navigation";

export const SIDEBAR_ITEMS = [
  { id: "home",          label: "Home",            icon: HomeIcon    },
  { id: "book",          label: "Book a Ride",      icon: Car         },
  { id: "trips",         label: "Request History",  icon: History     },
  { id: "wallet",        label: "Wallet",           icon: Wallet      },
  { id: "saved",         label: "Saved Places",     icon: BookMarked  },
  { id: "notifications", label: "Notifications",    icon: Bell        },
  { id: "support",       label: "Support",          icon: ShieldCheck },
  { id: "settings",      label: "Settings",         icon: Settings    },
] as const;

export type SidebarTabId = typeof SIDEBAR_ITEMS[number]["id"];

interface SidebarProps {
  isSidebarOpen: boolean;
  activeTab: SidebarTabId;
  setActiveTab: (id: SidebarTabId) => void;
  onClose?: () => void;
}

export default function Sidebar({ isSidebarOpen, activeTab, setActiveTab, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const D = isDark;

  const handleLogout = () => {
    logout();
    router.push("/auth/login?role=customer");
  };

  return (
    <div className={`h-full flex flex-col border-r transition-colors duration-200 ${
      D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"
    }`}>

      {/* Logo */}
      <div className={`px-4 py-4 flex items-center gap-3 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-green-500 rounded-lg flex items-center justify-center shrink-0">
          <Package className="text-white w-4 h-4" />
        </div>
        {isSidebarOpen && (
          <span className={`text-base font-black tracking-tight ${D ? "text-white" : "text-slate-900"}`}>
            Movers<span className="text-green-500">Padi</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose?.(); }}
              title={!isSidebarOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all group relative ${
                isActive
                  ? D
                    ? "bg-white/5 border-l-2 border-blue-500 text-blue-400"
                    : "bg-blue-50 border-l-2 border-blue-500 text-blue-600"
                  : D
                    ? "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${
                isActive
                  ? "text-blue-500"
                  : D ? "text-zinc-500 group-hover:text-zinc-300" : "text-slate-400 group-hover:text-slate-600"
              }`} />
              {isSidebarOpen && (
                <span className={`text-sm font-semibold truncate ${
                  isActive ? (D ? "text-blue-400" : "text-blue-600") : ""
                }`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + user + logout */}
      <div className={`border-t p-3 space-y-1 ${D ? "border-white/5" : "border-slate-100"}`}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={!isSidebarOpen ? (D ? "Light mode" : "Dark mode") : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
            D
              ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          {D
            ? <Sun className="w-4 h-4 shrink-0 text-amber-400" />
            : <Moon className="w-4 h-4 shrink-0 text-slate-400" />}
          {isSidebarOpen && <span>{D ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {/* User chip */}
        {isSidebarOpen && (
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${D ? "bg-white/5" : "bg-slate-50"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${D ? "bg-blue-500/20" : "bg-blue-100"}`}>
              <span className={`text-xs font-black ${D ? "text-blue-400" : "text-blue-600"}`}>
                {(user?.name ?? "U")[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>
                {user?.name ?? "Customer"}
              </p>
              <p className={`text-[10px] truncate ${D ? "text-zinc-500" : "text-slate-400"}`}>
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={!isSidebarOpen ? "Sign out" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
            D
              ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5"
              : "text-slate-500 hover:text-rose-500 hover:bg-rose-50"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isSidebarOpen && <span className="font-semibold">Sign out</span>}
        </button>
      </div>
    </div>
  );
}
