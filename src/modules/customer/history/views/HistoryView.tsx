"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, AlertCircle, Clock, MapPin,
  Package, Car, Truck, Wrench, ChevronRight, Search,
  Filter, Star, RotateCcw, Download, X
} from "lucide-react";

// ── Mock history data ──────────────────────────────────────
const HISTORY = [
  {
    id: "ORD-9921", type: "dispatch", status: "completed",
    pickup: "23 Bode Thomas St, Surulere", dropoff: "15 Admiralty Way, Lekki Phase 1",
    date: "Today, 2:14 PM", amount: "₦4,200", mover: "Segun A.", rating: 5,
    distance: "18.4 km", duration: "34 mins",
  },
  {
    id: "ORD-9920", type: "ride", status: "completed",
    pickup: "Murtala Muhammed Airport, Ikeja", dropoff: "Eko Hotel, Victoria Island",
    date: "Yesterday, 9:05 AM", amount: "₦8,500", mover: "Emeka D.", rating: 4,
    distance: "28.1 km", duration: "52 mins",
  },
  {
    id: "ORD-9919", type: "haulage", status: "cancelled",
    pickup: "Apapa Port, Lagos", dropoff: "Kano Depot, Kano State",
    date: "Jan 10, 11:30 AM", amount: "₦0", mover: "—", rating: null,
    distance: "—", duration: "—",
  },
  {
    id: "ORD-9918", type: "dispatch", status: "completed",
    pickup: "Yaba Tech Hub", dropoff: "Ikeja GRA",
    date: "Jan 9, 4:45 PM", amount: "₦2,800", mover: "Chidi N.", rating: 5,
    distance: "9.2 km", duration: "21 mins",
  },
  {
    id: "ORD-9917", type: "tow", status: "completed",
    pickup: "3rd Mainland Bridge, Lagos", dropoff: "Mechanic Village, Ojota",
    date: "Jan 7, 7:20 PM", amount: "₦12,000", mover: "Tunde B.", rating: 3,
    distance: "14.6 km", duration: "41 mins",
  },
  {
    id: "ORD-9916", type: "ride", status: "completed",
    pickup: "Lekki Phase 2", dropoff: "Onikan Stadium, Lagos Island",
    date: "Jan 5, 6:00 PM", amount: "₦5,600", mover: "Fatima B.", rating: 4,
    distance: "22.3 km", duration: "48 mins",
  },
];

type FilterStatus = "all" | "completed" | "cancelled";
type FilterType = "all" | "ride" | "dispatch" | "haulage" | "tow";

const TYPE_ICONS: Record<string, any> = {
  ride: Car,
  dispatch: Package,
  haulage: Truck,
  tow: Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  ride: "text-blue-400 bg-blue-500/10",
  dispatch: "text-orange-400 bg-orange-500/10",
  haulage: "text-violet-400 bg-violet-500/10",
  tow: "text-pink-400 bg-pink-500/10",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  "in-progress": "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-zinc-600">Not rated</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-700"}`} />
      ))}
    </div>
  );
}

export default function HistoryView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof HISTORY[0] | null>(null);

  const filtered = HISTORY.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.pickup.toLowerCase().includes(search.toLowerCase()) ||
      o.dropoff.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchType = typeFilter === "all" || o.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalSpent = HISTORY.filter(o => o.status === "completed")
    .reduce((sum, o) => sum + parseInt(o.amount.replace(/[₦,]/g, "") || "0"), 0);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-300 font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 h-16 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/customer")}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white">Request History</h1>
            <p className="text-[10px] text-zinc-600">{HISTORY.length} total orders</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <Download size={14} />
          <span className="hidden sm:block">Export</span>
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 space-y-6">

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Orders", value: HISTORY.length.toString() },
            { label: "Completed", value: HISTORY.filter(o => o.status === "completed").length.toString() },
            { label: "Total Spent", value: `₦${totalSpent.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 text-center">
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-[10px] text-zinc-600 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Search & Filters ── */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, pickup, or dropoff…"
              className="w-full bg-[#0e0e0e] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/10 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Status filters */}
            {(["all", "completed", "cancelled"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === f ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "bg-[#0e0e0e] text-zinc-500 border border-white/5 hover:border-white/10"}`}
              >
                {f}
              </button>
            ))}
            <div className="w-px bg-white/5 mx-1" />
            {/* Type filters */}
            {(["all", "ride", "dispatch", "haulage", "tow"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${typeFilter === f ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "bg-[#0e0e0e] text-zinc-500 border border-white/5 hover:border-white/10"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Order list ── */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500 font-medium">No orders match your filters</p>
              </motion.div>
            ) : (
              filtered.map((order, i) => {
                const Icon = TYPE_ICONS[order.type] || Package;
                const typeColor = TYPE_COLORS[order.type];
                return (
                  <motion.button
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 hover:bg-zinc-900/50 transition-all text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${typeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-zinc-500">{order.id}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">{order.pickup}</p>
                      <p className="text-xs text-zinc-500 truncate">→ {order.dropoff}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-zinc-600">{order.date}</span>
                        {order.rating !== null && <StarRating rating={order.rating} />}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-white">{order.amount}</p>
                      <ChevronRight className="w-4 h-4 text-zinc-700 mt-2 ml-auto" />
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Order detail drawer ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0f] border-t border-white/10 rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-mono text-zinc-500">{selectedOrder.id}</p>
                  <h2 className="text-lg font-black text-white capitalize">{selectedOrder.type} Order</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Route */}
              <div className="bg-zinc-900/50 rounded-2xl p-5 mb-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <div className="w-px h-8 bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-white/20" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5">Pickup</p>
                      <p className="text-sm font-semibold text-white">{selectedOrder.pickup}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5">Dropoff</p>
                      <p className="text-sm font-semibold text-white">{selectedOrder.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Date", value: selectedOrder.date },
                  { label: "Amount", value: selectedOrder.amount },
                  { label: "Distance", value: selectedOrder.distance },
                  { label: "Duration", value: selectedOrder.duration },
                  { label: "Mover", value: selectedOrder.mover },
                  { label: "Status", value: selectedOrder.status },
                ].map((d) => (
                  <div key={d.label} className="bg-zinc-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">{d.label}</p>
                    <p className="text-sm font-bold text-white capitalize">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Rating */}
              {selectedOrder.rating !== null && (
                <div className="bg-zinc-900/50 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <p className="text-xs text-zinc-500 font-medium">Your rating</p>
                  <StarRating rating={selectedOrder.rating} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedOrder.status === "completed" && (
                  <button
                    onClick={() => router.push(`/customer/book?type=${selectedOrder.type}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Rebook
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-zinc-400 border border-white/5 rounded-xl font-black text-xs uppercase tracking-widest hover:text-white hover:border-white/10 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Receipt
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
