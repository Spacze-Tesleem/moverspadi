import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ["About Us", "Careers", "News", "Partner with us"],
    Services: ["Dispatch Rider", "Haulage & Trucks", "Tow Truck Service", "Warehouse"],
    Support: ["Help Center", "Safety Guidelines", "Contact Us", "Privacy Policy"],
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900">
              Movers<span className="text-green-600">Padi</span>
            </h2>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Making logistics seamless across the country. Reliable drivers, transparent pricing, and 24/7 support for all your moving needs.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-widest">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-slate-500 hover:text-green-600 transition-colors duration-200 text-sm font-medium"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-widest">
              Stay Updated
            </h3>
            <p className="text-slate-500 text-sm mb-4 font-medium">
              Get the latest moving tips and discounts.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">
            © {currentYear} MoversPadi Technologies Ltd. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}