"use client";

import { useRef, useState } from "react";
import { CreditCard, ArrowDownLeft, ArrowUpRight, Plus, Send, RefreshCw, CheckCircle2, X } from "lucide-react";

const TRANSACTIONS = [
  { id: "TRX-8821", label: "Dispatch — Surulere → Lekki", date: "Today, 2:14 PM",    amount: -3500,  type: "debit" },
  { id: "TRX-8820", label: "Wallet Top-up",                date: "Today, 10:00 AM",   amount: 50000,  type: "credit" },
  { id: "TRX-8819", label: "Ride — Airport → VI",          date: "Yesterday, 9:05 AM",amount: -8200,  type: "debit" },
  { id: "TRX-8818", label: "Wallet Top-up",                date: "Jan 8, 3:00 PM",    amount: 20000,  type: "credit" },
  { id: "TRX-8817", label: "Haulage — Apapa → Kano",       date: "Jan 7, 11:30 AM",   amount: -45000, type: "debit" },
];

interface Props { isDark: boolean }

export default function WalletPanel({ isDark: D }: Props) {
  const [showTopUp, setShowTopUp]       = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [topUpAmount, setTopUpAmount]   = useState("");
  const [topUpDone, setTopUpDone]       = useState(false);
  const [transferTo, setTransferTo]     = useState("");
  const [transferAmt, setTransferAmt]   = useState("");
  const [transferDone, setTransferDone] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const balance = 21850;

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition-all ${
    D
      ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className="space-y-3">
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
          { label: "Top Up",   icon: Plus,       action: () => { setShowTopUp(true); setShowTransfer(false); setTopUpDone(false); } },
          { label: "Transfer", icon: Send,        action: () => { setShowTransfer(true); setShowTopUp(false); setTransferDone(false); } },
          { label: "History",  icon: RefreshCw,   action: () => { setShowTopUp(false); setShowTransfer(false); setTimeout(() => historyRef.current?.scrollIntoView({ behavior: "smooth" }), 50); } },
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
          <div className="flex items-center justify-between">
            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Add Funds</p>
            <button onClick={() => setShowTopUp(false)} className={D ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-600"}><X className="w-4 h-4" /></button>
          </div>
          {topUpDone ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" />
              <p className="text-green-600 font-bold text-sm">₦{parseInt(topUpAmount || "0").toLocaleString()} added successfully!</p>
              <p className={`text-xs ${D ? "text-zinc-500" : "text-slate-400"}`}>Your wallet balance has been updated.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {["5,000", "10,000", "20,000", "50,000", "100,000"].map((preset) => (
                  <button key={preset} onClick={() => setTopUpAmount(preset.replace(",", ""))}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${topUpAmount === preset.replace(",", "") ? "bg-blue-600 text-white border-blue-600" : D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    ₦{preset}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Or enter custom amount (₦)" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className={inputCls} />
              <div className="flex gap-3">
                <button onClick={() => setShowTopUp(false)} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
                <button onClick={() => { if (topUpAmount) setTopUpDone(true); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-200">Proceed</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Transfer form */}
      {showTransfer && (
        <div className={`rounded-2xl border p-5 space-y-4 ${D ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Transfer Funds</p>
            <button onClick={() => setShowTransfer(false)} className={D ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-600"}><X className="w-4 h-4" /></button>
          </div>
          {transferDone ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" />
              <p className="text-green-600 font-bold text-sm">₦{parseInt(transferAmt || "0").toLocaleString()} sent to {transferTo}!</p>
              <p className={`text-xs ${D ? "text-zinc-500" : "text-slate-400"}`}>Transfer completed instantly.</p>
            </div>
          ) : (
            <>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>Recipient Phone / Account</label>
                <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)} placeholder="+234 800 000 0000 or account number" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-400"}`}>Amount (₦)</label>
                <input type="number" value={transferAmt} onChange={(e) => setTransferAmt(e.target.value)} placeholder="Enter amount" className={`mt-1 ${inputCls}`} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowTransfer(false)} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
                <button onClick={() => { if (transferTo && transferAmt) setTransferDone(true); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">Send</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Transaction list */}
      <div ref={historyRef} className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
        <div className={`px-5 py-3 border-b ${D ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Recent Transactions</p>
        </div>
        <div className={`divide-y ${D ? "divide-white/5" : "divide-slate-100"}`}>
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className={`px-5 py-4 flex items-center gap-4 transition-colors ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                t.type === "credit"
                  ? D ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"
                  : D ? "bg-red-500/10 text-red-400"    : "bg-red-50 text-red-500"
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
                  ? "text-green-500"
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
