
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { PushSubscription } from "../models.js";

// Test authorization middleware.
// Actual JWT verification is covered by auth tests.
vi.mock("../auth.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../auth.js")>();

  return {
    ...actual,
    requireAdminAuth: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (req.headers.authorization !== "Bearer test-token") {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      next();
    },
  };
});

const validSubscription = {
  endpoint: "https://example.push.apple.com/push/test-device",
  keys: {
    p256dh: "A".repeat(87),
    auth: "B".repeat(22),
  },
};

describe("Web Push API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects subscriptions without authorization", async () => {
    const { createApp } = await import("../app.js");

    const res = await request(createApp())
      .post("/api/admin/web-push/subscribe")
      .send(validSubscription);

    expect(res.status).toBe(401);
  });

  it("rejects invalid subscriptions", async () => {
    const { createApp } = await import("../app.js");

    const res = await request(createApp())
      .post("/api/admin/web-push/subscribe")
      .set("Authorization", "Bearer test-token")
      .send({
        endpoint: "not-a-url",
        keys: { p256dh: "abc", auth: "123" },
      });

    expect(res.status).toBe(400);
  });

  it("stores a valid subscription", async () => {
    const { createApp } = await import("../app.js");

    const updateSpy = vi
      .spyOn(PushSubscription, "updateOne")
      .mockResolvedValue({ acknowledged: true } as any);

    const res = await request(createApp())
      .post("/api/admin/web-push/subscribe")
      .set("Authorization", "Bearer test-token")
      .send(validSubscription);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });

    expect(updateSpy).toHaveBeenCalledWith(
      { endpoint: validSubscription.endpoint },
      {
        $set: expect.objectContaining({
          endpoint: validSubscription.endpoint,
          keys: validSubscription.keys,
          enabled: true,
        }),
      },
      { upsert: true }
    );
  });
});
