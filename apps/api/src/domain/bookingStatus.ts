import type { BookingStatus } from "../models.js";

const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["cancelled", "completed", "no_show"],
  declined: [],
  cancelled: [],
  completed: [],
  no_show: [],
};

export function canTransitionBookingStatus(from: BookingStatus, to: BookingStatus) {
  return transitions[from].includes(to);
}
