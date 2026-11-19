import { clearAdminToken } from "../lib/adminAuth.js";

const API_BASE = import.meta.env.VITE_API_URL || "";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);

  if (res.status === 401) {
    clearAdminToken();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AdminBooking = {
  id: string;
  kind: "booking" | "blocked" | "block";
  status: string;
  startAt: string; // ISO
  endAt: string;   // ISO

  clientName?: string | null;
  phone?: string | null;
  notes: string | null;

  service?: null | {
    id: string;
    title: string;
    category: string;
    durationMin: number;
    priceFrom: number | null;
    priceTo: number | null;
    description: string | null;
  };
};

export function adminLogin(email: string, password: string) {
  return http<{ token: string }>("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function adminGetBookings(
  dateISO: string,
  token: string,
  range: "day" | "week" = "day"
) {
  return http<AdminBooking[]>(
    `/api/admin/bookings?date=${encodeURIComponent(dateISO)}&range=${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function adminBlockRange(
  token: string,
  payload: { startAt: string; endAt: string; notes?: string }
) {
  return http<{ id: string }>("/api/admin/block", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}



export type AdminWebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export function adminGetWebPushPublicKey(token: string) {
  return http<{ publicKey: string }>(
    "/api/admin/web-push/public-key",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function adminWebPushSubscribe(
  token: string,
  subscription: AdminWebPushSubscription
) {
  return http<{ ok: boolean }>(
    "/api/admin/web-push/subscribe",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    }
  );
}


export function adminGetCalendar(dateISO: string, token: string) {
  return http<AdminBooking[]>(`/api/admin/calendar?date=${encodeURIComponent(dateISO)}&range=month`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminUpdateBookingStatus(token: string, id: string, status: string) {
  return http<{ id: string; status: string }>(`/api/admin/bookings/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function adminRemoveBlock(token: string, id: string) {
  return http<{ ok: boolean }>(`/api/admin/block/${encodeURIComponent(id)}`, {
    method: "DELETE", headers: { Authorization: `Bearer ${token}` },
  });
}

export type ManualBooking = { serviceId: string; startAt: string; clientName: string; phone: string; notes?: string };
type SavedAppointment = { id: string; startAt: string; endAt: string };
export function adminCreateBooking(token: string, payload: ManualBooking) {
  return http<SavedAppointment>("/api/admin/bookings", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}
export function adminRescheduleBooking(token: string, id: string, startAt: string) {
  return http<SavedAppointment>(`/api/admin/bookings/${encodeURIComponent(id)}/reschedule`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ startAt }) });
}
