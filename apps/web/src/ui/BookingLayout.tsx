import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n.js";
export default function BookingLayout({step,title,subtitle,children}:React.PropsWithChildren<{step:1|2|3|4;title:string;subtitle?:string}>) {
 const {lang}=useI18n(); const l=(uk:string,en:string)=>lang==="uk"?uk:en;
 const labels=[l("Послуга","Service"),l("Дата й час","Date & time"),l("Ваші дані","Details")];
 const n=Math.max(1,step-1);
 const back=step===4?"/datetime":step===3?"/services":"/";
 return <main className="mx-auto w-full max-w-xl pb-8">
  <Link to={back} className="inline-flex min-h-[44px] items-center text-sm font-medium text-[#765487]">← {l("Назад","Back")}</Link>
  <div className="mt-3 flex items-center justify-between text-xs font-medium text-[#765487]"><span>{l("Крок","Step")} {n} {l("з","of")} 3</span><span>{labels[n-1]}</span></div>
  <div className="mt-2 grid grid-cols-3 gap-2" aria-hidden="true">{labels.map((x,i)=><div key={x} className={"h-1 rounded-full "+(i<n?"bg-[#765487]":"bg-[#e7dfe8]")}/>)}</div>
  <h1 className="mt-6 font-serif text-4xl font-normal leading-tight tracking-tight text-[#252128]">{title}</h1>
  {subtitle&&<p className="mt-2 text-sm leading-6 text-brand-sub">{subtitle}</p>}
  <div className="mt-6 min-w-0">{children}</div>
  <p className="mt-8 border-t border-brand-line pt-4 text-xs leading-6 text-brand-sub">{l("Colour Lab · 3 Henry St, Tullamore · Потрібна допомога?","Colour Lab · 3 Henry St, Tullamore · Need help?")} <a className="underline" href="tel:+353857842329">+353 85 784 2329</a></p>
 </main>;
}
