"use client";

import { useState } from "react";
import { Bell, Package, CreditCard, ShieldCheck, Truck, CheckCheck } from "lucide-react";

const INITIAL_NOTIFS = [
  { id: "1", icon: Truck,       title: "Order Delivered",          body: "ORD-9921 has been delivered to Lekki Phase 1.",       time: "2 mins ago",  read: false, color: "text-green-500", bg: "bg-green-50", bgDark: "bg-green-500/10" },
  { id: "2", icon: CreditCard,  title: "Wallet Credited",          body: "₦50,000 has been added to your wallet.",              time: "1 hr ago",    read: false, color: "text-blue-500",    bg: "bg-blue-50",    bgDark: "bg-blue-500/10" },
  { id: "3", icon: Package,     title: "New Booking Confirmed",    body: "Your haulage request ORD-9920 is confirmed.",         time: "3 hrs ago",   read: true,  color: "text-blue-500",  bg: "bg-blue-50",  bgDark: "bg-blue-500/10" },
  { id: "4", icon: ShieldCheck, title: "Security Alert",           body: "New login detected from Lagos, Nigeria.",             time: "Yesterday",   read: true,  color: "text-blue-500",   bg: "bg-blue-50",   bgDark: "bg-blue-500/10" },
  { id: "5", icon: Bell,        title: "Promo: 20% off Dispatch",  body: "Use code PADI20 on your next dispatch booking.",      time: "2 days ago",  read: true,  color: "text-red-500",    bg: "bg-red-50",    bgDark: "bg-red-500/10" },
];

interface Props { isDark: boolean }

export default function NotificationsPanel({ isDark: D }: Props) {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-bold ${D ? "text-zinc-400" : "text-slate-500"}`}>
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
          {unread > 0 && (
            <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${D ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
              !n.read
                ? D
                  ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
                  : "bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                : D
                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                  : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${D ? n.bgDark : n.bg}`}>
              <n.icon className={`w-4 h-4 ${n.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-sm font-bold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
              </div>
              <p className={`text-xs leading-relaxed ${D ? "text-zinc-500" : "text-slate-500"}`}>{n.body}</p>
              <p className={`text-[10px] mt-1 font-semibold ${D ? "text-zinc-600" : "text-slate-400"}`}>{n.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
