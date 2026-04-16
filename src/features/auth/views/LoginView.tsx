"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, ShieldCheck, Building2, Mail,
  Sparkles, ArrowRight, Truck, AlertCircle, ChevronLeft,
  Zap, ChevronDown,
} from "lucide-react";
import { authApi, isNetworkError, warmupBackend } from "@/src/services/api/auth";
import { useAuthStore } from "@/src/store/authStore";
import { useEffect } from "react";

type Role = "customer" | "mover" | "provider" | "company" | "admin";

const ROLE_DATA: Record<Role, {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
  tagline: string;
}> = {
  customer: {
    label: "Customer", icon: User, tagline: "Move with ease.",
    description: "Book moves, track real-time shipments, and manage your personal logistics dashboard.",
  },
  mover: {
    label: "Independent Mover", icon: Truck, tagline: "Earn on the go.",
    description: "Access high-quality leads, manage your schedule, and grow your independent moving business.",
  },
  provider: {
    label: "Transport Provider", icon: Truck, tagline: "Transport at scale.",
    description: "Offer private car hire or bus services, manage vehicle compliance, and grow your transport business.",
  },
  company: {
    label: "Logistics Company", icon: Building2, tagline: "Scale operations.",
    description: "Full-scale fleet management, driver dispatching, and enterprise-grade logistics analytics.",
  },
  admin: {
    label: "Admin", icon: ShieldCheck, tagline: "System Control.",
    description: "Manage platform users, monitor logistics traffic, and configure system settings.",
  },
};

const DEV_CREDENTIALS: Record<Role, { id: string; password: string; name: string }> = {
  customer: { id: "customer@demo.com",  password: "demo1234", name: "Demo Customer" },
  mover:    { id: "mover@demo.com",     password: "demo1234", name: "Demo Mover" },
  provider: { id: "provider@demo.com",  password: "demo1234", name: "Demo Provider" },
  company:  { id: "COMPANY-001",        password: "demo1234", name: "Demo Company" },
  admin:    { id: "ADMIN-001",          password: "demo1234", name: "Demo Admin" },
};

const QUICK_ACCESS_ROLES: { role: Role; label: string; color: string; portal: string }[] = [
  { role: "customer", label: "Customer",  color: "bg-blue-500",   portal: "/customer" },
  { role: "mover",    label: "Mover",     color: "bg-blue-600", portal: "/mover" },
  { role: "provider", label: "Provider",  color: "bg-blue-500",   portal: "/provider" },
  { role: "company",  label: "Company",   color: "bg-blue-500", portal: "/company" },
  { role: "admin",    label: "Admin",     color: "bg-slate-700",  portal: "/admin" },
];

export default function LoginView() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);

  const queryRole = params.get("role") as Role;
  const role = ROLE_DATA[queryRole] ? queryRole : "customer";
  const ActiveIcon = ROLE_DATA[role].icon;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  useEffect(() => { warmupBackend(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const isCompanyOrAdmin = role === "company" || role === "admin";
    const enteredId = isCompanyOrAdmin ? companyId : email;
    const enteredPw = isCompanyOrAdmin ? adminPassword : password;

    if (!enteredId || !enteredPw) {
      return setError("Please fill in all required fields.");
    }

    setIsSubmitting(true);

    try {
      // ── REAL API ──────────────────────────────────────────────────────────
      // POST /auth/login — backend sends OTP; verified in OtpView.
      // ─────────────────────────────────────────────────────────────────────
      await authApi.login(
        isCompanyOrAdmin
          ? { companyId: enteredId, accessKey: enteredPw, role }
          : { email: enteredId, password: enteredPw, role }
      );

      router.push(
        `/auth/otp?role=${role}&mode=login` +
        `&email=${encodeURIComponent(enteredId)}` +
        `&name=${encodeURIComponent(DEV_CREDENTIALS[role]?.name ?? "User")}`
      );
    } catch (err: unknown) {
      // ── DEV FALLBACK ──────────────────────────────────────────────────────
      // When the backend is unreachable, validate against DEV_CREDENTIALS and
      // advance to OTP so the UI flow can be exercised without a live server.
      // ─────────────────────────────────────────────────────────────────────
      const message = err instanceof Error ? err.message : "";
      const noBackend =
        !process.env.NEXT_PUBLIC_API_URL ||
        isNetworkError(err) ||
        message.startsWith("API 5");

      if (noBackend) {
        const creds = DEV_CREDENTIALS[role];
        if (enteredId !== creds.id || enteredPw !== creds.password) {
          setError(`Dev mode — use: ${creds.id} / ${creds.password}`);
        } else {
          router.push(
            `/auth/otp?role=${role}&mode=login` +
            `&email=${encodeURIComponent(enteredId)}` +
            `&name=${encodeURIComponent(creds.name)}`
          );
        }
      } else {
        setError(message || "Invalid credentials. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccess = (entry: typeof QUICK_ACCESS_ROLES[number]) => {
    setQuickLoading(entry.role);
    const creds = DEV_CREDENTIALS[entry.role] ?? DEV_CREDENTIALS.customer;
    login(
      { name: `Demo ${entry.label}`, email: creds.id },
      entry.role,
      "dev-token",
      // Customers and admins are immediately approved; supply-side roles start approved
      // in quick-access dev mode so the full dashboard is visible for testing
      "approved"
    );
    setProfileComplete(true);
    router.push(entry.portal);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[1100px] flex bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden min-h-[700px]"
      >
        {/* LEFT — branding */}
        <div className="hidden md:flex w-5/12 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

          <div className="relative z-10">
            <div onClick={() => router.push("/")} className="flex items-center gap-3 cursor-pointer group mb-12">
              <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Movers <b className="text-green-600">Padi</b>
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={role} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> {ROLE_DATA[role].tagline}
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                  Tailored for <br />
                  <span className="text-blue-500">{ROLE_DATA[role].label}s</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
                  {ROLE_DATA[role].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />)}
              </div>
              <p className="text-slate-500 text-xs font-medium">Join 2,000+ logistics pros</p>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex-1 p-8 md:p-14 lg:p-20 flex flex-col justify-center">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-3xl mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                <ActiveIcon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">Portal Access</p>
                <h4 className="text-base font-black text-slate-900 capitalize">{role} Portal</h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/auth/role?mode=login")}
              className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Change
            </button>
          </div>

          <div className="mb-8 px-1">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" /> {error}
                </motion.div>
              )}

              <div className="space-y-4">
                {(role === "company" || role === "admin") ? (
                  <>
                    <Input icon={Building2} value={companyId} onChange={setCompanyId} placeholder={role === "admin" ? "Admin ID" : "Company Identifier"} type="text" />
                    <Input icon={Lock} value={adminPassword} onChange={setAdminPassword} placeholder="Access Key" type="password" />
                  </>
                ) : (
                  <>
                    <Input icon={Mail} value={email} onChange={setEmail} placeholder="Email Address" type="email" />
                    <Input icon={Lock} value={password} onChange={setPassword} placeholder="Account Password" type="password" />
                  </>
                )}
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</button>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full group relative py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </motion.form>
          </AnimatePresence>

          {/* ── Quick Access Panel ─────────────────────────────────────────── */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setQuickOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all text-slate-500 text-xs font-bold uppercase tracking-widest"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                Quick Access (Dev)
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${quickOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-center text-[11px] text-slate-400 font-medium mt-3 mb-3">
                    Sign in instantly as any account type — no password needed
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {QUICK_ACCESS_ROLES.map((entry) => (
                      <button
                        key={entry.role}
                        type="button"
                        onClick={() => handleQuickAccess(entry)}
                        disabled={quickLoading === entry.role}
                        className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-60"
                      >
                        <div className={`w-7 h-7 ${entry.color} rounded-full flex items-center justify-center`}>
                          {quickLoading === entry.role
                            ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <Zap className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 leading-tight text-center">{entry.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/auth/role?mode=signup")}
              className="text-blue-600 font-extrabold cursor-pointer hover:underline underline-offset-4 decoration-2"
            >
              Register as a {role}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Input({
  icon: Icon, type = "text", placeholder, value, onChange,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <input
        required
        type={type}
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-500/10 focus:ring-4 focus:ring-blue-500/5"
      />
    </div>
  );
}
