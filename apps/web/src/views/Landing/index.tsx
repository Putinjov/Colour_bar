import React from "react";
import { useReveal } from "../../hooks/useReveal";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import CtaSection from "./sections/CtaSection";
import FooterSection from "./sections/FooterSection";

export default function Landing() {
  useReveal();

  return (
    <main className="w-full overflow-x-hidden snap-y snap-mandatory">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
