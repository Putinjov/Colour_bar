import { DateTime } from "luxon";
export const DEFAULT_TZ = "Europe/Dublin";
export function parseUtcISO(iso) {
    const dt = DateTime.fromISO(iso, { zone: "utc" });
    return dt.isValid ? dt : null;
}
export function dayBoundsUTC(dateISO, timezone = DEFAULT_TZ) {
    const local = DateTime.fromISO(dateISO, { zone: timezone });
    if (!local.isValid)
        return null;
    return {
        start: local.startOf("day").toUTC(),
        end: local.endOf("day").toUTC(),
    };
}
