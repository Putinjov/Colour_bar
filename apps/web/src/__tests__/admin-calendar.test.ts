import { describe, expect, it } from "vitest";
import { monthDays, itemsOnDay, actionsForStatus } from "../features/admin/calendar.js";
import type { AdminBooking } from "../api/admin.js";
describe("admin calendar", () => {
  it("aligns calendar weeks Monday to Sunday", () => {
    const days = monthDays("2026-11-01");
    expect(days[0].toISODate()).toBe("2026-10-26");
    expect(days.at(-1)?.toISODate()).toBe("2026-12-06");
  });
  it("uses Dublin local date and excludes blocks ending at midnight", () => {
    const event: AdminBooking = { id:"1", kind:"block", status:"blocked", startAt:"2026-07-01T22:00:00Z", endAt:"2026-07-01T23:00:00Z", notes:null };
    expect(itemsOnDay([event], "2026-07-01")).toHaveLength(1);
    expect(itemsOnDay([event], "2026-07-02")).toHaveLength(0);
  });
  it("does not offer invalid terminal status transitions", () => {
    expect(actionsForStatus.confirmed).not.toContain("declined");
    expect(actionsForStatus.completed).toBeUndefined();
  });
});
