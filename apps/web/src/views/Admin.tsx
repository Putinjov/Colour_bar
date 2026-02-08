import React, { useState } from "react";
import { Card } from "../ui/Card.js";
import { Button } from "../ui/Button.js";
import { adminListBookings } from "../lib/api.js";
import { format } from "date-fns";

export default function Admin() {
  const [dateISO, setDateISO] = useState(format(new Date(), "yyyy-MM-dd"));
  const [items, setItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <Card>
        <div className="text-sm font-semibold">Адмін: записи</div>
        <div className="mt-3">
          <div className="text-xs text-white/70 mb-1">Дата (YYYY-MM-DD)</div>
          <input
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            className="w-full rounded-xl2 bg-white/5 border border-white/10 px-3 py-3 text-sm outline-none focus:border-brand-yellow"
          />
        </div>
        <div className="mt-3">
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const data = await adminListBookings(dateISO);
                setItems(data);
              } catch (e: any) {
                alert(e?.message || "Помилка адмін-запиту. Перевір VITE_ADMIN_PIN.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Завантаження…" : "Показати"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Список</div>
        <div className="mt-3 space-y-2">
          {(items ?? []).map((b) => {
            const start = new Date(b.startAt);
            const end = new Date(b.endAt);
            return (
              <div key={b.id} className="rounded-xl2 border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">
                      {b.kind === "blocked" ? "⛔ Block" : "✅ Booking"}
                    </div>
                    <div className="text-xs text-white/70">
                      {format(start, "EEE dd/MM HH:mm")} – {format(end, "HH:mm")}
                    </div>
                    {b.clientName && <div className="text-xs text-white/70 mt-1">{b.clientName} • {b.phone}</div>}
                    {b.notes && <div className="text-xs text-white/60 mt-1">{b.notes}</div>}
                  </div>
                  <div className="text-xs text-white/60">{b.status}</div>
                </div>
              </div>
            );
          })}
          {items && items.length === 0 && <div className="text-sm text-white/70">Немає записів/блоків.</div>}
          {!items && <div className="text-sm text-white/70">Натисни “Показати”.</div>}
        </div>
      </Card>
    </div>
  );
}
