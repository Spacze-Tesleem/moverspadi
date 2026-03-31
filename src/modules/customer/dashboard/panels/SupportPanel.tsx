"use client";

import { useState } from "react";
import { MessageSquare, Phone, Mail, ChevronRight, Send, HelpCircle } from "lucide-react";

const FAQS = [
  { q: "How do I track my order?",              a: "Go to Request History, select your order, and tap 'Track'. You'll see real-time GPS updates." },
  { q: "Can I cancel a booking?",               a: "Yes, within 2 minutes of booking at no charge. After that, a cancellation fee may apply." },
  { q: "How do I add money to my wallet?",      a: "Open the Wallet tab, tap 'Top Up', enter an amount, and choose your payment method." },
  { q: "What if my mover doesn't show up?",     a: "Tap 'Contact Support' in the tracking screen. We'll reassign or fully refund within 10 minutes." },
  { q: "How are movers verified?",              a: "All movers pass ID verification, background checks, and a vehicle inspection before going live." },
];

interface Props { isDark: boolean }

export default function SupportPanel({ isDark: D }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition-all resize-none ${
    D
      ? "bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className="space-y-6">
      {/* Contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Phone,        label: "Call Us",   sub: "+234 800 MOVERS",    color: "text-emerald-500", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10" },
          { icon: Mail,         label: "Email",     sub: "help@moverspadi.com", color: "text-blue-500",    bg: "bg-blue-50",    bgDark: "bg-blue-500/10" },
          { icon: MessageSquare,label: "Live Chat", sub: "Avg. 2 min reply",   color: "text-violet-500",  bg: "bg-violet-50",  bgDark: "bg-violet-500/10" },
        ].map((c) => (
          <button key={c.label} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${D ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${D ? c.bgDark : c.bg}`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>{c.label}</p>
            <p className={`text-[10px] ${D ? "text-zinc-500" : "text-slate-400"}`}>{c.sub}</p>
          </button>
        ))}
      </div>

      {/* Message form */}
      <div className={`rounded-2xl border p-5 space-y-3 ${D ? "bg-white/5 border-white/5" : "bg-white border-slate-200"}`}>
        <p className={`text-sm font-bold ${D ? "text-zinc-200" : "text-slate-800"}`}>Send a Message</p>
        {sent ? (
          <div className="py-4 text-center">
            <p className="text-emerald-500 font-bold text-sm">Message sent! We'll reply within 2 hours.</p>
          </div>
        ) : (
          <>
            <textarea
              rows={4}
              className={inputCls}
              placeholder="Describe your issue or question…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-200"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </>
        )}
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className={`w-4 h-4 ${D ? "text-zinc-500" : "text-slate-400"}`} />
          <p className={`text-xs font-bold uppercase tracking-wider ${D ? "text-zinc-500" : "text-slate-500"}`}>Frequently Asked</p>
        </div>
        <div className={`rounded-2xl border overflow-hidden divide-y ${D ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${D ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
              >
                <p className={`text-sm font-semibold ${D ? "text-zinc-200" : "text-slate-800"}`}>{faq.q}</p>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""} ${D ? "text-zinc-600" : "text-slate-300"}`} />
              </button>
              {openFaq === i && (
                <div className={`px-5 pb-4 text-sm leading-relaxed ${D ? "text-zinc-400" : "text-slate-500"}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
