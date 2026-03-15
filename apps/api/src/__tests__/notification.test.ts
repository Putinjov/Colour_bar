import { describe, it, expect, vi } from "vitest";
import { notifyBookingCreated } from "../services/notification.service.js";
import * as emailModule from "../services/sendBookingEmail.js";
import { NotificationLog } from "../models.js";

describe("notification isolation", () => {
  it("logs failure and does not throw when email fails", async () => {
    vi.spyOn(emailModule, "sendBookingEmail").mockRejectedValueOnce(new Error("smtp down"));
    const createSpy = vi.spyOn(NotificationLog, "create").mockResolvedValue({} as any);

    await expect(notifyBookingCreated({ bookingId: "1", payload: {} })).resolves.toBeUndefined();
    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ status: "failed" }));
  });
});
