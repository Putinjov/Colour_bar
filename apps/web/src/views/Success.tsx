import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card.js";
import { Button } from "../ui/Button.js";
import { loadDraft, clearDraft } from "../lib/storage.js";
import { format } from "date-fns";
import { useI18n } from "../i18n.js";

export default function Success() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const d = loadDraft();
  const when = d.startAt ? new Date(d.startAt) : null;

  const t = {
    title: lang === "en" ? "Booking Confirmed ✅" : "Запис створено ✅",
    subtitle: lang === "en" ? "Thank you! Your slot has been reserved." : "Дякуємо! Ваш слот заброньовано.",
    serviceFallback: lang === "en" ? "Service" : "Послуга",
    client: lang === "en" ? "Client" : "Клієнт",
    toHome: lang === "en" ? "Back to Home" : "На головну",
    newBooking: lang === "en" ? "New Booking" : "Новий запис",
  };

  return (
    <Card>
      <div className="text-lg font-bold">{t.title}</div>
      <p className="mt-2 text-sm text-white/70">{t.subtitle}</p>

      <div className="mt-4 rounded-xl2 border border-white/10 bg-white/5 p-3 text-sm">
        <div className="font-semibold">{d.serviceTitle ?? t.serviceFallback}</div>
        {when && <div className="text-white/70">{format(when, "EEE dd/MM • HH:mm")}</div>}
        {d.clientName && <div className="text-white/70 mt-1">{t.client}: {d.clientName}</div>}
      </div>

      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={() => { clearDraft(); nav("/"); }}>{t.toHome}</Button>
        <Button variant="ghost" className="w-full" onClick={() => nav("/services")}>{t.newBooking}</Button>
      </div>
    </Card>
  );
}
