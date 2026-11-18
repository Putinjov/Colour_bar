import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useI18n } from "../i18n.js";

export default function AppShell() {
  const { lang, setLang } = useI18n();
  const l = (uk: string, en: string) => lang === "uk" ? uk : en;
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const landing = loc.pathname === "/";
  useEffect(() => { setOpen(false); }, [loc.pathname, loc.hash]);
  useEffect(() => {
    if (!landing || !loc.hash) return;
    const id = loc.hash.slice(1);
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
    return () => cancelAnimationFrame(frame);
  }, [landing, loc.hash]);
  useEffect(() => {
    if (!landing) { setShowBooking(false); return; }
    const hero = document.getElementById("hero-booking");
    if (!hero || !("IntersectionObserver" in globalThis)) return;
    const observer = new IntersectionObserver(([entry]) => setShowBooking(!entry.isIntersecting && entry.boundingClientRect.top < 0), {rootMargin:"-70px 0px 0px 0px"});
    observer.observe(hero); return () => observer.disconnect();
  }, [landing]);
  useEffect(() => { if (!loc.hash) globalThis.scrollTo(0,0); }, [loc.pathname,loc.hash]);
  const links = [{to:"/services-catalog",text:l("Послуги","Services")},{to:"/#about",text:l("Про майстра","About")},{to:"/#schedule",text:l("Контакти","Contact")}];
  return <div className={"client-shell min-h-dvh bg-[#faf8f5] text-[#252128] " + (landing ? "pb-20 md:pb-0" : "")}>
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf8f5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link to="/" aria-label="Colour Lab home"><img src="/branding/logo-compact-outline.svg" alt="Colour Lab" className="h-9 w-auto max-w-[145px] sm:h-11 sm:max-w-[180px]" /></Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">{links.map(x=><Link key={x.to} to={x.to} className="hover:underline">{x.text}</Link>)}</nav>
        <div className="flex items-center gap-3">
          <button onClick={()=>setLang(lang==="uk"?"en":"uk")} className="rounded-full border border-black/10 px-3 py-2 text-xs font-medium" aria-label={l("Перемкнути мову","Change language")}>{lang==="uk"?"EN":"UA"}</button>
          <Link to="/services" className="hidden rounded-full bg-[#262129] px-5 py-3 text-sm font-medium text-white md:block">{l("Записатися","Book now")}</Link>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-black/10 md:hidden" aria-label={l("Меню","Menu")} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?"✕":"☰"}</button>
        </div>
      </div>
      {open && <nav className="grid gap-1 border-t border-black/5 px-5 pb-4 pt-2 md:hidden">{links.map(x=><Link key={x.to} to={x.to} onClick={()=>setOpen(false)} className="py-3 text-base">{x.text}</Link>)}<Link to="/services" onClick={()=>setOpen(false)} className="py-3">{l("Записатися","Book appointment")}</Link></nav>}
    </header>
    {landing ? <Outlet/> : <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10"><Outlet/></div>}
    {landing && showBooking && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-[#faf8f5]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"><Link to="/services" className="block rounded-full bg-[#262129] px-6 py-4 text-center text-sm font-semibold text-white">{l("Записатися онлайн","Book appointment")} <span aria-hidden="true">↗</span></Link></div>}
  </div>;
}
