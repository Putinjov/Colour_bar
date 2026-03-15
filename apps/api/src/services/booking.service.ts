import { DateTime } from "luxon";
import { Booking, type BookingStatus, Service } from "../models.js";
import { canTransitionBookingStatus } from "../domain/bookingStatus.js";
import { hasBusyConflict } from "./availability.service.js";
import { parseUtcISO } from "../utils/time.js";

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

  if (await hasBusyConflict(start, end)) throw new Error("SLOT_BUSY");

  const created = await Booking.create({
    serviceId: input.serviceId,
    startAt: start.toJSDate(),
    endAt: end.toJSDate(),
    clientName: input.clientName,
    phone: input.phone,
    notes: input.notes,
    status: "confirmed",
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
