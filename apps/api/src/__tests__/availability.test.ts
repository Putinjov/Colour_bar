import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateSlotsForDay } from "../slots.js";
import { mergeBusyRanges, getAvailableSlots } from "../services/availability.service.js";
import { AvailabilityBlock, Booking } from "../models.js";

describe("availability engine", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("merges overlapping busy ranges from bookings and blocks", () => {
    const merged = mergeBusyRanges([
      { startAt: new Date("2026-02-02T10:00:00.000Z"), endAt: new Date("2026-02-02T11:00:00.000Z") },
      { startAt: new Date("2026-02-02T10:30:00.000Z"), endAt: new Date("2026-02-02T11:30:00.000Z") },
      { startAt: new Date("2026-02-02T12:00:00.000Z"), endAt: new Date("2026-02-02T12:30:00.000Z") },
    ]);

    expect(merged).toHaveLength(2);
    expect(merged[0].startAt.toISOString()).toBe("2026-02-02T10:00:00.000Z");
    expect(merged[0].endAt.toISOString()).toBe("2026-02-02T11:30:00.000Z");
  });

  it("returns only free slots when busy ranges exist", async () => {
    vi.spyOn(Booking, "find").mockReturnValue({ select: () => ({ lean: async () => [{ startAt: new Date("2026-04-07T10:00:00.000Z"), endAt: new Date("2026-04-07T10:30:00.000Z") }] }) } as any);
    vi.spyOn(AvailabilityBlock, "find").mockReturnValue({ select: () => ({ lean: async () => [] }) } as any);

    const slots = await getAvailableSlots({ serviceDurationMin: 30, dateISO: "2026-04-07", timezone: "UTC" });
    expect(slots.some((s) => s.startAt === "2026-04-07T10:00:00.000Z")).toBe(false);
    expect(slots.some((s) => s.startAt === "2026-04-07T10:30:00.000Z")).toBe(true);
  });

  it("handles DST transition day in Europe/Dublin", () => {
    const result = generateSlotsForDay({
      timezone: "Europe/Dublin",
      dateISO: "2026-03-29",
      durationMin: 60,
      stepMin: 30,
      openHour: 10,
      openMinute: 0,
      closeHour: 18,
      closeMinute: 0,
      workWeekdays: [1, 2, 3, 4, 5, 6, 7],
    });

    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots[0].start.zoneName).toBe("Europe/Dublin");
  });
});
