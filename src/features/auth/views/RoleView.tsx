"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

export default function RoleView() {
  return (
    <Suspense>
      <RolePageInner />
    </Suspense>
  );
}

type MoverSubType = "mover" | "provider" | "company";

const TOP_ROLES = [
  {
    name: "customer",
    label: "Customer",
    description: "Personal moving and shipping",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    hideInSignup: false,
  },
  {
    name: "movers",
    label: "Movers",
    description: "Transport & logistics services",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=150&h=150&auto=format&fit=crop",
    hideInSignup: false,
  },
  {
    name: "admin",
    label: "Admin",
    description: "Platform management",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
    hideInSignup: true,
  },
];

const MOVER_SUBTYPES: { role: MoverSubType; label: string; description: string; color: string }[] = [
  {
    role: "mover",
    label: "Independent Mover",
    description: "Individual courier or driver operating solo",
    color: "blue",
  },
  {
    role: "provider",
    label: "Transport Provider",
    description: "Heavy-duty or specialised transport services",
    color: "cyan",
  },
  {
    role: "company",
    label: "Logistics Company",
    description: "Enterprise fleet with multiple drivers",
    color: "violet",
  },
];

const COLOR_MAP: Record<string, string> = {
  blue:   "bg-blue-500/10 border-blue-500/40 text-blue-600",
  cyan:   "bg-cyan-500/10 border-cyan-500/40 text-cyan-600",
  violet: "bg-violet-500/10 border-violet-500/40 text-violet-600",
};

function RolePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "signup";

  const [selected, setSelected] = useState<string | null>(null);
  const [moverSub, setMoverSub] = useState<MoverSubType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const visibleRoles = TOP_ROLES.filter((r) => !(mode === "signup" && r.hideInSignup));

  const resolvedRole =
    selected === "movers" ? moverSub : (selected as string | null);
  const canContinue = selected !== null && (selected !== "movers" || moverSub !== null);

  const handleContinue = () => {
    if (!canContinue || !resolvedRole) return;
    setIsLoading(true);
    router.push(`/auth/${mode}?role=${resolvedRole}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Choose Your Account Type
        </h1>
        <p className="text-lg text-slate-500">
          Select how you&apos;ll use MoversPadi to get started
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {visibleRoles.map((role) => {
          const isSelected = selected === role.name;
          const isMovers = role.name === "movers";

          return (
            <motion.div
              key={role.name}
              layout
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={() => {
                setSelected(role.name);
                if (!isMovers) setMoverSub(null);
              }}
              className={`cursor-pointer rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "bg-white border-blue-500 shadow-xl shadow-blue-100"
                  : "bg-white/70 border-transparent hover:border-slate-200 hover:bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {/* Row */}
              <div className="flex items-center gap-5 p-5">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                  isSelected ? "border-blue-200 scale-105" : "border-slate-100"
                }`}>
                  <img src={role.image} alt={role.label} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold transition-colors ${isSelected ? "text-blue-600" : "text-slate-800"}`}>
                    {role.label}
                  </h3>
                  <p className="text-slate-400 text-sm leading-snug">{role.description}</p>

                  {isMovers && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {MOVER_SUBTYPES.map((s) => (
                        <span key={s.role} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {isSelected
                    ? <CheckCircle2 className="w-6 h-6 text-blue-500" fill="currentColor" stroke="white" strokeWidth={2} />
                    : <ChevronRight className="w-5 h-5 text-slate-300" />
                  }
                </div>
              </div>

              {/* Movers sub-type panel */}
              <AnimatePresence>
                {isSelected && isMovers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Select your mover type
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {MOVER_SUBTYPES.map((sub) => (
                          <button
                            key={sub.role}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMoverSub(sub.role); }}
                            className={`text-left p-4 rounded-2xl border-2 transition-all ${
                              moverSub === sub.role
                                ? `${COLOR_MAP[sub.color]} shadow-sm`
                                : "bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-sm font-bold text-slate-800 leading-tight">{sub.label}</p>
                              {moverSub === sub.role && (
                                <CheckCircle2 className="w-4 h-4 text-current shrink-0 mt-0.5" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">{sub.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10">
        <button
          onClick={handleContinue}
          disabled={!canContinue || isLoading}
          className={`group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
            canContinue
              ? "bg-slate-900 text-white hover:bg-blue-600 shadow-2xl shadow-blue-200 hover:-translate-y-1"
              : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${!canContinue && "opacity-0"}`} />
            </>
          )}
        </button>
      </div>

      <p className="mt-8 text-slate-500 font-medium">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/role?mode=login")}
          className="text-blue-600 hover:underline font-bold"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
