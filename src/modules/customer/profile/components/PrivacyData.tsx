"use client";

import { useState } from "react";
import { Shield, Bell, Link2, Trash2, ChevronRight } from "lucide-react";

export default function PrivacyData() {
  const [settings, setSettings] = useState({
    dataSharing:        true,
    emailNotifications: true,
    smsNotifications:   false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-black text-slate-900">Privacy & Data</h2>

      {/* Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {[
          { key: "dataSharing"        as const, icon: Shield, label: "Data Sharing",         sub: "Allow anonymised usage data to improve the service" },
          { key: "emailNotifications" as const, icon: Bell,   label: "Email Notifications",  sub: "Receive order updates and promotions by email" },
          { key: "smsNotifications"   as const, icon: Bell,   label: "SMS Notifications",    sub: "Receive order updates by SMS" },
        ].map(({ key, icon: Icon, label, sub }) => (
          <div key={key} className="flex items-center gap-4 p-4">
            <div className="p-2 bg-slate-100 rounded-xl shrink-0">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sub}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${settings[key] ? "bg-blue-600" : "bg-slate-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {[
          { icon: Link2, label: "Third-Party Apps",    sub: "Manage connected applications" },
          { icon: Shield, label: "Privacy Centre",     sub: "View our full privacy policy" },
        ].map(({ icon: Icon, label, sub }) => (
          <button key={label} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
            <div className="p-2 bg-slate-100 rounded-xl shrink-0">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
          <p className="text-sm font-bold text-rose-700">Delete Account</p>
        </div>
        <p className="text-xs text-rose-500 leading-relaxed mb-3">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all">
          Request Deletion
        </button>
      </div>
    </div>
  );
}
