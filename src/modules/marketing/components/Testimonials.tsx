import { Star, ArrowRight, Quote, ShieldCheck } from "lucide-react";

const testimonials = [
  {
    tag: "Haulage",
    text: "MoversPadi connected me to a dispatch rider in minutes. My package arrived faster than expected!",
    name: "Mary C",
    handle: "@maryc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    tag: "Logistics",
    text: "Transparent pricing and reliable drivers made my haulage experience smooth and stress-free. The best in the market.",
    name: "Robert Fox",
    handle: "@robert_logix",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    tag: "Emergency",
    text: "I found a tow truck quickly through MoversPadi when my car broke down—super convenient and safe.",
    name: "Sarah Jenkins",
    handle: "@sjenks",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden">
      {/* Subtle Grainy Background Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Real stories from <br /> our <span className="text-green-600 underline decoration-green-100 underline-offset-8">community.</span>
            </h2>
            <p className="text-slate-500 text-lg">
                We help thousands of people move their goods across the country with zero stress.
            </p>
          </div>
          
          {/* Category Pill Filters (SaaS Style) */}
          <div className="flex flex-wrap gap-2">
            {['All Reviews', 'Logistics', 'Haulage', 'Towing'].map((tab, i) => (
              <button key={tab} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          {testimonials.map((item, i) => (
            <div key={i} className="group relative">
              
              {/* Main Decorative Quote Mark */}
              <Quote className="absolute -top-6 -left-2 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" size={80} />

              {/* The "Main" Card */}
              <div className="relative bg-white border border-slate-100 rounded-[3rem] p-10 pb-28 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-1">
                
                <div className="flex items-center gap-1 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">#{item.tag}</span>
                    <div className="ml-auto flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                </div>

                <p className="text-slate-800 text-xl leading-relaxed font-semibold italic tracking-tight">
                  "{item.text}"
                </p>
              </div>

              {/* The "Floating" Profile Card */}
              <div className="absolute -bottom-8 left-8 right-8 bg-slate-900 rounded-[2rem] p-4 flex items-center gap-4 shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:bg-blue-600">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <ShieldCheck size={14} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <p className="text-slate-400 group-hover:text-green-100 text-xs font-medium">{item.handle}</p>
                </div>
                <div className="bg-white/10 p-2 rounded-xl border border-white/10 text-white">
                    <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}