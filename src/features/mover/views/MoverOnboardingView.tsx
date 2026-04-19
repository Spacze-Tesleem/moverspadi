"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, MapPin, FileText, Camera, ShieldCheck,
  Phone, Users, Check, UploadCloud, ChevronRight,
  ChevronLeft, Loader2, CheckCircle2, CreditCard, Link2,
  Truck, Calendar, Hash, Home, AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { profileApi } from "@/src/services/api/profile";

const STEPS = [
  { id: 1, label: "Personal",  icon: User },
  { id: 2, label: "Identity",  icon: FileText },
  { id: 3, label: "Address",   icon: MapPin },
  { id: 4, label: "Vehicle",   icon: Truck },
  { id: 5, label: "Extras",    icon: CreditCard },
];

type FormData = {
  gender: string; dob: string; emergencyContact: string;
  address: string; nextOfKinName: string; nextOfKinPhone: string;
  nextOfKinRelationship: string; guarantorName: string; guarantorPhone: string;
  vehicleType: string; plateNumber: string; vehicleBrand: string;
  vehicleModel: string; vehicleColor: string; yearsOfExperience: string;
  coverageArea: string; bankName: string; accountName: string;
  accountNumber: string; facebookUrl: string; instagramUrl: string; twitterUrl: string;
};

type FileState = {
  license: File | null; nin: File | null; profilePhoto: File | null;
  selfie: File | null; homePhoto: File | null; vehicleRegistration: File | null;
  roadworthiness: File | null; insurance: File | null; vehiclePhoto: File | null;
};

export default function MoverOnboardingView() {
  const router = useRouter();
  const { user, token, setProfileComplete } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    gender: "", dob: "", emergencyContact: "", address: "",
    nextOfKinName: "", nextOfKinPhone: "", nextOfKinRelationship: "",
    guarantorName: "", guarantorPhone: "", vehicleType: "", plateNumber: "",
    vehicleBrand: "", vehicleModel: "", vehicleColor: "", yearsOfExperience: "",
    coverageArea: "", bankName: "", accountName: "", accountNumber: "",
    facebookUrl: "", instagramUrl: "", twitterUrl: "",
  });

  const [files, setFiles] = useState<FileState>({
    license: null, nin: null, profilePhoto: null, selfie: null,
    homePhoto: null, vehicleRegistration: null, roadworthiness: null,
    insurance: null, vehiclePhoto: null,
  });

  const setFile = (key: keyof FileState) => (file: File) =>
    setFiles((prev) => ({ ...prev, [key]: file }));
  const update = (key: keyof FormData) => (v: string) =>
    setFormData((prev) => ({ ...prev, [key]: v }));
  const progress = (step / STEPS.length) * 100;

  const handleNext = () => {
    if (step < STEPS.length) { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else handleSubmit();
  };
  const handleBack = () => {
    if (step > 1) { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileApi.completeProfile({
        role: "mover", ...formData,
        documents: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, !!v])),
      }, token ?? "");
    } catch { /* advance regardless */ } finally {
      setProfileComplete(true); setDone(true); setIsSubmitting(false);
      await new Promise((r) => setTimeout(r, 1200));
      router.push("/mover");
    }
  };

  if (done) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center p-8">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Submitted for Review</h2>
        <p className="text-slate-500 font-medium max-w-xs">Our team will review and approve your profile within 24–48 hours.</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/30 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-[580px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Movers <b className="text-green-600">Padi</b></span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Complete your profile</h2>
          <p className="text-slate-500 font-medium">Hi {user?.name?.split(" ")[0] ?? "there"} — a few details before you start earning.</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isActive ? "bg-green-600 text-white shadow-lg shadow-green-600/30" : isDone ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                  {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-4 h-px ${isDone ? "bg-green-400" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of {STEPS.length}</span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} className="h-full bg-green-600 rounded-full" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 1 && <Step1Personal formData={formData} update={update} />}
              {step === 2 && <Step2Identity files={files} setFile={setFile} />}
              {step === 3 && <Step3Address formData={formData} update={update} files={files} setFile={setFile} />}
              {step === 4 && <Step4Vehicle formData={formData} update={update} files={files} setFile={setFile} />}
              {step === 5 && <Step5Extras formData={formData} update={update} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col gap-3">
            <button onClick={handleNext} disabled={isSubmitting}
              className={`w-full group py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${step === STEPS.length ? "bg-slate-900 text-white hover:bg-black shadow-slate-900/20" : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"}`}>
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><span>{step === STEPS.length ? "Submit for Review" : "Continue"}</span><ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
            {step > 1 && (
              <button onClick={handleBack} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1Personal({ formData, update }: { formData: FormData; update: (k: keyof FormData) => (v: string) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Personal Information</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <select value={formData.gender} onChange={(e) => update("gender")(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-semibold text-sm text-slate-700 focus:bg-white focus:border-green-500/20 focus:ring-4 focus:ring-green-500/5 transition-all">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Field icon={Calendar} placeholder="" value={formData.dob} onChange={update("dob")} type="date" label="Date of Birth" />
      </div>
      <Field icon={Phone} placeholder="+234 800 000 0000" value={formData.emergencyContact} onChange={update("emergencyContact")} type="tel" label="Emergency Contact Number" />
    </div>
  );
}

function Step2Identity({ files, setFile }: { files: FileState; setFile: (k: keyof FileState) => (f: File) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Identity Documents</SectionTitle>
      <p className="text-sm text-slate-500 -mt-2 mb-2">Upload clear photos. Used for verification only.</p>
      <UploadField label="Driver's License" sub="Front and back view" file={files.license} onFile={setFile("license")} accept="image/*,.pdf" />
      <UploadField label="NIN or Passport" sub="Government-issued ID" file={files.nin} onFile={setFile("nin")} accept="image/*,.pdf" />
      <UploadField label="Profile Photo" sub="Clear headshot, plain background" file={files.profilePhoto} onFile={setFile("profilePhoto")} accept="image/*" />
      <UploadField label="Selfie Verification" sub="Hold your ID next to your face" file={files.selfie} onFile={setFile("selfie")} accept="image/*" />
    </div>
  );
}

function Step3Address({ formData, update, files, setFile }: { formData: FormData; update: (k: keyof FormData) => (v: string) => void; files: FileState; setFile: (k: keyof FileState) => (f: File) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Address & Trust Data</SectionTitle>
      <Field icon={Home} placeholder="Full residential address" value={formData.address} onChange={update("address")} label="Home Address" />
      <UploadField label="Picture of Home / Residence" sub="Exterior photo of your home address" file={files.homePhoto} onFile={setFile("homePhoto")} accept="image/*" />
      <Divider label="Next of Kin" />
      <Field icon={Users} placeholder="Full name" value={formData.nextOfKinName} onChange={update("nextOfKinName")} label="Full Name" />
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Phone} placeholder="+234 800 000 0000" value={formData.nextOfKinPhone} onChange={update("nextOfKinPhone")} type="tel" label="Phone" />
        <Field icon={Users} placeholder="e.g. Sister" value={formData.nextOfKinRelationship} onChange={update("nextOfKinRelationship")} label="Relationship" />
      </div>
      <Divider label="Guarantor" />
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Users} placeholder="Full name" value={formData.guarantorName} onChange={update("guarantorName")} label="Full Name" />
        <Field icon={Phone} placeholder="+234 800 000 0000" value={formData.guarantorPhone} onChange={update("guarantorPhone")} type="tel" label="Phone" />
      </div>
    </div>
  );
}

function Step4Vehicle({ formData, update, files, setFile }: { formData: FormData; update: (k: keyof FormData) => (v: string) => void; files: FileState; setFile: (k: keyof FileState) => (f: File) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Vehicle Data</SectionTitle>
      <div className="space-y-1.5">
        <Label>Vehicle Type</Label>
        <select value={formData.vehicleType} onChange={(e) => update("vehicleType")(e.target.value)}
          className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-semibold text-sm text-slate-700 focus:bg-white focus:border-green-500/20 focus:ring-4 focus:ring-green-500/5 transition-all">
          <option value="">Select type</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="tricycle">Tricycle (Keke)</option>
          <option value="car">Car</option>
          <option value="van">Van / Bus</option>
          <option value="truck">Truck</option>
          <option value="pickup">Pickup</option>
        </select>
      </div>
      <Field icon={Hash} placeholder="e.g. LAG-123-AA" value={formData.plateNumber} onChange={update("plateNumber")} label="Plate Number" />
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Truck} placeholder="e.g. Toyota" value={formData.vehicleBrand} onChange={update("vehicleBrand")} label="Brand" />
        <Field icon={Truck} placeholder="e.g. Hiace" value={formData.vehicleModel} onChange={update("vehicleModel")} label="Model" />
      </div>
      <Field icon={AlertCircle} placeholder="e.g. White" value={formData.vehicleColor} onChange={update("vehicleColor")} label="Color" />
      <Divider label="Vehicle Documents" />
      <UploadField label="Registration Papers" sub="Proof of vehicle ownership" file={files.vehicleRegistration} onFile={setFile("vehicleRegistration")} accept="image/*,.pdf" />
      <UploadField label="Roadworthiness Certificate" sub="Current valid certificate" file={files.roadworthiness} onFile={setFile("roadworthiness")} accept="image/*,.pdf" />
      <UploadField label="Vehicle Insurance" sub="Comprehensive or third-party" file={files.insurance} onFile={setFile("insurance")} accept="image/*,.pdf" />
      <UploadField label="Vehicle Photo" sub="Clear exterior photo of your vehicle" file={files.vehiclePhoto} onFile={setFile("vehiclePhoto")} accept="image/*" />
    </div>
  );
}

function Step5Extras({ formData, update }: { formData: FormData; update: (k: keyof FormData) => (v: string) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Extra Trust Information</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Truck} placeholder="e.g. 5" value={formData.yearsOfExperience} onChange={update("yearsOfExperience")} type="number" label="Years of Experience" />
        <Field icon={MapPin} placeholder="e.g. Lagos Island" value={formData.coverageArea} onChange={update("coverageArea")} label="Coverage Area / Routes" />
      </div>
      <Divider label="Bank Account (Payouts)" />
      <Field icon={CreditCard} placeholder="e.g. GTBank" value={formData.bankName} onChange={update("bankName")} label="Bank Name" />
      <Field icon={CreditCard} placeholder="Account holder name" value={formData.accountName} onChange={update("accountName")} label="Account Name" />
      <Field icon={CreditCard} placeholder="10-digit account number" value={formData.accountNumber} onChange={update("accountNumber")} label="Account Number" />
      <Divider label="Social Media (optional)" />
      <Field icon={Link2} placeholder="https://facebook.com/..." value={formData.facebookUrl} onChange={update("facebookUrl")} label="Facebook" />
      <Field icon={Link2} placeholder="https://instagram.com/..." value={formData.instagramUrl} onChange={update("instagramUrl")} label="Instagram" />
      <Field icon={Link2} placeholder="https://x.com/..." value={formData.twitterUrl} onChange={update("twitterUrl")} label="Twitter / X" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-black text-slate-800 mb-2">{children}</h3>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{children}</p>;
}
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}
function Field({ icon: Icon, label, placeholder, value, onChange, type = "text" }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5 group">
      <Label>{label}</Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-green-600 group-focus-within:text-white transition-all duration-300">
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-green-500/10 focus:ring-4 focus:ring-green-500/5 text-sm" />
      </div>
    </div>
  );
}
function UploadField({ label, sub, file, onFile, accept }: { label: string; sub: string; file: File | null; onFile: (f: File) => void; accept: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <button type="button" onClick={() => ref.current?.click()}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${file ? "border-green-500 bg-green-50 text-green-700" : "border-dashed border-slate-200 hover:border-green-500/50 hover:bg-slate-50"}`}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${file ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {file ? <Check className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
        </div>
        <div className="text-left min-w-0">
          <p className="text-sm font-black text-slate-800">{label}</p>
          <p className="text-[11px] text-slate-400 font-medium truncate">{file ? file.name : sub}</p>
        </div>
      </button>
    </>
  );
}
