import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { Button } from "../ui/Button";
import { useReveal } from "../hooks/useReveal";

function Center({ children }: React.PropsWithChildren) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}

export default function Landing() {
  const nav = useNavigate();
  const { lang } = useI18n();
  useReveal();

  const t = {
    badge: lang === "en" ? "Premium Hair Studio" : "Преміум Hair Studio",
    title: "Colour",
    accent: "Bar",
    heroText:
      lang === "en"
        ? "Where artistry meets science. Colouring, precision cuts, and restorative treatments."
        : "Де мистецтво зустрічає техніку. Фарбування, точні стрижки та відновлення волосся.",
    book: lang === "en" ? "Book Appointment" : "Записатися",
    explore: lang === "en" ? "Explore Services" : "Переглянути послуги",

    aboutK: lang === "en" ? "ABOUT US" : "ПРО НАС",
    aboutT:
      lang === "en"
        ? "Where Science Meets Artistry"
        : "Де наука зустрічає мистецтво",
    aboutP:
      lang === "en"
        ? "One master. Maximum attention. Personalised approach from consultation to final styling."
        : "Один майстер. Максимум уваги. Персональний підхід від консультації до фінального стайлінгу.",

    servicesK: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    servicesT:
      lang === "en"
        ? "Artistry in Every Detail"
        : "Мистецтво в кожній деталі",

    scheduleK: lang === "en" ? "SCHEDULE" : "ГРАФІК",
    scheduleT:
      lang === "en"
        ? "Ready to Transform Your Look?"
        : "Готові змінити свій образ?",
    scheduleP:
      lang === "en"
        ? "Book online in under a minute. Clear timing and instant slot reservation."
        : "Запис онлайн за хвилину. Чіткий таймінг та миттєве резервування слоту.",
  };

  return (
    <main className="w-full overflow-x-hidden snap-y snap-mandatory">
      {/* ================= HERO ================= */}
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
                className="inline-flex items-center gap-2 rounded-full bg-brand-surface border border-brand-line px-4 py-2 text-xs text-brand-sub shadow-soft"
              >
                ✨ {t.badge}
              </div>

              <h1
                data-reveal
                data-delay="120"
                className="mt-6 text-5xl md:text-7xl font-light tracking-tight"
              >
                <span className="text-brand-ink">{t.title}</span>
                <span className="text-brand-yellow">{t.accent}</span>
              </h1>

              <p
                data-reveal
                data-delay="240"
                className="mt-4 text-sm md:text-base text-brand-sub max-w-xl"
              >
                {t.heroText}
              </p>

              <div
                data-reveal
                data-delay="360"
                className="mt-7 flex flex-col sm:flex-row gap-3"
              >
                <Button onClick={() => nav("/services")}>
                  {t.book}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t.explore}
                </Button>
              </div>
            </div>

            <div
              data-reveal="zoom"
              data-delay="180"
              className="relative"
            >
              <div className="rounded-[28px] overflow-hidden border border-brand-line bg-brand-surface shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
                  className="w-full h-[320px] md:h-[440px] object-cover"
                  alt="Salon"
                />
              </div>

              <div className="absolute -bottom-4 left-4 rounded-2xl bg-brand-surface border border-brand-line p-4 shadow-soft">
                <div className="text-2xl font-semibold">10+</div>
                <div className="text-xs text-brand-sub">
                  {lang === "en" ? "Years of Excellence" : "Років досвіду"}
                </div>
              </div>
            </div>
          </div>
        </Center>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        className="min-h-dvh w-screen snap-start flex items-center"
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
                {t.aboutK}
              </div>
              <h2 data-reveal data-delay="120" className="mt-3 text-4xl md:text-5xl font-light">
                {t.aboutT}
              </h2>
              <p data-reveal data-delay="240" className="mt-4 text-brand-sub max-w-xl">
                {t.aboutP}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                data-reveal="fade-left"
                data-delay="180"
                className="rounded-2xl shadow-soft"
                src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4"
              />
              <img
                data-reveal="fade-left"
                data-delay="300"
                className="rounded-2xl shadow-soft"
                src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388"
              />
            </div>
          </div>
        </Center>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="min-h-dvh w-screen snap-start flex items-center"
        style={{
          background:
            "radial-gradient(900px 450px at 10% 10%, rgba(246,196,69,0.2), transparent 60%)," +
            "radial-gradient(900px 450px at 90% 20%, rgba(109,40,217,0.15), transparent 60%)," +
            "#F3EEE6",
        }}
      >
        <Center>
          <div className="text-center">
            <div data-reveal className="text-xs tracking-widest text-brand-yellow">
              {t.servicesK}
            </div>
            <h2 data-reveal data-delay="120" className="mt-3 text-4xl md:text-5xl font-light">
              {t.servicesT}
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <ServiceCard delay={0} title={lang === "en" ? "Hair Colouring" : "Фарбування"} />
            <ServiceCard delay={120} title={lang === "en" ? "Haircuts" : "Стрижки"} />
            <ServiceCard delay={240} title={lang === "en" ? "Hair Repair" : "Відновлення"} />
          </div>
        </Center>
      </section>

            {/* ================= CTA (like screenshot) ================= */}
      <section
        id="schedule"
        className="min-h-dvh w-screen snap-start"
        style={{
          background: "#0F0F12",
        }}
      >
        <div className="min-h-dvh flex items-center">
          <div className="w-full">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <div className="grid gap-10 md:grid-cols-2 md:items-center">
                {/* Left */}
                <div>
                  <h2
                    data-reveal
                    className="text-4xl md:text-6xl font-light leading-tight text-white"
                  >
                    {lang === "en" ? "Ready to Transform" : "Готові змінити"}{" "}
                    <span className="text-brand-yellow">
                      {lang === "en" ? "Your Look?" : "свій образ?"}
                    </span>
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
                      className="inline-flex items-center gap-3 rounded-full bg-brand-yellow text-brand-ink px-7 py-3 text-sm font-semibold hover:brightness-105 transition"
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
                    text={lang === "en" ? "Tullamore, Ireland" : "Tullamore, Ireland"}
                    delay={120}
                  />
                  <DarkInfoCard
                    icon="🕒"
                    title={lang === "en" ? "Working Hours" : "Графік"}
                    text={lang === "en" ? "Tue – Sat: 10:00 AM – 6:00 PM" : "Вт – Сб: 10:00 – 18:00"}
                    delay={220}
                  />
                  <DarkInfoCard
                    icon="📞"
                    title={lang === "en" ? "Call Us" : "Подзвонити"}
                    text={lang === "en" ? "+353 … (add)" : "+353 … (додати)"}
                    delay={320}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Footer like screenshot (light) ===== */}
        <footer
          className="w-screen"
          style={{
            background: "#F3EEE6",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-10 md:grid-cols-4">
              {/* Brand */}
              <div>
                <div className="text-lg font-medium tracking-tight">
                  <span className="text-brand-ink">Colour</span>
                  <span className="text-brand-yellow">Bar</span>
                </div>
                <p className="mt-4 text-sm text-brand-sub max-w-sm">
                  {lang === "en"
                    ? "Premium hair care and styling services with a personalised approach."
                    : "Преміальні послуги для волосся з персональним підходом."}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <div className="text-sm font-semibold text-brand-ink">
                  {lang === "en" ? "Quick Links" : "Швидкі посилання"}
                </div>
                <div className="mt-4 space-y-2 text-sm text-brand-sub">
                  <button className="hover:text-brand-ink" onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}>
                    {lang === "en" ? "Home" : "Головна"}
                  </button>
                  <div />
                  <button className="hover:text-brand-ink" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
                    {lang === "en" ? "Services" : "Послуги"}
                  </button>
                  <div />
                  <button className="hover:text-brand-ink" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>
                    {lang === "en" ? "Schedule" : "Графік"}
                  </button>
                </div>
              </div>

              {/* Services */}
              <div>
                <div className="text-sm font-semibold text-brand-ink">
                  {lang === "en" ? "Services" : "Послуги"}
                </div>
                <div className="mt-4 space-y-2 text-sm text-brand-sub">
                  <div>{lang === "en" ? "Hair Colouring" : "Фарбування"}</div>
                  <div>{lang === "en" ? "Haircuts" : "Стрижки"}</div>
                  <div>{lang === "en" ? "Hair Repair" : "Відновлення"}</div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="text-sm font-semibold text-brand-ink">
                  {lang === "en" ? "Contact" : "Контакти"}
                </div>

                <div className="mt-4 space-y-3 text-sm text-brand-sub">
                  <div className="flex items-center gap-3">
                    <span>📞</span>
                    <span>+353 … (add)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>✉️</span>
                    <span>hello@colourbar.ie (add)</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button className="h-10 w-10 rounded-full bg-brand-surface border border-brand-line hover:bg-brand-muted transition">
                    ⓘ
                  </button>
                  <button className="h-10 w-10 rounded-full bg-brand-surface border border-brand-line hover:bg-brand-muted transition">
                    ◎
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-brand-line pt-6 text-center text-xs text-brand-sub">
              © {new Date().getFullYear()} Colour Bar. {lang === "en" ? "All rights reserved." : "Всі права захищено."}
            </div>
          </div>
        </footer>
      </section>

    </main>
  );
}

function ServiceCard({ title, delay }: { title: string; delay: number }) {
  return (
    <button
      data-reveal
      data-delay={delay}
      className="rounded-2xl bg-brand-surface border border-brand-line p-6 shadow-soft text-left hover:-translate-y-1 transition"
    >
      <div className="text-sm text-brand-sub">{title}</div>
      <div className="mt-2 text-xl font-semibold">{title}</div>
      <div className="mt-6">
        <span className="inline-flex h-10 w-10 rounded-full bg-brand-yellow items-center justify-center">
          ↗
        </span>
      </div>
    </button>
  );
}
function DarkInfoCard({
  icon,
  title,
  text,
  delay = 0,
}: {
  icon: string;
  title: string;
  text: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal="fade-left"
      data-delay={delay}
      className="rounded-[22px] bg-white/10 border border-white/10 px-6 py-5"
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-brand-yellow/20 border border-white/10 grid place-items-center text-lg">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/60 mt-0.5">{text}</div>
        </div>
      </div>
    </div>
  );
}

