import React from "react";
import { useI18n } from "../../../i18n.js";
import Center from "../components/Center.js";
import CatalogCategoriesSliderMarquee from "../components/CatalogCategoriesSlider.js";

export default function ServicesSection() {
  const { lang } = useI18n();

  const t = {
    k: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    title: lang === "en" ? "Services for Colour, Cut & Care" : "Послуги для кольору, стрижки та догляду",
    text:
      lang === "en"
        ? "Choose the category and explore treatments tailored to your hair goals."
        : "Оберіть категорію та перегляньте процедури, підібрані під ваш запит.",
  };

  return (
    <section
      id="services"
      style={{
        background: "#F7F4EF",
      }}
    >
      <Center>
        <div className="pt-16 text-center">
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
          <p
            data-reveal
            data-delay="220"
            className="mt-4 text-sm md:text-base text-brand-sub max-w-2xl mx-auto"
          >
            {t.text}
          </p>
        </div>

        <div className="mt-10 pb-16">
          <CatalogCategoriesSliderMarquee speed={9000} />
        </div>
      </Center>
    </section>
  );
}
