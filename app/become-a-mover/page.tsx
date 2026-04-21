"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/src/modules/marketing/components/Navbar";
import Footer from "@/src/modules/marketing/components/Footer";
import {
  Truck, ShieldCheck, Wallet, Clock, Star,
  ChevronRight, CheckCircle2, Zap,
} from "lucide-react";

const PERKS = [
  { icon: Wallet,      title: "Earn on your schedule",   desc: "Set your own hours. Accept jobs when you want, decline when you don't." },
  { icon: Zap,         title: "Instant job matching",    desc: "Our algorithm sends you the closest, highest-paying jobs first." },
  { icon: ShieldCheck, title: "Verified & protected",    desc: "Every partner is vetted. Insurance coverage on every trip." },
  { icon: Clock,       title: "Fast payouts",            desc: "Earnings hit your wallet within 24 hours of job completion." },
  { icon: Star,        title: "Build your reputation",   desc: "Ratings and reviews help you unlock premium job tiers." },
  { icon: Truck,       title: "All vehicle types",       desc: "Motorcycle, van, truck, tow truck — we need every type." },
];

const STEPS = [
  { step: "01", title: "Sign up",          desc: "Create your account and choose your role — mover, provider, or company." },
  { step: "02", title: "Submit documents", desc: "Upload your license, vehicle registration, and insurance. Takes 5 minutes." },
  { step: "03", title: "Get verified",     desc: "Our team reviews your application within 24–48 hours." },
  { step: "04", title: "Start earning",    desc: "Go online, accept jobs, and get paid." },
];

export default function BecomeAMoverPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-900 py-28 px-4 text-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Join the fleet
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Earn more.<br />
              <span className="text-green-400">Move smarter.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Join thousands of independent movers and transport providers earning on the MoversPadi platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/auth/role?mode=signup")}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95"
              >
                Apply Now <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/auth/login?role=mover")}
                className="px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
              >
                Already a partner? Sign in
              </button>
            </div>
          </motion.div>
        </section>

        {/* Perks */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-3">Why partner with us?</h2>
              <p className="text-slate-500 text-lg">Everything you need to run a successful logistics business.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
                    <perk.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{perk.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{perk.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-3">How it works</h2>
              <p className="text-slate-500 text-lg">Get on the road in under 48 hours.</p>
            </div>
            <div className="space-y-6">
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start p-6 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
                >
                  <span className="text-4xl font-black text-green-200 leading-none shrink-0 w-14">{s.step}</span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1 ml-auto" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-green-600 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to start earning?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-md mx-auto">
            Join the MoversPadi partner network today. Free to sign up.
          </p>
          <button
            onClick={() => router.push("/auth/role?mode=signup")}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-green-700 font-black rounded-2xl shadow-xl hover:bg-green-50 transition-all active:scale-95"
          >
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
        </section>

      </main>
      <Footer />
    </>
  );
}
