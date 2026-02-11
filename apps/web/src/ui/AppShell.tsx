import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n.js";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const { lang, setLang } = useI18n();

  const onLanding = loc.pathname === "/";

  const linkBase = "text-xs uppercase tracking-[0.14em] transition px-2 py-2";
  const linkIdle = "text-brand-sub hover:text-brand-ink";
  const linkActive = "bg-brand-yellow text-brand-ink font-bold";

  function goSection(id: "home" | "services" | "schedule") {
    if (!onLanding) {
      nav("/");
      setTimeout(() => scrollToId(id), 80);
      return;
    }
    scrollToId(id);
  }

  return (
    <div className="min-h-dvh bg-brand-bg text-brand-ink">
      <header className="sticky top-0 z-50 border-b-2 border-brand-line bg-brand-bg">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <button onClick={() => nav("/")} className="select-none flex items-center" aria-label="Go home">
            <img
              src="/branding/logo-full-outline.svg"
              alt="Colour Lab"
              className="hidden md:block h-12 w-auto"
              draggable={false}
            />
            <img
              src="/branding/logo-compact-outline.svg"
              alt="Colour Lab"
              className="block md:hidden h-9 w-auto"
              draggable={false}
            />
          </button>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-4">
              <button className={[linkBase, onLanding ? linkActive : linkIdle].join(" ")} onClick={() => goSection("home")}>
                {lang === "en" ? "Home" : "Головна"}
              </button>
              <button className={[linkBase, linkIdle].join(" ")} onClick={() => goSection("services")}>
                {lang === "en" ? "Services" : "Послуги"}
              </button>
              <button className={[linkBase, linkIdle].join(" ")} onClick={() => goSection("schedule")}>
                {lang === "en" ? "Schedule" : "Графік"}
              </button>
              <button
                onClick={() => nav("/admin/login")}
                className="border-2 border-brand-line bg-brand-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] hover:bg-brand-muted transition"
              >
                Admin
              </button>
            </nav>

            <div className="border-2 border-brand-line bg-brand-surface p-1 flex">
              <button
                onClick={() => setLang("uk")}
                className={[
                  "px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition",
                  lang === "uk" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
                ].join(" ")}
              >
                UKR
              </button>
              <button
                onClick={() => setLang("en")}
                className={[
                  "px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition",
                  lang === "en" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
                ].join(" ")}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => nav("/services")}
              className="border-2 border-brand-yellow bg-brand-yellow text-brand-ink px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] hover:brightness-110 transition"
            >
              {lang === "en" ? "Book Now" : "Записатися"}
            </button>
          </div>
        </div>
      </header>

      {onLanding ? (
        <Outlet />
      ) : (
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <Outlet />
          <footer className="mt-10 text-center text-[11px] text-brand-sub uppercase tracking-[0.1em]">
            Colour Lab • Tullamore, Ireland
          </footer>
        </div>
      )}
    </div>
  );
}
