import React, { useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { adminGetCalendar, adminUpdateBookingStatus, type AdminBooking } from "../api/admin.js";
import { clearAdminToken, getAdminToken } from "../lib/adminAuth.js";
import { useI18n } from "../i18n.js";
import { actionsForStatus, activeBooking, itemsOnDay, localDate, monthDays, SALON_ZONE } from "../features/admin/calendar.js";

const statuses: Record<string, [string, string]> = {
  pending: ["Очікує", "Pending"], confirmed: ["Підтверджено", "Confirmed"],
  declined: ["Відхилено", "Declined"], cancelled: ["Скасовано", "Cancelled"],
  completed: ["Виконано", "Completed"], no_show: ["Не з’явився", "No-show"], blocked: ["Заблоковано", "Blocked"],
};
const actionLabels: Record<string, [string, string]> = {
  confirmed: ["Підтвердити", "Confirm"], declined: ["Відхилити", "Decline"], cancelled: ["Скасувати", "Cancel"],
  completed: ["Завершити", "Complete"], no_show: ["Не з’явився", "No-show"],
};
const btn = "rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-muted disabled:opacity-50";

export default function Admin() {
  const token = getAdminToken();
  return token ? <Calendar token={token} /> : <Navigate to="/admin/login" replace />;
}

function Calendar({ token }: { token: string }) {
  const { lang } = useI18n();
  const l = (uk: string, en: string) => lang === "uk" ? uk : en;
  const locale = lang === "uk" ? "uk-UA" : "en-IE";
  const today = DateTime.now().setZone(SALON_ZONE).toISODate()!;
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(localDate(today).startOf("month").toISODate()!);
  const [loggedOut, setLoggedOut] = useState(false);
  const qc = useQueryClient();
  const calendar = useQuery({
    queryKey: ["adminCalendar", month, token],
    queryFn: () => adminGetCalendar(month, token),
    retry: false,
    refetchInterval: 30000,
  });
  const status = useMutation({
    mutationFn: ({ id, next }: { id: string; next: string }) => adminUpdateBookingStatus(token, id, next),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminCalendar"] }),
  });
  const items = calendar.data ?? [];
  const dayItems = itemsOnDay(items, selected);
  const days = monthDays(month);
  const monthDate = localDate(month);
  function shift(delta: number) {
    const next = monthDate.plus({ months: delta }).startOf("month").toISODate()!;
    setMonth(next); setSelected(next);
  }
  function goToday() { setMonth(localDate(today).startOf("month").toISODate()!); setSelected(today); }
  function logout() {
    clearAdminToken();
    qc.removeQueries({ queryKey: ["adminCalendar"] });
    setLoggedOut(true);
  }
  if (loggedOut || calendar.error?.message === "Unauthorized" || status.error?.message === "Unauthorized") return <Navigate to="/admin/login" replace />;
  const labels = lang === "uk" ? ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-semibold text-brand-ink">{l("Календар", "Calendar")}</h1>
      <p className="text-sm text-brand-sub">Colour Lab · {l("Кабінет майстра", "Studio manager")}</p></div>
      <div className="flex flex-wrap gap-2">
        <Link className={btn} to="/admin-catalog">{l("Послуги", "Services")}</Link>
        <button className={btn} onClick={logout}>{l("Вийти", "Logout")}</button>
      </div>
    </header>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-brand-muted p-4"><div className="text-sm text-brand-sub">{l("Активні за місяць", "Active this month")}</div><strong className="text-2xl">{items.filter(activeBooking).length}</strong></div>
      <div className="rounded-2xl border border-brand-line bg-white p-4"><div className="text-sm text-brand-sub">{l("Очікують", "Pending")}</div><strong className="text-2xl">{items.filter(x => x.status === "pending").length}</strong></div>
    </div>
    <section className="mt-4 rounded-[22px] border border-brand-line bg-white p-3 shadow-soft sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <button className={btn} onClick={() => shift(-1)} aria-label={l("Попередній місяць","Previous month")}>‹</button>
        <h2 className="text-lg font-semibold capitalize">{monthDate.setLocale(locale).toFormat("LLLL yyyy")}</h2>
        <button className={btn} onClick={() => shift(1)} aria-label={l("Наступний місяць","Next month")}>›</button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-brand-sub">{labels.map(label => <div key={label}>{label}</div>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map(day => {
          const date = day.toISODate()!;
          const inMonth = day.month === monthDate.month;
          const dayEvents = inMonth ? itemsOnDay(items, date) : [];
          const count = dayEvents.filter(activeBooking).length;
          const blocked = dayEvents.some(x => x.kind !== "booking");
          return <button key={date} disabled={!inMonth} aria-label={date + ": " + count} aria-pressed={selected === date}
            onClick={() => setSelected(date)}
            className={"min-h-[54px] rounded-xl text-center text-sm transition flex flex-col items-center justify-center gap-1 " +
              (!inMonth ? "opacity-25" : selected === date ? "bg-brand-ink text-white" : date === today ? "border border-brand-purple bg-brand-surface" : "hover:bg-brand-muted")}>
            <span>{day.day}</span><span className="flex min-h-[14px] items-center gap-1">{count > 0 && <span className="rounded-full bg-brand-purple px-1.5 text-[10px] text-white">{count}</span>}{blocked && <span className="h-2 w-2 rounded-full bg-brand-yellow" />}</span>
          </button>;
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-sub">
        <span>{l("Фіолетовий — записи · жовтий — блокування", "Purple — bookings · yellow — blocked")}</span>
        <button className={btn} onClick={goToday}>{l("Сьогодні","Today")}</button>
      </div>
    </section>
    <section className="mt-6">
      <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-semibold capitalize">{localDate(selected).setLocale(locale).toFormat("cccc, dd LLLL")}</h2>
      <button className={btn} onClick={() => calendar.refetch()} disabled={calendar.isFetching}>{l("Оновити","Refresh")}</button></div>
      {calendar.isLoading && <p className="mt-3 text-brand-sub">{l("Завантаження…","Loading…")}</p>}
      {calendar.error && <p role="alert" className="mt-3 text-red-600">{calendar.error.message}</p>}
      {status.error && <p role="alert" className="mt-3 text-red-600">{status.error.message}</p>}
      {!calendar.isLoading && !calendar.error && dayItems.length === 0 && <p className="mt-3 rounded-2xl border border-brand-line bg-white p-5 text-brand-sub">{l("Немає записів","No appointments")}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {dayItems.map(item => <BookingCard key={item.kind + item.id} item={item} uk={lang === "uk"} busy={status.isPending} onChange={next => {
          if (["cancelled","declined","no_show"].includes(next) && !window.confirm(l("Змінити статус запису?", "Change appointment status?"))) return;
          status.mutate({ id: item.id, next });
        }} />)}
      </div>
    </section>
    <p className="mt-6 text-xs text-brand-sub">{l("Календар оновлюється кожні 30 секунд, поки відкритий. Email-сповіщення залишаються активними.", "Calendar refreshes every 30 seconds while open. Email notifications remain active.")}</p>
  </main>;
}

function BookingCard({ item, uk, busy, onChange }: { item: AdminBooking; uk: boolean; busy: boolean; onChange: (status: string) => void }) {
  const idx = uk ? 0 : 1;
  const blocked = item.kind !== "booking";
  const status = blocked ? "blocked" : item.status;
  const start = localDate(item.startAt), end = localDate(item.endAt);
  const time = start.hasSame(end, "day") ? start.toFormat("HH:mm") + " – " + end.toFormat("HH:mm") : start.toFormat("dd/LL HH:mm") + " – " + end.toFormat("dd/LL HH:mm");
  return <article className="rounded-2xl border border-brand-line bg-white p-4 shadow-soft">
    <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{time}</span><span className={"rounded-full px-2 py-1 text-xs " + (status === "confirmed" ? "bg-green-100 text-green-800" : status === "pending" || blocked ? "bg-yellow-100 text-yellow-900" : "bg-gray-100 text-gray-700")}>{statuses[status]?.[idx] ?? status}</span></div>
    <h3 className="mt-2 font-semibold">{blocked ? (uk ? "Заблокований час" : "Blocked time") : item.service?.title ?? (uk ? "Послуга" : "Service")}</h3>
    {item.clientName && <p className="mt-1 text-sm">{item.clientName}</p>}
    {item.phone && <a className="text-sm text-brand-purple underline" href={"tel:" + item.phone.replace(/[^+\d]/g,"")}>{item.phone}</a>}
    {item.notes && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-brand-surface p-2 text-sm">{item.notes}</p>}
    {!blocked && <div className="mt-3 flex flex-wrap gap-2">{(actionsForStatus[status] ?? []).map(next => <button key={next} className={btn} disabled={busy} onClick={() => onChange(next)}>{actionLabels[next][idx]}</button>)}</div>}
  </article>;
}
