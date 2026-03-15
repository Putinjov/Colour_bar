import express from "express";
import cors from "cors";
import { DateTime } from "luxon";
import catalogRouter from "./routes/catalog.js";
import adminAuthRouter from "./routes/adminAuth.js";
import { bookingCreateSchema, adminBlockSchema } from "./validators.js";
import { Booking, PushSubscription, Service } from "./models.js";
import { requireAdminAuth, verifyAdminToken } from "./auth.js";
import { createBooking, updateBookingStatus } from "./services/booking.service.js";
import { createAvailabilityBlock } from "./services/availabilityBlock.service.js";
import { getAvailableSlots } from "./services/availability.service.js";
import { notifyBookingCreated } from "./services/notification.service.js";

const TIMEZONE = process.env.TIMEZONE ?? "Europe/Dublin";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.use("/api/catalog", catalogRouter);
  app.use("/api/admin", adminAuthRouter);

  const liveClients = new Map<string, Set<express.Response>>();
  const publishAdminPush = (payload: { title: string; body: string; at: string }) => {
    const msg = `event: booking\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const listeners of liveClients.values()) for (const res of listeners) res.write(msg);
  };

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/api/services", async (_req, res) => {
    const items = await Service.find().sort({ category: 1, title: 1 }).lean();
    res.json(items.map((s) => ({ ...s, id: String(s._id) })));
  });

  app.get("/api/slots", async (req, res) => {
    const serviceId = String(req.query.serviceId ?? "");
    const date = String(req.query.date ?? "");
    if (!serviceId || !date) return res.status(400).json({ error: "serviceId and date are required" });

    const svc = await Service.findById(serviceId).lean();
    if (!svc) return res.status(404).json({ error: "Service not found" });

    const slots = await getAvailableSlots({ serviceDurationMin: svc.durationMin, dateISO: date, timezone: TIMEZONE });
    return res.json(slots);
  });

  app.post("/api/bookings", async (req, res) => {
    const parsed = bookingCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    try {
      const result = await createBooking(parsed.data);
      void notifyBookingCreated({
        bookingId: String(result.created._id),
        payload: {
          ...result.created.toObject(),
          serviceTitle: result.service.title,
          startAtISO: result.start.toISO(),
          endAtISO: result.end.toISO(),
        },
      });

      publishAdminPush({
        title: "Новий запис",
        body: `${result.service.title} • ${result.start.toISO()}${parsed.data.clientName ? ` • ${parsed.data.clientName}` : ""}`,
        at: new Date().toISOString(),
      });

      return res.json({
        ok: true,
        booking: {
          id: String(result.created._id),
          serviceId: parsed.data.serviceId,
          startAt: result.start.toISO(),
          endAt: result.end.toISO(),
          clientName: parsed.data.clientName,
          phone: parsed.data.phone,
          notes: parsed.data.notes,
          status: "confirmed",
        },
      });
    } catch (error: any) {
      if (error.message === "SERVICE_NOT_FOUND") return res.status(404).json({ error: "Service not found" });
      if (error.message === "INVALID_START") return res.status(400).json({ error: "Invalid startAt" });
      if (error.message === "SLOT_BUSY") return res.status(409).json({ error: "Цей час уже зайнятий" });
      throw error;
    }
  });

  app.post("/api/admin/push/subscribe", requireAdminAuth, async (req, res) => {
    const clientId = String(req.body?.clientId ?? "").trim();
    if (!clientId) return res.status(400).json({ error: "Invalid push subscription payload" });
    await PushSubscription.updateOne({ clientId }, { $set: { clientId, enabled: true, userAgent: req.body?.userAgent, lastSeenAt: new Date() } }, { upsert: true });
    res.status(201).json({ ok: true });
  });

  app.get("/api/admin/push/stream", async (req, res) => {
    try {
      verifyAdminToken(String(req.query.token ?? ""));
    } catch {
      return res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
    }
    const clientId = String(req.query.clientId ?? "").trim();
    if (!clientId) return res.status(400).json({ error: "clientId is required" });

    const sub = await PushSubscription.findOne({ clientId, enabled: true }).lean();
    if (!sub) return res.status(403).json({ error: "Forbidden", code: "FORBIDDEN" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let listeners = liveClients.get(clientId);
    if (!listeners) {
      listeners = new Set();
      liveClients.set(clientId, listeners);
    }
    listeners.add(res);

    const keepAlive = setInterval(() => res.write(`event: ping\ndata: ${Date.now()}\n\n`), 25000);
    req.on("close", () => {
      clearInterval(keepAlive);
      listeners?.delete(res);
    });
  });

  app.get("/api/admin/bookings", requireAdminAuth, async (req, res) => {
    const date = String(req.query.date ?? "");
    const range = String(req.query.range ?? "day");
    if (!date) return res.status(400).json({ error: "date is required" });
    if (!["day", "week"].includes(range)) return res.status(400).json({ error: "range must be day or week" });

    const targetDate = DateTime.fromISO(date, { zone: TIMEZONE });
    const periodStart = (range === "week" ? targetDate.startOf("week") : targetDate.startOf("day")).toUTC().toJSDate();
    const periodEnd = (range === "week" ? targetDate.endOf("week") : targetDate.endOf("day")).toUTC().toJSDate();

    const items = await Booking.find({ startAt: { $lte: periodEnd }, endAt: { $gte: periodStart } }).sort({ startAt: 1 }).lean();
    const services = await Service.find({ _id: { $in: items.map((x) => x.serviceId) } }).lean();
    const svcMap = new Map(services.map((s) => [String(s._id), s]));

    res.json(items.map((b) => ({
      id: String(b._id),
      kind: "booking",
      status: b.status,
      startAt: DateTime.fromJSDate(b.startAt).toUTC().toISO(),
      endAt: DateTime.fromJSDate(b.endAt).toUTC().toISO(),
      clientName: b.clientName,
      phone: b.phone,
      notes: b.notes ?? null,
      service: svcMap.get(String(b.serviceId)) ?? null,
    })));
  });

  app.post("/api/admin/block", requireAdminAuth, async (req, res) => {
    const parsed = adminBlockSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    try {
      const created = await createAvailabilityBlock(parsed.data);
      res.json({ id: String(created._id) });
    } catch (error: any) {
      if (error.message === "INVALID_RANGE") return res.status(400).json({ error: "Invalid range" });
      if (error.message === "RANGE_BUSY") return res.status(409).json({ error: "Range overlaps existing booking/block" });
      throw error;
    }
  });

  app.patch("/api/admin/bookings/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const updated = await updateBookingStatus(req.params.id, req.body?.status);
      res.json({ id: String(updated._id), status: updated.status });
    } catch (error: any) {
      if (error.message === "BOOKING_NOT_FOUND") return res.status(404).json({ error: "Booking not found" });
      if (error.message === "INVALID_STATUS_TRANSITION") return res.status(400).json({ error: "Invalid status transition" });
      throw error;
    }
  });

  app.get("/", (_req, res) => res.json({ status: "ok" }));
  return app;
}

const app = createApp();
export default app;
