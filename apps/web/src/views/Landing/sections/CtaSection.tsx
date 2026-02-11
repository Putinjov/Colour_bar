import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../i18n.js";
import Center from "../components/Center.js";
import DarkInfoCard from "../components/DarkInfoCard.js";

export default function CtaSection() {
  const nav = useNavigate();
  const { lang } = useI18n();

  return (
    <section
      id="schedule"
      className="w-screen snap-start"
      style={{ background: "#0F0F12" }}
    >
      <div className="flex items-center">
        <Center>
          <div className="grid gap-10 md:grid-cols-2 md:items-center py-16">
            {/* Left */}
            <div>
              <h2 data-reveal className="text-4xl md:text-6xl font-light leading-tight text-white">
                {lang === "en" ? "Ready to Transform" : "Готові змінити"}{" "}
                <span className="text-brand-yellow">{lang === "en" ? "Your Look?" : "свій образ?"}</span>
              </h2>

              <p
                data-reveal
                data-delay="120"
                className="mt-5 text-sm md:text-base text-white/70 max-w-xl"
              >
                {lang === "en"
                  ? "Book your appointment today and we’ll take care of the rest. Clear timing, instant slot reservation."
                  : "Запишіться сьогодні — і ми подбаємо про все. Чіткий таймінг та миттєве резервування слоту."}
              </p>

              <div data-reveal data-delay="240" className="mt-8">
                <button
                  onClick={() => nav("/services")}
                  className="inline-flex items-center gap-3 border-2 border-brand-yellow bg-brand-yellow text-brand-ink px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:brightness-105 transition"
                >
                  {lang === "en" ? "Book Now" : "Записатися"}
                  <span className="text-lg leading-none">→</span>
                </button>
              </div>
            </div>

            {/* Right cards */}
            <div className="space-y-4">
              <DarkInfoCard
                icon="📍"
                title={lang === "en" ? "Visit Us" : "Адреса"}
                text="Tullamore, Ireland"
                delay={140}
              />
              <DarkInfoCard
                icon="🕒"
                title={lang === "en" ? "Working Hours" : "Графік"}
                text={lang === "en" ? "Tue – Sat: 10:00 AM – 6:00 PM" : "Вт – Сб: 10:00 – 18:00"}
                delay={240}
              />
              <DarkInfoCard
                icon="📞"
                title={lang === "en" ? "Call Us" : "Подзвонити"}
                text={lang === "en" ? "+353 … (add)" : "+353 … (додати)"}
                delay={340}
              />
            </div>
          </div>
        </Center>
      </div>
    </section>
  );
}
