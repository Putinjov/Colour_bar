import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80",
  about1:
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80",
  about2:
    "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=900&q=80",
  service1:
    "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=1200&q=80",
  service2:
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
  service3:
    "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80",
};

export default function Landing() {
  const nav = useNavigate();
  const { lang } = useI18n();

  // Лаконічні тексти (UA/EN) — щоб стилістично було як на скрінах
  const T = {
    badge: lang === "en" ? "Premium Hair Studio" : "Преміум hair studio",
    heroTitleA: lang === "en" ? "Colour" : "Colour",
    heroTitleB: lang === "en" ? "Lab" : "Lab",
    heroText:
      lang === "en"
        ? "Where artistry meets science. Transformative colouring, precision cuts, and restorative treatments."
        : "Де мистецтво зустрічає техніку. Фарбування, точні стрижки та відновлення волосся.",
    cta1: lang === "en" ? "Book Appointment" : "Записатися",
    cta2: lang === "en" ? "Explore Services" : "Послуги",
    navHome: lang === "en" ? "Home" : "Головна",
    navServices: lang === "en" ? "Services" : "Послуги",
    navSchedule: lang === "en" ? "Schedule" : "Графік",
    bookNow: lang === "en" ? "Book Now" : "Запис",
    aboutKicker: lang === "en" ? "ABOUT US" : "ПРО НАС",
    aboutTitleA: lang === "en" ? "Where Science Meets " : "Де наука зустрічає ",
    aboutTitleB: lang === "en" ? "Artistry" : "мистецтво",
    aboutP1:
      lang === "en"
        ? "Colour Bar was founded with a simple vision: a space where cutting-edge hair science meets creative artistry."
        : "Colour Bar пояснюється просто: сучасні техніки + креативний підхід, щоб результат був передбачувано красивим.",
    aboutP2:
      lang === "en"
        ? "Every client deserves a personalized experience — from consultation to final styling."
        : "Кожен клієнт отримує персональний підхід — від консультації до фінального стайлінгу.",
    stat1: lang === "en" ? "Years Experience" : "Років досвіду",
    stat2: lang === "en" ? "Happy Clients" : "Задоволених клієнтів",
    stat3: lang === "en" ? "Treatments Done" : "Процедур виконано",
    stat4: lang === "en" ? "Master Stylist" : "Майстер",
    servicesKicker: lang === "en" ? "OUR SERVICES" : "ПОСЛУГИ",
    servicesTitle: lang === "en" ? "Artistry in Every Detail" : "Деталі вирішують все",
    s1: lang === "en" ? "Hair Colouring" : "Фарбування",
    s1t:
      lang === "en"
        ? "AirTouch, Balayage, Ombre — techniques for stunning results."
        : "AirTouch, Balayage, Ombre — техніки для вау-результату.",
    s2: lang === "en" ? "Haircuts" : "Стрижки",
    s2t:
      lang === "en"
        ? "Precision cuts for men, women, and children."
        : "Точні стрижки: чоловічі, жіночі та дитячі.",
    s3: lang === "en" ? "Hair Repair" : "Відновлення",
    s3t:
      lang === "en"
        ? "Restorative treatments to bring hair back to life."
        : "Процедури, що повертають волоссю силу та блиск.",
    testimonialsTitle: lang === "en" ? "What Our Clients Say" : "Відгуки клієнтів",
    readyTitleA: lang === "en" ? "Ready to Transform" : "Готові змінити",
    readyTitleB: lang === "en" ? "Your Look?" : "свій образ?",
    readyText:
      lang === "en"
        ? "Book your appointment today — quick online booking and clear timing."
        : "Запишіться онлайн — швидко, зручно, з чітким таймінгом.",
  };

  return (
    <div className="space-y-10">
      {/* Top nav (landing only) */}
      <div className="hidden md:flex items-center justify-end gap-6 text-sm text-white/70">
        <button onClick={() => scrollToId("home")} className="hover:text-white">
          {T.navHome}
        </button>
        <button onClick={() => scrollToId("services")} className="hover:text-white">
          {T.navServices}
        </button>
        <button onClick={() => scrollToId("schedule")} className="hover:text-white">
          {T.navSchedule}
        </button>
        <button
          onClick={() => nav("/services")}
          className="rounded-xl2 bg-brand-yellow text-brand-ink px-4 py-2 text-xs font-semibold hover:brightness-105 transition"
        >
          {T.bookNow}
        </button>
      </div>

      {/* HERO */}
      <section id="home" className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-white/75">
            ✨ {T.badge}
          </div>

          <h1 className="mt-5 text-4xl md:text-6xl font-light tracking-tight">
            <span className="text-white/90">{T.heroTitleA}</span>
            <span className="text-brand-yellow">{T.heroTitleB}</span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-white/70 max-w-xl">
            {T.heroText}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => nav("/services")}
              className="rounded-xl2 bg-brand-yellow text-brand-ink px-6 py-3 text-sm font-semibold hover:brightness-105 transition"
            >
              {T.cta1} →
            </button>
            <button
              onClick={() => scrollToId("services")}
              className="rounded-xl2 border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              {T.cta2}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-soft">
            <img
              src={IMAGES.hero}
              alt="Salon"
              className="w-full h-[320px] md:h-[420px] object-cover"
            />
          </div>

          {/* Badge 10+ like screenshot */}
          <div className="absolute -bottom-4 left-4 md:left-6 rounded-2xl bg-brand-paper/90 border border-white/10 p-4 shadow-soft backdrop-blur">
            <div className="text-2xl font-semibold text-white">10+</div>
            <div className="text-xs text-white/70">{T.stat1}</div>
          </div>

          {/* Soft glow */}
          <div
            className="absolute -inset-6 -z-10 blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(400px 220px at 30% 20%, rgba(246,196,69,0.45), transparent 60%)," +
                "radial-gradient(400px 220px at 70% 30%, rgba(109,40,217,0.45), transparent 60%)",
            }}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        }}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* left images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[22px] overflow-hidden border border-white/10">
              <img src={IMAGES.about1} alt="About 1" className="w-full h-[220px] object-cover" />
            </div>

            <div className="relative">
              <div className="rounded-[22px] overflow-hidden border border-white/10">
                <img src={IMAGES.about2} alt="About 2" className="w-full h-[220px] object-cover" />
              </div>

              <div className="absolute -bottom-3 left-3 right-3 rounded-2xl bg-brand-paper/90 border border-white/10 p-3 shadow-soft backdrop-blur">
                <div className="text-xs font-semibold text-white">🏆 Award Winning</div>
                <div className="text-[11px] text-white/60">Best Salon 2024</div>
              </div>
            </div>
          </div>

          {/* right text */}
          <div>
            <div className="text-[11px] tracking-[0.18em] text-brand-yellow/90">
              {T.aboutKicker}
            </div>

            <h2 className="mt-3 text-3xl md:text-4xl font-light">
              {T.aboutTitleA}
              <span className="font-semibold text-white">{T.aboutTitleB}</span>
            </h2>

            <p className="mt-4 text-sm text-white/70">{T.aboutP1}</p>
            <p className="mt-3 text-sm text-white/70">{T.aboutP2}</p>

            {/* Stats row like screenshot */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat value="10+" label={T.stat1} />
              <Stat value="5000+" label={T.stat2} />
              <Stat value="15k+" label={T.stat3} />
              <Stat value="1" label={T.stat4} />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.18em] text-brand-yellow/90">
            {T.servicesKicker}
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl font-light">{T.servicesTitle}</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ServiceCard
            title={T.s1}
            text={T.s1t}
            img={IMAGES.service1}
            onClick={() => nav("/services")}
          />
          <ServiceCard
            title={T.s2}
            text={T.s2t}
            img={IMAGES.service2}
            onClick={() => nav("/services")}
          />
          <ServiceCard
            title={T.s3}
            text={T.s3t}
            img={IMAGES.service3}
            onClick={() => nav("/services")}
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-light">{T.testimonialsTitle}</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Testimonial
            text={
              lang === "en"
                ? "“The AirTouch technique gave me the most natural highlights I’ve ever had. Stunning!”"
                : "“AirTouch вийшов максимально натуральним. Я в захваті!”"
            }
            name={lang === "en" ? "Maria Anderson" : "Марія"}
            role={lang === "en" ? "Regular Client" : "Постійна клієнтка"}
          />
          <Testimonial
            text={
              lang === "en"
                ? "“Best haircut I’ve ever received. Attention to detail sets them apart.”"
                : "“Найкраща стрижка. Увага до деталей — топ.”"
            }
            name={lang === "en" ? "James Wilson" : "Олександр"}
            role={lang === "en" ? "Client since 2020" : "Клієнт з 2020"}
          />
          <Testimonial
            text={
              lang === "en"
                ? "“My damaged hair has never looked healthier. The repair treatment worked wonders.”"
                : "“Відновлення реально працює — волосся стало набагато живішим.”"
            }
            name={lang === "en" ? "Sophie Chen" : "Ірина"}
            role={lang === "en" ? "New Client" : "Нова клієнтка"}
          />
        </div>
      </section>

      {/* CTA + SCHEDULE/CONTACT like screenshot bottom */}
      <section
        id="schedule"
        className="rounded-[28px] overflow-hidden border border-white/10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.2))",
        }}
      >
        <div className="grid gap-6 md:grid-cols-2 p-6 md:p-10 bg-black/30">
          <div>
            <h2 className="text-4xl md:text-6xl font-light leading-tight">
              {T.readyTitleA}{" "}
              <span className="text-brand-yellow">{T.readyTitleB}</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/70">{T.readyText}</p>

            <div className="mt-6">
              <button
                onClick={() => nav("/services")}
                className="rounded-xl2 bg-brand-yellow text-brand-ink px-6 py-3 text-sm font-semibold hover:brightness-105 transition"
              >
                {T.bookNow}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <InfoCard
              title={lang === "en" ? "Visit Us" : "Адреса"}
              text={lang === "en" ? "Tullamore, Ireland" : "Tullamore, Ireland"}
            />
            <InfoCard
              title={lang === "en" ? "Working Hours" : "Графік"}
              text={lang === "en" ? "Tue–Sat: 10:00–18:00" : "Вт–Сб: 10:00–18:00"}
            />
            <InfoCard
              title={lang === "en" ? "Contacts" : "Контакти"}
              text={lang === "en" ? "Phone + Instagram (add)" : "Телефон + Instagram (додати)"}
            />
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="md:hidden sticky bottom-3 z-40">
        <button
          onClick={() => nav("/services")}
          className="w-full rounded-xl2 bg-brand-yellow text-brand-ink px-4 py-3 text-sm font-semibold shadow-soft"
        >
          {T.bookNow}
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="text-[11px] text-white/60 mt-1">{label}</div>
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
      className="group rounded-[22px] overflow-hidden border border-white/10 bg-white/5 text-left hover:bg-white/10 transition"
    >
      <div className="relative">
        <img src={img} alt={title} className="h-[220px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xl font-semibold text-white">{title}</div>
        </div>

        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-brand-yellow/95 text-brand-ink grid place-items-center font-black">
          ↗
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-white/70">{text}</div>
      </div>
    </button>
  );
}

function Testimonial({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
      <div className="text-brand-yellow text-sm">★★★★★</div>
      <div className="mt-3 text-sm text-white/75 leading-relaxed">{text}</div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-brand-purple/60 border border-white/10" />
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-[11px] text-white/60">{role}</div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{text}</div>
    </div>
  );
}
