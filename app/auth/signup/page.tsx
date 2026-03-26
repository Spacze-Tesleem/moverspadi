"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Lock, ChevronRight, ChevronLeft,
  Camera, FileText, MapPin, Users, ShieldCheck, Check,
  UploadCloud, AlertCircle, Loader2
} from "lucide-react";

type Role = "customer" | "mover" | "company";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "customer";

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //  GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    otp: "",
    address: "",
    nextOfKin: "",
    guarantor: "",
    emergencyContact: "",
  });

  const totalSteps = role === "customer" ? 1 : 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // Basic validation for Step 1
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) return;
      if (formData.password !== formData.confirmPassword) return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.yourapp.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password: formData.confirmPassword,
          role,
        }),
      });

      const data = await res.json();

      // ✅ Save token
      localStorage.setItem("token", data.token);

      // ✅ Redirect
      if (role === "customer") {
        router.push(`/${role}`);
      } else {
        router.push(`/onboarding/${role}`);
      }

    } catch (err) {
      console.error(err);
      alert("Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

return (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">

    {/* Background Decor (Matching Login Style) */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/30 blur-[120px]" />
    </div>

    <div className="relative w-full max-w-[550px]">

      {/* LOGO & HEADER */}
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
          {role === "customer" ? "Create Account" : `Join as a ${role}`}
        </h2>
        <p className="text-slate-500 font-medium">
          {totalSteps > 1 ? `Step ${step}: ${step === 1 ? "Account Basics" :
              step === 2 ? "Personal Info" :
                step === 3 ? "Identity" : "Trust & Location"
            }` : "Fill in your details to get started"}
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">

        {/* PROGRESS BAR */}
        {totalSteps > 1 && (
          <div className="mb-10">
            <div className="flex justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-green-600"
              />
            </div>
          </div>
        )}

        {/* FORM STEPS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {step === 1 && <StepBasicInfo formData={formData} setFormData={setFormData} />}
            {step === 2 && <StepExtra formData={formData} setFormData={setFormData} />}
            {step === 3 && <StepIdentity />}
            {step === 4 && <StepAddress formData={formData} setFormData={setFormData} />}
          </motion.div>
        </AnimatePresence>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`w-full group relative py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all flex items-center justify-center gap-3 shadow-xl ${step === totalSteps
                ? "bg-slate-900 text-white hover:bg-black shadow-slate-900/20"
                : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"
              }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>{step === totalSteps ? "Finish & Create Account" : "Continue to Next Step"}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {step > 1 && (
            <button
              onClick={handleBack}
              className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Go back
            </button>
          )}
        </div>

        {step === 1 && (
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <button onClick={() => router.push('/auth/login')} className="text-blue-600 font-bold hover:underline underline-offset-4">Sign in</button>
          </p>
        )}
      </div>
    </div>
  </div>
);
}

/* ---------------- STEP 1 ---------------- */
function StepBasicInfo({ formData, setFormData }: any) {
  return (
    <div className="space-y-4">
      <Input icon={User} placeholder="Full Name"
        value={formData.fullName}
        onChange={(v: string) => setFormData({ ...formData, fullName: v })}
      />
      <Input icon={Mail} placeholder="Email Address" type="email"
        value={formData.email}
        onChange={(v: string) => setFormData({ ...formData, email: v })}
      />
      <Input icon={Phone} placeholder="Phone Number" type="tel"
        value={formData.phone}
        onChange={(v: string) => setFormData({ ...formData, phone: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input icon={Lock} type="password" placeholder="Password"
          value={formData.password}
          onChange={(v: string) => setFormData({ ...formData, password: v })}
        />
        <Input icon={Lock} type="password" placeholder="Confirm"
          value={formData.confirmPassword}
          onChange={(v: string) => setFormData({ ...formData, confirmPassword: v })}
        />
      </div>
    </div>
  );
}

/* ---------------- STEP 2 ---------------- */
function StepExtra({ formData, setFormData }: any) {
  return (
    <div className="space-y-4">
      <Input icon={Users} placeholder="Gender (e.g. Male, Female)"
        value={formData.gender}
        onChange={(v: string) => setFormData({ ...formData, gender: v })}
      />
      <Input icon={FileText} placeholder="Date of Birth (DD/MM/YYYY)"
        value={formData.dob}
        onChange={(v: string) => setFormData({ ...formData, dob: v })}
      />
      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed font-medium">
          A verification OTP has been sent to your phone number. Please enter it below to verify your identity.
        </p>
      </div>
      <Input icon={ShieldCheck} placeholder="Enter 6-digit OTP"
        value={formData.otp}
        onChange={(v: string) => setFormData({ ...formData, otp: v })}
      />
    </div>
  );
}

/* ---------------- STEP 3 ---------------- */
function StepIdentity() {
  return (
    <div className="space-y-4">
      <UploadBox icon={FileText} label="Driver License" sub="Upload front and back view" />
      <UploadBox icon={ShieldCheck} label="NIN / Passport" sub="Government issued document" />
      <UploadBox icon={Camera} label="Profile Picture" sub="Clear headshot photo" />
    </div>
  );
}

/* ---------------- STEP 4 ---------------- */
function StepAddress({ formData, setFormData }: any) {
  return (
    <div className="space-y-4">
      <Input icon={MapPin} placeholder="Residential Address"
        value={formData.address}
        onChange={(v: string) => setFormData({ ...formData, address: v })}
      />
      <Input icon={Users} placeholder="Next of Kin (Name & Phone)"
        value={formData.nextOfKin}
        onChange={(v: string) => setFormData({ ...formData, nextOfKin: v })}
      />
      <Input icon={ShieldCheck} placeholder="Guarantor Details"
        value={formData.guarantor}
        onChange={(v: string) => setFormData({ ...formData, guarantor: v })}
      />
      <Input icon={Phone} placeholder="Emergency Contact" type="tel"
        value={formData.emergencyContact}
        onChange={(v: string) => setFormData({ ...formData, emergencyContact: v })}
      />
    </div>
  );
}

/* ---------------- REUSABLE INPUT ---------------- */
function Input({ icon: Icon, type = "text", placeholder, value, onChange }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-green-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-green-500/10 focus:ring-4 focus:ring-green-500/5"
      />
    </div>
  );
}

/* ---------------- REUSABLE UPLOAD ---------------- */
function UploadBox({ label, sub, icon: Icon }: any) {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div
      onClick={() => setUploaded(!uploaded)}
      className={`relative border-2 border-dashed rounded-3xl p-5 flex items-center gap-5 cursor-pointer transition-all duration-300 ${uploaded ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-green-500/50 hover:bg-slate-50"
        }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${uploaded ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
        }`}>
        {uploaded ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-slate-800 tracking-tight">{label}</p>
        <p className="text-[11px] text-slate-400 font-medium leading-none">{sub}</p>
      </div>
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${uploaded ? "bg-green-600 border-green-600 text-white" : "border-slate-200 text-slate-300"
        }`}>
        <UploadCloud className="w-4 h-4" />
      </div>
    </div>
  );
}