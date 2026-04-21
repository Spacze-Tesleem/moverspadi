"use client";

import { useState } from "react";
import { Bell, Globe, Shield, Smartphone, Moon, Sun, ChevronRight } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";

interface Props { isDark: boolean }

// Defined outside the component so they are stable across renders.

function Toggle({ on, onToggle, isDark }: { on: boolean; onToggle: () => void; isDark: boolean }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-blue-600" : isDark ? "bg-zinc-700" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Row({ icon: Icon, label, sub, children, isDark }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}>
      <div className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <Icon className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-slate-500"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>{label}</p>
        {sub && <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPanel({ isDark: D }: Props) {
  const { toggleTheme } = useTheme();

  const [prefs, setPrefs] = useState({
    pushNotifications:  true,
    emailUpdates:       true,
    smsAlerts:          false,
    biometricLogin:     false,
    locationServices:   true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-5">

      {/* Appearance */}
      <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
        <div className={`px-5 py-3 border-b ${D ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Appearance</p>
        </div>
        <Row icon={D ? Sun : Moon} label={D ? "Light Mode" : "Dark Mode"} sub="Switch the dashboard theme" isDark={D}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              D
                ? "border-white/10 text-zinc-300 hover:bg-white/10"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {D ? <Sun className="w-3.5 h-3.5 text-blue-400" /> : <Moon className="w-3.5 h-3.5" />}
            Switch
          </button>
        </Row>
      </div>

      {/* Notifications */}
      <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
        <div className={`px-5 py-3 border-b ${D ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Notifications</p>
        </div>
        <Row icon={Bell} label="Push Notifications" sub="Order updates and alerts" isDark={D}>
          <Toggle on={prefs.pushNotifications} onToggle={() => toggle("pushNotifications")} isDark={D} />
        </Row>
        <Row icon={Globe} label="Email Updates" sub="Receipts and promotions" isDark={D}>
          <Toggle on={prefs.emailUpdates} onToggle={() => toggle("emailUpdates")} isDark={D} />
        </Row>
        <Row icon={Smartphone} label="SMS Alerts" sub="Critical order updates only" isDark={D}>
          <Toggle on={prefs.smsAlerts} onToggle={() => toggle("smsAlerts")} isDark={D} />
        </Row>
      </div>

      {/* Security */}
      <div className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
        <div className={`px-5 py-3 border-b ${D ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Security</p>
        </div>
        <Row icon={Shield} label="Biometric Login" sub="Use fingerprint or Face ID" isDark={D}>
          <Toggle on={prefs.biometricLogin} onToggle={() => toggle("biometricLogin")} isDark={D} />
        </Row>
        <Row icon={Shield} label="Location Services" sub="Required for booking" isDark={D}>
          <Toggle on={prefs.locationServices} onToggle={() => toggle("locationServices")} isDark={D} />
        </Row>
        <button className={`w-full flex items-center gap-4 px-5 py-4 transition-colors ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
          <div className={`p-2 rounded-xl shrink-0 ${D ? "bg-white/5" : "bg-slate-100"}`}>
            <Shield className={`w-4 h-4 ${D ? "text-zinc-400" : "text-slate-500"}`} />
          </div>
          <div className="flex-1 text-left">
            <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-800"}`}>Change Password</p>
            <p className={`text-xs mt-0.5 ${D ? "text-zinc-500" : "text-slate-400"}`}>Last changed 3 months ago</p>
          </div>
          <ChevronRight className={`w-4 h-4 ${D ? "text-zinc-600" : "text-slate-300"}`} />
        </button>
      </div>

      {/* App info */}
      <div className={`rounded-2xl border p-5 ${D ? "border-white/5" : "border-slate-200"}`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${D ? "text-zinc-500" : "text-slate-500"}`}>App Info</p>
        <div className="space-y-2">
          {[
            { label: "Version",       value: "1.0.0" },
            { label: "Build",         value: "2025.01" },
            { label: "Environment",   value: "Production" },
          ].map((r) => (
            <div key={r.label} className="flex justify-between">
              <span className={`text-xs ${D ? "text-zinc-500" : "text-slate-400"}`}>{r.label}</span>
              <span className={`text-xs font-bold ${D ? "text-zinc-300" : "text-slate-700"}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
