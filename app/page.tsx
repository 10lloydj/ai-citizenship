import { BenefitsSection } from "@/components/landing/benefits-section";
import { CountrySection } from "@/components/landing/country-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { TrustSection } from "@/components/landing/trust-section";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <CountrySection />
      <HowItWorksSection />
      <TrustSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
