import React from "react";
import { useI18n } from "../../../i18n";
import Center from "../components/Center";
import ServiceCard from "../components/ServiceCard";

export default function ServicesSection() {
  const { lang } = useI18n();

  const t = {
    k: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    title: lang === "en" ? "Artistry in Every Detail" : "Мистецтво в кожній деталі",

    s1: lang === "en" ? "Hair Colouring" : "Фарбування",
    s1d:
      lang === "en"
        ? "AirTouch, Balayage, Shatush, Brazilian Blonde — masterful techniques for stunning results."
        : "AirTouch, Balayage, Shatush, Brazilian Blonde — майстерні техніки для вау-результату.",

    s2: lang === "en" ? "Haircuts" : "Стрижки",
    s2d:
      lang === "en"
        ? "Precision cuts for men, women, and children — for every style and occasion."
        : "Точні стрижки для чоловіків, жінок і дітей — під будь-який стиль та випадок.",

    s3: lang === "en" ? "Hair Repair" : "Відновлення",
    s3d:
      lang === "en"
        ? "Restorative treatments to bring life back to damaged, dry, or brittle hair."
        : "Відновлювальні процедури, щоб повернути життя сухому, ламкому або пошкодженому волоссю.",
  };

  const cards = [
    {
      title: t.s1,
      description: t.s1d,
      icon: "🎨",
      image:
        "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=1400&q=80",
      reveal: "fade-right" as const,
      delay: 0,
    },
    {
      title: t.s2,
      description: t.s2d,
      icon: "✂️",
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1400&q=80",
      reveal: "" as const,
      delay: 120,
    },
    {
      title: t.s3,
      description: t.s3d,
      icon: "✨",
      image:
        "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1400&q=80",
      reveal: "fade-left" as const,
      delay: 240,
    },
  ];

  return (
    <section
      id="services"
      className="min-h-dvh w-screen snap-start flex items-center"
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

      <div className="mt-10 flex justify-center">
  <div className="w-full md:w-3/4">
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((c) => (
        <ServiceCard
          key={c.title}
          title={c.title}
          description={c.description}
          image={c.image}
          icon={c.icon}
          reveal={c.reveal}
          delay={c.delay}
          target={c.title === t.s1 ? "colouring" : c.title === t.s2 ? "haircuts" : "repair"}
        />
      ))}
    </div>
  </div>
</div>

      </Center>
    </section>
  );
}
