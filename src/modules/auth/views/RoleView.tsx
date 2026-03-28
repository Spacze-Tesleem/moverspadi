"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react"; // npm i lucide-react

export default function RoleView() {
  return (
    <Suspense>
      <RolePageInner />
    </Suspense>
  );
}

function RolePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mode = params.get("mode");

  const roles = [
    {
      name: "customer",
      label: "Customer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
      description: "Personal moving and shipping",
      color: "blue"
    },
    {
      name: "mover",
      label: "Independent Mover",
      image: "https://images.unsplash.com/photo-1554672408-730436b60dde?q=80&w=150&h=150&auto=format&fit=crop", // Scooter icon image
      description: "Individual couriers & drivers",
      color: "indigo"
    },
    {
      name: "provider",
      label: "Transport Provider",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=150&h=150&auto=format&fit=crop", // Truck image
      description: "Heavy transport services",
      color: "cyan"
    },
    {
      name: "company",
      label: "Logistics Company",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=150&h=150&auto=format&fit=crop", // Fleet image
      description: "Enterprise fleet management",
      color: "violet"
    },
    {
      name: "admin",
      label: "Admin",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
      description: "Platform management",
      color: "slate",
      hideInSignup: true,
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      setIsLoading(true);
      router.push(`/auth/${mode}?role=${selectedRole}`);
    }
  };

  const filteredRoles = roles.filter((r) => !(mode === "signup" && r.hideInSignup));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      {/* Header Section */}
      <div className="text-center max-w-2xl mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Select Your Role
        </h1>
        <p className="text-lg text-slate-500">
          Choose the account type that best describes your needs. We'll tailor your experience accordingly.
        </p>
      </div>

      {/* Grid Layout - 3 columns top, centered bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl w-full justify-center">
        {filteredRoles.map((role) => (
          <div
            key={role.name}
            onClick={() => setSelectedRole(role.name)}
            className={`group relative cursor-pointer transition-all duration-500 ${
              // This makes the last 2 items center on large screens if there are 5 total
              filteredRoles.length === 5 && (role.name === "company" || role.name === "admin") 
                ? "lg:translate-x-1/2" 
                : ""
            }`}
          >
            {/* The Overlapping Circular Image */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
              <div className={`w-24 h-24 rounded-full border-4 bg-white overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:scale-110 ${
                selectedRole === role.name ? "border-blue-500 ring-4 ring-blue-500/10" : "border-white group-hover:border-blue-100"
              }`}>
                <img 
                  src={role.image} 
                  alt={role.label} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
              </div>
              
              {/* Checkmark Badge */}
              {selectedRole === role.name && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-6 h-6" fill="currentColor" stroke="white" strokeWidth={2} />
                </div>
              )}
            </div>

            {/* The Card */}
            <div className={`pt-16 pb-8 px-6 rounded-[2.5rem] border-2 transition-all duration-500 text-center h-full flex flex-col items-center ${
              selectedRole === role.name
                ? "bg-white border-blue-500 shadow-2xl shadow-blue-200/50 scale-[1.03]"
                : "bg-white/60 border-transparent hover:border-slate-200 hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-1"
            }`}>
              <h3 className={`text-xl font-bold mb-2 transition-colors ${
                selectedRole === role.name ? "text-blue-600" : "text-slate-800"
              }`}>
                {role.label}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="mt-20">
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className={`group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
            selectedRole
              ? "bg-slate-900 text-white hover:bg-blue-600 shadow-2xl shadow-blue-200 hover:-translate-y-1"
              : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${!selectedRole && "opacity-0"}`} />
            </>
          )}
        </button>
      </div>

      {/* Sign in Footer */}
      <p className="mt-8 text-slate-500 font-medium">
        Already have an account?{" "}
        <button className="text-blue-600 hover:underline font-bold">Sign in</button>
      </p>
    </div>
  );
}