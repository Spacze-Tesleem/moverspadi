"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-500">
      
      {/* Soft Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-white/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[300px] h-[300px] bg-white/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl px-6 py-12 md:px-12 md:py-16"
      >
        
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
          🚀 Trusted by fast-growing businesses
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Move your goods faster{" "}
          <span className="text-green-600">with smarter logistics</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10">
          Automate deliveries, track shipments in real-time, and scale your operations — all from one powerful platform.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          
          {/* Primary */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md w-full sm:w-auto transition duration-300"
          >
            Get Started Free
          </motion.button>
        </div>

        {/* Trust Note */}
        <p className="text-xs text-gray-400">
          No credit card required • Setup in minutes
        </p>
      </motion.div>
    </section>
  );
}