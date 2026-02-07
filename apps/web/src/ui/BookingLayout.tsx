import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

type Step = 1 | 2 | 3;

export default function BookingLayout({
  step,
  title,
  subtitle,
  children,
}: React.PropsWithChildren<{ step: Step; title: string; subtitle?: string }>) {
  const nav = useNavigate();
  const { lang } = useI18n();

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="text-center">
        <div className="text-[11px] tracking-[0.18em] text-brand-yellow">
          {lang === "en" ? "BOOK ONLINE" : "ЗАПИС ОНЛАЙН"}
        </div>

        <h1 className="mt-3 text-3xl md:text-5xl font-light text-brand-ink">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-brand-sub max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content + Sidebar */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr] items-start">
        {/* Main */}
        <div className="rounded-[24px] border border-brand-line bg-brand-surface shadow-soft overflow-hidden">
          <Stepper step={step} />
          <div className="p-5 md:p-7">{children}</div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-[24px] border border-brand-line bg-brand-surface shadow-soft p-5">
            <div className="text-sm font-semibold text-brand-ink">
              {lang === "en" ? "Visit Us" : "Контакти"}
            </div>

            <div className="mt-4 space-y-3">
              <Row icon="📍" title={lang === "en" ? "Location" : "Локація"} text="Tullamore, Ireland" />
              <Row icon="🕒" title={lang === "en" ? "Hours" : "Години"} text={lang === "en" ? "Tue–Sat: 10:00–18:00" : "Вт–Сб: 10:00–18:00"} />
              <Row icon="☎️" title={lang === "en" ? "Contact" : "Звʼязок"} text={lang === "en" ? "Phone / Instagram (add)" : "Телефон / Instagram (додати)"} />
            </div>

            <button
              onClick={() => nav("/")}
              className="mt-4 w-full rounded-full border border-brand-line bg-brand-muted px-5 py-3 text-sm font-semibold text-brand-ink hover:brightness-98 transition"
            >
              {lang === "en" ? "Back to Home" : "На головну"}
            </button>
          </div>

          <div className="rounded-[24px] bg-brand-ink text-white shadow-soft p-6">
            <div className="text-sm font-semibold">
              {lang === "en" ? "Cancellation Policy" : "Правила скасування"}
            </div>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              {lang === "en"
                ? "Please give at least 24 hours notice if you need to reschedule or cancel."
                : "Будь ласка, попередьте мінімум за 24 години, якщо потрібно перенести або скасувати запис."}
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              {lang === "en"
                ? "Late cancellations may be subject to a fee."
                : "Пізнє скасування може мати оплату."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items: { n: 1 | 2 | 3; label: string }[] = [
    { n: 1, label: "Service" },
    { n: 2, label: "Date & Time" },
    { n: 3, label: "Details" },
  ];

  return (
    <div className="px-5 md:px-7 py-4 border-b border-brand-line bg-brand-muted">
      <div className="flex items-center justify-between">
        {items.map((it, idx) => {
          const active = step === it.n;
          const done = step > it.n;

          return (
            <div key={it.n} className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "h-9 w-9 rounded-full grid place-items-center text-sm font-semibold border",
                      done
                        ? "bg-brand-yellow text-brand-ink border-brand-line"
                        : active
                        ? "bg-brand-purple text-white border-brand-line"
                        : "bg-brand-surface text-brand-sub border-brand-line",
                    ].join(" ")}
                  >
                    {it.n}
                  </div>
                  <div className="text-xs text-brand-sub hidden sm:block">{it.label}</div>
                </div>

                {idx < items.length - 1 && (
                  <div className="hidden sm:block flex-1 mx-4 h-px bg-brand-line" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full bg-brand-muted border border-brand-line grid place-items-center">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-brand-ink">{title}</div>
        <div className="text-xs text-brand-sub mt-0.5">{text}</div>
      </div>
    </div>
  );
}
