"use client";

import { useState } from "react";
import { MapPin, Home, Briefcase, Star, Plus, Trash2, Edit2 } from "lucide-react";

const INITIAL_PLACES = [
  { id: "1", label: "Home",   address: "14 Bode Thomas St, Surulere, Lagos",    icon: Home,      color: "text-blue-500",   bg: "bg-blue-50",   bgDark: "bg-blue-500/10" },
  { id: "2", label: "Office", address: "Plot 1234, Adeola Odeku St, Victoria Island", icon: Briefcase, color: "text-violet-500", bg: "bg-violet-50", bgDark: "bg-violet-500/10" },
  { id: "3", label: "Gym",    address: "Ikoyi Club, Ikoyi, Lagos",              icon: Star,      color: "text-amber-500",  bg: "bg-amber-50",  bgDark: "bg-amber-500/10" },
];

interface Props { isDark: boolean }

export default function SavedPlacesPanel({ isDark: D }: Props) {
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim() || !newAddress.trim()) return;
    setPlaces([...places, {
      id: Date.now().toString(),
      label: newLabel,
      address: newAddress,
      icon: MapPin,
      color: "text-slate-500",
      bg: "bg-slate-50",
      bgDark: "bg-white/5",
    }]);
    setNewLabel(""); setNewAddress(""); setAdding(false);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition-all ${
    D
      ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-sm font-bold ${D ? "text-zinc-400" : "text-slate-500"}`}>{places.length} saved locations</p>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add Place
        </button>
      </div>

      {adding && (
        <div className={`rounded-2xl border p-5 space-y-3 ${D ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
          <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>New Saved Place</p>
          <input className={inputCls} placeholder="Label (e.g. Home, Office)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <input className={inputCls} placeholder="Full address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => setAdding(false)} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${D ? "border-white/10 text-zinc-400 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
            <button onClick={handleAdd} className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {places.map((place) => (
          <div key={place.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${D ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${D ? place.bgDark : place.bg}`}>
              <place.icon className={`w-5 h-5 ${place.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{place.label}</p>
              <p className={`text-xs truncate mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>{place.address}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className={`p-2 rounded-lg transition-colors ${D ? "text-zinc-600 hover:text-zinc-300 hover:bg-white/5" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`}>
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPlaces(places.filter((p) => p.id !== place.id))}
                className={`p-2 rounded-lg transition-colors ${D ? "text-zinc-600 hover:text-rose-400 hover:bg-rose-500/5" : "text-slate-300 hover:text-rose-500 hover:bg-rose-50"}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
