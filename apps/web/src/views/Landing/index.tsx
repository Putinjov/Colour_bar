import React from "react";
import { useReveal } from "../../hooks/useReveal.js";
import HeroSection from "./sections/HeroSection.js";
import AboutSection from "./sections/AboutSection.js";
import CtaSection from "./sections/CtaSection.js";
import FooterSection from "./sections/FooterSection.js";
import ServicesSection from "./sections/ServicesSection.js";

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
