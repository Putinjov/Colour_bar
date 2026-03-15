import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingLayout from "../ui/BookingLayout.js";
import { getServices } from "../lib/api.js";
import { loadDraft, saveDraft } from "../lib/storage.js";
import { useI18n } from "../i18n.js";

const cats = [
  { key: "Фарбування", icon: "🎨", en: "Hair Colouring" },
  { key: "Стрижки", icon: "✂️", en: "Haircuts" },
  { key: "Відновлення", icon: "✨", en: "Hair Repair" },
] as const;

type CatKey = (typeof cats)[number]["key"];

const intentions = ["Consultation", "Quick refresh", "Full transformation"] as const;

function getId(s: any): string {
  return s?.id ?? s?._id ?? "";
}

export default function Services() {
  const nav = useNavigate();
  const location = useLocation();
  const { lang } = useI18n();

  const { data } = useQuery({ queryKey: ["services"], queryFn: getServices });

  // категорія
  const [cat, setCat] = useState<CatKey>("Фарбування");

  // локально тримаємо вибір (бо loadDraft() не реактивний)
  const initialDraft = loadDraft();
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    initialDraft?.serviceId
  );
  const [intention, setIntention] = useState<string>(initialDraft?.intention ?? intentions[0]);

  const list = useMemo(
    () => (data ?? []).filter((s: any) => s.category === cat),
    [data, cat]
  );

  function pickService(serviceId: string) {
    const svc = (data ?? []).find((s: any) => getId(s) === serviceId);
    if (!svc) return;

    const d = loadDraft(); // беремо актуальний драфт
    saveDraft({
      ...d,
      serviceId: getId(svc),
      serviceTitle: svc.title,
      durationMin: svc.durationMin,
      intention,
    });

    setSelectedServiceId(getId(svc));
    nav("/datetime");
  }

  // ✅ preselect з /services?serviceId=... або state
  useEffect(() => {
    if (!data || data.length === 0) return;

    const fromState = (location.state as any)?.serviceId as string | undefined;

    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("serviceId") || undefined;

    const preselected = fromState || fromQuery;
    if (!preselected) return;

    const svc = (data ?? []).find((s: any) => getId(s) === preselected);
    if (!svc) return;

    // щоб UI показав правильну категорію
    if (svc.category && svc.category !== cat) {
      setCat(svc.category as CatKey);
    }

    // автоматично вибираємо й переходимо на datetime
    pickService(preselected);

    // почистимо URL (щоб при оновленні/повторному заході не зациклювало)
    // (state теж зникне при replace)
    nav("/services", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <BookingLayout
      step={2}
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

      <div className="mt-4">
        <div className="text-xs font-semibold text-brand-ink/70">{lang === "en" ? "Goal / Intention" : "Мета візиту"}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {intentions.map((item) => (
            <button key={item} onClick={() => { setIntention(item); saveDraft({ ...loadDraft(), intention: item }); }}
              className={["rounded-full border px-3 py-1 text-xs", intention === item ? "bg-brand-purple text-white border-brand-purple" : "bg-white/5 border-white/10"].join(" ")}>
              {item}
            </button>
          ))}
        </div>
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
        {list.map((s: any) => {
          const sid = getId(s);
          const active = sid && sid === selectedServiceId;

          return (
            <button
              key={sid}
              onClick={() => pickService(sid)}
              className={[
                "w-full text-left rounded-[18px] border p-4 transition",
                active
                  ? "border-brand-yellow/50 bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-brand-ink/60 mt-1">{s.durationMin} min</div>
                  {s.description && (
                    <div className="text-xs text-brand-ink/60 mt-2">{s.description}</div>
                  )}
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
          );
        })}
      </div>

      {/* Continue button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => nav("/datetime")}
          disabled={!selectedServiceId}
          className="rounded-full px-6 py-2 text-xs font-semibold bg-white/15 text-brand-ink/70 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "en" ? "Continue" : "Продовжити"}
        </button>
      </div>
    </BookingLayout>
  );
}
