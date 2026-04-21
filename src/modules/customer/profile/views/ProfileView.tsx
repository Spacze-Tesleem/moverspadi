"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Shield, Home } from "lucide-react";
import ProfileHome from "@/src/modules/customer/profile/components/ProfileHome";
import PersonalInfo from "@/src/modules/customer/profile/components/PersonalInfo";
import Security     from "@/src/modules/customer/profile/components/Security";
import PrivacyData  from "@/src/modules/customer/profile/components/PrivacyData";

type Tab = "home" | "personal" | "security" | "privacy";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home",     label: "Overview",      icon: Home   },
  { id: "personal", label: "Personal Info", icon: User   },
  { id: "security", label: "Security",      icon: Lock   },
  { id: "privacy",  label: "Privacy",       icon: Shield },
];

interface Props {
  isDark?: boolean;
  embedded?: boolean;
}

export default function ProfileView({ isDark = false, embedded = false }: Props) {
  const D = isDark;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const content: Record<Tab, React.ReactNode> = {
    home:     <ProfileHome isDark={D} />,
    personal: <PersonalInfo isDark={D} />,
    security: <Security isDark={D} />,
    privacy:  <PrivacyData isDark={D} />,
  };

  return (
    <div className={`min-h-full font-sans transition-colors duration-200 ${D ? "bg-[#080808] text-zinc-100" : "bg-slate-50 text-slate-800"}`}>

      {/* Header — only when standalone */}
      {!embedded && (
        <header className={`sticky top-0 z-30 h-14 border-b flex items-center gap-3 px-4 lg:px-8 ${D ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          <button onClick={() => router.push("/customer")} className={`p-2 rounded-xl transition-all ${D ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}>
            <ArrowLeft size={18} />
          </button>
          <h1 className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-900"}`}>Profile</h1>
        </header>
      )}

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-5 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Desktop sidebar nav */}
          <aside className="hidden lg:block w-52 shrink-0">
            <nav className={`rounded-2xl border overflow-hidden ${D ? "border-white/5" : "border-slate-200"}`}>
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left border-b last:border-0 ${
                      D ? "border-white/5" : "border-slate-100"
                    } ${
                      isActive
                        ? D
                          ? "bg-white/5 text-blue-400 border-l-2 border-l-blue-500"
                          : "bg-blue-50 text-blue-600 border-l-2 border-l-blue-500"
                        : D
                          ? "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : D ? "text-zinc-600" : "text-slate-400"}`} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tab chips */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 mb-5 -mx-4 px-4 scrollbar-none">
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : D
                          ? "bg-white/5 text-zinc-400 border border-white/10 hover:border-white/20"
                          : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="pb-8">{content[activeTab]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
