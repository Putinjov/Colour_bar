import React, { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSlots } from "../lib/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { loadDraft, saveDraft } from "../lib/storage";

function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export default function DateTime() {
  const nav = useNavigate();
  const draft = loadDraft();

  const [dateISO, setDateISO] = useState<string>(draft.dateISO ?? todayISO());

  const can = Boolean(draft.serviceId);
  const q = useQuery({
    queryKey: ["slots", draft.serviceId, dateISO],
    queryFn: () => getSlots(draft.serviceId!, dateISO),
    enabled: can,
  });

  const next7 = useMemo(() => Array.from({ length: 7 }, (_, i) => format(addDays(new Date(), i), "yyyy-MM-dd")), []);

  function pickSlot(startAt: string, endAt: string) {
    saveDraft({ ...draft, dateISO, startAt, endAt });
    nav("/details");
  }

  if (!can) {
    return (
      <Card>
        <div className="text-sm font-semibold">Спочатку обери послугу</div>
        <div className="mt-3">
          <Button className="w-full" onClick={() => nav("/services")}>Перейти до послуг</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card>
        <div className="text-sm font-semibold">Дата</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {next7.map(d => (
            <button
              key={d}
              onClick={() => setDateISO(d)}
              className={[
                "rounded-xl2 px-3 py-2 text-xs font-semibold border transition",
                d === dateISO ? "bg-brand-purple text-white border-white/10" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
              ].join(" ")}
            >
              {format(new Date(d), "EEE dd/MM")}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-white/60">
          Послуга: <span className="text-white font-semibold">{draft.serviceTitle}</span>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Час</div>
        {q.isLoading && <div className="mt-3 text-sm text-white/70">Завантаження слотів…</div>}
        {q.error && <div className="mt-3 text-sm text-red-200">Помилка: {String(q.error)}</div>}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(q.data ?? []).map(s => {
            const t = new Date(s.startAt);
            return (
              <button
                key={s.startAt}
                onClick={() => pickSlot(s.startAt, s.endAt)}
                className="rounded-xl2 px-3 py-2 text-xs font-semibold border bg-white/5 text-white/90 border-white/10 hover:bg-white/10 transition"
              >
                {format(t, "HH:mm")}
              </button>
            );
          })}
        </div>

        {(q.data?.length ?? 0) === 0 && !q.isLoading && (
          <div className="mt-3 text-sm text-white/70">Немає доступних слотів на цю дату.</div>
        )}

        <div className="mt-3">
          <Button variant="ghost" className="w-full" onClick={() => nav("/services")}>Змінити послугу</Button>
        </div>
      </Card>
    </div>
  );
}
