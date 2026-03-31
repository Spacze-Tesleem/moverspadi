"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/application/store/authStore";
import { User, Mail, Phone, Edit2, Check, X } from "lucide-react";

interface Props { isDark?: boolean }

export default function PersonalInfo({ isDark: D = false }: Props) {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? "Customer", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [saved, setSaved] = useState({ ...form });

  const handleSave = () => { setSaved({ ...form }); setEditing(false); };
  const handleCancel = () => { setForm({ ...saved }); setEditing(false); };

  const fields = [
    { key: "name"  as const, label: "Full Name",     icon: User,  type: "text",  placeholder: "Your full name" },
    { key: "email" as const, label: "Email Address", icon: Mail,  type: "email", placeholder: "you@example.com" },
    { key: "phone" as const, label: "Phone Number",  icon: Phone, type: "tel",   placeholder: "+234 800 000 0000" },
  ];

  const inputCls = `w-full text-sm font-semibold rounded-xl px-3 py-2 outline-none transition-all border ${
    D
      ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-black ${D ? "text-white" : "text-slate-900"}`}>Personal Information</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${D ? "bg-white/5 border-white/10 text-blue-400 hover:bg-white/10" : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100"}`}>
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      <div className={`rounded-2xl border divide-y ${D ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="p-4 flex items-start gap-4">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${D ? "bg-white/5" : "bg-slate-100"}`}>
              <Icon className={`w-4 h-4 ${D ? "text-zinc-500" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${D ? "text-zinc-600" : "text-slate-400"}`}>{label}</p>
              {editing
                ? <input type={type} value={form[key]} placeholder={placeholder} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputCls} />
                : <p className={`text-sm font-semibold truncate ${D ? "text-zinc-200" : "text-slate-800"}`}>{form[key] || <span className={D ? "text-zinc-600 font-normal" : "text-slate-400 font-normal"}>Not set</span>}</p>}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-sm shadow-blue-200">
            <Check className="w-4 h-4" /> Save
          </button>
          <button onClick={handleCancel} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border ${D ? "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"}`}>
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}
