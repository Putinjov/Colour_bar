import { DateTime } from "luxon";
import type { AdminBooking } from "../../api/admin.js";

export const SALON_ZONE = "Europe/Dublin";
export const localDate = (iso: string) => DateTime.fromISO(iso, { zone: SALON_ZONE });
export const activeBooking = (item: AdminBooking) => item.kind === "booking" && ["pending", "confirmed"].includes(item.status);
export function monthDays(monthISO: string) {
  const first = localDate(monthISO).startOf("month");
  const start = first.startOf("week");
  const end = first.endOf("month").endOf("week");
  const dates: DateTime[] = [];
  for (let day = start; day <= end; day = day.plus({ days: 1 })) dates.push(day);
  return dates;
}
export function itemsOnDay(items: AdminBooking[], dayISO: string) {
  const start = localDate(dayISO).startOf("day");
  const end = start.plus({ days: 1 });
  return items.filter(item => localDate(item.startAt) < end && localDate(item.endAt) > start)
    .sort((a, b) => localDate(a.startAt).toMillis() - localDate(b.startAt).toMillis());
}
export const actionsForStatus: Record<string, string[]> = {
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["completed", "no_show", "cancelled"],
};
