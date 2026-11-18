import React from "react";
import {Navigate,useNavigate} from "react-router-dom";
import {loadDraft,clearDraft} from "../lib/storage.js";
import {useI18n} from "../i18n.js";
import {salonDate} from "../features/booking/bookingDates.js";
export default function Success(){
 const nav=useNavigate(),{lang}=useI18n();const l=(uk:string,en:string)=>lang==="uk"?uk:en;const d=loadDraft();
 if(!d.confirmed||!d.startAt)return <Navigate to="/services" replace/>;
 return <main className="mx-auto max-w-md py-10 text-center">
 <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eee4f0] text-4xl text-[#765487]" aria-hidden="true">✓</div>
 <h1 className="mt-6 font-serif text-4xl">{l("Ви записані.","You’re booked.")}</h1><p className="mt-3 text-sm text-brand-sub">{l("До зустрічі в Colour Lab!","We look forward to seeing you.")}</p>
 <div className="mt-7 rounded-2xl border border-brand-line bg-white p-6"><p className="font-semibold">{d.serviceTitle}</p><p className="mt-2 text-[#765487]">{salonDate(d.startAt).setLocale(lang==="uk"?"uk-UA":"en-IE").toFormat("d MMMM yyyy · HH:mm")}</p><p className="mt-3 text-sm text-brand-sub">3 Henry St, Tullamore, R35 VN34</p><a className="mt-2 inline-block text-sm underline" href="tel:+353857842329">+353 85 784 2329</a></div>
 <button className="mt-6 w-full rounded-full bg-[#262129] px-6 py-4 text-sm font-semibold text-white" onClick={()=>{clearDraft();nav("/",{replace:true})}}>{l("На головну","Back to home")}</button>
 <button className="mt-3 min-h-[44px] text-sm text-[#765487] underline" onClick={()=>{clearDraft();nav("/services",{replace:true})}}>{l("Новий запис","Book another appointment")}</button>
 </main>
}
