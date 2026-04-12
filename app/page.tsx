import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Logos } from "@/components/landing/logos";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Integrations } from "@/components/landing/integrations";
import { Stats } from "@/components/landing/stats";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CtaSection, Footer } from "@/components/landing/cta-footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Logos />
      <HowItWorks />
      <Features />
      <Integrations />
      <Stats />
      <Pricing />
      <FAQ />
      <CtaSection />
      <Footer />
    </main>
  );
}
