import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import BookingLayout from "../ui/BookingLayout.js";
import {getServices,type Service} from "../lib/api.js";
import {getCatalog} from "../api/catalog.js";
import {loadDraft,saveDraft} from "../lib/storage.js";
import {useI18n} from "../i18n.js";
const cats=[{key:"Фарбування",en:"Colour"},{key:"Стрижки",en:"Cuts"},{key:"Відновлення",en:"Care"}] as const;
export default function Services(){
 const nav=useNavigate(),loc=useLocation();const {lang}=useI18n();const l=(uk:string,en:string)=>lang==="uk"?uk:en;
 const q=useQuery({queryKey:["services"],queryFn:getServices});
 const catalog=useQuery({queryKey:["catalog",lang],queryFn:getCatalog});
 const [cat,setCat]=useState<string>(()=>new URLSearchParams(loc.search).get("category")||cats[0].key);
 const items=q.data??[];
 function choose(s:Service,replace=false){
  const d=loadDraft();const changed=d.serviceId!==s.id;
  const translated=catalog.data?.blocks.flatMap(b=>b.items).find(i=>i.serviceId===s.id)?.title[lang];
  saveDraft({...d,serviceId:s.id,serviceTitle:translated||s.title,durationMin:s.durationMin,priceFrom:s.priceFrom,priceTo:s.priceTo,confirmed:false,...(changed?{dateISO:undefined,startAt:undefined,endAt:undefined}:{})});
  nav("/datetime",{replace});
 }
 useEffect(()=>{
  const id=new URLSearchParams(loc.search).get("serviceId")||(loc.state as {serviceId?:string}|null)?.serviceId;
  const s=items.find(x=>x.id===id);
  if(s)choose(s,true);
 },[q.data,loc.search,loc.state]);
 return <BookingLayout step={2} title={l("Оберіть послугу","Choose a service")} subtitle={l("Виберіть процедуру, щоб переглянути доступний час.","Select a treatment to see available appointments.")}>
 <div className="grid grid-cols-3 gap-2">{cats.map(c=><button key={c.key} aria-pressed={cat===c.key} onClick={()=>setCat(c.key)} className={"min-h-[44px] rounded-full px-2 text-sm font-medium "+(cat===c.key?"bg-[#765487] text-white":"bg-[#eee7ef] text-[#493b50]")}>{lang==="uk"?c.key:c.en}</button>)}</div>
 {q.isLoading&&<p className="mt-5 text-sm text-brand-sub">{l("Завантаження…","Loading…")}</p>}
 {q.error&&<button className="mt-5 text-sm underline" onClick={()=>q.refetch()}>{l("Не вдалося завантажити. Повторити","Unable to load. Retry")}</button>}
 {!q.isLoading&&!q.error&&!items.some(s=>s.category===cat)&&<p className="mt-5 text-sm text-brand-sub">{l("Немає послуг у цій категорії.","No services in this category.")}</p>}
 <div className="mt-4 space-y-2">{items.filter(s=>s.category===cat).map(s=>{
 const item=catalog.data?.blocks.flatMap(b=>b.items).find(i=>i.serviceId===s.id);
 return <button key={s.id} onClick={()=>choose(s)} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-brand-line bg-white p-4 text-left hover:border-[#765487]">
 <span className="min-w-0"><span className="block font-medium">{item?.title[lang]||s.title}</span><span className="mt-1 block text-xs text-brand-sub">{s.durationMin} {l("хв","min")}</span></span>
 <span className="shrink-0 text-sm font-semibold text-[#765487]">{typeof s.priceFrom==="number"? (s.priceTo&&s.priceTo!==s.priceFrom?`€${s.priceFrom}–${s.priceTo}`:`€${s.priceFrom}`):"—"} <span aria-hidden="true">›</span></span></button>})}</div>
 </BookingLayout>
}
