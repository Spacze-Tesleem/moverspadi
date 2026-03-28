"use client";

import { motion } from "framer-motion";
import {
  Bike,
  Truck,
  Car,
  Globe,
  Zap,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Variants } from "framer-motion";

const services = [
  {
    title: "Smart Dispatch",
    desc: "Hyper-local parcel delivery with real-time tracking. Perfect for documents and food.",
    icon: <Bike className="w-6 h-6" />,
    tag: "15-30 min",
    lightBg: "bg-emerald-50",
    darkBg: "bg-emerald-500",
    text: "text-emerald-600",
  },
  {
    title: "Enterprise Haulage",
    desc: "Heavy-duty trucks for large-scale moves, office relocations, and bulk cargo.",
    icon: <Truck className="w-6 h-6" />,
    tag: "Vetted",
    lightBg: "bg-blue-50",
    darkBg: "bg-blue-500",
    text: "text-blue-600",
  },
  {
    title: "Emergency Towing",
    desc: "Stuck on the road? Get connected to the nearest tow truck in minutes.",
    icon: <Car className="w-6 h-6" />,
    tag: "24/7",
    lightBg: "bg-orange-50",
    darkBg: "bg-orange-500",
    text: "text-orange-600",
  },
  {
    title: "Inter-state Logistics",
    desc: "Moving goods across borders? Our transport network ensures safe long-distance delivery.",
    icon: <Globe className="w-6 h-6" />,
    tag: "Nationwide",
    lightBg: "bg-purple-50",
    darkBg: "bg-purple-500",
    text: "text-purple-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const, // ✅ FIX
    },
  },
};

export default function Services() {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-green-200 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-emerald-200 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-5"
            >
              <Zap className="w-3 h-3 fill-current" />
              Expert Solutions
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05]"
            >
              Logistics for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Modern World.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-sm text-slate-500 text-lg leading-relaxed border-l-2 border-slate-200 pl-6"
          >
            We've simplified supply chains so you can focus on scaling your business faster.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/60 to-white/20"
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 overflow-hidden border border-slate-100">

                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition ${service.darkBg}`} />

                {/* Content */}
                <div className="relative z-10">

                  {/* Icon */}
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-14 h-14 rounded-2xl ${service.lightBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                      <div className={service.text}>{service.icon}</div>
                    </div>

                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest shadow-sm">
                      {service.tag}
                    </span>
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-10">
                    {service.desc}
                  </p>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-900">
                      Explore
                    </span>

                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Corner Glow */}
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10 group-hover:opacity-20 transition ${service.darkBg} blur-2xl`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}