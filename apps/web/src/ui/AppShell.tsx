import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

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

  const linkBase = "text-sm transition";
  const linkIdle = "text-brand-sub hover:text-brand-ink";
  const linkActive = "text-brand-ink font-medium";

  function goSection(id: "home" | "services" | "schedule") {
    if (!onLanding) {
      nav("/");
      setTimeout(() => scrollToId(id), 80);
      return;
    }
    scrollToId(id);
  }

  const HeaderInner = (
    <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-4">
      {/* Logo */}
      <button onClick={() => nav("/")} className="select-none" aria-label="Go home">
        <div className="text-lg font-medium tracking-tight">
          <span className="text-brand-ink">Colour</span>
          <span className="text-brand-yellow">Bar</span>
        </div>
      </button>

      {/* Right */}
      <div className="flex items-center gap-3">
        <nav className="hidden md:flex items-center gap-6">
          <button className={[linkBase, onLanding ? linkActive : linkIdle].join(" ")} onClick={() => goSection("home")}>
            {lang === "en" ? "Home" : "Головна"}
          </button>
          <button className={[linkBase, linkIdle].join(" ")} onClick={() => goSection("services")}>
            {lang === "en" ? "Services" : "Послуги"}
          </button>
          <button className={[linkBase, linkIdle].join(" ")} onClick={() => goSection("schedule")}>
            {lang === "en" ? "Schedule" : "Графік"}
          </button>
        </nav>

        {/* Lang */}
        <div className="rounded-full border border-brand-line bg-brand-surface p-1 flex">
          <button
            onClick={() => setLang("uk")}
            className={[
              "px-3 py-2 text-xs font-semibold rounded-full transition",
              lang === "uk" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
            ].join(" ")}
          >
            UKR
          </button>
          <button
            onClick={() => setLang("en")}
            className={[
              "px-3 py-2 text-xs font-semibold rounded-full transition",
              lang === "en" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
            ].join(" ")}
          >
            EN
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => nav("/services")}
          className="rounded-full bg-brand-ink text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition"
        >
          {lang === "en" ? "Book Now" : "Записатися"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-brand-bg text-brand-ink overflow-x-hidden">
      {/* Header: full width, inner centered */}
      <header className="pt-5 pb-4">{HeaderInner}</header>

      {/* ✅ Landing: full width. Other pages: centered container */}
      {onLanding ? (
        <Outlet />
      ) : (
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <Outlet />
          <footer className="mt-10 text-center text-[11px] text-brand-sub">
            Colour Bar • Tullamore, Ireland • 💛💜
          </footer>
        </div>
      )}

      {/* footer for landing, centered */}
      {onLanding && (
        <footer className="mt-10 text-center text-[11px] text-brand-sub pb-12">
          Colour Bar • Tullamore, Ireland • 💛💜
        </footer>
      )}
    </div>
  );
}
