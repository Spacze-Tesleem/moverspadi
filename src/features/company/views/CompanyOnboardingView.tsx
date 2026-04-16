"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FileText, Users, Truck,
  ChevronRight, ChevronLeft, Loader2, CheckCircle2,
  UploadCloud, DollarSign,
} from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { apiClient } from "@/src/services/api/client";

const STEPS = [
  { id: 1, label: "Company Details", icon: Building2 },
  { id: 2, label: "Documents", icon: FileText },
  { id: 3, label: "Representative", icon: Users },
  { id: 4, label: "Fleet & Finance", icon: Truck },
];

interface OnboardingData {
  companyName: string;
  officialEmail: string;
  officialPhone: string;
  address: string;
  city: string;
  state: string;
  cacNumber: string;
  tinNumber: string;
  repName: string;
  repPhone: string;
  repIdType: string;
  repIdNumber: string;
  repAltContact: string;
  fleetSize: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  agreedToCommission: boolean;
}

interface DocsState {
  cacCertificate: boolean;
  companyPicture: boolean;
  signature: boolean;
}

export default function CompanyOnboardingView() {
  const router = useRouter();
  const { user, token, setProfileComplete } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    companyName: "",
    officialEmail: user?.email || "",
    officialPhone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    cacNumber: "",
    tinNumber: "",
    repName: "",
    repPhone: "",
    repIdType: "",
    repIdNumber: "",
    repAltContact: "",
    fleetSize: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    agreedToCommission: false,
  });

  const [docs, setDocs] = useState<DocsState>({
    cacCertificate: false,
    companyPicture: false,
    signature: false,
  });

  const progress = (step / STEPS.length) * 100;

  const update = (key: keyof OnboardingData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (process.env.NEXT_PUBLIC_API_URL && token) {
        await apiClient.post("/company/onboarding", { ...formData, documents: docs }, { token });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setProfileComplete(true);
      setDone(true);
      setTimeout(() => router.push("/company"), 2000);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Submitted for Review</h2>
          <p className="text-slate-500 max-w-sm">
            Your company profile has been submitted. Our team will review and approve it shortly.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 font-sans">
      <div className="w-full max-w-[560px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Company Setup</h2>
          <p className="text-slate-500 mt-1 font-medium">Complete your business profile to start accepting orders</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                step > s.id ? "bg-blue-600 text-white" : step === s.id ? "bg-blue-600 text-white ring-4 ring-indigo-100" : "bg-slate-200 text-slate-400"
              }`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full transition-all ${step > s.id ? "bg-blue-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-2xl shadow-slate-200/60 border border-white p-8">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Company Details ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-4">Company Details</h3>
                <Field label="Company Name" value={formData.companyName} onChange={(v) => update("companyName", v)} placeholder="e.g. Chukwu Logistics Ltd" />
                <Field label="Official Email" value={formData.officialEmail} onChange={(v) => update("officialEmail", v)} placeholder="info@company.com" type="email" />
                <Field label="Official Phone" value={formData.officialPhone} onChange={(v) => update("officialPhone", v)} placeholder="+234 800 000 0000" type="tel" />
                <Field label="Company Address" value={formData.address} onChange={(v) => update("address", v)} placeholder="Street address" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City" value={formData.city} onChange={(v) => update("city", v)} placeholder="Lagos" />
                  <Field label="State" value={formData.state} onChange={(v) => update("state", v)} placeholder="Lagos" />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Documents ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-4">Corporate Documents</h3>
                <Field label="CAC Number" value={formData.cacNumber} onChange={(v) => update("cacNumber", v)} placeholder="RC000000" />
                <Field label="TIN (optional)" value={formData.tinNumber} onChange={(v) => update("tinNumber", v)} placeholder="Tax identification number" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">Upload Documents</p>
                {(["cacCertificate", "companyPicture", "signature"] as (keyof DocsState)[]).map((key) => (
                  <UploadRow
                    key={key}
                    label={key === "cacCertificate" ? "CAC Certificate" : key === "companyPicture" ? "Company Photo" : "Company Signature"}
                    uploaded={docs[key]}
                    onToggle={() => setDocs((d) => ({ ...d, [key]: !d[key] }))}
                  />
                ))}
              </motion.div>
            )}

            {/* ── STEP 3: Representative ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-4">Company Representative</h3>
                <Field label="Full Name" value={formData.repName} onChange={(v) => update("repName", v)} placeholder="Representative's full name" />
                <Field label="Phone" value={formData.repPhone} onChange={(v) => update("repPhone", v)} placeholder="+234 800 000 0000" type="tel" />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID Type</label>
                  <select
                    value={formData.repIdType}
                    onChange={(e) => update("repIdType", e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none text-slate-700 font-semibold focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  >
                    <option value="">Select ID type</option>
                    <option value="nin">National ID (NIN)</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                    <option value="voters_card">Voter&apos;s Card</option>
                  </select>
                </div>
                <Field label="ID Number" value={formData.repIdNumber} onChange={(v) => update("repIdNumber", v)} placeholder="ID document number" />
                <Field label="Alternate Contact" value={formData.repAltContact} onChange={(v) => update("repAltContact", v)} placeholder="Alternate phone or email" />
              </motion.div>
            )}

            {/* ── STEP 4: Fleet & Finance ── */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-4">Fleet & Payment Details</h3>
                <Field label="Number of Vehicles" value={formData.fleetSize} onChange={(v) => update("fleetSize", v)} placeholder="e.g. 5" type="number" />
                <div className="h-px bg-slate-100 my-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payout Account</p>
                <Field label="Bank Name" value={formData.bankName} onChange={(v) => update("bankName", v)} placeholder="e.g. First Bank" />
                <Field label="Account Name" value={formData.accountName} onChange={(v) => update("accountName", v)} placeholder="Account holder name" />
                <Field label="Account Number" value={formData.accountNumber} onChange={(v) => update("accountNumber", v)} placeholder="10-digit account number" />
                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToCommission}
                    onChange={(e) => update("agreedToCommission", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500 font-medium">
                    I agree to MoversPadi&apos;s <span className="text-blue-600 font-bold">commission terms</span> and understand that a platform fee will be deducted from each completed order.
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === STEPS.length ? (
                <>
                  <DollarSign className="w-4 h-4" />
                  Submit for Review
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all"
      />
    </div>
  );
}

function UploadRow({
  label, uploaded, onToggle,
}: {
  label: string; uploaded: boolean; onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
        uploaded ? "border-indigo-500/30 bg-indigo-50/50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${uploaded ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
        {uploaded ? <CheckCircle2 className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${uploaded ? "text-indigo-700" : "text-slate-700"}`}>{label}</p>
        <p className="text-xs text-slate-400">{uploaded ? "Marked as uploaded" : "Click to mark as uploaded"}</p>
      </div>
    </button>
  );
}
