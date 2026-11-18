import React,{useEffect,useState} from "react";
import {Navigate,useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getSlots,type Slot} from "../lib/api.js";
import {loadDraft,saveDraft} from "../lib/storage.js";
import {useI18n} from "../i18n.js";
import BookingLayout from "../ui/BookingLayout.js";
import {bookingWindow,salonDate} from "../features/booking/bookingDates.js";
export default function DateTime(){
 const nav=useNavigate(),{lang}=useI18n();const l=(uk:string,en:string)=>lang==="uk"?uk:en,locale=lang==="uk"?"uk-UA":"en-IE";
 const [draft]=useState(loadDraft);const [window,setWindow]=useState(()=>bookingWindow());
 const [date,setDate]=useState(()=>draft.dateISO&&window.days.includes(draft.dateISO)&&draft.dateISO>=window.earliest?draft.dateISO:window.earliest);
 const [selected,setSelected]=useState<Slot|null>(()=>draft.dateISO===date&&draft.startAt&&draft.endAt?{startAt:draft.startAt,endAt:draft.endAt}:null);
 useEffect(()=>{const timer=globalThis.setInterval(()=>setWindow(bookingWindow()),15000);return()=>globalThis.clearInterval(timer)},[]);
 function pickDate(d:string){setDate(d);setSelected(null);saveDraft({...loadDraft(),dateISO:d,startAt:undefined,endAt:undefined,confirmed:false})}
 useEffect(()=>{if(date<window.earliest||!window.days.includes(date))pickDate(window.earliest)},[window.earliest,window.days[0],date]);
 const q=useQuery({queryKey:["slots",draft.serviceId,date],queryFn:()=>getSlots(draft.serviceId!,date),enabled:!!draft.serviceId&&date>=window.earliest&&window.days.includes(date),refetchInterval:30000});
 const valid=!!selected&&!!q.data?.some(s=>s.startAt===selected.startAt&&s.endAt===selected.endAt)&&date>=window.earliest&&!q.isError&&!q.isFetching;
 if(!draft.serviceId)return <Navigate to="/services" replace/>;
 return <BookingLayout step={3} title={l("Оберіть дату й час","Choose a time")} subtitle={l("Час вказано за Ірландією.","All times are in Ireland time.")}>
 <div className="rounded-2xl bg-[#eee4f0] p-4"><p className="font-medium">{draft.serviceTitle}</p><p className="mt-1 text-sm text-[#765487]">{draft.durationMin} {l("хв","min")}{typeof draft.priceFrom==="number"?` · ${l("від","from")} €${draft.priceFrom}`:""}</p></div>
 <h2 className="mt-6 text-sm font-semibold capitalize">{salonDate(date).setLocale(locale).toFormat("LLLL yyyy")}</h2>
 <div className="mt-3 grid grid-cols-7 gap-1">{window.days.map(d=>{const day=salonDate(d).setLocale(locale),disabled=d<window.earliest||[1,7].includes(day.weekday);return <button key={d} disabled={disabled} aria-pressed={date===d} onClick={()=>pickDate(d)} className={"flex min-h-[60px] min-w-0 flex-col items-center justify-center rounded-xl border text-xs "+(disabled?"border-transparent bg-[#f1eeeb] text-[#a09aa1]":date===d?"border-[#765487] bg-[#765487] text-white":"border-brand-line bg-white")}><span>{day.toFormat("ccc")}</span><strong className="mt-1 text-base">{day.day}</strong></button>})}</div>
 <p className="mt-3 text-xs leading-5 text-brand-sub">{l("Запис на завтра відкритий до 18:00. Сьогодні запис недоступний.","Next-day bookings close at 18:00. Same-day bookings are unavailable.")}</p>
 <h2 className="mt-6 text-sm font-semibold">{l("Доступний час","Available times")}</h2>
 {q.isLoading&&<p className="mt-3 text-sm text-brand-sub">{l("Завантаження…","Loading…")}</p>}
 {q.error&&<button className="mt-3 text-sm underline" onClick={()=>q.refetch()}>{l("Не вдалося завантажити. Повторити","Unable to load. Retry")}</button>}
 {!q.isLoading&&!q.error&&!q.data?.length&&<p className="mt-3 rounded-xl bg-white p-4 text-sm text-brand-sub">{l("Немає вільного часу. Оберіть інший день.","No available times. Choose another day.")}</p>}
 <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">{q.data?.map(s=><button key={s.startAt} aria-pressed={selected?.startAt===s.startAt} className={"min-h-[44px] rounded-xl border text-sm font-medium "+(selected?.startAt===s.startAt?"border-[#765487] bg-[#765487] text-white":"border-brand-line bg-white")} onClick={()=>{setSelected(s);saveDraft({...loadDraft(),dateISO:date,...s,confirmed:false})}}>{salonDate(s.startAt).toFormat("HH:mm")}</button>)}</div>
 <button disabled={!valid} className="mt-7 w-full rounded-full bg-[#262129] px-6 py-4 text-sm font-semibold text-white disabled:opacity-40" onClick={()=>{if(valid)nav("/details")}}>{l("Продовжити","Continue")} →</button>
 </BookingLayout>
}
