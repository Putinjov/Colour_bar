import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { requireAdminAuth } from "../auth.js";

describe("admin auth middleware", () => {
  it("returns 401 when token is missing", async () => {
    const app = express();
    app.get("/x", requireAdminAuth, (_req, res) => res.json({ ok: true }));
    const res = await request(app).get("/x");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("UNAUTHORIZED");
  });
});

 describe("catalog write protection", () => {
  it("rejects anonymous catalog updates and resets", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();
    expect((await request(app).put("/api/catalog").send({ blocks: [] })).status).toBe(401);
    expect((await request(app).post("/api/catalog/reset")).status).toBe(401);
    expect((await request(app).put("/api/catalog").set("x-admin-pin", "1234").send({ blocks: [] })).status).toBe(401);
  });
});
