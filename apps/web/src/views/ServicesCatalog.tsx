import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import catalog from "../data/services.catalog.json";

type Lang = "en" | "uk";
type ServiceKey = "colouring" | "haircuts" | "repair";

type Catalog = {
  blocks: Array<{
    key: ServiceKey;
    pill: Record<Lang, string>;
    title: Record<Lang, string>;
    description: Record<Lang, string>;
    cta: Record<Lang, string>;
    image: string;
    items: Array<{
      title: Record<Lang, string>;
      priceFrom: number;
      duration: string;
      bullets: Record<Lang, string[]>;
    }>;
  }>;
};

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ServicesCatalog() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const loc = useLocation();

  const data = catalog as Catalog;

  useEffect(() => {
    const state = (loc.state || {}) as { target?: ServiceKey };
    const targetFromState = state.target;

    const hash = (loc.hash || "").replace("#", "") as ServiceKey | "";
    const target = targetFromState || (hash ? hash : undefined);

    if (target) setTimeout(() => scrollToTarget(target), 80);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loc.hash, loc.state]);

  return (
    <div className="mx-auto  px-4 pb-16">
      {data.blocks.map((b) => (
        <section key={b.key} id={b.key} className="pt-10 md:pt-14 scroll-mt-[96px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brand-muted border border-brand-line grid place-items-center">
                  ✨
                </div>
                <div className="text-xs tracking-[0.18em] text-brand-yellow font-semibold">
                  {b.pill[lang as Lang]}
                </div>
              </div>

              <h2 className="mt-6 text-3xl md:text-5xl font-light text-brand-ink leading-tight">
                {b.title[lang as Lang]}
              </h2>

              <p className="mt-4 text-sm md:text-base text-brand-sub max-w-xl">
                {b.description[lang as Lang]}
              </p>

              <div className="mt-7">
                <button
                  onClick={() => nav("/services")}
                  className="inline-flex items-center gap-3 rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  {b.cta[lang as Lang]}
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            <div>
              <div className="rounded-[22px] overflow-hidden border border-brand-line shadow-soft bg-brand-surface">
                <img
                  src={b.image}
                  alt={b.pill[lang as Lang]}
                  className="w-full h-[260px] md:h-[360px] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {b.items.map((it) => (
              <div key={it.title.en} className="rounded-[18px] bg-white border border-brand-line shadow-soft p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-lg font-semibold text-brand-ink">
                    {it.title[lang as Lang]}
                  </div>
                  <div className="text-sm font-semibold text-brand-yellow whitespace-nowrap">
                    {lang === "en" ? `from €${it.priceFrom}` : `від €${it.priceFrom}`}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-brand-sub">
                  <span>🕒</span>
                  <span>{it.duration}</span>
                </div>

                <div className="mt-5 space-y-2">
                  {it.bullets[lang as Lang].map((btxt) => (
                    <div key={btxt} className="flex items-start gap-2 text-sm text-brand-sub">
                      <span className="mt-[3px] text-brand-yellow">✓</span>
                      <span>{btxt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-brand-line" />
        </section>
      ))}
    </div>
  );
}
