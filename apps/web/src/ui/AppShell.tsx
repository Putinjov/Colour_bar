import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const canBack = loc.pathname !== "/";
  const { lang, setLang, t } = useI18n();

  const isLanding = loc.pathname === "/";

  return (
    <div className="min-h-dvh bg-brand-ink text-white">
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <header className="pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <button onClick={() => nav("/")} className="flex items-center gap-2">
              <div className="text-lg font-semibold tracking-tight">
                <span className="text-white/90">Colour</span>
                <span className="text-brand-yellow">Lab</span>
              </div>
            </button>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Lang toggle */}
              <div className="rounded-xl2 border border-white/10 bg-white/5 p-1 flex">
                <button
                  onClick={() => setLang("uk")}
                  className={[
                    "px-3 py-2 text-xs font-semibold rounded-xl2 transition",
                    lang === "uk" ? "bg-brand-purple text-white" : "text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  UKR
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={[
                    "px-3 py-2 text-xs font-semibold rounded-xl2 transition",
                    lang === "en" ? "bg-brand-purple text-white" : "text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  EN
                </button>
              </div>

              {!isLanding && canBack && (
                <button
                  onClick={() => nav(-1)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl2 bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  {t("nav.back")}
                </button>
              )}

              {/* Book now (on all pages) */}
              <button
                onClick={() => nav("/services")}
                className="hidden sm:inline-flex items-center justify-center rounded-xl2 px-4 py-2 text-xs font-semibold bg-brand-yellow text-brand-ink hover:brightness-105 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        </header>

        <Outlet />

        <footer className="mt-8 text-center text-[11px] text-white/50">
          💛💜 Colour Lab • Dublin time • 1 master
        </footer>
      </div>
    </div>
  );
}
