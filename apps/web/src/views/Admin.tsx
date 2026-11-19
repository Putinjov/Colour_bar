import React, { useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { adminGetCalendar, adminUpdateBookingStatus, adminBlockRange, adminRemoveBlock, adminCreateBooking, adminRescheduleBooking, type ManualBooking, type AdminBooking } from "../api/admin.js";
import { getServices } from "../lib/api.js";
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
  const { lang, setLang } = useI18n();
  const l = (uk: string, en: string) => lang === "uk" ? uk : en;
  const locale = lang === "uk" ? "uk-UA" : "en-IE";
  const today = DateTime.now().setZone(SALON_ZONE).toISODate()!;
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(localDate(today).startOf("month").toISODate()!);
  const [loggedOut, setLoggedOut] = useState(false);
  const qc = useQueryClient();
  const [showBlock, setShowBlock] = useState(false);
  const [editing, setEditing] = useState<AdminBooking | 'new' | null>(null);
  const saveAppointment = useMutation({ mutationFn: (payload: ManualBooking | { id: string; startAt: string }) => 'id' in payload ? adminRescheduleBooking(token, payload.id, payload.startAt) : adminCreateBooking(token, payload), onSuccess: result => { const day = localDate(result.startAt); setSelected(day.toISODate()!); setMonth(day.startOf('month').toISODate()!); setEditing(null); return qc.invalidateQueries({ queryKey: ['adminCalendar'] }); } });
  const blockMutation = useMutation({ mutationFn: (payload: { startAt: string; endAt: string; notes?: string }) => adminBlockRange(token, payload), onSuccess: () => { setShowBlock(false); return qc.invalidateQueries({ queryKey: ["adminCalendar"] }); } });
  const removeBlock = useMutation({ mutationFn: (id: string) => adminRemoveBlock(token, id), onSuccess: () => qc.invalidateQueries({ queryKey: ["adminCalendar"] }) });
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
  if (loggedOut || calendar.error?.message === "Unauthorized" || status.error?.message === "Unauthorized" || blockMutation.error?.message === "Unauthorized" || removeBlock.error?.message === "Unauthorized" || saveAppointment.error?.message === "Unauthorized") return <Navigate to="/admin/login" replace />;
  const labels = lang === "uk" ? ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-semibold text-brand-ink">{l("Календар", "Calendar")}</h1>
      <p className="text-sm text-brand-sub">Colour Lab · {l("Кабінет майстра", "Studio manager")}</p></div>
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={() => setLang(lang === "uk" ? "en" : "uk")}>{lang === "uk" ? "EN" : "UA"}</button>
        <Link className={btn} to="/admin-catalog">{l("Послуги", "Services")}</Link>
        <button className={btn} onClick={logout}>{l("Вийти", "Logout")}</button>
      </div>
    </header>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-brand-muted p-4"><div className="text-sm text-brand-sub">{l("Активні за місяць", "Active this month")}</div><strong className="text-2xl">{items.filter(activeBooking).length}</strong></div>
      <div className="rounded-2xl border border-brand-line bg-white p-4"><div className="text-sm text-brand-sub">{l("Очікують", "Pending")}</div><strong className="text-2xl">{items.filter(x => x.status === "pending").length}</strong></div>
    </div>
    <section className="mt-4 rounded-[22px] border border-brand-line bg-white p-3 shadow-sm sm:p-5">
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
            className={"min-h-[44px] rounded-xl text-center text-sm transition flex flex-col items-center justify-center gap-1 " +
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
    <section className="mt-4">
      <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-semibold first-letter:uppercase">{localDate(selected).setLocale(locale).toFormat("cccc, d MMMM")}</h2>
      <button className={btn} onClick={() => calendar.refetch()} disabled={calendar.isFetching}>{l("Оновити","Refresh")}</button></div>
      <div className="mt-3 flex flex-wrap gap-2">
      <button className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saveAppointment.isPending} onClick={() => { saveAppointment.reset(); setShowBlock(false); setEditing(editing === "new" ? null : "new"); }}>{l("+ Новий запис","+ New appointment")}</button>
      <button className={showBlock ? "mt-3 px-2 py-2 text-sm font-medium text-brand-sub underline" : btn + " mt-3"} aria-expanded={showBlock} onClick={() => { blockMutation.reset(); setEditing(null); setShowBlock(v => !v); }}>{showBlock ? l("Закрити форму","Close form") : l("+ Заблокувати час"," + Block time")}</button>
      </div>
      {editing && <AppointmentForm key={editing === "new" ? "new"+selected : editing.id} selected={selected} item={editing === "new" ? undefined : editing} uk={lang === "uk"} busy={saveAppointment.isPending} error={saveAppointment.error?.message} onCancel={() => { setEditing(null); saveAppointment.reset(); }} onSave={payload => saveAppointment.mutate(payload)} />}
      {showBlock && <BlockForm key={selected} selected={selected} uk={lang === "uk"} busy={blockMutation.isPending} onSave={payload => blockMutation.mutate(payload)} />}
      {blockMutation.error && <p role="alert" className="mt-2 text-red-600">{blockMutation.error.message}</p>}
      {removeBlock.error && <p role="alert" className="mt-2 text-red-600">{removeBlock.error.message}</p>}
      {calendar.isLoading && <p className="mt-3 text-brand-sub">{l("Завантаження…","Loading…")}</p>}
      {calendar.error && <p role="alert" className="mt-3 text-red-600">{calendar.error.message}</p>}
      {status.error && <p role="alert" className="mt-3 text-red-600">{status.error.message}</p>}
      {!calendar.isLoading && !calendar.error && dayItems.length === 0 && <p className="mt-3 rounded-2xl border border-brand-line bg-white p-5 text-brand-sub">{l("Немає записів","No appointments")}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {dayItems.map(item => <BookingCard key={item.kind + item.id} item={item} uk={lang === "uk"} busy={status.isPending || removeBlock.isPending || saveAppointment.isPending} onMove={() => { saveAppointment.reset(); setShowBlock(false); setEditing(item); }} onRemove={() => { if (window.confirm(l("Розблокувати цей час?", "Unblock this time?"))) removeBlock.mutate(item.id); }} onChange={next => {
          if (["cancelled","declined","no_show"].includes(next) && !window.confirm(l("Змінити статус запису?", "Change appointment status?"))) return;
          status.mutate({ id: item.id, next });
        }} />)}
      </div>
    </section>
    <p className="mt-6 text-xs text-brand-sub">{l("Календар оновлюється кожні 30 секунд, поки відкритий. Email-сповіщення залишаються активними.", "Calendar refreshes every 30 seconds while open. Email notifications remain active.")}</p>
  </main>;
}

function BookingCard({ item, uk, busy, onChange, onRemove, onMove }: { item: AdminBooking; uk: boolean; busy: boolean; onChange: (status: string) => void; onRemove: () => void; onMove: () => void }) {
  const idx = uk ? 0 : 1;
  const blocked = item.kind !== "booking";
  const status = blocked ? "blocked" : item.status;
  const start = localDate(item.startAt), end = localDate(item.endAt);
  const time = start.hasSame(end, "day") ? start.toFormat("HH:mm") + " – " + end.toFormat("HH:mm") : start.toFormat("dd/LL HH:mm") + " – " + end.toFormat("dd/LL HH:mm");
  return <article className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{time}</span><span className={"rounded-full px-2 py-1 text-xs " + (status === "confirmed" ? "bg-green-100 text-green-800" : status === "pending" || blocked ? "bg-yellow-100 text-yellow-900" : "bg-gray-100 text-gray-700")}>{statuses[status]?.[idx] ?? status}</span></div>
    <h3 className="mt-2 font-semibold">{blocked ? (uk ? "Заблокований час" : "Blocked time") : item.service?.title ?? (uk ? "Послуга" : "Service")}</h3>
    {item.clientName && <p className="mt-1 text-sm">{item.clientName}</p>}
    {item.phone && <a className="text-sm text-brand-purple underline" href={"tel:" + item.phone.replace(/[^+\d]/g,"")}>{item.phone}</a>}
    {item.notes && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-brand-surface p-2 text-sm">{item.notes}</p>}
    {blocked && <button className={btn + " mt-3"} disabled={busy} onClick={onRemove}>{uk ? "Розблокувати" : "Unblock"}</button>}
    {!blocked && <div className="mt-3 flex flex-wrap gap-2">{activeBooking(item) && <button className={btn} disabled={busy} onClick={onMove}>{uk ? "Перенести" : "Reschedule"}</button>}{(actionsForStatus[status] ?? []).filter(next => !["completed","no_show"].includes(next) || end <= DateTime.now()).map(next => <button key={next} className={btn} disabled={busy} onClick={() => onChange(next)}>{actionLabels[next][idx]}</button>)}</div>}
  </article>;
}

function BlockForm({ selected, uk, busy, onSave }: { selected: string; uk: boolean; busy: boolean; onSave: (payload: {startAt:string;endAt:string;notes?:string}) => void }) {
  const l = (a:string,b:string) => uk ? a : b;
  const [from,setFrom] = useState(selected);
  const [to,setTo] = useState(selected);
  const [allDay,setAllDay] = useState(true);
  const [start,setStart] = useState("10:00");
  const [end,setEnd] = useState("18:00");
  const [notes,setNotes] = useState("");
  const [error,setError] = useState("");
  const field = "block box-border w-full max-w-full min-w-0 appearance-none rounded-xl border border-brand-line bg-white px-3 py-2 text-base min-h-[44px]";
  return <form className="mt-3 min-w-0 space-y-4 rounded-2xl border border-brand-line bg-white p-4" onSubmit={e => {
    e.preventDefault(); setError("");
    const a = localDate(from + "T" + (allDay ? "00:00" : start));
    const b = allDay ? localDate(to).plus({ days: 1 }).startOf("day") : localDate(to + "T" + end);
    if (!a.isValid || !b.isValid || b <= a) { setError(l("Перевір дати й час", "Check dates and times")); return; }
    onSave({ startAt: a.toUTC().toISO()!, endAt: b.toUTC().toISO()!, notes: notes.trim() || undefined });
  }}>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allDay} onChange={e=>setAllDay(e.target.checked)} />{l("Цілі дні","Full days")}</label>
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block min-w-0 space-y-1 text-sm"><span className="block">{l("Від","From")}</span><input className={field} type="date" required value={from} onChange={e=>{setFrom(e.target.value); if(e.target.value > to) setTo(e.target.value);}} /></label>
      <label className="block min-w-0 space-y-1 text-sm"><span className="block">{l("До","To")}</span><input className={field} type="date" required min={from} value={to} onChange={e=>setTo(e.target.value)} /></label>
      {!allDay && <><label className="block min-w-0 space-y-1 text-sm"><span className="block">{l("Початок","Start")}</span><input className={field} type="time" required value={start} onChange={e=>setStart(e.target.value)} /></label><label className="block min-w-0 space-y-1 text-sm"><span className="block">{l("Кінець","End")}</span><input className={field} type="time" required value={end} onChange={e=>setEnd(e.target.value)} /></label></>}
    </div>
    {allDay && <p className="text-xs text-brand-sub">{l("Обидві дати включно.","Both dates are inclusive.")}</p>}
    <label className="block min-w-0 text-sm">{l("Причина (необов’язково)","Reason (optional)")}<input className={field} maxLength={200} value={notes} onChange={e=>setNotes(e.target.value)} /></label>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <button className="w-full rounded-xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto" disabled={busy}>{l("Заблокувати","Block")}</button>
  </form>;
}

function AppointmentForm({selected,item,uk,busy,error,onSave,onCancel}:{selected:string;item?:AdminBooking;uk:boolean;busy:boolean;error?:string;onSave:(payload:ManualBooking|{id:string;startAt:string})=>void;onCancel:()=>void}) {
 const l=(a:string,b:string)=>uk?a:b;
 const today=DateTime.now().setZone(SALON_ZONE).toISODate()!;
 const [date,setDate]=useState(item?localDate(item.startAt).toISODate()!:selected<today?today:selected);
 const [time,setTime]=useState(item?localDate(item.startAt).toFormat("HH:mm"):"10:00");
 const [serviceId,setServiceId]=useState("");
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [notes,setNotes]=useState("");
 const [localError,setLocalError]=useState("");
 const services=useQuery({queryKey:["services"],queryFn:getServices,enabled:!item});
 const service=services.data?.find(s=>s.id===serviceId);
 const duration=item?localDate(item.endAt).diff(localDate(item.startAt),"minutes").minutes:service?.durationMin;
 const start=localDate(date+"T"+time);
 const end=duration&&start.isValid?start.plus({minutes:duration}):null;
 const field="block box-border w-full max-w-full min-w-0 appearance-none rounded-xl border border-brand-line bg-white px-3 py-2 text-base min-h-[44px]";
 const errors:Record<string,string>={SLOT_BUSY:l("Цей час зайнятий або заблокований.","This time overlaps an appointment or block."),INVALID_START:l("Оберіть майбутній час.","Choose a future time."),INVALID_STATUS_TRANSITION:l("Статус запису змінився. Оновіть календар.","Appointment changed. Refresh the calendar."),INVALID_INPUT:l("Перевірте введені дані.","Check the entered details."),BOOKING_LOCK_TIMEOUT:l("Сервіс зайнятий. Спробуйте ще раз.","Service busy. Try again.")};
 return <form className="mt-3 min-w-0 space-y-3 rounded-2xl border border-brand-line bg-white p-4" onSubmit={e=>{
  e.preventDefault();setLocalError("");
  if(!start.isValid||start.toMillis()<=Date.now()||start.toFormat("yyyy-MM-dd HH:mm")!==date+" "+time){setLocalError(l("Оберіть коректний майбутній час.","Choose a valid future time."));return;}
  if(item){onSave({id:item.id,startAt:start.toUTC().toISO()!});return;}
  if(!service||name.trim().length<2||phone.trim().length<6){setLocalError(errors.INVALID_INPUT);return;}
  onSave({serviceId,startAt:start.toUTC().toISO()!,clientName:name.trim(),phone:phone.trim(),notes:notes.trim()||undefined});
 }}>
 <h3 className="font-semibold">{item?l("Перенести запис","Reschedule appointment"):l("Новий запис","New appointment")}</h3>
 {item?<p className="text-sm">{item.clientName} · {item.service?.title}</p>:<>
 <label className="block min-w-0 space-y-1 text-sm">{l("Послуга","Service")}<select required className={field} value={serviceId} onChange={e=>setServiceId(e.target.value)}><option value="">{l("Оберіть послугу","Choose service")}</option>{services.data?.map(s=><option key={s.id} value={s.id}>{s.title} · {s.durationMin} min</option>)}</select></label>
 {services.error&&<button type="button" className="text-sm underline" onClick={()=>services.refetch()}>{l("Повторити завантаження","Retry loading services")}</button>}
 <label className="block min-w-0 space-y-1 text-sm">{l("Ім’я клієнта","Client name")}<input className={field} required minLength={2} maxLength={60} value={name} onChange={e=>setName(e.target.value)}/></label>
 <label className="block min-w-0 space-y-1 text-sm">{l("Телефон","Phone")}<input className={field} required type="tel" minLength={6} maxLength={30} value={phone} onChange={e=>setPhone(e.target.value)}/></label>
 <label className="block min-w-0 space-y-1 text-sm">{l("Коментар","Notes")}<textarea className={field} maxLength={300} value={notes} onChange={e=>setNotes(e.target.value)}/></label></>}
 <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
 <label className="block min-w-0 space-y-1 text-sm">{l("Дата","Date")}<input type="date" required min={today} className={field} value={date} onChange={e=>setDate(e.target.value)}/></label>
 <label className="block min-w-0 space-y-1 text-sm">{l("Час","Time")}<input type="time" required className={field} value={time} onChange={e=>setTime(e.target.value)}/></label>
 </div>
 {end&&<p className="text-sm text-brand-sub">{l("Закінчення","Ends")}: {end.toFormat("dd/LL HH:mm")} · {duration} min</p>}
 <p className="text-xs text-brand-sub">{l("Можна записати поза стандартним графіком. Перетини з іншими записами та блокуваннями заборонені.","Custom hours are allowed. Overlapping appointments and blocks are not.")}</p>
 {(localError||error)&&<p role="alert" className="text-sm text-red-700">{localError||errors[error!]||error}</p>}
 <div className="flex flex-wrap gap-2"><button disabled={busy} className="rounded-xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{l("Зберегти","Save")}</button><button type="button" disabled={busy} className={btn} onClick={onCancel}>{l("Скасувати","Cancel")}</button></div>
 </form>;
}
