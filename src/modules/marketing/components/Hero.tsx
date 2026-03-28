"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle, 
  Star, 
  ShieldCheck, 
  TrendingUp 
} from "lucide-react";

export default function SaasHero() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50/80 -z-10 skew-x-[-12deg] translate-x-20 hidden lg:block" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-green-400/20 blur-[120px] rounded-full -z-10 mix-blend-multiply" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full -z-10 mix-blend-multiply" />

      <main className="relative pt-32 pb-24 lg:pt-[5rem] lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT SIDE: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 hover:border-green-300 transition-colors cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-600 tracking-wide">#1 Logistics Network in Africa</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Move anything, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                anywhere.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg font-medium">
              MoversPadi is the operating system for modern logistics. We connect you with vetted haulers, dispatch riders, and tow trucks in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3">
                <PlayCircle className="w-5 h-5 text-slate-400" />
                How it works
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map((i) => (
                   <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?u=${i+20}`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-slate-100" 
                   />
                 ))}
               </div>
               <div>
                 <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
                 <p className="text-sm font-bold text-slate-700">
                   Trusted by <span className="underline decoration-green-300 decoration-2 underline-offset-2">12,000+</span> users
                 </p>
               </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Hero Image & Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white transform hover:rotate-1 transition-transform duration-700 ease-out group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              
              {/* Replace this src with your actual dashboard/app screenshot */}
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                alt="MoversPadi App Interface" 
                className="w-full h-[600px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* In-Image Overlay Text */}
              <div className="absolute bottom-8 left-8 z-20 text-white">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-green-300">New Feature</p>
                <h3 className="text-2xl font-bold">Real-time Fleet Tracking</h3>
              </div>
            </div>

            {/* Floating Card 1: Success Status */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-8 top-20 bg-white/90 backdrop-blur-md p-4 pr-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-4 animate-float-slow"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Delivery Complete</p>
                <p className="text-xs text-slate-500 font-medium">Just now • Lagos</p>
              </div>
            </motion.div>

            {/* Floating Card 2: Growth Stats */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-6 bottom-32 bg-slate-900 p-5 rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col gap-3 animate-float-reverse"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <ShieldCheck size={18} className="text-green-400" />
                </div>
                <span className="text-sm font-bold text-white">Insurance Cover</span>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-slate-400 mb-1">Protected</span>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </main>

      {/* Trust Logos */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
            Powering logistics for top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Replace text with actual SVG Logos for better effect */}
             <span className="text-xl font-black text-slate-800">DHL</span>
             <span className="text-xl font-black text-slate-800">MAERSK</span>
             <span className="text-xl font-black text-slate-800">FEDEX</span>
             <span className="text-xl font-black text-slate-800">KOB0360</span>
             <span className="text-xl font-black text-slate-800">GIG LOGISTICS</span>
          </div>
        </div>
      </section>
    </div>
  );
}