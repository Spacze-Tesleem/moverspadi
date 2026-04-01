"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";
import { authApi } from "@/src/infrastructure/api/auth";
import type { UserRole } from "@/src/domain/auth/types";

export default function OtpView() {
  return (
    <Suspense>
      <OtpPageInner />
    </Suspense>
  );
}

function OtpPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);

  const role = (params.get("role") || "customer") as UserRole;
  const mode = params.get("mode") || "login"; // "login" | "signup"
  const email = params.get("email") || "";
  const name = params.get("name") || "User";

  const OTP_LENGTH = 6;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const focusNext = (i: number) => inputRefs.current[i + 1]?.focus();
  const focusPrev = (i: number) => { if (i > 0) inputRefs.current[i - 1]?.focus(); };

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);
    if (char) focusNext(index);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits]; next[index] = ""; setDigits(next);
      } else { focusPrev(index); }
    } else if (e.key === "ArrowLeft") { focusPrev(index); }
    else if (e.key === "ArrowRight") { focusNext(index); }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const otp = digits.join("");
  const isFilled = otp.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isFilled) return setError("Enter all 6 digits.");
    setError(null);
    setIsVerifying(true);

    try {
      if (process.env.NEXT_PUBLIC_API_URL) {
        // ── REAL API ────────────────────────────────────────────────────────
        // POST /api/auth/verify-otp → { user, role, token }
        const session = await authApi.verifyOtp({ email, otp, role });
        login(session.user, session.role as typeof role, session.token);

        if (mode === "signup" && (role === "mover" || role === "company")) {
          setProfileComplete(false);
        } else {
          setProfileComplete(true);
        }
      } else {
        // ── DEV FALLBACK ────────────────────────────────────────────────────
        // Any 6-digit code except "000000" is accepted when no backend is set.
        await new Promise((r) => setTimeout(r, 1200));
        if (otp === "000000") throw new Error("Invalid OTP");

        login({ name, email }, role, "dev-token");

        if (mode === "signup" && (role === "mover" || role === "company")) {
          setProfileComplete(false);
        } else {
          setProfileComplete(true);
        }
      }

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 800));

      if (mode === "signup" && (role === "mover" || role === "company")) {
        router.push(`/${role}/onboarding`);
      } else {
        router.push(`/${role}`);
      }
    } catch {
      setError("Incorrect code. Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    setError(null);
    setDigits(Array(OTP_LENGTH).fill(""));

    try {
      if (process.env.NEXT_PUBLIC_API_URL) {
        await authApi.resendOtp({ email, role });
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
    } finally {
      setIsResending(false);
      setCountdown(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-100/40 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white p-10 md:p-14"
      >
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Movers <b className="text-green-600">Padi</b>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Verified!</h3>
              <p className="text-slate-500 font-medium">
                {mode === "signup" && (role === "mover" || role === "company")
                  ? "Setting up your profile…"
                  : "Redirecting to your dashboard…"}
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Verify your {mode === "signup" ? "account" : "identity"}
              </h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                We sent a 6-digit code to{" "}
                {email
                  ? <span className="font-bold text-slate-700">{email}</span>
                  : "your registered email / phone"
                }. Enter it below.
              </p>

              <div className="flex gap-3 justify-between mb-6">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    autoFocus={i === 0}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-14 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-slate-50 text-slate-900
                      ${d ? "border-blue-500 bg-white shadow-sm shadow-blue-100" : "border-slate-200"}
                      focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10
                      ${error ? "border-rose-400 bg-rose-50" : ""}
                    `}
                  />
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold mb-5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleVerify}
                disabled={!isFilled || isVerifying}
                className="w-full group flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isVerifying ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Didn&apos;t receive a code?{" "}
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-blue-600 font-extrabold hover:underline underline-offset-4 decoration-2 inline-flex items-center gap-1"
                    >
                      {isResending
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <RefreshCw className="w-3.5 h-3.5" />}
                      Resend
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold">
                      Resend in <span className="tabular-nums text-slate-600">{countdown}s</span>
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
