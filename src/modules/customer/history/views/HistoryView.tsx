"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, AlertCircle, Clock, MapPin,
  Package, Car, Truck, Wrench, ChevronRight, Search,
  Star, RotateCcw, Download, X,
} from "lucide-react";

const HISTORY = [
  { id: "ORD-9921", type: "dispatch", status: "completed", pickup: "23 Bode Thomas St, Surulere", dropoff: "15 Admiralty Way, Lekki Phase 1", date: "Today, 2:14 PM", amount: "₦4,200", mover: "Segun A.", rating: 5, distance: "18.4 km", duration: "34 mins" },
  { id: "ORD-9920", type: "ride",     status: "completed", pickup: "Murtala Muhammed Airport, Ikeja", dropoff: "Eko Hotel, Victoria Island", date: "Yesterday, 9:05 AM", amount: "₦8,500", mover: "Emeka D.", rating: 4, distance: "28.1 km", duration: "52 mins" },
  { id: "ORD-9919", type: "haulage",  status: "cancelled", pickup: "Apapa Port, Lagos", dropoff: "Kano Depot, Kano State", date: "Jan 10, 11:30 AM", amount: "₦0", mover: "—", rating: null, distance: "—", duration: "—" },
  { id: "ORD-9918", type: "dispatch", status: "completed", pickup: "Yaba Tech Hub", dropoff: "Ikeja GRA", date: "Jan 9, 4:45 PM", amount: "₦2,800", mover: "Chidi N.", rating: 5, distance: "9.2 km", duration: "21 mins" },
  { id: "ORD-9917", type: "tow",      status: "completed", pickup: "3rd Mainland Bridge, Lagos", dropoff: "Mechanic Village, Ojota", date: "Jan 7, 7:20 PM", amount: "₦12,000", mover: "Tunde B.", rating: 3, distance: "14.6 km", duration: "41 mins" },
  { id: "ORD-9916", type: "ride",     status: "completed", pickup: "Lekki Phase 2", dropoff: "Onikan Stadium, Lagos Island", date: "Jan 5, 6:00 PM", amount: "₦5,600", mover: "Fatima B.", rating: 4, distance: "22.3 km", duration: "48 mins" },
];

type FilterStatus = "all" | "completed" | "cancelled";
type FilterType   = "all" | "ride" | "dispatch" | "haulage" | "tow";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ride: Car, dispatch: Package, haulage: Truck, tow: Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  ride:     "text-blue-500 bg-blue-50 border-blue-100",
  dispatch: "text-orange-500 bg-orange-50 border-orange-100",
  haulage:  "text-violet-500 bg-violet-50 border-violet-100",
  tow:      "text-rose-500 bg-rose-50 border-rose-100",
};

const STATUS_STYLES: Record<string, string> = {
  completed:   "text-emerald-600 bg-emerald-50 border-emerald-200",
  cancelled:   "text-rose-500 bg-rose-50 border-rose-200",
  "in-progress": "text-blue-500 bg-blue-50 border-blue-200",
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-slate-400">Not rated</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export default function HistoryView() {
  const router = useRouter();
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState<FilterStatus>("all");
  const [typeFilter,    setTypeFilter]    = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof HISTORY[0] | null>(null);

  const filtered = HISTORY.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.pickup.toLowerCase().includes(q) || o.dropoff.toLowerCase().includes(q);
    return matchSearch && (statusFilter === "all" || o.status === statusFilter) && (typeFilter === "all" || o.type === typeFilter);
  });

  const totalSpent = HISTORY.filter(o => o.status === "completed")
    .reduce((sum, o) => sum + parseInt(o.amount.replace(/[₦,]/g, "") || "0"), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/customer")} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Request History</h1>
            <p className="text-[10px] text-slate-400">{HISTORY.length} total orders</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
          <Download size={14} />
          <span className="hidden sm:block font-semibold">Export</span>
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-5 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Orders", value: HISTORY.length.toString() },
            { label: "Completed",    value: HISTORY.filter(o => o.status === "completed").length.toString() },
            { label: "Total Spent",  value: `₦${totalSpent.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-lg font-black text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, pickup, or dropoff…"
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Filters — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap scrollbar-none">
          {(["all", "completed", "cancelled"] as FilterStatus[]).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all shrink-0 ${
                statusFilter === f
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}>
              {f}
            </button>
          ))}
          <div className="w-px bg-slate-200 mx-1 shrink-0" />
          {(["all", "ride", "dispatch", "haulage", "tow"] as FilterType[]).map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all shrink-0 ${
                typeFilter === f
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Order list */}
        <div className="space-y-3 pb-8">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No orders match your filters</p>
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
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-4 hover:border-slate-300 hover:shadow-sm transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${typeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-slate-400">{order.id}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate">{order.pickup}</p>
                      <p className="text-xs text-slate-400 truncate">→ {order.dropoff}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-400">{order.date}</span>
                        {order.rating !== null && <StarRating rating={order.rating} />}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900">{order.amount}</p>
                      <ChevronRight className="w-4 h-4 text-slate-300 mt-2 ml-auto" />
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Order detail bottom sheet */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 rounded-t-[28px] p-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-mono text-slate-400">{selectedOrder.id}</p>
                  <h2 className="text-lg font-black text-slate-900 capitalize">{selectedOrder.type} Order</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Route */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Pickup</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedOrder.pickup}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Dropoff</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedOrder.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Date",     value: selectedOrder.date },
                  { label: "Amount",   value: selectedOrder.amount },
                  { label: "Distance", value: selectedOrder.distance },
                  { label: "Duration", value: selectedOrder.duration },
                  { label: "Mover",    value: selectedOrder.mover },
                  { label: "Status",   value: selectedOrder.status },
                ].map((d) => (
                  <div key={d.label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{d.label}</p>
                    <p className="text-sm font-bold text-slate-800 capitalize">{d.value}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.rating !== null && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-semibold">Your rating</p>
                  <StarRating rating={selectedOrder.rating} />
                </div>
              )}

              <div className="flex gap-3">
                {selectedOrder.status === "completed" && (
                  <button
                    onClick={() => router.push(`/customer/book?type=${selectedOrder.type}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm shadow-blue-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rebook
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                  <Download className="w-3.5 h-3.5" /> Receipt
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
