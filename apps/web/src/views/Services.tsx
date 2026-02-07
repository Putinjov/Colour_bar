import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices, Service } from "../lib/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { useNavigate } from "react-router-dom";
import { loadDraft, saveDraft } from "../lib/storage";

const cats = ["Стрижки", "Фарбування", "Відновлення"] as const;

export default function Services() {
  const nav = useNavigate();
  const { data, isLoading, error } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const [cat, setCat] = useState<(typeof cats)[number]>("Стрижки");
  const draft = loadDraft();

  const items = useMemo(() => (data ?? []).filter(s => s.category === cat), [data, cat]);

  function pick(s: Service) {
    saveDraft({ ...draft, serviceId: s.id, serviceTitle: s.title, durationMin: s.durationMin });
    nav("/datetime");
  }

  return (
    <div className="space-y-3">
      <Card>
        <div className="text-sm font-semibold">Послуги</div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {cats.map(c => <Chip key={c} active={c===cat} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
      </Card>

      <Card>
        {isLoading && <div className="text-sm text-white/70">Завантаження…</div>}
        {error && <div className="text-sm text-red-200">Помилка: {String(error)}</div>}

        <div className="space-y-3">
          {items.map(s => (
            <button
              key={s.id}
              onClick={() => pick(s)}
              className="w-full text-left rounded-xl2 border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-white/60">{s.durationMin} хв</div>
                  {s.description && <div className="mt-1 text-xs text-white/60">{s.description}</div>}
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">ціна</div>
                  <div className="text-sm font-semibold text-brand-yellow">
                    {typeof s.priceFrom === "number" ? `€${s.priceFrom}` : "—"}
                    {typeof s.priceTo === "number" ? `–€${s.priceTo}` : ""}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {items.length === 0 && !isLoading && (
            <div className="text-sm text-white/70">Немає послуг у цій категорії.</div>
          )}
        </div>

        <div className="mt-3">
          <Button variant="ghost" className="w-full" onClick={() => nav("/")}>На головну</Button>
        </div>
      </Card>
    </div>
  );
}
