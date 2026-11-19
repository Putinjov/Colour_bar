import { DateTime } from "luxon";
import { AvailabilityBlock, Booking } from "../models.js";
import { generateSlotsForDay } from "../slots.js";
import { dayBoundsUTC } from "../utils/time.js";

const BLOCKING_STATUSES = ["pending", "confirmed"];

type BusyRange = { startAt: Date; endAt: Date };

function mergeBusyRanges(ranges: BusyRange[]) {
  const sorted = ranges
    .map((r) => ({ startAt: new Date(r.startAt), endAt: new Date(r.endAt) }))
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

  const merged: BusyRange[] = [];
  for (const current of sorted) {
    const last = merged[merged.length - 1];
    if (!last || current.startAt >= last.endAt) {
      merged.push(current);
      continue;
    }
    if (current.endAt > last.endAt) last.endAt = current.endAt;
  }

  return merged;
}

export async function getBusyRanges(dateISO: string, timezone: string) {
  const bounds = dayBoundsUTC(dateISO, timezone);
  if (!bounds) return [];

  const [bookings, blocks] = await Promise.all([
    Booking.find({
      status: { $in: BLOCKING_STATUSES },
      startAt: { $lte: bounds.end.toJSDate() },
      endAt: { $gte: bounds.start.toJSDate() },
    })
      .select({ startAt: 1, endAt: 1 })
      .lean(),
    AvailabilityBlock.find({
      active: true,
      startAt: { $lte: bounds.end.toJSDate() },
      endAt: { $gte: bounds.start.toJSDate() },
    })
      .select({ startAt: 1, endAt: 1 })
      .lean(),
  ]);

  return mergeBusyRanges([...bookings, ...blocks]);
}

export async function getAvailableSlots(input: {
  serviceDurationMin: number;
  dateISO: string;
  timezone: string;
}) {
  const { serviceDurationMin, dateISO, timezone } = input;

  const { slots, isWorkDay } = generateSlotsForDay({
    timezone,
    dateISO,
    durationMin: serviceDurationMin,
    stepMin: 30,
    openHour: 10,
    openMinute: 0,
    closeHour: 18,
    closeMinute: 0,
    workWeekdays: [2, 3, 4, 5, 6],
  });

  if (!isWorkDay) return [];
  const busy = await getBusyRanges(dateISO, timezone);

  return slots
    .filter(({ start, end }) => {
      const startUTC = start.toUTC().toJSDate();
      const endUTC = end.toUTC().toJSDate();
      return !busy.some((b) => b.startAt < endUTC && b.endAt > startUTC);
    })
    .map(({ start, end }) => ({
      startAt: start.toUTC().toISO(),
      endAt: end.toUTC().toISO(),
      startAtLocal: start.setZone(timezone).toISO(),
      endAtLocal: end.setZone(timezone).toISO(),
    }));
}

export async function hasBusyConflict(startAt: DateTime, endAt: DateTime, excludeBookingId?: string) {
  const [booking, block] = await Promise.all([
    Booking.findOne({
      ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
      status: { $in: BLOCKING_STATUSES },
      startAt: { $lt: endAt.toJSDate() },
      endAt: { $gt: startAt.toJSDate() },
    }).lean(),
    AvailabilityBlock.findOne({
      active: true,
      startAt: { $lt: endAt.toJSDate() },
      endAt: { $gt: startAt.toJSDate() },
    }).lean(),
  ]);
  return Boolean(booking || block);
}

export { mergeBusyRanges };
