"use client";

import { Lock, Smartphone, ShieldCheck, Phone, ChevronRight } from "lucide-react";

interface Props { isDark?: boolean }

const items = [
  { icon: Lock,        label: "Password",            sub: "Last changed 3 months ago",       action: "Change" },
  { icon: Smartphone,  label: "Authenticator App",   sub: "Not configured",                  action: "Setup"  },
  { icon: ShieldCheck, label: "2-Step Verification", sub: "Adds an extra layer of security", action: "Enable" },
  { icon: Phone,       label: "Recovery Phone",      sub: "Not added",                       action: "Add"    },
];

export default function Security({ isDark: D = false }: Props) {
  return (
    <div className="space-y-5">
      <h2 className={`text-lg font-black ${D ? "text-white" : "text-slate-900"}`}>Security</h2>

      <div className={`rounded-2xl border divide-y ${D ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
        {items.map(({ icon: Icon, label, sub, action }) => (
          <button key={label} className={`w-full flex items-center gap-4 p-4 transition-colors text-left ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
            <div className={`p-2 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
              <Icon className={`w-4 h-4 ${D ? "text-zinc-500" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-800"}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${D ? "text-zinc-600" : "text-slate-400"}`}>{sub}</p>
            </div>
            <span className={`text-xs font-bold shrink-0 ${D ? "text-blue-400" : "text-blue-600"}`}>{action}</span>
            <ChevronRight className={`w-4 h-4 shrink-0 ${D ? "text-zinc-700" : "text-slate-300"}`} />
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 ${D ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
        <p className={`text-xs font-bold mb-1 ${D ? "text-amber-400" : "text-amber-700"}`}>Recommendation</p>
        <p className={`text-xs leading-relaxed ${D ? "text-amber-500/80" : "text-amber-600"}`}>
          Enable 2-step verification to protect your account from unauthorised access.
        </p>
      </div>
    </div>
  );
}
