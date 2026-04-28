"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FileText, Users, Truck,
  ChevronRight, ChevronLeft, Loader2, CheckCircle2,
  UploadCloud, DollarSign, ShieldCheck, MapPin,
  Sparkles, PartyPopper, Briefcase, Phone, Hash,
} from "lucide-react";
import { useAuthStore } from "@/src/application/store/authStore";
import { apiClient } from "@/src/infrastructure/api/client";

const STEPS = [
  { id: 1, label: "Company",  icon: Building2,  color: "blue" },
  { id: 2, label: "Docs",     icon: ShieldCheck, color: "violet" },
  { id: 3, label: "Rep",      icon: Users,       color: "cyan" },
  { id: 4, label: "Fleet",    icon: Truck,       color: "amber" },
  { id: 5, label: "Finance",  icon: DollarSign,  color: "emerald" },
];

export default function CompanyOnboardingView() {
  const router = useRouter();
  const { user, token, setProfileComplete } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState({
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
    vehicleCategories: [] as string[],
    bankName: "",
    accountName: "",
    accountNumber: "",
    agreedToCommission: false,
  });

  const [docs, setDocs] = useState<{
    cacCertificate: File | null;
    companyLogo: File | null;
    companyPicture: File | null;
    signature: File | null;
  }>({
    cacCertificate: null,
    companyLogo: null,
    companyPicture: null,
    signature: null,
  });

  const activeColor = STEPS.find(s => s.id === step)?.color || "blue";

  const update = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (process.env.NEXT_PUBLIC_API_URL && token) {
        await apiClient.post("/company/onboarding", {
          ...formData,
          documents: Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, !!v])),
        }, { token });
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
      setProfileComplete(true);
      setDone(true);
      setTimeout(() => router.push("/company"), 3000);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full" />
          </motion.div>
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40">
            <PartyPopper className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Application Received!</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            We are reviewing your corporate profile. You'll be notified via email once your dashboard is unlocked.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Redirecting to Console...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#050505] transition-colors duration-500 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      
      {/* ── Background Decoration ── */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-${activeColor}-500/10 blur-[120px] rounded-full transition-colors duration-1000`} 
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[640px] relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <motion.div
            layoutId="icon-box"
            className={`w-16 h-16 bg-${activeColor}-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-${activeColor}-600/30 transition-colors duration-500`}
          >
            {step === 1 && <Briefcase className="w-8 h-8 text-white" />}
            {step === 2 && <ShieldCheck className="w-8 h-8 text-white" />}
            {step === 3 && <Users className="w-8 h-8 text-white" />}
            {step === 4 && <Truck className="w-8 h-8 text-white" />}
            {step === 5 && <Sparkles className="w-8 h-8 text-white" />}
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Enterprise Setup</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[11px] tracking-[0.2em]">Step {step} of {STEPS.length}: {STEPS[step-1].label}</p>
        </div>

        {/* ── Multi-color Step Indicator ── */}
        <div className="flex items-center gap-3 mb-10 px-4">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-700 ${
                step > s.id ? "bg-emerald-500" : step === s.id ? `bg-${activeColor}-500 shadow-lg shadow-${activeColor}-500/40` : "bg-slate-200 dark:bg-zinc-800"
              }`} />
            </div>
          ))}
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl rounded-3xl sm:rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-white/5 p-5 sm:p-10 overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Company Details</h3>
                  </div>
                  <Input label="Company Name" value={formData.companyName} onChange={(v) => update("companyName", v)} placeholder="MoversPadi Logistics Ltd" icon={<Building2 size={16}/>} />
                  <Input label="Official Email" value={formData.officialEmail} onChange={(v) => update("officialEmail", v)} placeholder="admin@company.com" type="email" />
                  <Input label="Official Phone" value={formData.officialPhone} onChange={(v) => update("officialPhone", v)} placeholder="+234 800 000 0000" icon={<Phone size={16}/>} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="City" value={formData.city} onChange={(v) => update("city", v)} placeholder="Lagos" icon={<MapPin size={16}/>} />
                    <Input label="State" value={formData.state} onChange={(v) => update("state", v)} placeholder="Lagos" />
                  </div>
                  <Input label="Company Address" value={formData.address} onChange={(v) => update("address", v)} placeholder="HQ Street, Phase 1" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Corporate Documents</h3>
                  </div>
                  <Input label="CAC Registration Number" value={formData.cacNumber} onChange={(v) => update("cacNumber", v)} placeholder="RC-1234567" icon={<Hash size={16}/>} />
                  <Input label="TIN (Tax Identification Number)" value={formData.tinNumber} onChange={(v) => update("tinNumber", v)} placeholder="Optional" icon={<FileText size={16}/>} />
                  <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Files</p>
                  {([
                    { key: "cacCertificate", label: "CAC Certificate" },
                    { key: "companyLogo",    label: "Company Logo" },
                    { key: "companyPicture", label: "Premises / Office Photo" },
                    { key: "signature",      label: "Authorized Signature" },
                  ] as const).map(({ key, label }) => (
                    <UploadItem
                      key={key}
                      label={label}
                      file={docs[key]}
                      color="violet"
                      accept="image/*,.pdf"
                      onFile={(file) => setDocs(d => ({ ...d, [key]: file }))}
                    />
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Representative Data</h3>
                  </div>
                  <Input label="Full Name" value={formData.repName} onChange={(v) => update("repName", v)} placeholder="John Doe" icon={<Users size={16}/>} />
                  <Input label="Phone Number" value={formData.repPhone} onChange={(v) => update("repPhone", v)} placeholder="+234 810 000 0000" icon={<Phone size={16}/>} />
                  <Input label="Alternate Contact" value={formData.repAltContact} onChange={(v) => update("repAltContact", v)} placeholder="+234 810 000 0001" icon={<Phone size={16}/>} />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="ID Type"
                      value={formData.repIdType}
                      onChange={(v) => update("repIdType", v)}
                      options={[
                        { label: "NIN", value: "nin" },
                        { label: "Driver's License", value: "license" },
                        { label: "Passport", value: "passport" },
                      ]}
                    />
                    <Input label="ID Number" value={formData.repIdNumber} onChange={(v) => update("repIdNumber", v)} placeholder="000 000 000" icon={<Hash size={16}/>} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Fleet Setup</h3>
                  </div>
                  <Input label="Number of Vehicles" value={formData.fleetSize} onChange={(v) => update("fleetSize", v)} placeholder="e.g. 12" type="number" icon={<Truck size={16}/>} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-3">Vehicle Categories</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Motorcycle", "Van", "Truck", "Tow Truck", "Private Car", "Bus"].map((cat) => {
                        const selected = formData.vehicleCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData((prev) => ({
                              ...prev,
                              vehicleCategories: selected
                                ? prev.vehicleCategories.filter((c) => c !== cat)
                                : [...prev.vehicleCategories, cat],
                            }))}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${selected ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-200"}`}
                          >
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "bg-amber-500 border-amber-500" : "border-slate-300 dark:border-zinc-600"}`}>
                              {selected && <CheckCircle2 size={10} className="text-white" />}
                            </div>
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Financial Details</h3>
                  </div>
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                    <Input label="Bank Name" value={formData.bankName} onChange={(v) => update("bankName", v)} placeholder="e.g. GTBank" />
                    <Input label="Account Name" value={formData.accountName} onChange={(v) => update("accountName", v)} placeholder="Company account name" />
                    <Input label="Account Number" value={formData.accountNumber} onChange={(v) => update("accountNumber", v)} placeholder="0123456789" />
                  </div>
                  <label className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.agreedToCommission ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-zinc-700"}`}>
                      {formData.agreedToCommission && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.agreedToCommission} onChange={(e) => update("agreedToCommission", e.target.checked)} />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                      I agree to the <span className="text-slate-900 dark:text-white underline">Commission Model</span> and confirm all provided corporate details are accurate.
                    </span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="flex items-center gap-4 mt-10">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="p-4 rounded-[1.5rem] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm text-white shadow-2xl transition-all ${
                isSubmitting ? "bg-slate-400" : `bg-${activeColor}-600 shadow-${activeColor}-600/30 hover:scale-[1.02] active:scale-95`
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : step === STEPS.length ? "Complete Onboarding" : "Next Milestone"}
              {!isSubmitting && step < STEPS.length && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Visual Components ──

function Input({ label, value, onChange, placeholder, type = "text", icon }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-12' : 'pl-5'} pr-5 py-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-white/5 rounded-2xl outline-none font-bold text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
        />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-white/5 rounded-2xl outline-none font-bold text-sm text-slate-800 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
      >
        <option value="">Choose</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function UploadItem({ label, file, color, accept, onFile }: {
  label: string;
  file: File | null;
  color: string;
  accept: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFile(selected);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all ${
          file
            ? `bg-${color}-500/10 border-${color}-500 text-${color}-600 shadow-lg shadow-${color}-500/10`
            : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
        }`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${file ? `bg-${color}-500 text-white` : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
          {file ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
        </div>
        <div className="text-left min-w-0">
          <p className="text-sm font-black tracking-tight">{label}</p>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest truncate">
            {file ? file.name : "Tap to upload file"}
          </p>
        </div>
      </button>
    </>
  );
}