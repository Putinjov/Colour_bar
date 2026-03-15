import { describe, expect, it } from "vitest";
import { hasOverlap } from "../domain/overlap.js";
import { canTransitionBookingStatus } from "../domain/bookingStatus.js";
import { dayBoundsUTC } from "../utils/time.js";
import { generateSlotsForDay } from "../slots.js";
describe("overlap", () => {
    it("detects collision", () => {
        expect(hasOverlap({ startAt: new Date("2026-01-01T10:00:00Z"), endAt: new Date("2026-01-01T11:00:00Z") }, [{ startAt: new Date("2026-01-01T10:30:00Z"), endAt: new Date("2026-01-01T11:30:00Z") }])).toBe(true);
    });
});
describe("booking transitions", () => {
    it("allows confirmed -> completed and blocks completed -> confirmed", () => {
        expect(canTransitionBookingStatus("confirmed", "completed")).toBe(true);
        expect(canTransitionBookingStatus("completed", "confirmed")).toBe(false);
    });
});
describe("timezone utils", () => {
    it("provides valid UTC bounds", () => {
        const bounds = dayBoundsUTC("2026-03-29", "Europe/Dublin"); // DST boundary
        expect(bounds?.start.toISO()).toMatch(/Z$/);
        expect(bounds?.end.toISO()).toMatch(/Z$/);
    });
    it("generates slots", () => {
        const { slots, isWorkDay } = generateSlotsForDay({
            timezone: "Europe/Dublin",
            dateISO: "2026-04-07",
            durationMin: 60,
            stepMin: 30,
            openHour: 10,
            openMinute: 0,
            closeHour: 12,
            closeMinute: 0,
            workWeekdays: [2],
        });
        expect(isWorkDay).toBe(true);
        expect(slots.length).toBe(3);
    });
});
