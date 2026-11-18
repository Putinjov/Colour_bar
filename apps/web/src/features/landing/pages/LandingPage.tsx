import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "../../../i18n.js";
import { getCatalog } from "../../../api/catalog.js";

const instagram = "https://instagram.com/hair_by_marina_ie";
const image = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85";
const primary = "inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-[#262129] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#483b4e]";
const eyebrow = "text-xs font-medium uppercase tracking-[0.19em] text-[#765487]";
const heading = "font-serif font-normal leading-[1.08] tracking-[-0.035em]";
export default function LandingPage() {
  const {lang} = useI18n();
  const l = (uk:string,en:string)=>lang==="uk"?uk:en;
  const catalog = useQuery({queryKey:["catalog",lang],queryFn:getCatalog,staleTime:300000});
  return <main className="overflow-hidden">
    <section id="home" className="mx-auto grid max-w-7xl items-center gap-5 px-5 pb-12 pt-6 md:grid-cols-[0.95fr_1.05fr] md:gap-12 md:px-8 md:py-14">
      <div className="md:py-10">
        <p className={eyebrow}>Colour Lab · Tullamore, Ireland</p>
        <h1 className={heading+" mt-4 text-[clamp(2.8rem,6vw,5.6rem)]"}>{l("Колір, що підкреслює","Colour that feels")} <em className="font-normal text-[#765487]">{l("вас.","like you.")}</em></h1>
        <p className="mt-4 max-w-md text-base leading-7 text-[#6b626c]">{l("Індивідуальне фарбування, сучасні стрижки та професійний догляд за волоссям у Талламорі.","Personalised colour, precision cuts and restorative hair care in Tullamore.")}</p>
        <div id="hero-booking" className="mt-5 flex flex-wrap items-center gap-4"><Link className={primary} to="/services">{l("Записатися онлайн","Book appointment")} ↗</Link><Link className="border-b border-[#765487] pb-1 text-sm font-medium" to="/services-catalog">{l("Послуги та ціни","Services & prices")}</Link></div>
        <p className="mt-4 text-xs tracking-wide text-[#6b626c]">{l("Індивідуальний підхід · За попереднім записом","One-to-one appointments · By appointment")}</p>
      </div>
      <div className="relative overflow-hidden rounded-[28px] bg-[#e9dfe5]"><img src={image} alt={l("Ілюстрація перукарського догляду","Hair studio imagery")} className="aspect-[5/4] w-full object-cover md:aspect-[4/5] md:max-h-[650px]" fetchPriority="high" decoding="async"/></div>
    </section>
    <section id="services" className="border-t border-black/5 bg-white/60 py-14 md:py-20"><div className="mx-auto max-w-7xl px-5 md:px-8">
      <p className={eyebrow}>{l("Послуги","The services")}</p><h2 className={heading+" mt-3 text-4xl md:text-5xl"}>{l("Ваше волосся. Ваш стиль.","Your hair. Your way.")}</h2>
      <p className="mt-3 max-w-xl text-[#6b626c]">{l("Оберіть напрямок, щоб переглянути процедури, тривалість та ціни.","Explore treatments, timing and prices before booking.")}</p>
      {catalog.isLoading && <div className="mt-8 grid gap-5 md:grid-cols-3" aria-label={l("Завантаження","Loading")}>{[1,2,3].map(n=><div key={n} className="h-64 animate-pulse rounded-2xl bg-[#eee8e5]"/>)}</div>}
      {catalog.error && <p className="mt-6 text-sm text-[#6b626c]">{l("Каталог тимчасово недоступний.","The catalogue is temporarily unavailable.")} <Link to="/services" className="underline">{l("Перейти до запису","Go to booking")}</Link></p>}
      <div className="mt-8 grid gap-6 md:grid-cols-3">{catalog.data?.blocks.map(block=><Link key={block.key} to={"/services-catalog#"+encodeURIComponent(block.key)} className="group block overflow-hidden rounded-2xl border border-black/5 bg-[#faf8f5]">
        <img src={block.image} alt={block.title[lang]} className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async"/>
        <div className="p-5"><p className={eyebrow}>{block.pill[lang]}</p><h3 className={heading+" mt-2 text-2xl"}>{block.title[lang]}</h3><p className="mt-3 text-sm leading-6 text-[#6b626c]">{block.description[lang]}</p><span className="mt-5 inline-block text-sm font-medium text-[#765487]">{l("Переглянути послуги","Explore services")} ↗</span></div>
      </Link>)}</div>
    </div></section>
    <section id="about" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
      <div className="rounded-[28px] bg-[#eee4f0] p-8 md:p-12"><p className={eyebrow}>{l("Персональний підхід","The personal touch")}</p><h2 className={heading+" mt-5 text-4xl md:text-5xl"}>{l("Краса починається з розуміння.","Good hair starts with understanding.")}</h2><p className="mt-5 leading-7 text-[#625665]">{l("Від консультації до фінального укладання — увага до стану волосся, вашого стилю та бажаного результату.","From consultation to the final finish, every appointment considers your hair's condition, your style and your desired result.")}</p></div>
      <div className="flex flex-col justify-center"><p className={eyebrow}>{l("Ваш майстер","Meet your stylist")}</p><h2 className={heading+" mt-3 text-4xl md:text-5xl"}>Marina</h2><p className="mt-4 text-base leading-7 text-[#6b626c]">{l("Перукар-колорист. Спеціалізація — фарбування, стрижки та відновлення волосся. Перегляньте роботи в Instagram, щоб познайомитися зі стилем майстра.","Hair stylist and colourist specialising in colour, cuts and hair repair. Explore recent work on Instagram to get a feel for Marina's style.")}</p><a href={instagram} target="_blank" rel="noreferrer" className="mt-6 self-start border-b border-[#765487] pb-1 text-sm font-medium">Instagram ↗</a></div>
    </section>
    <section id="schedule" className="bg-[#28232b] text-white"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20"><div><p className="text-xs uppercase tracking-[0.18em] text-[#e5c7ee]">{l("Ваш наступний візит","Your next visit")}</p><h2 className={heading+" mt-4 text-4xl md:text-5xl"}>{l("Час для себе.","Make time for yourself.")}</h2><Link to="/services" className="mt-7 inline-flex rounded-full bg-[#ead8ee] px-6 py-3 text-sm font-semibold text-[#28232b]">{l("Обрати час","Find an appointment")} ↗</Link></div><div className="space-y-5 text-sm text-white/80"><div><h3 className="mb-1 font-semibold text-white">{l("Адреса","Visit")}</h3><p>3 Henry St, Tullamore, R35 VN34</p></div><div><h3 className="mb-1 font-semibold text-white">{l("Години роботи","Opening hours")}</h3><p>{l("Вт–Сб · 10:00–18:00","Tue–Sat · 10:00–18:00")}</p></div><div><h3 className="mb-1 font-semibold text-white">{l("Зв’язок","Contact")}</h3><a href="tel:+353857842329" className="underline">+353 85 784 2329</a><br/><a href={instagram} target="_blank" rel="noreferrer" className="underline">Instagram</a></div></div></div></section>
    <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-[#6b626c] md:px-8"><span>© {new Date().getFullYear()} Colour Lab · Tullamore</span><Link to="/admin/login" className="underline">{l("Кабінет майстра","Studio login")}</Link></footer>
  </main>;
}
