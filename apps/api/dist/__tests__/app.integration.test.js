import request from "supertest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as bookingService from "../services/booking.service.js";
import * as availabilityService from "../services/availability.service.js";
describe("api integration (handlers)", () => {
    beforeEach(() => vi.restoreAllMocks());
    it("creates booking and isolates notification path", async () => {
        const { createApp } = await import("../app.js");
        const app = createApp();
        vi.spyOn(bookingService, "createBooking").mockResolvedValue({
            created: { _id: "b1", toObject: () => ({}) },
            service: { title: "Cut" },
            start: { toISO: () => "2026-01-01T10:00:00.000Z" },
            end: { toISO: () => "2026-01-01T11:00:00.000Z" },
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
        const { createApp } = await import("../app.js");
        const app = createApp();
        vi.spyOn(availabilityService, "getAvailableSlots").mockResolvedValue([
            { startAt: "a", endAt: "b", startAtLocal: "a", endAtLocal: "b" },
        ]);
        const models = await import("../models.js");
        vi.spyOn(models.Service, "findById").mockReturnValue({ lean: async () => ({ durationMin: 30 }) });
        const res = await request(app).get("/api/slots?serviceId=507f191e810c19729de860ea&date=2026-04-07");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
