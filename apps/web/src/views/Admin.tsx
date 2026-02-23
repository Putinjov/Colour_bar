import React, { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import {
  adminGetBookings,
  adminLogin,
  adminPushSubscribe,
  type AdminBooking,
} from "../api/admin.js";
import { clearAdminToken, getAdminToken, setAdminToken } from "../lib/adminAuth.js";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

function fmtTime(iso: string) {
  return DateTime.fromISO(iso, { zone: "utc" }).toLocal().toFormat("HH:mm");
}

function fmtDayTitle(dateISO: string) {
  return DateTime.fromISO(dateISO).toFormat("cccc, dd LLL");
}

export default function Admin() {
  const nav = useNavigate();
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [pushStatus, setPushStatus] = useState<string>("");
  const [pushBusy, setPushBusy] = useState(false);
  const [pushClientId, setPushClientId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dateISO, setDateISO] = useState(() =>
    DateTime.local().toFormat("yyyy-LL-dd")
  );

  const bookingsQ = useQuery({
    queryKey: ["adminBookings", dateISO, token, "week"],
    queryFn: () => adminGetBookings(dateISO, token!, "week"),
    enabled: Boolean(token),
    retry: false,
  });

  const weekLabel = useMemo(() => {
    const selected = DateTime.fromISO(dateISO);
    const weekStart = selected.startOf("week");
    const weekEnd = selected.endOf("week");
    return `${weekStart.toFormat("dd LLL")} – ${weekEnd.toFormat("dd LLL yyyy")}`;
  }, [dateISO]);

  const groupedByDay = useMemo(() => {
    const items = bookingsQ.data || [];
    const sorted = [...items].sort((a, b) => a.startAt.localeCompare(b.startAt));

    const groups = new Map<string, AdminBooking[]>();
    sorted.forEach((booking) => {
      const dayKey = DateTime.fromISO(booking.startAt, { zone: "utc" })
        .toLocal()
        .toFormat("yyyy-LL-dd");

      if (!groups.has(dayKey)) groups.set(dayKey, []);
      groups.get(dayKey)!.push(booking);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dayISO, dayBookings]) => ({ dayISO, dayBookings }));
  }, [bookingsQ.data]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const { token } = await adminLogin(email.trim(), password);
    setAdminToken(token);
    setToken(token);
  }

  function logout() {
    clearAdminToken();
    setToken(null);
  }

  function getOrCreatePushClientId() {
    const key = "colourbar.admin.pushClientId";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const fresh = `admin-${crypto.randomUUID()}`;
    localStorage.setItem(key, fresh);
    return fresh;
  }

  async function enableNotifications() {
    if (!token) return;

    setPushBusy(true);
    setPushStatus("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("Доступ до сповіщень не надано.");
        return;
      }

      const clientId = getOrCreatePushClientId();

      await adminPushSubscribe(token, {
        clientId,
        userAgent: navigator.userAgent,
      });

      setPushClientId(clientId);
      setPushStatus("Сповіщення увімкнено. Нові записи будуть приходити автоматично.");
    } catch (err: any) {
      setPushStatus(err?.message || "Не вдалося увімкнути сповіщення.");
    } finally {
      setPushBusy(false);
    }
  }

  useEffect(() => {
    if (!token || !pushClientId) return;

    const streamUrl = `${API_BASE}/api/admin/push/stream?token=${encodeURIComponent(token)}&clientId=${encodeURIComponent(pushClientId)}`;
    const source = new EventSource(streamUrl);

    source.addEventListener("booking", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data || "{}");
        setPushStatus(data?.body || "Новий запис у базі даних");
        if (Notification.permission === "granted") {
          new Notification(data?.title || "Новий запис", {
            body: data?.body || "Зʼявився новий запис",
          });
        }
        bookingsQ.refetch();
      } catch {
        setPushStatus("Новий запис у базі даних");
        bookingsQ.refetch();
      }
    });

    source.onerror = () => {
      setPushStatus("Канал сповіщень перепідключається...");
    };

    return () => {
      source.close();
    };
  }, [token, pushClientId, bookingsQ.refetch]);

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-[22px] border border-brand-line bg-white shadow-soft p-6">
          <div className="text-2xl font-semibold text-brand-ink">
            Admin
          </div>
          <div className="mt-1 text-sm text-brand-sub">
            Sign in to manage bookings.
          </div>

          <form onSubmit={doLogin} className="mt-6 space-y-3">
            <input
              className="w-full rounded-xl border border-brand-line bg-brand-surface px-4 py-3 text-sm outline-none focus:border-brand-purple/60"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <input
              className="w-full rounded-xl border border-brand-line bg-brand-surface px-4 py-3 text-sm outline-none focus:border-brand-purple/60"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {bookingsQ.error && (
              <div className="text-sm text-red-600">
                {String((bookingsQ.error as any)?.message || "Login failed")}
              </div>
            )}

            <button className="w-full rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
              Sign in
            </button>
          </form>

          <div className="mt-4 text-xs text-brand-sub">
            Tip: credentials are stored in API ENV (no user registration).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-brand-ink">Bookings</div>
          <div className="mt-1 text-sm text-brand-sub">
            Тиждень: {weekLabel}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm">
            <span className="text-brand-sub mr-2">Date</span>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="bg-transparent outline-none"
            />
          </div>

          <button
            onClick={() => bookingsQ.refetch()}
            className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-sm font-semibold hover:bg-brand-muted transition"
          >
            Refresh
          </button>

          <button
            onClick={enableNotifications}
            disabled={pushBusy}
            className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-sm font-semibold hover:bg-brand-muted transition disabled:opacity-60"
          >
            {pushBusy ? "Підключення..." : "Увімкнути сповіщення"}
          </button>

          <button
            onClick={() => nav("/admin-catalog")}
            className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-sm font-semibold hover:bg-brand-muted transition"
          >
            До каталогу
          </button>

          <button
            onClick={logout}
            className="rounded-full bg-brand-ink text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {pushStatus ? (
        <div className="mt-4 rounded-xl border border-brand-line bg-white p-3 text-sm text-brand-sub">
          {pushStatus}
        </div>
      ) : null}

      <div className="mt-8">
        {bookingsQ.isLoading && (
          <div className="text-brand-sub">Loading…</div>
        )}

        {bookingsQ.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {String((bookingsQ.error as any)?.message || bookingsQ.error)}
            <div className="mt-2 text-sm text-red-700/80">
              If this is “Unauthorized”, your token expired — logout and sign in again.
            </div>
          </div>
        )}

        {!bookingsQ.isLoading && !bookingsQ.error && groupedByDay.length === 0 && (
          <div className="rounded-2xl border border-brand-line bg-white p-6 text-brand-sub">
            Немає записів на цей тиждень.
          </div>
        )}

        <div className="space-y-8">
          {groupedByDay.map(({ dayISO, dayBookings }) => (
            <section key={dayISO}>
              <h2 className="mb-4 text-lg font-semibold text-brand-ink">
                {fmtDayTitle(dayISO)}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {dayBookings.map((b) => (
                  <BookingCard key={b.id} b={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ b }: { b: AdminBooking }) {
  const serviceTitle =
    b.kind === "blocked"
      ? "Blocked"
      : b.service?.title || "Unknown service";

  const meta =
    b.kind === "blocked"
      ? "Time blocked"
      : `${b.service?.category || "—"} • ${b.service?.durationMin ?? "—"} min`;

  const price =
    b.kind === "blocked"
      ? null
      : b.service
      ? `€${b.service.priceFrom ?? "—"}${typeof b.service.priceTo === "number" ? `–€${b.service.priceTo}` : ""}`
      : null;

  return (
    <div className="rounded-[22px] border border-brand-line bg-white shadow-soft p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-brand-sub">
            {fmtTime(b.startAt)} – {fmtTime(b.endAt)}
          </div>
          <div className="mt-1 text-lg font-semibold text-brand-ink">
            {serviceTitle}
          </div>
          <div className="mt-1 text-sm text-brand-sub">{meta}</div>
        </div>

        <div className="text-right">
          {price && (
            <div className="text-sm font-semibold text-brand-yellow">
              {price}
            </div>
          )}
          <div className="mt-1 text-[11px] text-brand-sub">
            {b.status}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="text-brand-sub">Client</div>
          <div className="font-semibold text-brand-ink">
            {b.clientName || "—"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-brand-sub">Phone</div>
          <div className="font-semibold text-brand-ink">
            {b.phone || "—"}
          </div>
        </div>

        {b.notes && (
          <div className="mt-2 rounded-xl border border-brand-line bg-brand-surface p-3 text-sm text-brand-ink/80">
            {b.notes}
          </div>
        )}
      </div>
    </div>
  );
}
