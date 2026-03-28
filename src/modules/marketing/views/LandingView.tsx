import Navbar from "@/src/modules/marketing/components/Navbar";
import Hero from "@/src/modules/marketing/components/Hero";
import WhoWeAre from "@/src/modules/marketing/components/WhoWeAre";
import Services from "@/src/modules/marketing/components/Services";
import WhyChooseUs from "@/src/modules/marketing/components/WhyChooseUs";
import Testimonials from "@/src/modules/marketing/components/Testimonials";
import CTA from "@/src/modules/marketing/components/CTA";
import Footer from "@/src/modules/marketing/components/Footer";

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
