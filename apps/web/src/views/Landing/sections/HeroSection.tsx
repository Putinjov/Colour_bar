import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../i18n.js";
import Center from "../components/Center.js";
import { Button } from "../../../ui/Button.js";

export default function HeroSection() {
  const nav = useNavigate();
  const { lang } = useI18n();

  const t = {
    badge: lang === "en" ? "Premium Hair Studio" : "Преміум Hair Studio",
    title: "Colour",
    accent: "Lab",
    text:
      lang === "en"
        ? "Where artistry meets science. Colouring, precision cuts, and restorative treatments."
        : "Де мистецтво зустрічає техніку. Фарбування, точні стрижки та відновлення волосся.",
    book: lang === "en" ? "Book Appointment" : "Записатися",
    explore: lang === "en" ? "Explore Services" : "Переглянути послуги",
    years: lang === "en" ? "Years of Excellence" : "Років досвіду",
  };

  return (
    <section
      id="home"
      className="min-h-dvh w-screen snap-start flex items-center"
      style={{
        background:
          "radial-gradient(900px 450px at 20% 20%, rgba(246,196,69,0.35), transparent 60%)," +
          "radial-gradient(900px 450px at 80% 10%, rgba(109,40,217,0.25), transparent 60%)," +
          "linear-gradient(180deg, #F7F4EF, #F3EEE6)",
      }}
    >
      <Center>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              data-reveal="fade-right"
              data-delay="0"
              className="inline-flex items-center gap-2 border-2 border-brand-line bg-brand-surface px-4 py-2 text-xs uppercase tracking-[0.12em] text-brand-sub shadow-soft"
            >
              ✨ {t.badge}
            </div>

            <h1
              data-reveal
              data-delay="120"
              className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight uppercase"
            >
              <span className="text-brand-ink">{t.title}</span>
              <span className="text-brand-yellow">{t.accent}</span>
            </h1>

            <p
              data-reveal
              data-delay="240"
              className="mt-4 text-sm md:text-base text-brand-sub max-w-xl"
            >
              {t.text}
            </p>

            <div data-reveal data-delay="360" className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => nav("/services")}>{t.book}</Button>

              <Button
                variant="ghost"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.explore}
              </Button>
            </div>
          </div>

          <div data-reveal="zoom" data-delay="180" className="relative">
            <div className="rounded-sm overflow-hidden border-2 border-brand-line bg-brand-surface shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
                className="w-full h-[320px] md:h-[440px] object-cover"
                alt="Salon"
              />
            </div>

            <div className="absolute -bottom-4 left-4 rounded-sm bg-brand-yellow border-2 border-brand-yellow p-4 shadow-soft text-brand-ink">
              <div className="text-2xl font-semibold text-brand-ink">10+</div>
              <div className="text-xs text-brand-sub">{t.years}</div>
            </div>
          </div>
        </div>
      </Center>
    </section>
  );
}
