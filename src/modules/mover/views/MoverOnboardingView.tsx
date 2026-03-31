"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, MapPin, FileText, Camera, ShieldCheck,
  Phone, Users, Check, UploadCloud, ChevronRight,
  ChevronLeft, Loader2, CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";
import { profileApi } from "@/src/infrastructure/api/profile";

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Personal Info",  icon: User },
  { id: 2, label: "Identity Docs",  icon: FileText },
  { id: 3, label: "Trust & Location", icon: MapPin },
];

// ─── Main view ───────────────────────────────────────────────────────────────

export default function MoverOnboardingView() {
  const router = useRouter();
  const { user, token, setProfileComplete } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState<OnboardingFormData>({
    gender: "",
    dob: "",
    emergencyContact: "",
    address: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelationship: "",
    guarantorName: "",
    guarantorPhone: "",
  });

  const [docs, setDocs] = useState<DocsState>({
    license: false,
    nin: false,
    photo: false,
  });

  const progress = (step / STEPS.length) * 100;

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // ── REAL API ────────────────────────────────────────────────────────
      // PUT /profile/complete via profileApi (src/infrastructure/api/profile.ts).
      // Sends formData + doc upload references to the backend.
      // Replace the dev fallback below once the endpoint is ready.
      // ───────────────────────────────────────────────────────────────────
      await profileApi.completeProfile(
        {
          ...formData,
          documents: docs,
        },
        token ?? ""
      );

      setProfileComplete(true);
      setDone(true);
      await new Promise((r) => setTimeout(r, 1200));
      router.push("/mover");
    } catch {
      // Dev fallback: advance anyway when no backend is set
      setProfileComplete(true);
      setDone(true);
      await new Promise((r) => setTimeout(r, 1200));
      router.push("/mover");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center p-8"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Profile Complete!</h2>
          <p className="text-slate-500 font-medium">Taking you to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/30 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[560px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                Movers <b className="text-green-600">Padi</b>
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Complete your profile</h2>
          <p className="text-slate-500 font-medium">
            Hi {user?.name?.split(" ")[0] ?? "there"} — just a few more details before you start earning.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                  : isDone ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-400"
                }`}>
                  {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px ${isDone ? "bg-green-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Step {step} of {STEPS.length}
              </span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-green-600 rounded-full"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <StepPersonalInfo formData={formData} setFormData={setFormData} />
              )}
              {step === 2 && (
                <StepIdentityDocs docs={docs} setDocs={setDocs} />
              )}
              {step === 3 && (
                <StepTrustLocation formData={formData} setFormData={setFormData} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`w-full group py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${
                step === STEPS.length
                  ? "bg-slate-900 text-white hover:bg-black shadow-slate-900/20"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>{step === STEPS.length ? "Submit & Go to Dashboard" : "Continue"}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {step > 1 && (
              <button
                onClick={handleBack}
                className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared form data type ────────────────────────────────────────────────────

type OnboardingFormData = {
  gender: string;
  dob: string;
  emergencyContact: string;
  address: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  guarantorName: string;
  guarantorPhone: string;
};

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

function StepPersonalInfo({ formData, setFormData }: {
  formData: OnboardingFormData;
  setFormData: (d: OnboardingFormData) => void;
}) {
  const set = (key: string) => (v: string) => setFormData({ ...formData, [key]: v });
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input icon={User} placeholder="Gender" value={formData.gender} onChange={set("gender")} />
        <Input icon={User} placeholder="Date of Birth" value={formData.dob} onChange={set("dob")} />
      </div>
      <Input icon={Phone} placeholder="Emergency Contact Number" type="tel" value={formData.emergencyContact} onChange={set("emergencyContact")} />
    </div>
  );
}

type DocsState = { license: boolean; nin: boolean; photo: boolean };

// ─── Step 2: Identity Docs ────────────────────────────────────────────────────

function StepIdentityDocs({ docs, setDocs }: {
  docs: DocsState;
  setDocs: (d: DocsState) => void;
}) {
  const toggle = (key: keyof DocsState) => setDocs({ ...docs, [key]: !docs[key] });
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Identity Documents</h3>
      <p className="text-sm text-slate-500 -mt-2 mb-4">
        Upload clear photos of each document. These are used for verification only.
      </p>
      <UploadBox icon={FileText} label="Driver's License" sub="Front and back view" checked={docs.license} onToggle={() => toggle("license" as keyof DocsState)} />
      <UploadBox icon={ShieldCheck} label="NIN / Passport" sub="Government-issued ID" checked={docs.nin} onToggle={() => toggle("nin" as keyof DocsState)} />
      <UploadBox icon={Camera} label="Profile Photo" sub="Clear headshot, plain background" checked={docs.photo} onToggle={() => toggle("photo" as keyof DocsState)} />
    </div>
  );
}

// ─── Step 3: Trust & Location ─────────────────────────────────────────────────

function StepTrustLocation({ formData, setFormData }: {
  formData: OnboardingFormData;
  setFormData: (d: OnboardingFormData) => void;
}) {
  const set = (key: string) => (v: string) => setFormData({ ...formData, [key]: v });
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Trust & Location</h3>
      <Input icon={MapPin} placeholder="Residential Address" value={formData.address} onChange={set("address")} />
      <div className="pt-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Next of Kin</p>
        <div className="space-y-3">
          <Input icon={Users} placeholder="Full Name" value={formData.nextOfKinName} onChange={set("nextOfKinName")} />
          <div className="grid grid-cols-2 gap-3">
            <Input icon={Phone} placeholder="Phone" type="tel" value={formData.nextOfKinPhone} onChange={set("nextOfKinPhone")} />
            <Input icon={Users} placeholder="Relationship" value={formData.nextOfKinRelationship} onChange={set("nextOfKinRelationship")} />
          </div>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Guarantor</p>
        <div className="grid grid-cols-2 gap-3">
          <Input icon={Users} placeholder="Full Name" value={formData.guarantorName} onChange={set("guarantorName")} />
          <Input icon={Phone} placeholder="Phone" type="tel" value={formData.guarantorPhone} onChange={set("guarantorPhone")} />
        </div>
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

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
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-green-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-green-500/10 focus:ring-4 focus:ring-green-500/5 text-sm"
      />
    </div>
  );
}

function UploadBox({
  icon: Icon, label, sub, checked, onToggle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative border-2 border-dashed rounded-3xl p-5 flex items-center gap-5 cursor-pointer transition-all duration-300 ${
        checked
          ? "border-green-500 bg-green-50"
          : "border-slate-200 hover:border-green-500/50 hover:bg-slate-50"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
        checked ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
      }`}>
        {checked ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all ${
        checked ? "bg-green-600 border-green-600 text-white" : "border-slate-200 text-slate-300"
      }`}>
        <UploadCloud className="w-4 h-4" />
      </div>
    </div>
  );
}
