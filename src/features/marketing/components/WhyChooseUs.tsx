"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Receipt,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    id: "01",
    title: "Fast Matching",
    description:
      "Our AI engine scans thousands of active drivers to find the perfect match for your load in under 60 seconds.",
    icon: <Zap className="w-full h-full" />,
  },
  {
    id: "02",
    title: "Transparent Pricing",
    description:
      "Our algorithms calculate a fixed price instantly based on distance and weight. No hidden fees, ever.",
    icon: <Receipt className="w-full h-full" />,
  },
  {
    id: "03",
    title: "Trusted Movers",
    description:
      "Every driver undergoes a 7-step vetting process, including government ID verification and vehicle inspection.",
    icon: <ShieldCheck className="w-full h-full" />,
  },
  {
    id: "04",
    title: "Real-time Tracking",
    description:
      "Watch your cargo move on the map. Share live tracking links with customers via WhatsApp or SMS.",
    icon: <MapPin className="w-full h-full" />,
  },
];

export default function WhyChooseUsGrid() {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      
      {/* Soft Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-green-200/40 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[300px] h-[300px] bg-green-200/40 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Why Choose Us?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            We’ve removed the friction from logistics so you can focus on scaling your business.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/60 to-white/20"
            >
              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/60 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 overflow-hidden">

                {/* Glow Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] bg-green-500 transition duration-500" />

                {/* Background Icon */}
                <div className="absolute right-6 bottom-6 w-32 h-32 opacity-[0.03] text-slate-900 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition">
                  {feature.icon}
                </div>

                <div className="relative z-10 flex items-start gap-6 md:gap-8">

                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-white bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                      {feature.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed font-medium">
                      {feature.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-green-600 transition cursor-pointer">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Corner Glow */}
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-green-500 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}