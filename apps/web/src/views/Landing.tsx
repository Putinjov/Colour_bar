import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { Button } from "../ui/Button";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80",
  about1:
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80",
  about2:
    "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=900&q=80",
  service1:
    "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=1400&q=80",
  service2:
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1400&q=80",
  service3:
    "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1400&q=80",
};

export default function Landing() {
  const nav = useNavigate();
  const { lang } = useI18n();

  const T = {
    navHome: lang === "en" ? "Home" : "Головна",
    navServices: lang === "en" ? "Services" : "Послуги",
    navSchedule: lang === "en" ? "Schedule" : "Графік",
    bookNow: lang === "en" ? "Book Now" : "Записатися",

    badge: lang === "en" ? "Premium Hair Studio" : "Преміум Hair Studio",

    heroTitle: lang === "en" ? "Colour" : "Colour",
    heroAccent: lang === "en" ? "Lab" : "Lab",
    heroText:
      lang === "en"
        ? "Where artistry meets science. Experience transformative hair colouring, precision cuts, and restorative treatments."
        : "Де мистецтво зустрічає техніку. Фарбування, точні стрижки та відновлення волосся з передбачуваним результатом.",

    ctaPrimary: lang === "en" ? "Book Appointment" : "Записатися",
    ctaSecondary: lang === "en" ? "Explore Services" : "Переглянути послуги",

    aboutKicker: lang === "en" ? "ABOUT US" : "ПРО НАС",
    aboutTitleA: lang === "en" ? "Where Science Meets " : "Де наука зустрічає ",
    aboutTitleB: lang === "en" ? "Artistry" : "мистецтво",
    aboutP1:
      lang === "en"
        ? "Colour Bar was founded with a simple vision: to create a space where hair science meets creative artistry."
        : "Colour Bar — просте бачення: поєднати сучасні техніки та креатив, щоб результат був стабільно красивим.",
    aboutP2:
      lang === "en"
        ? "Every client deserves a personalized experience — from consultation to final styling."
        : "Кожен клієнт отримує персональний підхід — від консультації до фінального стайлінгу.",

    servicesKicker: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    servicesTitle: lang === "en" ? "Artistry in Every Detail" : "Мистецтво в кожній деталі",

    s1: lang === "en" ? "Hair Colouring" : "Фарбування",
    s1t:
      lang === "en"
        ? "AirTouch, Balayage, Ombre — premium techniques for stunning results."
        : "AirTouch, Balayage, Ombre — преміальні техніки для вау-результату.",
    s2: lang === "en" ? "Haircuts" : "Стрижки",
    s2t:
      lang === "en"
        ? "Precision cuts for men, women, and children — for every style."
        : "Точні стрижки: чоловічі, жіночі та дитячі — під ваш стиль.",
    s3: lang === "en" ? "Hair Repair" : "Відновлення",
    s3t:
      lang === "en"
        ? "Restorative treatments to bring hair back to life."
        : "Процедури для сили, блиску та здорового вигляду волосся.",

    testTitle: lang === "en" ? "What Our Clients Say" : "Що кажуть клієнти",

    readyTitleA: lang === "en" ? "Ready to Transform" : "Готові змінити",
    readyTitleB: lang === "en" ? "Your Look?" : "свій образ?",
    readyText:
      lang === "en"
        ? "Book your appointment today — quick online booking and clear timing."
        : "Запишіться сьогодні — швидкий онлайн-запис і чіткий таймінг.",
  };

  return (
    <div className="space-y-12">
      {/* top nav like screenshot (landing only) */}
      <div className="hidden md:flex items-center justify-end gap-6">
        <button className="text-sm text-brand-sub hover:text-brand-ink" onClick={() => scrollToId("home")}>
          {T.navHome}
        </button>
        <button className="text-sm text-brand-sub hover:text-brand-ink" onClick={() => scrollToId("services")}>
          {T.navServices}
        </button>
        <button className="text-sm text-brand-sub hover:text-brand-ink" onClick={() => scrollToId("schedule")}>
          {T.navSchedule}
        </button>
        <button
          onClick={() => nav("/services")}
          className="rounded-full bg-brand-ink text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition"
        >
          {T.bookNow}
        </button>
      </div>

      {/* HERO */}
      <section id="home" className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface border border-brand-line px-4 py-2 text-xs text-brand-sub shadow-soft">
            ✨ {T.badge}
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-light tracking-tight">
            <span className="text-brand-ink">{T.heroTitle}</span>
            <span className="text-brand-yellow">{T.heroAccent}</span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-brand-sub max-w-xl">
            {T.heroText}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="w-full sm:w-auto" onClick={() => nav("/services")}>
              {T.ctaPrimary} →
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto" onClick={() => scrollToId("services")}>
              {T.ctaSecondary}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] overflow-hidden border border-brand-line bg-brand-surface shadow-soft">
            <img src={IMAGES.hero} alt="Salon" className="w-full h-[320px] md:h-[440px] object-cover" />
          </div>

          {/* 10+ badge */}
          <div className="absolute -bottom-4 left-4 md:left-6 rounded-2xl bg-brand-surface border border-brand-line p-4 shadow-soft">
            <div className="text-2xl font-semibold text-brand-ink">10+</div>
            <div className="text-xs text-brand-sub">{lang === "en" ? "Years of Excellence" : "Років досвіду"}</div>
          </div>

          {/* glow */}
          <div
            className="absolute -inset-10 -z-10 blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(420px 240px at 30% 20%, rgba(246,196,69,0.35), transparent 60%)," +
                "radial-gradient(420px 240px at 70% 30%, rgba(109,40,217,0.25), transparent 60%)",
            }}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="rounded-[28px] bg-brand-muted border border-brand-line p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[22px] overflow-hidden border border-brand-line bg-brand-surface shadow-soft">
              <img src={IMAGES.about1} alt="About" className="w-full h-[230px] object-cover" />
            </div>

            <div className="relative">
              <div className="rounded-[22px] overflow-hidden border border-brand-line bg-brand-surface shadow-soft">
                <img src={IMAGES.about2} alt="About 2" className="w-full h-[230px] object-cover" />
              </div>

              <div className="absolute -bottom-3 left-3 right-3 rounded-2xl bg-brand-surface border border-brand-line p-3 shadow-soft">
                <div className="text-xs font-semibold text-brand-ink">🏆 {lang === "en" ? "Award Winning" : "Нагороди"}</div>
                <div className="text-[11px] text-brand-sub">{lang === "en" ? "Best Salon 2024" : "Best Salon 2024"}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.18em] text-brand-yellow">
              {T.aboutKicker}
            </div>

            <h2 className="mt-3 text-3xl md:text-5xl font-light text-brand-ink">
              {T.aboutTitleA}
              <span className="font-semibold">{T.aboutTitleB}</span>
            </h2>

            <p className="mt-4 text-sm text-brand-sub">{T.aboutP1}</p>
            <p className="mt-3 text-sm text-brand-sub">{T.aboutP2}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat value="10+" label={lang === "en" ? "Years Experience" : "Досвід"} />
              <Stat value="5000+" label={lang === "en" ? "Happy Clients" : "Клієнти"} />
              <Stat value="15k+" label={lang === "en" ? "Treatments" : "Процедури"} />
              <Stat value="1" label={lang === "en" ? "Master" : "Майстер"} />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.18em] text-brand-yellow">{T.servicesKicker}</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-light text-brand-ink">{T.servicesTitle}</h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <ServiceCard title={T.s1} text={T.s1t} img={IMAGES.service1} onClick={() => nav("/services")} />
          <ServiceCard title={T.s2} text={T.s2t} img={IMAGES.service2} onClick={() => nav("/services")} />
          <ServiceCard title={T.s3} text={T.s3t} img={IMAGES.service3} onClick={() => nav("/services")} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-light text-brand-ink">{T.testTitle}</h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <Testimonial
            text={
              lang === "en"
                ? "“The AirTouch technique gave me the most natural highlights I've ever had.”"
                : "“AirTouch вийшов максимально натуральним — я в захваті!”"
            }
            name={lang === "en" ? "Maria Anderson" : "Марія"}
            role={lang === "en" ? "Regular Client" : "Постійна клієнтка"}
          />
          <Testimonial
            text={
              lang === "en"
                ? "“Best haircut I've ever received. Attention to detail sets them apart.”"
                : "“Найкраща стрижка. Увага до деталей — топ.”"
            }
            name={lang === "en" ? "James Wilson" : "Олександр"}
            role={lang === "en" ? "Client since 2020" : "Клієнт з 2020"}
          />
          <Testimonial
            text={
              lang === "en"
                ? "“My hair has never looked healthier. The repair treatment worked wonders.”"
                : "“Відновлення реально працює — волосся стало набагато живішим.”"
            }
            name={lang === "en" ? "Sophie Chen" : "Ірина"}
            role={lang === "en" ? "New Client" : "Нова клієнтка"}
          />
        </div>
      </section>

      {/* CTA / SCHEDULE */}
      <section
        id="schedule"
        className="rounded-[28px] overflow-hidden border border-brand-line bg-brand-ink text-white shadow-soft"
      >
        <div className="grid gap-6 md:grid-cols-2 p-6 md:p-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-light leading-tight">
              {T.readyTitleA}{" "}
              <span className="text-brand-yellow">{T.readyTitleB}</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/75">{T.readyText}</p>

            <div className="mt-6">
              <button
                onClick={() => nav("/services")}
                className="rounded-full bg-brand-yellow text-brand-ink px-6 py-3 text-sm font-semibold hover:brightness-105 transition"
              >
                {T.bookNow}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <InfoCard title={lang === "en" ? "Visit Us" : "Адреса"} text="Tullamore, Ireland" />
            <InfoCard title={lang === "en" ? "Working Hours" : "Графік"} text={lang === "en" ? "Tue–Sat: 10:00–18:00" : "Вт–Сб: 10:00–18:00"} />
            <InfoCard title={lang === "en" ? "Contact" : "Контакти"} text={lang === "en" ? "Phone / Instagram (add)" : "Телефон / Instagram (додати)"} />
          </div>
        </div>
      </section>

      {/* mobile sticky CTA */}
      <div className="md:hidden sticky bottom-3 z-40">
        <button
          onClick={() => nav("/services")}
          className="w-full rounded-full bg-brand-ink text-white px-4 py-3 text-sm font-semibold shadow-soft"
        >
          {T.bookNow}
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center md:text-left rounded-2xl bg-brand-surface border border-brand-line p-4 shadow-soft">
      <div className="text-xl font-semibold text-brand-ink">{value}</div>
      <div className="text-[11px] text-brand-sub mt-1">{label}</div>
    </div>
  );
}

function ServiceCard({
  title,
  text,
  img,
  onClick,
}: {
  title: string;
  text: string;
  img: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-[22px] overflow-hidden border border-brand-line bg-brand-surface shadow-soft text-left hover:-translate-y-0.5 transition"
    >
      <div className="relative">
        <img src={img} alt={title} className="h-[240px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xl font-semibold text-white">{title}</div>
        </div>

        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-brand-yellow text-brand-ink grid place-items-center font-black shadow-soft">
          ↗
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-brand-sub">{text}</div>
      </div>
    </button>
  );
}

function Testimonial({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <div className="rounded-[22px] border border-brand-line bg-brand-surface shadow-soft p-5">
      <div className="text-brand-yellow text-sm">★★★★★</div>
      <div className="mt-3 text-sm text-brand-sub leading-relaxed">{text}</div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-brand-purple/20 border border-brand-line" />
        <div>
          <div className="text-sm font-semibold text-brand-ink">{name}</div>
          <div className="text-[11px] text-brand-sub">{role}</div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[22px] bg-white/10 border border-white/15 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/70">{text}</div>
    </div>
  );
}
