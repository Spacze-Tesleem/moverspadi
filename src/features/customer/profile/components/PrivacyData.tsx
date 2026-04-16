"use client";

import { useState } from "react";
import { Shield, Bell, Link2, Trash2, ChevronRight } from "lucide-react";

interface Props { isDark?: boolean }

export default function PrivacyData({ isDark: D = false }: Props) {
  const [settings, setSettings] = useState({ dataSharing: true, emailNotifications: true, smsNotifications: false });
  const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-blue-600" : D ? "bg-zinc-700" : "bg-slate-200"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="space-y-5">
      <h2 className={`text-lg font-black ${D ? "text-white" : "text-slate-900"}`}>Privacy & Data</h2>

      <div className={`rounded-2xl border divide-y ${D ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
        {[
          { key: "dataSharing"        as const, icon: Shield, label: "Data Sharing",        sub: "Allow anonymised usage data to improve the service" },
          { key: "emailNotifications" as const, icon: Bell,   label: "Email Notifications", sub: "Receive order updates and promotions by email" },
          { key: "smsNotifications"   as const, icon: Bell,   label: "SMS Notifications",   sub: "Receive order updates by SMS" },
        ].map(({ key, icon: Icon, label, sub }) => (
          <div key={key} className="flex items-center gap-4 p-4">
            <div className={`p-2 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
              <Icon className={`w-4 h-4 ${D ? "text-zinc-500" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-800"}`}>{label}</p>
              <p className={`text-xs mt-0.5 leading-relaxed ${D ? "text-zinc-600" : "text-slate-400"}`}>{sub}</p>
            </div>
            <Toggle on={settings[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border divide-y ${D ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
        {[
          { icon: Link2,  label: "Third-Party Apps", sub: "Manage connected applications" },
          { icon: Shield, label: "Privacy Centre",   sub: "View our full privacy policy"  },
        ].map(({ icon: Icon, label, sub }) => (
          <button key={label} className={`w-full flex items-center gap-4 p-4 transition-colors text-left ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
            <div className={`p-2 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
              <Icon className={`w-4 h-4 ${D ? "text-zinc-500" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-800"}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{sub}</p>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${D ? "text-zinc-700" : "text-slate-300"}`} />
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 ${D ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className={`w-4 h-4 shrink-0 ${D ? "text-red-400" : "text-red-500"}`} />
          <p className={`text-sm font-bold ${D ? "text-red-400" : "text-red-700"}`}>Delete Account</p>
        </div>
        <p className={`text-xs leading-relaxed mb-3 ${D ? "text-red-500/70" : "text-red-500"}`}>
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all">
          Request Deletion
        </button>
      </div>
    </div>
  );
}
