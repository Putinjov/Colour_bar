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
  kind: "booking" | "blocked";
  status: string;
  startAt: string; // ISO
  endAt: string;   // ISO

  clientName: string | null;
  phone: string | null;
  notes: string | null;

  service: null | {
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

export function adminGetBookings(dateISO: string, token: string) {
  return http<AdminBooking[]>(
    `/api/admin/bookings?date=${encodeURIComponent(dateISO)}`,
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
