"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/application/store/authStore";
import { User, Mail, Phone, Edit2, Check, X } from "lucide-react";

export default function PersonalInfo() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:  user?.name  ?? "Customer",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [saved, setSaved] = useState({ ...form });

  const handleSave = () => { setSaved({ ...form }); setEditing(false); };
  const handleCancel = () => { setForm({ ...saved }); setEditing(false); };

  const fields = [
    { key: "name",  label: "Full Name",     icon: User,  type: "text",  placeholder: "Your full name" },
    { key: "email", label: "Email Address", icon: Mail,  type: "email", placeholder: "you@example.com" },
    { key: "phone", label: "Phone Number",  icon: Phone, type: "tel",   placeholder: "+234 800 000 0000" },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="p-4 flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              {editing ? (
                <input
                  type={type}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {form[key] || <span className="text-slate-400 font-normal">Not set</span>}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-sm shadow-blue-200"
          >
            <Check className="w-4 h-4" /> Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}
