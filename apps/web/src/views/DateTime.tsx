import React, { useMemo, useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  parseISO,
  differenceInMilliseconds,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingLayout from "../ui/BookingLayout.js";
import { getSlots } from "../lib/api.js";
import { loadDraft, saveDraft } from "../lib/storage.js";
import { useI18n } from "../i18n.js";

function todayISO(now = new Date()) {
  return format(now, "yyyy-MM-dd");
}

function tomorrowISO(now = new Date()) {
  return format(addDays(startOfDay(now), 1), "yyyy-MM-dd");
}

function cutoffToday(now = new Date()) {
  // сьогодні о 18:00
  return setMilliseconds(setSeconds(setMinutes(setHours(now, 18), 0), 0), 0);
}

function earliestSelectableISO(now = new Date()) {
  // мінімум завтра, але якщо вже 18:00+ — мінімум післязавтра
  const tmr = addDays(startOfDay(now), 1);
  const cutoff = cutoffToday(now);
  const earliest = now.getTime() >= cutoff.getTime() ? addDays(tmr, 1) : tmr;
  return format(earliest, "yyyy-MM-dd");
}

export default function DateTime() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const draft = loadDraft();

  const can = Boolean(draft.serviceId);

  // правила доступності дат
  const [earliestISO, setEarliestISO] = useState(() => earliestSelectableISO());

  // initial date (не раніше дозволеного)
  const initialDate = useMemo(() => {
    const e = earliestISO;
    return draft.dateISO && draft.dateISO >= e ? draft.dateISO : e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dateISO, setDateISO] = useState<string>(initialDate);

  // selected slot (щоб Continue реально працював)
  const [selected, setSelected] = useState<{ startAt: string; endAt: string } | null>(
    draft.startAt && draft.endAt ? { startAt: draft.startAt, endAt: draft.endAt } : null
  );

  const tomorrow = useMemo(() => tomorrowISO(), []);
  const isTomorrow = (d: string) => d === tomorrow;

  // показуємо 7 днів від завтра (сьогодні не показуємо)
  const next7 = useMemo(() => {
    const start = addDays(startOfDay(new Date()), 1); // завтра
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), "yyyy-MM-dd"));
  }, []);

  // таймер на 18:00: після переходу порогу завтра стає disabled, earliest зсувається
  useEffect(() => {
    const now = new Date();
    const cutoff = cutoffToday(now);
    const ms = differenceInMilliseconds(cutoff, now);

    const syncRules = () => {
      const e = earliestSelectableISO(new Date());
      setEarliestISO(e);
    };

    // якщо вже після 18:00 — просто синхронізуємо
    if (ms <= 0) {
      syncRules();
      return;
    }

    // рівно в 18:00 оновимо правила
    const t = window.setTimeout(() => {
      syncRules();
    }, ms + 50);

    return () => window.clearTimeout(t);
  }, []);

  // якщо поточна дата стала недопустимою (наприклад було "завтра", а стало після 18:00) — перескочити
  useEffect(() => {
    if (dateISO < earliestISO) {
      setDateISO(earliestISO);
      setSelected(null);
      saveDraft({ ...draft, dateISO: earliestISO, startAt: undefined, endAt: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earliestISO]);

  const q = useQuery({
    queryKey: ["slots", draft.serviceId, dateISO],
    queryFn: () => getSlots(draft.serviceId!, dateISO),
    enabled: can && dateISO >= earliestISO,
  });

  function onPickDate(d: string) {
    // date disabled check (для безпеки)
    if (d < earliestISO) return;

    setDateISO(d);
    setSelected(null);
    saveDraft({ ...draft, dateISO: d, startAt: undefined, endAt: undefined });
  }

  function pickSlot(startAt: string, endAt: string) {
    setSelected({ startAt, endAt });
    saveDraft({ ...draft, dateISO, startAt, endAt });
  }

  if (!can) {
    return (
      <BookingLayout
        step={3}
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

  const tomorrowBlocked = tomorrow < earliestISO; // після 18:00 earliest = післязавтра => завтра disabled

  return (
    <BookingLayout
      step={3}
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
        <div className="text-xs font-semibold text-brand-sub">{lang === "en" ? "Date" : "Дата"}</div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {next7.map((d) => {
            const active = d === dateISO;
            const disabled = d < earliestISO;
            const label = format(parseISO(d), "EEE dd/MM");
            const showLock = disabled && isTomorrow(d);

            return (
              <button
                key={d}
                disabled={disabled}
                onClick={() => onPickDate(d)}
                className={[
                  "rounded-2xl border px-3 py-3 text-xs font-semibold transition flex items-center justify-center gap-2",
                  disabled
                    ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                    : active
                    ? "bg-brand-purple text-white border-brand-line"
                    : "bg-brand-surface text-brand-ink border-brand-line hover:bg-brand-muted",
                ].join(" ")}
              >
                <span>{label}</span>
                {showLock && <span aria-hidden="true">🔒</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-brand-sub">
          {lang === "en"
            ? "Same-day booking is not available. Booking for tomorrow is open until 18:00."
            : "Запис на сьогодні недоступний. Запис на завтра можливий до 18:00."}

          {tomorrowBlocked && (
            <div className="mt-1 text-red-600">
              {lang === "en"
                ? "It’s after 18:00 — tomorrow is no longer available."
                : "Зараз після 18:00 — запис на завтра вже недоступний."}
            </div>
          )}
        </div>
      </div>

      {/* Time slots */}
      <div className="mt-7">
        <div className="text-xs font-semibold text-brand-sub">
          {lang === "en" ? "Available times" : "Доступний час"}
        </div>

        {dateISO < earliestISO && (
          <div className="mt-3 text-sm text-brand-sub">
            {lang === "en"
              ? "This date is not available for booking."
              : "Ця дата недоступна для запису."}
          </div>
        )}

        {q.isLoading && (
          <div className="mt-3 text-sm text-brand-sub">{lang === "en" ? "Loading slots…" : "Завантаження слотів…"}</div>
        )}

        {q.error && (
          <div className="mt-3 text-sm text-red-600">
            {lang === "en" ? "Error: " : "Помилка: "}
            {(q.error as Error)?.message ?? String(q.error)}
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {(q.data ?? []).map((s) => {
            const t = new Date(s.startAt);
            const isActive = selected?.startAt === s.startAt;

            return (
              <button
                key={s.startAt}
                onClick={() => pickSlot(s.startAt, s.endAt)}
                className={[
                  "rounded-2xl border px-3 py-3 text-xs font-semibold transition",
                  isActive
                    ? "bg-brand-purple text-white border-brand-line"
                    : "border-brand-line bg-brand-surface text-brand-ink hover:bg-brand-muted",
                ].join(" ")}
              >
                {format(t, "HH:mm")}
              </button>
            );
          })}
        </div>

        {(q.data?.length ?? 0) === 0 && !q.isLoading && dateISO >= earliestISO && (
          <div className="mt-3 text-sm text-brand-sub">
            {lang === "en" ? "No available slots for this date." : "Немає доступних слотів на цю дату."}
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
            if (!selected) return;
            nav("/details");
          }}
          disabled={!selected}
          className="rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "en" ? "Continue" : "Продовжити"}
        </button>
      </div>
    </BookingLayout>
  );
}