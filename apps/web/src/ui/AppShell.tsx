import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const { lang, setLang } = useI18n();

  const isLanding = loc.pathname === "/";
  const isBooking = ["/services", "/datetime", "/details"].some((p) => loc.pathname.startsWith(p));

  const linkCls =
    "text-sm text-brand-sub hover:text-brand-ink transition";

  return (
    <div className="min-h-dvh bg-brand-bg text-brand-ink">
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <header className="pt-5 pb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button onClick={() => nav("/")} className="flex items-center gap-2">
              <div className="text-lg font-medium tracking-tight">
                <span className="text-brand-ink">Colour</span>
                <span className="text-brand-yellow">Bar</span>
              </div>
            </button>

            {/* Nav (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              <button className={linkCls} onClick={() => (isLanding ? document.getElementById("home")?.scrollIntoView({behavior:"smooth"}) : nav("/"))}>
                {lang === "en" ? "Home" : "Головна"}
              </button>
              <button className={linkCls} onClick={() => (isLanding ? document.getElementById("services")?.scrollIntoView({behavior:"smooth"}) : nav("/#services"))}>
                {lang === "en" ? "Services" : "Послуги"}
              </button>
              <button className={linkCls} onClick={() => (isLanding ? document.getElementById("schedule")?.scrollIntoView({behavior:"smooth"}) : nav("/#schedule"))}>
                {lang === "en" ? "Schedule" : "Графік"}
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Lang toggle */}
              <div className="rounded-xl2 border border-brand-line bg-brand-surface p-1 flex">
                <button
                  onClick={() => setLang("uk")}
                  className={[
                    "px-3 py-2 text-xs font-semibold rounded-xl2 transition",
                    lang === "uk"
                      ? "bg-brand-purple text-white"
                      : "text-brand-sub hover:text-brand-ink",
                  ].join(" ")}
                >
                  UKR
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={[
                    "px-3 py-2 text-xs font-semibold rounded-xl2 transition",
                    lang === "en"
                      ? "bg-brand-purple text-white"
                      : "text-brand-sub hover:text-brand-ink",
                  ].join(" ")}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => nav("/services")}
                className="rounded-full bg-brand-ink text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition"
              >
                {lang === "en" ? "Book Now" : "Записатися"}
              </button>
            </div>
          </div>

          {/* Tiny breadcrumb for booking pages (optional) */}
          {isBooking && (
            <div className="mt-3 text-xs text-brand-sub">
              {lang === "en" ? "Book online" : "Запис онлайн"} • Colour Lab
            </div>
          )}
        </header>

        <Outlet />

        <footer className="mt-10 text-center text-[11px] text-brand-sub">
          Colour Lab • Tullamore, Ireland • 💛💜
        </footer>
      </div>
    </div>
  );
}
