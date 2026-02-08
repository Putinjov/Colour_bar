import React from "react";
import { useI18n } from "../../../i18n";
import Center from "../components/Center";
import ServiceCard from "../components/ServiceCard";
import CatalogCategoriesSliderMarquee from "../components/CatalogCategoriesSlider";

export default function ServicesSection() {
  const { lang } = useI18n();

  const t = {
    k: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    title: lang === "en" ? "Artistry in Every Detail" : "Мистецтво в кожній деталі",
  };

  return (
    <section
      id="services"
      style={{
        background: "#F7F4EF",
      }}
    >
      <Center>
        <div className="text-center">
          <div
            data-reveal
            data-delay="0"
            className="text-[11px] tracking-[0.18em] text-brand-yellow"
          >
            {t.k}
          </div>
          <h2
            data-reveal
            data-delay="120"
            className="mt-3 text-3xl md:text-5xl font-light text-brand-ink"
          >
            {t.title}
          </h2>
        </div>


      </Center>
      <CatalogCategoriesSliderMarquee speed={9000} />
    </section>
  );
}
