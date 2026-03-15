import { describe, expect, it, vi, beforeEach } from "vitest";
import { createBooking } from "../services/booking.service.js";
import { Booking, BookingCreationLock, Service } from "../models.js";
import * as availabilityService from "../services/availability.service.js";
describe("booking race protection", () => {
    beforeEach(() => vi.restoreAllMocks());
    it("serializes concurrent createBooking calls through lock", async () => {
        vi.spyOn(Service, "findById").mockReturnValue({ lean: async () => ({ durationMin: 60, title: "Cut" }) });
        vi.spyOn(availabilityService, "hasBusyConflict")
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);
        const lockSpy = vi.spyOn(BookingCreationLock, "findOneAndUpdate").mockReturnValue({ lean: async () => ({ _id: "booking-create-global-lock" }) });
        vi.spyOn(BookingCreationLock, "updateOne").mockResolvedValue({});
        const createSpy = vi.spyOn(Booking, "create").mockResolvedValue({ _id: "b1" });
        const payload = {
            serviceId: "507f191e810c19729de860ea",
            startAt: "2026-01-01T10:00:00.000Z",
            clientName: "Jane",
            phone: "+353000",
        };
        const [first, second] = await Promise.allSettled([createBooking(payload), createBooking(payload)]);
        expect(first.status).toBe("fulfilled");
        expect(second.status).toBe("rejected");
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(lockSpy).toHaveBeenCalled();
    });
});
