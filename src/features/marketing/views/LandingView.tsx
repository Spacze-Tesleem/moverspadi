import Navbar from "@/src/features/marketing/components/Navbar";
import Hero from "@/src/features/marketing/components/Hero";
import WhoWeAre from "@/src/features/marketing/components/WhoWeAre";
import Services from "@/src/features/marketing/components/Services";
import WhyChooseUs from "@/src/features/marketing/components/WhyChooseUs";
import Testimonials from "@/src/features/marketing/components/Testimonials";
import CTA from "@/src/features/marketing/components/CTA";
import Footer from "@/src/features/marketing/components/Footer";

export default function LandingView() {
  return (
    <main className="bg-gray-50 text-gray-800">
      <Navbar />
      <Hero />
      <WhoWeAre />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
