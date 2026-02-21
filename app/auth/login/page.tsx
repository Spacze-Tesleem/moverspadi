"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Building2, 
  Mail, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";

type Role = "customer" | "mover" | "company";

const ROLE_CONFIG: Record<Role, { label: string; icon: any; color: string }> = {
  customer: { label: "Customer", icon: User, color: "blue" },
  mover: { label: "Mover", icon: Sparkles, color: "indigo" },
  company: { label: "Company", icon: Building2, color: "violet" },
};

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [role, setRole] = useState<Role>("customer");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (role === "customer" && (!email || !password)) return setError("Credentials required");
    if (role === "mover" && !phone) return setError("Phone number required");
    if (role === "company" && (!companyId || !adminPassword)) return setError("Company auth required");

    try {
      setIsSubmitting(true);
      login({ name: "Test User" }, role, "fake-token");

      // Maintain Routes
      const paths = { customer: "/customer", mover: "/mover", company: "/company" };
      router.push(paths[role]);
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Tech Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[1000px] flex bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden"
      >
        
        {/* --- LEFT SIDE: THEMED ART --- */}
        <div className="hidden md:flex w-5/12 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
          {/* Animated Background for Image Side */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80"
              alt="Logistics Tech"
              className="object-cover w-full h-full mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Movers <br />
              <span className="text-blue-400">Padi</span>
            </h2>
          </div>

          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Experience the next generation of logistics management. Fast, secure, and reliable transport at your fingertips.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="flex-1 p-8 md:p-14 lg:p-20">
          <div className="mb-10">
            <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-400 text-sm">Please select your role to continue</p>
          </div>

          {/* ROLE SWITCHER */}
          <div className="flex p-1 bg-slate-100 rounded-[20px] mb-8 relative">
            {(["customer", "mover", "company"] as Role[]).map((item) => {
              const Icon = ROLE_CONFIG[item].icon;
              const isActive = role === item;
              return (
                <button
                  key={item}
                  onClick={() => { setRole(item); setError(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px] text-xs font-bold uppercase tracking-widest transition-all duration-300 relative z-10 ${
                    isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {ROLE_CONFIG[item].label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute inset-0 bg-white rounded-[16px] -z-10 shadow-sm border border-slate-200/50" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={role}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {/* INPUT FIELDS */}
              <div className="space-y-4">
                {role === "customer" && (
                  <>
                    <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
                    <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />
                  </>
                )}

                {role === "mover" && (
                  <div className="flex gap-3">
                    <div className="px-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center font-bold text-slate-400 text-sm">+234</div>
                    <Input icon={Phone} type="tel" placeholder="Phone Number" value={phone} onChange={setPhone} />
                  </div>
                )}

                {role === "company" && (
                  <>
                    <Input icon={Building2} type="text" placeholder="Company ID" value={companyId} onChange={setCompanyId} />
                    <Input icon={Lock} type="password" placeholder="Admin Password" value={adminPassword} onChange={setAdminPassword} />
                  </>
                )}
              </div>

              <button
                disabled={isSubmitting}
                className="w-full mt-4 group relative py-4 bg-slate-900 text-white rounded-[20px] font-bold overflow-hidden transition-all hover:bg-blue-600 disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Authenticating..." : "Sign In"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="mt-8 text-center text-slate-400 text-xs">
            Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Register Here</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Input Component
interface InputProps {
  icon: React.ComponentType<any>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function Input({ icon: Icon, type, placeholder, value, onChange }: InputProps) {
  return (
    <div className="relative group flex-1">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-blue-500 group-focus-within:text-white transition-all">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-[20px] outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
      />
    </div>
  );
}

function XCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  )
}