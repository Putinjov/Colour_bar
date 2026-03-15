import { describe, it, expect, vi, beforeEach } from "vitest";
import { enqueueBookingCreatedNotification, processNotificationLogEntry, runNotificationWorkerOnce, } from "../services/notification.service.js";
import * as emailModule from "../services/sendBookingEmail.js";
import { NotificationLog } from "../models.js";
describe("notification queue", () => {
    beforeEach(() => vi.restoreAllMocks());
    it("enqueues booking notification", async () => {
        const createSpy = vi.spyOn(NotificationLog, "create").mockResolvedValue({});
        await enqueueBookingCreatedNotification({ bookingId: "1", payload: { foo: "bar" } });
        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ status: "pending", event: "booking.created" }));
    });
    it("retries failed notification deliveries", async () => {
        vi.spyOn(emailModule, "sendBookingEmail").mockRejectedValueOnce(new Error("smtp down"));
        const updateSpy = vi.spyOn(NotificationLog, "updateOne").mockResolvedValue({});
        await processNotificationLogEntry({ _id: "x", payload: {}, attempts: 0, maxAttempts: 3 });
        expect(updateSpy).toHaveBeenCalledWith({ _id: "x" }, expect.objectContaining({ $set: expect.objectContaining({ status: "pending" }) }));
    });
    it("processes due queue entries", async () => {
        vi.spyOn(NotificationLog, "find").mockReturnValue({ sort: () => ({ limit: () => ({ lean: async () => [{ _id: "x", payload: {} }] }) }) });
        vi.spyOn(emailModule, "sendBookingEmail").mockResolvedValue(undefined);
        vi.spyOn(NotificationLog, "updateOne").mockResolvedValue({});
        await expect(runNotificationWorkerOnce(5)).resolves.toBe(1);
    });
});
