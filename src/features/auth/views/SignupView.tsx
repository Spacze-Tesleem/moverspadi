"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Lock, ChevronRight,
  ShieldCheck, Loader2, AlertCircle,
} from "lucide-react";
import { authApi, isNetworkError, warmupBackend } from "@/src/services/api/auth";

type Role = "customer" | "mover" | "provider" | "company";

export default function SignupView() {
  return (
    <Suspense>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "customer";

  useEffect(() => { warmupBackend(); }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleLabel =
    role === "company"   ? "Logistics Company" :
    role === "mover"     ? "Independent Mover" :
    role === "provider"  ? "Transport Provider" :
    "Customer";

  const validate = () => {
    if (!formData.fullName.trim()) return "Full name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!formData.phone.trim()) return "Phone number is required.";
    if (formData.password.length < 8) return "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setError(null);
    setIsSubmitting(true);

    try {
      // ── REAL API ──────────────────────────────────────────────────────────
      // POST /auth/signup via authApi (src/infrastructure/api/auth.ts).
      // Set NEXT_PUBLIC_API_URL in .env.local to point at the real backend.
      // Expected response: { user, role, token } matching AuthSession.
      // The backend should send an OTP to formData.email / phone on success.
      // ─────────────────────────────────────────────────────────────────────
      await authApi.signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role,
      });

      // login() is called in OtpView after the code is verified — not here.
      router.push(
        `/auth/otp?role=${role}&mode=signup` +
        `&email=${encodeURIComponent(formData.email)}` +
        `&name=${encodeURIComponent(formData.fullName)}`
      );
    } catch (err: unknown) {
      // ── DEV FALLBACK ──────────────────────────────────────────────────────
      // When NEXT_PUBLIC_API_URL is unset the fetch fails with a network error.
      // We still advance to OTP so the UI flow works without a backend.
      // Remove this block once the real backend is connected.
      // ─────────────────────────────────────────────────────────────────────
      const message = err instanceof Error ? err.message : "";
      const noBackend =
        !process.env.NEXT_PUBLIC_API_URL ||
        isNetworkError(err) ||
        message.startsWith("API 5");

      if (noBackend) {
        router.push(
          `/auth/otp?role=${role}&mode=signup` +
          `&email=${encodeURIComponent(formData.email)}` +
          `&name=${encodeURIComponent(formData.fullName)}`
        );
      } else {
        setError(message || "Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/30 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[520px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                Movers <b className="text-green-600">Padi</b>
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            Create your account
          </h2>
          <p className="text-slate-500 font-medium">
            Signing up as a{" "}
            <span className="font-bold text-slate-700">{roleLabel}</span>
            {(role === "mover" || role === "provider" || role === "company") && (
              <> — complete your profile after verification</>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {error && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <Input icon={User} placeholder="Full Name" value={formData.fullName}
              onChange={(v) => setFormData({ ...formData, fullName: v })} />
            <Input icon={Mail} placeholder="Email Address" type="email" value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })} />
            <Input icon={Phone} placeholder="Phone Number" type="tel" value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={Lock} type="password" placeholder="Password" value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })} />
              <Input icon={Lock} type="password" placeholder="Confirm" value={formData.confirmPassword}
                onChange={(v) => setFormData({ ...formData, confirmPassword: v })} />
            </div>
          </motion.div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group py-4 rounded-2xl font-bold text-lg bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => router.push(`/auth/login?role=${role}`)}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-green-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <input
        required
        type={type}
        autoComplete={type === "password" ? "new-password" : type === "email" ? "email" : "off"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-green-500/10 focus:ring-4 focus:ring-green-500/5"
      />
    </div>
  );
}
