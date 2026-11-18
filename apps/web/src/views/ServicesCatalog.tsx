import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "../i18n.js";
import { getCatalog, type Catalog, type Lang, type ServiceKey } from "../api/catalog.js";

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ServicesCatalog() {
  const nav = useNavigate();
  const loc = useLocation();
  const { lang } = useI18n();
  const L = (lang === "en" ? "en" : "uk") as Lang;

  const { data, isLoading, error } = useQuery<Catalog>({
    queryKey: ["catalog"],
    queryFn: getCatalog,
  });

  // ✅ авто-скрол на секцію після завантаження каталогу
  useEffect(() => {
    if (!data) return;

    const state = (loc.state || {}) as { target?: ServiceKey };
    const targetFromState = state.target;

    const hash = (loc.hash || "").replace("#", "") as ServiceKey | "";
    const target = targetFromState || (hash ? hash : undefined);

    if (target) {
      setTimeout(() => scrollToTarget(target), 80);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [data, loc.state, loc.hash]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-brand-sub">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-red-600">
        {String((error as any)?.message || error)}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {data.blocks.map((b) => (
        <section
          key={b.key}
          id={b.key}
          className="pt-10 md:pt-14 scroll-mt-[96px]"
        >
          {/* HERO like screenshot */}
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brand-muted border border-brand-line grid place-items-center">
                  ✨
                </div>
                <div className="text-xs tracking-[0.18em] text-[#765487] font-semibold">
                  {b.pill[L]}
                </div>
              </div>

              <h2 className="mt-6 font-serif text-3xl md:text-5xl font-normal text-brand-ink leading-tight">
                {b.title[L]}
              </h2>

              <p className="mt-4 text-sm md:text-base text-brand-sub max-w-xl">
                {b.description[L]}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {/* CTA: відкриває booking сторінку без прив’язки до конкретної процедури */}
                <button
                  onClick={() => nav("/services?category=" + encodeURIComponent(({colouring:"Фарбування",haircuts:"Стрижки",repair:"Відновлення"} as const)[b.key]))}
                  className="inline-flex items-center gap-3 rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  {b.cta[L]}
                  <span className="text-lg">→</span>
                </button>

                {/* Якір на процедури */}
                <button
                  onClick={() =>
                    document
                      .getElementById(`grid-${b.key}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="inline-flex items-center gap-3 rounded-full border border-brand-line bg-brand-surface px-6 py-3 text-sm font-semibold hover:bg-brand-muted transition"
                >
                  {lang === "en" ? "See procedures" : "Переглянути процедури"}
                </button>
              </div>
            </div>

            <div>
              <div className="rounded-[22px] overflow-hidden border border-brand-line shadow-soft bg-brand-surface">
                <img
                  src={b.image}
                  alt={b.pill[L]}
                  className="w-full h-[260px] md:h-[360px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* PROCEDURES GRID */}
          <div id={`grid-${b.key}`} className="mt-10 grid gap-6 md:grid-cols-3 scroll-mt-[96px]">
            {b.items.map((it) => {
              const canBook = Boolean(it.serviceId);

              return (
                <div
                  key={`${b.key}-${it.title.en}`}
                  className="rounded-[18px] bg-white border border-brand-line shadow-soft p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-lg font-semibold text-brand-ink">
                      {it.title[L]}
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
                    {it.bullets[L].map((btxt) => (
                      <div
                        key={btxt}
                        className="flex items-start gap-2 text-sm text-brand-sub"
                      >
                        <span className="mt-[3px] text-brand-yellow">✓</span>
                        <span>{btxt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">{canBook && <button onClick={() => nav("/services?serviceId=" + encodeURIComponent(it.serviceId!))} className="w-full rounded-full bg-brand-ink px-4 py-3 text-sm font-semibold text-white">{lang === "en" ? "Book this service" : "Записатися"}</button>}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 border-t border-brand-line" />
        </section>
      ))}
    </div>
  );
}
