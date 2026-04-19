import Navbar from "@/src/features/marketing/components/Navbar";
import Services from "@/src/features/marketing/components/Services";
import Footer from "@/src/features/marketing/components/Footer";
import CTA from "@/src/features/marketing/components/CTA";

export const metadata = { title: "Services – MoversPadi" };

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-20 bg-white text-center px-4">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
            What we offer
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
            Our Services
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From same-day dispatch to heavy haulage — every logistics need covered in one platform.
          </p>
        </div>
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
