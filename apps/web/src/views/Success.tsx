import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { loadDraft, clearDraft } from "../lib/storage";
import { format } from "date-fns";

export default function Success() {
  const nav = useNavigate();
  const d = loadDraft();
  const when = d.startAt ? new Date(d.startAt) : null;

  return (
    <Card>
      <div className="text-lg font-bold">Запис створено ✅</div>
      <p className="mt-2 text-sm text-white/70">
        Дякуємо! Ваш слот заброньовано.
      </p>

      <div className="mt-4 rounded-xl2 border border-white/10 bg-white/5 p-3 text-sm">
        <div className="font-semibold">{d.serviceTitle ?? "Послуга"}</div>
        {when && <div className="text-white/70">{format(when, "EEE dd/MM • HH:mm")}</div>}
        {d.clientName && <div className="text-white/70 mt-1">Клієнт: {d.clientName}</div>}
      </div>

      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={() => { clearDraft(); nav("/"); }}>На головну</Button>
        <Button variant="ghost" className="w-full" onClick={() => nav("/services")}>Новий запис</Button>
      </div>
    </Card>
  );
}
