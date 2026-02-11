import React, { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLanding = loc.pathname === "/";

  const linkBase = "text-xs uppercase tracking-[0.14em] transition px-2 py-2";
  const linkIdle = "text-brand-sub hover:text-brand-ink";
  const linkActive = "bg-brand-yellow text-brand-ink font-bold";

  function goSection(id: "home" | "services" | "schedule") {
    setMobileOpen(false);
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
          <button
            onClick={() => {
              nav("/");
              setMobileOpen(false);
            }}
            className="select-none flex items-center"
            aria-label="Go home"
          >
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

          <div className="hidden md:flex items-center gap-3">
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

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center border-2 border-brand-line bg-brand-surface"
            aria-label={lang === "en" ? "Toggle menu" : "Відкрити меню"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-brand-ink" />
              <span className="block h-0.5 w-5 bg-brand-ink" />
              <span className="block h-0.5 w-5 bg-brand-ink" />
            </div>
          </button>
        </div>

        {mobileOpen ? (
          <div id="mobile-menu" className="md:hidden border-t-2 border-brand-line px-4 pb-4">
            <nav className="grid gap-2 pt-4">
              <button className={[linkBase, onLanding ? linkActive : linkIdle, "text-left"].join(" ")} onClick={() => goSection("home")}>
                {lang === "en" ? "Home" : "Головна"}
              </button>
              <button className={[linkBase, linkIdle, "text-left"].join(" ")} onClick={() => goSection("services")}>
                {lang === "en" ? "Services" : "Послуги"}
              </button>
              <button className={[linkBase, linkIdle, "text-left"].join(" ")} onClick={() => goSection("schedule")}>
                {lang === "en" ? "Schedule" : "Графік"}
              </button>

              <button
                onClick={() => {
                  nav("/admin/login");
                  setMobileOpen(false);
                }}
                className="mt-2 border-2 border-brand-line bg-brand-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-left"
              >
                Admin
              </button>

              <div className="border-2 border-brand-line bg-brand-surface p-1 flex mt-2">
                <button
                  onClick={() => setLang("uk")}
                  className={[
                    "flex-1 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition",
                    lang === "uk" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
                  ].join(" ")}
                >
                  UKR
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={[
                    "flex-1 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition",
                    lang === "en" ? "bg-brand-purple text-white" : "text-brand-sub hover:text-brand-ink",
                  ].join(" ")}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => {
                  nav("/services");
                  setMobileOpen(false);
                }}
                className="mt-2 border-2 border-brand-yellow bg-brand-yellow text-brand-ink px-5 py-2 text-xs font-bold uppercase tracking-[0.08em]"
              >
                {lang === "en" ? "Book Now" : "Записатися"}
              </button>
            </nav>
          </div>
        ) : null}
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
