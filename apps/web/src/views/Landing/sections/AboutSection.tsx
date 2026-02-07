import React from "react";
import { useI18n } from "../../../i18n";
import Center from "../components/Center";

export default function AboutSection() {
  const { lang } = useI18n();

  const t = {
    k: lang === "en" ? "ABOUT US" : "ПРО НАС",
    title:
      lang === "en"
        ? "Where Science Meets Artistry"
        : "Де наука зустрічає мистецтво",
    p:
      lang === "en"
        ? "One master. Maximum attention. Personalised approach from consultation to final styling."
        : "Один майстер. Максимум уваги. Персональний підхід від консультації до фінального стайлінгу.",
  };

  return (
    <section
      className="w-screen py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(109,40,217,0.08), transparent 50%)," +
          "linear-gradient(225deg, rgba(246,196,69,0.14), transparent 55%)," +
          "#F7F4EF",
      }}
    >
      <Center>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div data-reveal data-delay="0" className="text-xs tracking-widest text-brand-yellow">
              {t.k}
            </div>
            <h2 data-reveal data-delay="120" className="mt-3 text-4xl md:text-5xl font-light text-brand-ink">
              {t.title}
            </h2>
            <p data-reveal data-delay="240" className="mt-4 text-sm md:text-base text-brand-sub max-w-xl">
              {t.p}
            </p>

            <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat delay={300} value="10+" label={lang === "en" ? "Years" : "Досвід"} />
              <Stat delay={380} value="5000+" label={lang === "en" ? "Clients" : "Клієнти"} />
              <Stat delay={460} value="15k+" label={lang === "en" ? "Treatments" : "Процедури"} />
              <Stat delay={540} value="1" label={lang === "en" ? "Master" : "Майстер"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              data-reveal="fade-left"
              data-delay="200"
              className="rounded-2xl shadow-soft border border-brand-line bg-brand-surface object-cover w-full h-[260px]"
              alt="About 1"
              src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=900&q=80"
            />
            <img
              data-reveal="fade-left"
              data-delay="320"
              className="rounded-2xl shadow-soft border border-brand-line bg-brand-surface object-cover w-full h-[260px]"
              alt="About 2"
              src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80"
            />
          </div>
        </div>
      </Center>
    </section>
  );
}

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div
      data-reveal
      data-delay={delay}
      className="rounded-2xl bg-brand-surface border border-brand-line p-4 shadow-soft"
    >
      <div className="text-xl font-semibold text-brand-ink">{value}</div>
      <div className="text-[11px] text-brand-sub mt-1">{label}</div>
    </div>
  );
}
