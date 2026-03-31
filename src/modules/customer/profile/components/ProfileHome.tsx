"use client";

import { useState, useRef } from "react";
import { Camera, Package, Star, MapPin, Clock } from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";

export default function ProfileHome() {
  const { user } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  }

  const stats = [
    { label: "Total Orders", value: "24",    icon: Package },
    { label: "Avg Rating",   value: "4.8 ★", icon: Star },
    { label: "Cities",       value: "3",     icon: MapPin },
    { label: "Member Since", value: "2024",  icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative shrink-0">
          <div
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-white shadow-md hover:opacity-90 transition-opacity"
          >
            {avatar
              ? <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
              : <span className="text-2xl font-black text-blue-600">{(user?.name ?? "U")[0].toUpperCase()}</span>}
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">{user?.name ?? "Customer"}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email ?? ""}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
            Customer Account
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <s.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-lg font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
