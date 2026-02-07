import React, { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingLayout from "../ui/BookingLayout";
import { getSlots } from "../lib/api";
import { loadDraft, saveDraft } from "../lib/storage";
import { useI18n } from "../i18n";

function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export default function DateTime() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const draft = loadDraft();

  const can = Boolean(draft.serviceId);
  const [dateISO, setDateISO] = useState<string>(draft.dateISO ?? todayISO());

  const next7 = useMemo(
    () => Array.from({ length: 7 }, (_, i) => format(addDays(new Date(), i), "yyyy-MM-dd")),
    []
  );

  const q = useQuery({
    queryKey: ["slots", draft.serviceId, dateISO],
    queryFn: () => getSlots(draft.serviceId!, dateISO),
    enabled: can,
  });

  function pickSlot(startAt: string, endAt: string) {
    saveDraft({ ...draft, dateISO, startAt, endAt });
    nav("/details");
  }

  if (!can) {
    return (
      <BookingLayout
        step={2}
        title={lang === "en" ? "Schedule Your Appointment" : "Записатися на процедуру"}
        subtitle={lang === "en" ? "Pick a date and time that works for you." : "Оберіть дату та зручний час."}
      >
        <div className="text-xl font-semibold text-brand-ink">
          {lang === "en" ? "Choose a service first" : "Спочатку оберіть послугу"}
        </div>

        <p className="mt-2 text-sm text-brand-sub">
          {lang === "en"
            ? "Please go back and select a service to continue."
            : "Поверніться назад і оберіть послугу, щоб продовжити."}
        </p>

        <div className="mt-6">
          <button
            onClick={() => nav("/services")}
            className="rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            {lang === "en" ? "Go to Services" : "Перейти до послуг"}
          </button>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout
      step={2}
      title={lang === "en" ? "Schedule Your Appointment" : "Записатися на процедуру"}
      subtitle={
        lang === "en"
          ? "Choose a date and pick a time — your slot will be reserved instantly."
          : "Оберіть дату та час — слот буде зарезервовано одразу."
      }
    >
      <div className="text-xl md:text-2xl font-semibold text-brand-ink">
        {lang === "en" ? "Select Date & Time" : "Оберіть дату та час"}
      </div>

      <div className="mt-2 text-sm text-brand-sub">
        {lang === "en" ? "Service:" : "Послуга:"}{" "}
        <span className="text-brand-ink font-semibold">{draft.serviceTitle}</span>
      </div>

      {/* Date picker row */}
      <div className="mt-6">
        <div className="text-xs font-semibold text-brand-sub">
          {lang === "en" ? "Date" : "Дата"}
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {next7.map((d) => {
            const active = d === dateISO;
            const label = format(new Date(d), "EEE dd/MM");
            return (
              <button
                key={d}
                onClick={() => setDateISO(d)}
                className={[
                  "rounded-2xl border px-3 py-3 text-xs font-semibold transition",
                  active
                    ? "bg-brand-purple text-white border-brand-line"
                    : "bg-brand-surface text-brand-ink border-brand-line hover:bg-brand-muted",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="mt-7">
        <div className="text-xs font-semibold text-brand-sub">
          {lang === "en" ? "Available times" : "Доступний час"}
        </div>

        {q.isLoading && (
          <div className="mt-3 text-sm text-brand-sub">
            {lang === "en" ? "Loading slots…" : "Завантаження слотів…"}
          </div>
        )}

        {q.error && (
          <div className="mt-3 text-sm text-red-600">
            {lang === "en" ? "Error: " : "Помилка: "}
            {String(q.error)}
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {(q.data ?? []).map((s) => {
            const t = new Date(s.startAt);
            return (
              <button
                key={s.startAt}
                onClick={() => pickSlot(s.startAt, s.endAt)}
                className="rounded-2xl border border-brand-line bg-brand-surface px-3 py-3 text-xs font-semibold text-brand-ink hover:bg-brand-muted transition"
              >
                {format(t, "HH:mm")}
              </button>
            );
          })}
        </div>

        {(q.data?.length ?? 0) === 0 && !q.isLoading && (
          <div className="mt-3 text-sm text-brand-sub">
            {lang === "en"
              ? "No available slots for this date."
              : "Немає доступних слотів на цю дату."}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
        <button
          onClick={() => nav("/services")}
          className="rounded-full border border-brand-line bg-brand-muted px-6 py-3 text-sm font-semibold text-brand-ink hover:brightness-98 transition"
        >
          {lang === "en" ? "Change Service" : "Змінити послугу"}
        </button>

        <button
          onClick={() => {
            // if user hasn't chosen slot yet, do nothing
            if (!draft.startAt) return;
            nav("/details");
          }}
          disabled={!draft.startAt}
          className="rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "en" ? "Continue" : "Продовжити"}
        </button>
      </div>
    </BookingLayout>
  );
}
