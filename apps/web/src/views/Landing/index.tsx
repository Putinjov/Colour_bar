import React from "react";
import { useReveal } from "../../hooks/useReveal";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import CtaSection from "./sections/CtaSection";
import FooterSection from "./sections/FooterSection";
import ServicesSection from "./sections/ServicesSection";

export default function Landing() {
  useReveal();

  return (
    <main className="w-full">
      <HeroSection />
      <ServicesSection/>
      <AboutSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
