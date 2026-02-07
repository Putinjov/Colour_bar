export type BookingDraft = {
  serviceId?: string;
  serviceTitle?: string;
  durationMin?: number;
  dateISO?: string; // YYYY-MM-DD
  startAt?: string; // ISO UTC
  endAt?: string;   // ISO UTC
  clientName?: string;
  phone?: string;
  notes?: string;
};

const KEY = "colourbar.bookingDraft.v1";

export function loadDraft(): BookingDraft {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function saveDraft(d: BookingDraft) { sessionStorage.setItem(KEY, JSON.stringify(d)); }
export function clearDraft() { sessionStorage.removeItem(KEY); }
