import request from "supertest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createApp } from "../app.js";
import * as bookingService from "../services/booking.service.js";
import * as availabilityService from "../services/availability.service.js";

describe("api integration (handlers)", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("creates booking and isolates notification path", async () => {
    const app = createApp();
    vi.spyOn(bookingService, "createBooking").mockResolvedValue({
      created: { _id: "b1", toObject: () => ({}) } as any,
      service: { title: "Cut" } as any,
      start: { toISO: () => "2026-01-01T10:00:00.000Z" } as any,
      end: { toISO: () => "2026-01-01T11:00:00.000Z" } as any,
    });

    const res = await request(app).post("/api/bookings").send({
      serviceId: "507f191e810c19729de860ea",
      startAt: "2026-01-01T10:00:00.000Z",
      clientName: "Test User",
      phone: "+353123",
    });

    expect(res.status).toBe(200);
    expect(res.body.booking.id).toBe("b1");
  });

  it("returns slots payload", async () => {
    const app = createApp();
    vi.spyOn(availabilityService, "getAvailableSlots").mockResolvedValue([{ startAt: "a", endAt: "b" }]);
    // service lookup gate
    const models = await import("../models.js");
    vi.spyOn(models.Service, "findById").mockReturnValue({ lean: async () => ({ durationMin: 30 }) } as any);
    const res = await request(app).get("/api/slots?serviceId=507f191e810c19729de860ea&date=2026-04-07");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
