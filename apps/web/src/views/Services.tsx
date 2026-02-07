import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingLayout from "../ui/BookingLayout";
import { getServices } from "../lib/api";
import { loadDraft, saveDraft } from "../lib/storage";
import { useI18n } from "../i18n";

const cats = [
  { key: "Фарбування", icon: "🎨", en: "Hair Colouring" },
  { key: "Стрижки", icon: "✂️", en: "Haircuts" },
  { key: "Відновлення", icon: "✨", en: "Hair Repair" },
] as const;

export default function Services() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const draft = loadDraft();

  const { data } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const [cat, setCat] = useState<(typeof cats)[number]["key"]>("Фарбування");

  const list = useMemo(() => (data ?? []).filter((s) => s.category === cat), [data, cat]);

  function pickService(serviceId: string) {
    const svc = (data ?? []).find((s) => s.id === serviceId);
    if (!svc) return;
    saveDraft({
      ...draft,
      serviceId: svc.id,
      serviceTitle: svc.title,
      durationMin: svc.durationMin,
    });
    nav("/datetime");
  }

  return (
    <BookingLayout
      step={1}
      title={lang === "en" ? "Schedule Your Appointment" : "Записатися на процедуру"}
      subtitle={
        lang === "en"
          ? "Choose your service, pick a time that works for you, and we’ll take care of the rest."
          : "Оберіть послугу, дату та час — і ми все підтвердимо. Це займає менше хвилини."
      }
    >
      <div className="text-xl md:text-2xl font-semibold">
        {lang === "en" ? "Select Your Service" : "Оберіть послугу"}
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold text-brand-ink/70">
          {lang === "en" ? "Service Category" : "Категорія"}
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cats.map((c) => {
            const active = c.key === cat;
            return (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={[
                  "rounded-[18px] border p-4 text-center transition",
                  active
                    ? "bg-brand-purple/40 border-white/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="mx-auto h-10 w-10 rounded-full bg-white/5 border border-white/10 grid place-items-center">
                  {c.icon}
                </div>
                <div className="mt-3 text-sm font-semibold">
                  {lang === "en" ? c.en : c.key}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* services list */}
      <div className="mt-6 space-y-3">
        {list.map((s) => (
          <button
            key={s.id}
            onClick={() => pickService(s.id)}
            className="w-full text-left rounded-[18px] border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="text-xs text-brand-ink/60 mt-1">{s.durationMin} min</div>
                {s.description && <div className="text-xs text-brand-ink/60 mt-2">{s.description}</div>}
              </div>
              <div className="text-right">
                <div className="text-[11px] text-brand-ink/60">price</div>
                <div className="text-sm font-semibold text-brand-yellow">
                  {typeof s.priceFrom === "number" ? `€${s.priceFrom}` : "—"}
                  {typeof s.priceTo === "number" ? `–€${s.priceTo}` : ""}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Continue button like screenshot */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => nav("/datetime")}
          disabled={!draft.serviceId && list.length === 0}
          className="rounded-full px-6 py-2 text-xs font-semibold bg-white/15 text-brand-ink/70 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "en" ? "Continue" : "Продовжити"}
        </button>
      </div>
    </BookingLayout>
  );
}
