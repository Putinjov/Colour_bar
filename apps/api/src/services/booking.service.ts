import { DateTime } from "luxon";
import { Booking, BookingCreationLock, type BookingStatus, Service } from "../models.js";
import { canTransitionBookingStatus } from "../domain/bookingStatus.js";
import { hasBusyConflict } from "./availability.service.js";
import { parseUtcISO } from "../utils/time.js";

async function acquireBookingCreationLock() {
  const now = new Date();
  const lockUntil = new Date(now.getTime() + 5_000);

  const lock = await BookingCreationLock.findOneAndUpdate(
    {
      _id: "booking-create-global-lock",
      $or: [{ lockedUntil: { $lt: now } }, { lockedUntil: { $exists: false } }],
    },
    {
      $set: { lockedUntil: lockUntil },
    },
    { upsert: true, new: true }
  ).lean();

  return Boolean(lock);
}

export async function withBookingCreationLock<T>(fn: () => Promise<T>) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const locked = await acquireBookingCreationLock().catch((error: any) => { if (error?.code === 11000) return false; throw error; });
    if (!locked) {
      await new Promise((resolve) => setTimeout(resolve, 25));
      continue;
    }

    try {
      return await fn();
    } finally {
      await BookingCreationLock.updateOne(
        { _id: "booking-create-global-lock" },
        { $set: { lockedUntil: new Date(0) } }
      );
    }
  }

  throw new Error("BOOKING_LOCK_TIMEOUT");
}

export async function createBooking(input: {
  serviceId: string;
  startAt: string;
  clientName: string;
  phone: string;
  notes?: string;
}) {
  const svc = await Service.findById(input.serviceId).lean();
  if (!svc) throw new Error("SERVICE_NOT_FOUND");

  const start = parseUtcISO(input.startAt);
  if (!start) throw new Error("INVALID_START");
  const end = start.plus({ minutes: svc.durationMin });

  const created = await withBookingCreationLock(async () => {
    if (await hasBusyConflict(start, end)) throw new Error("SLOT_BUSY");

    return Booking.create({
      serviceId: input.serviceId,
      startAt: start.toJSDate(),
      endAt: end.toJSDate(),
      clientName: input.clientName,
      phone: input.phone,
      notes: input.notes,
      status: "confirmed",
    });
  });

  return { created, service: svc, start, end };
}

export async function updateBookingStatus(bookingId: string, toStatus: BookingStatus) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("BOOKING_NOT_FOUND");
  if (!canTransitionBookingStatus(booking.status as BookingStatus, toStatus)) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }
  booking.status = toStatus;
  await booking.save();
  return booking;
}

export async function rescheduleBooking(bookingId: string, startAt: string) {
  const start = parseUtcISO(startAt);
  if (!start || start.toMillis() <= Date.now()) throw new Error("INVALID_START");
  return withBookingCreationLock(async () => {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) throw new Error("BOOKING_NOT_FOUND");
    if (!["pending", "confirmed"].includes(booking.status ?? "")) throw new Error("INVALID_STATUS_TRANSITION");
    const duration = booking.endAt.getTime() - booking.startAt.getTime();
    if (duration <= 0) throw new Error("INVALID_START");
    const end = start.plus({ milliseconds: duration });
    if (await hasBusyConflict(start, end, bookingId)) throw new Error("SLOT_BUSY");
    const updated = await Booking.findOneAndUpdate(
      { _id: bookingId, status: booking.status, startAt: booking.startAt, endAt: booking.endAt },
      { $set: { startAt: start.toJSDate(), endAt: end.toJSDate() } },
      { new: true }
    );
    if (!updated) throw new Error("INVALID_STATUS_TRANSITION");
    return updated;
  });
}
