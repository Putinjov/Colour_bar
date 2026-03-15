import React, { Suspense, lazy } from "react";
import { useReveal } from "../../../hooks/useReveal.js";
import HeroSection from "../../../views/Landing/sections/HeroSection.js";
import AboutSection from "../../../views/Landing/sections/AboutSection.js";
import CtaSection from "../../../views/Landing/sections/CtaSection.js";
import FooterSection from "../../../views/Landing/sections/FooterSection.js";
import ServicesSectionSkeleton from "../components/ServicesSectionSkeleton.js";

const ServicesSection = lazy(() => import("../components/ServicesSection.js"));

export default function LandingPage() {
  useReveal();

  return (
    <main className="w-full">
      <HeroSection />
      <Suspense fallback={<ServicesSectionSkeleton />}>
        <ServicesSection />
      </Suspense>
      <AboutSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
