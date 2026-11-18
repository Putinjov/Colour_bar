import React,{useState} from "react";
import {Navigate,useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import BookingLayout from "../ui/BookingLayout.js";
import {loadDraft,saveDraft} from "../lib/storage.js";
import {createBooking,getSlots} from "../lib/api.js";
import {useI18n} from "../i18n.js";
import {bookingWindow,salonDate} from "../features/booking/bookingDates.js";
type FormVals={clientName:string;phone:string;notes:string};
export default function Details(){
 const nav=useNavigate(),{lang}=useI18n();const l=(uk:string,en:string)=>lang==="uk"?uk:en;
 const [draft]=useState(loadDraft);const [error,setError]=useState("");
 const {register,handleSubmit,formState:{isSubmitting,errors}}=useForm<FormVals>({defaultValues:{clientName:draft.clientName??"",phone:draft.phone??"",notes:draft.notes??""}});
 if(draft.confirmed)return <Navigate to="/success" replace/>;
 if(!draft.serviceId||!draft.dateISO||!draft.startAt||!draft.endAt)return <Navigate to="/datetime" replace/>;
 const field="block w-full min-w-0 rounded-xl border border-brand-line bg-white px-4 py-3 text-base";
 const when=salonDate(draft.startAt).setLocale(lang==="uk"?"uk-UA":"en-IE");
 return <BookingLayout step={4} title={l("Ваші дані","Your details")} subtitle={l("Залишилося підтвердити запис.","Just one step to confirm your appointment.")}>
 <div className="rounded-2xl bg-[#eee4f0] p-4"><p className="font-semibold">{draft.serviceTitle}</p><p className="mt-1 text-sm text-[#765487]">{when.toFormat("d MMMM · HH:mm")} – {salonDate(draft.endAt).toFormat("HH:mm")}</p>{typeof draft.priceFrom==="number"&&<p className="mt-1 text-sm text-brand-sub">{l("від","from")} €{draft.priceFrom}</p>}</div>
 <form className="mt-6 space-y-4" onSubmit={handleSubmit(async vals=>{
 setError("");const clientName=vals.clientName.trim(),phone=vals.phone.trim(),notes=vals.notes.trim();
 if(clientName.length<2||phone.length<6){setError(l("Перевірте ім’я та телефон.","Check your name and phone."));return;}
 saveDraft({...draft,clientName,phone,notes,confirmed:false});
 try{
 const w=bookingWindow();const slots=draft.dateISO!>=w.earliest&&w.days.includes(draft.dateISO!)?await getSlots(draft.serviceId!,draft.dateISO!):[];
 if(!slots.some(s=>s.startAt===draft.startAt&&s.endAt===draft.endAt)){setError(l("Цей час більше недоступний. Поверніться й оберіть інший.","This time is no longer available. Go back and select another."));return;}
 await createBooking({serviceId:draft.serviceId!,startAt:draft.startAt!,clientName,phone,notes:notes||undefined});
 saveDraft({...draft,clientName:undefined,phone:undefined,notes:undefined,confirmed:true});
 nav("/success",{replace:true});
 }catch{setError(l("Не вдалося підтвердити запис. Перевірте доступність часу або зв’яжіться з майстром перед повторною спробою.","Unable to confirm. Check availability or contact the studio before trying again."))}
 })}>
 <label className="block text-sm font-medium">{l("Ваше ім’я","Your name")}<input className={field+" mt-1"} autoComplete="name" required {...register("clientName",{required:true,minLength:2,maxLength:60})}/></label>
 {errors.clientName&&<p className="text-xs text-red-700">{l("Вкажіть ім’я (2–60 символів).","Enter a name (2–60 characters).")}</p>}
 <label className="block text-sm font-medium">{l("Номер телефону","Phone number")}<input className={field+" mt-1"} type="tel" autoComplete="tel" required placeholder="+353…" {...register("phone",{required:true,minLength:6,maxLength:30})}/></label>
 {errors.phone&&<p className="text-xs text-red-700">{l("Перевірте номер телефону.","Check the phone number.")}</p>}
 <label className="block text-sm font-medium">{l("Коментар (необов’язково)","Notes (optional)")}<textarea className={field+" mt-1"} rows={3} maxLength={300} {...register("notes",{maxLength:300})}/></label>
 <p className="text-xs leading-5 text-brand-sub">{l("Якщо потрібно змінити або скасувати запис, повідомте нас щонайменше за 24 години.","If you need to change or cancel, please contact us at least 24 hours in advance.")}</p>
 {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
 <button disabled={isSubmitting} className="w-full rounded-full bg-[#262129] px-6 py-4 text-sm font-semibold text-white disabled:opacity-40">{isSubmitting?l("Підтверджуємо…","Confirming…"):l("Підтвердити запис","Confirm booking")}</button>
 </form></BookingLayout>
}
