import { AvailabilityBlock } from "../models.js";
import { parseUtcISO } from "../utils/time.js";
import { hasBusyConflict } from "./availability.service.js";
export async function createAvailabilityBlock(input) {
    const start = parseUtcISO(input.startAt);
    const end = parseUtcISO(input.endAt);
    if (!start || !end || end <= start)
        throw new Error("INVALID_RANGE");
    if (await hasBusyConflict(start, end))
        throw new Error("RANGE_BUSY");
    const created = await AvailabilityBlock.create({
        startAt: start.toJSDate(),
        endAt: end.toJSDate(),
        notes: input.notes,
        active: true,
    });
    return created;
}
