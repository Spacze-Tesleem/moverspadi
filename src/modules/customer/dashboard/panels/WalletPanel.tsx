"use client";

import { useState } from "react";
import { CreditCard, ArrowDownLeft, ArrowUpRight, Plus, Send, RefreshCw } from "lucide-react";

const TRANSACTIONS = [
  { id: "TRX-8821", label: "Dispatch — Surulere → Lekki", date: "Today, 2:14 PM",    amount: -3500,  type: "debit" },
  { id: "TRX-8820", label: "Wallet Top-up",                date: "Today, 10:00 AM",   amount: 50000,  type: "credit" },
  { id: "TRX-8819", label: "Ride — Airport → VI",          date: "Yesterday, 9:05 AM",amount: -8200,  type: "debit" },
  { id: "TRX-8818", label: "Wallet Top-up",                date: "Jan 8, 3:00 PM",    amount: 20000,  type: "credit" },
  { id: "TRX-8817", label: "Haulage — Apapa → Kano",       date: "Jan 7, 11:30 AM",   amount: -45000, type: "debit" },
];

interface Props { isDark: boolean }

export default function WalletPanel({ isDark: D }: Props) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [amount, setAmount] = useState("");

  const balance = 21850;

  return (
    <div className="space-y-5">
      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Wallet Balance</span>
          </div>
          <p className="text-4xl font-black tracking-tight mb-1">₦{balance.toLocaleString()}<span className="text-xl text-blue-300">.00</span></p>
          <p className="text-xs text-blue-300">Available for transactions</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Top Up",   icon: Plus,       action: () => setShowTopUp(true) },
          { label: "Transfer", icon: Send,        action: () => {} },
          { label: "History",  icon: RefreshCw,   action: () => {} },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.action}
            className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
              D
                ? "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            <a.icon className="w-5 h-5" />
            <span className="text-xs font-bold">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Top-up form */}
      {showTopUp && (
        <div className={`rounded-2xl border p-5 space-y-4 ${D ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
          <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Add Funds</p>
          <input
            type="number"
            placeholder="Enter amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition-all ${
              D
                ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }`}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowTopUp(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-200">
              Proceed
            </button>
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
        <div className={`px-5 py-3 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Recent Transactions</p>
        </div>
        <div className={`divide-y ${D ? "divide-white/5" : "divide-slate-100"}`}>
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className={`px-5 py-4 flex items-center gap-4 transition-colors ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                t.type === "credit"
                  ? D ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                  : D ? "bg-rose-500/10 text-rose-400"    : "bg-rose-50 text-rose-500"
              }`}>
                {t.type === "credit"
                  ? <ArrowDownLeft className="w-4 h-4" />
                  : <ArrowUpRight  className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{t.label}</p>
                <p className={`text-[11px] ${D ? "text-zinc-600" : "text-slate-400"}`}>{t.date} · {t.id}</p>
              </div>
              <span className={`text-sm font-bold shrink-0 ${
                t.type === "credit"
                  ? "text-emerald-500"
                  : D ? "text-zinc-300" : "text-slate-800"
              }`}>
                {t.type === "credit" ? "+" : "-"}₦{Math.abs(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
