"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, CheckCircle2, XCircle, LogOut, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import type { VerificationStatus } from "@/src/types/auth/types";

const ROLE_LABELS: Record<string, string> = {
  mover:    "Independent Mover",
  provider: "Transport Provider",
  company:  "Logistics Company",
};

const CHECKLIST = [
  "Identity documents (Driver's License / NIN / Passport)",
  "Profile photo (selfie)",
  "Residential address & home photo",
  "Next of kin & guarantor details",
  "Bank account for payouts",
];

const PROVIDER_EXTRA = [
  "Vehicle registration, roadworthiness & insurance",
  "Vehicle capacity & service type",
];

const COMPANY_EXTRA = [
  "CAC certificate & company documents",
  "Representative ID & details",
  "Fleet size & payout account",
];

interface Props {
  /** The real dashboard to render once approved */
  approvedDashboard: React.ReactNode;
}

export default function PendingApprovalView({ approvedDashboard }: Props) {
  const { role, verificationStatus, user, logout } = useAuthStore();
  const router = useRouter();

  // Show the real dashboard once approved
  if (verificationStatus === "approved") {
    return <>{approvedDashboard}</>;
  }

  const isRejected = verificationStatus === "rejected";
  const roleLabel = ROLE_LABELS[role ?? ""] ?? "Account";

  const checklist = [
    ...CHECKLIST,
    ...(role === "provider" ? PROVIDER_EXTRA : []),
    ...(role === "company" ? COMPANY_EXTRA : []),
  ];

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const handleResubmit = () => {
    router.push(`/${role}/onboarding`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Movers <b className="text-green-600">Padi</b>
          </span>
        </div>

        {/* Status card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">
          {/* Status icon */}
          <div className="flex justify-center mb-6">
            {isRejected ? (
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-rose-500" />
              </div>
            ) : (
              <div className="relative w-20 h-20">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-amber-500" />
                </div>
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full animate-ping bg-amber-400/20" />
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <StatusBadge status={verificationStatus} />
            <h2 className="text-2xl font-black text-slate-900 mt-4 mb-2">
              {isRejected ? "Application Not Approved" : "Application Under Review"}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {isRejected
                ? `Hi ${user?.name?.split(" ")[0] ?? "there"}, your ${roleLabel} application was not approved. Please review the requirements and resubmit.`
                : `Hi ${user?.name?.split(" ")[0] ?? "there"}, your ${roleLabel} profile has been submitted. Our team typically reviews applications within 24–48 hours.`}
            </p>
          </div>

          {/* What was submitted */}
          <div className="bg-slate-50 rounded-3xl p-6 mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {isRejected ? "Required documents" : "Submitted for review"}
            </p>
            <ul className="space-y-2.5">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isRejected ? "text-slate-300" : "text-green-500"}`} />
                  <span className="text-sm text-slate-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What happens next */}
          {!isRejected && (
            <div className="bg-blue-50 rounded-3xl p-5 mb-6 text-sm text-blue-700 font-medium leading-relaxed">
              <p className="font-bold mb-1">What happens next?</p>
              Once approved, you will receive a notification and gain full access to your dashboard to start accepting jobs.
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isRejected && (
              <button
                onClick={handleResubmit}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-600 text-white font-bold text-base hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Resubmit Application
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:border-slate-300 hover:text-slate-700 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium mt-6">
          Questions? Contact{" "}
          <a href="mailto:support@moverspadi.com" className="text-blue-500 hover:underline font-bold">
            support@moverspadi.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === "approved") return null;
  const styles =
    status === "rejected"
      ? "bg-rose-100 text-rose-600 border-rose-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const label = status === "rejected" ? "Not Approved" : "Pending Review";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "rejected" ? "bg-rose-500" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}
