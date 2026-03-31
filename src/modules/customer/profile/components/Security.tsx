"use client";

import { Lock, Smartphone, ShieldCheck, Phone, ChevronRight } from "lucide-react";

const items = [
  { icon: Lock,        label: "Password",           sub: "Last changed 3 months ago",  action: "Change" },
  { icon: Smartphone,  label: "Authenticator App",  sub: "Not configured",              action: "Setup" },
  { icon: ShieldCheck, label: "2-Step Verification",sub: "Adds an extra layer of security", action: "Enable" },
  { icon: Phone,       label: "Recovery Phone",     sub: "Not added",                   action: "Add" },
];

export default function Security() {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-black text-slate-900">Security</h2>

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {items.map(({ icon: Icon, label, sub, action }) => (
          <button
            key={label}
            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="p-2 bg-slate-100 rounded-xl shrink-0">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <span className="text-xs font-bold text-blue-600 shrink-0">{action}</span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </button>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-amber-700 mb-1">Recommendation</p>
        <p className="text-xs text-amber-600 leading-relaxed">
          Enable 2-step verification to protect your account from unauthorised access.
        </p>
      </div>
    </div>
  );
}
