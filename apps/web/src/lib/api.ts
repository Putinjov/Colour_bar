export type Service = {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  priceFrom?: number;
  priceTo?: number;
  description?: string;
};

export type Slot = { startAt: string; endAt: string };

export type BookingCreate = {
  serviceId: string;
  startAt: string;
  clientName: string;
  phone: string;
  notes?: string;
};

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "";

async function okJson(r: Response) {
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getServices(): Promise<Service[]> {
  const r = await fetch(`${API}/api/services`);
  return okJson(r);
}

export async function getSlots(serviceId: string, dateISO: string): Promise<Slot[]> {
  const r = await fetch(`${API}/api/slots?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(dateISO)}`);
  return okJson(r);
}

export async function createBooking(payload: BookingCreate) {
  const r = await fetch(`${API}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return okJson(r);
}

export async function adminListBookings(dateISO: string) {
  const r = await fetch(`${API}/api/admin/bookings?date=${encodeURIComponent(dateISO)}`, {
    headers: { "x-admin-pin": ADMIN_PIN },
  });
  return okJson(r);
}
