"use client";

import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <section className="relative py-24 px-6 bg-slate-50 overflow-hidden">
      
      {/* Soft background glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-green-200/40 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[300px] h-[300px] bg-emerald-200/40 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Small Label */}
        <div className="inline-block mb-6 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-green-100 text-green-700">
          About MoversPadi
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          What is MoversPadi?
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          MoversPadi is a <span className="font-semibold text-slate-900">fleetless logistics marketplace</span> 
          that connects customers with trusted dispatch riders, haulage trucks, tow trucks, 
          and transport providers.
        </p>

        <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Instead of owning vehicles, we link you to available service providers 
          <span className="font-semibold text-green-600"> quickly, efficiently, and transparently.</span>
        </p>

        {/* Optional CTA */}
        <div className="mt-10">
          <button className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition-all duration-300 shadow-md">
            Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
}