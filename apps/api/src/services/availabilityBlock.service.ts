import { AvailabilityBlock } from "../models.js";
import { parseUtcISO } from "../utils/time.js";
import { withBookingCreationLock } from "./booking.service.js";
import { hasBusyConflict } from "./availability.service.js";

export async function createAvailabilityBlock(input: { startAt: string; endAt: string; notes?: string }) {
  const start = parseUtcISO(input.startAt);
  const end = parseUtcISO(input.endAt);
  if (!start || !end || end <= start) throw new Error("INVALID_RANGE");

  return withBookingCreationLock(async () => {
  if (await hasBusyConflict(start, end)) throw new Error("RANGE_BUSY");

  const created = await AvailabilityBlock.create({
    startAt: start.toJSDate(),
    endAt: end.toJSDate(),
    notes: input.notes,
    active: true,
  });

  return created;
  });
}
