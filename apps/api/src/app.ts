import express from "express";
import cors from "cors";
import { isValidObjectId } from "mongoose";
import { DateTime } from "luxon";
import catalogRouter from "./routes/catalog.js";
import adminAuthRouter from "./routes/adminAuth.js";
import { bookingCreateSchema, adminBlockSchema } from "./validators.js";
import { AvailabilityBlock, Booking, PushSubscription, Service, BOOKING_STATUSES, type BookingStatus } from "./models.js";
import { requireAdminAuth, verifyAdminToken } from "./auth.js";
import { createBooking, updateBookingStatus, rescheduleBooking } from "./services/booking.service.js";
import { createAvailabilityBlock } from "./services/availabilityBlock.service.js";
import { getAvailableSlots } from "./services/availability.service.js";
import { enqueueBookingCreatedNotification } from "./services/notification.service.js";

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
      void enqueueBookingCreatedNotification({
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
      if (error.message === "BOOKING_LOCK_TIMEOUT") return res.status(503).json({ error: "Booking service busy, retry" });
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

  app.get("/api/admin/calendar", requireAdminAuth, async (req, res) => {
    const date = String(req.query.date ?? "");
    const range = String(req.query.range ?? "day");
    if (!date) return res.status(400).json({ error: "date is required" });
    if (!["day", "week", "month"].includes(range)) return res.status(400).json({ error: "range must be day, week or month" });

    const targetDate = DateTime.fromISO(date, { zone: TIMEZONE });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !targetDate.isValid) return res.status(400).json({ error: "Invalid date" });
    const unit = range === "month" ? "month" : range === "week" ? "week" : "day";
    const periodStart = targetDate.startOf(unit).toUTC().toJSDate();
    const periodEnd = targetDate.startOf(unit).plus(unit === "month" ? { months: 1 } : unit === "week" ? { weeks: 1 } : { days: 1 }).toUTC().toJSDate();

    const [bookings, blocks] = await Promise.all([
      Booking.find({ startAt: { $lt: periodEnd }, endAt: { $gt: periodStart } }).sort({ startAt: 1 }).lean(),
      AvailabilityBlock.find({ active: true, startAt: { $lt: periodEnd }, endAt: { $gt: periodStart } }).sort({ startAt: 1 }).lean(),
    ]);

    const services = await Service.find({ _id: { $in: bookings.map((x) => x.serviceId) } }).lean();
    const svcMap = new Map(services.map((svc) => [String(svc._id), svc]));

    const items = [
      ...bookings.map((b) => ({
        id: String(b._id),
        kind: "booking",
        status: b.status,
        startAt: DateTime.fromJSDate(b.startAt).toUTC().toISO(),
        endAt: DateTime.fromJSDate(b.endAt).toUTC().toISO(),
        startAtLocal: DateTime.fromJSDate(b.startAt).setZone(TIMEZONE).toISO(),
        endAtLocal: DateTime.fromJSDate(b.endAt).setZone(TIMEZONE).toISO(),
        clientName: b.clientName,
        phone: b.phone,
        notes: b.notes ?? null,
        service: svcMap.get(String(b.serviceId)) ?? null,
      })),
      ...blocks.map((b) => ({
        id: String(b._id),
        kind: "block",
        status: "blocked",
        startAt: DateTime.fromJSDate(b.startAt).toUTC().toISO(),
        endAt: DateTime.fromJSDate(b.endAt).toUTC().toISO(),
        startAtLocal: DateTime.fromJSDate(b.startAt).setZone(TIMEZONE).toISO(),
        endAtLocal: DateTime.fromJSDate(b.endAt).setZone(TIMEZONE).toISO(),
        notes: b.notes ?? null,
      })),
    ].sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));

    res.json(items);
  });

  // Manual entries deliberately allow custom hours and same-day appointments.
  function adminBookingError(res: express.Response, error: unknown) {
    const message = error instanceof Error ? error.message : "";
    const codes: Record<string, number> = { SERVICE_NOT_FOUND: 404, BOOKING_NOT_FOUND: 404, INVALID_START: 400, INVALID_STATUS_TRANSITION: 409, SLOT_BUSY: 409, BOOKING_LOCK_TIMEOUT: 503 };
    return res.status(codes[message] ?? 500).json({ error: codes[message] ? message : "Unable to save appointment" });
  }
  app.post("/api/admin/bookings", requireAdminAuth, async (req, res) => {
    const parsed = bookingCreateSchema.safeParse(req.body);
    if (!parsed.success || !isValidObjectId(parsed.data.serviceId)) return res.status(400).json({ error: "INVALID_INPUT" });
    if (Date.parse(parsed.data.startAt) <= Date.now()) return res.status(400).json({ error: "INVALID_START" });
    try {
      const result = await createBooking(parsed.data);
      return res.status(201).json({ id: String(result.created._id), startAt: result.start.toISO(), endAt: result.end.toISO() });
    } catch (error) { return adminBookingError(res, error); }
  });
  app.patch("/api/admin/bookings/:id/reschedule", requireAdminAuth, async (req, res) => {
    if (!isValidObjectId(req.params.id) || typeof req.body?.startAt !== "string") return res.status(400).json({ error: "INVALID_INPUT" });
    try {
      const result = await rescheduleBooking(req.params.id, req.body.startAt);
      return res.json({ id: String(result._id), startAt: result.startAt.toISOString(), endAt: result.endAt.toISOString() });
    } catch (error) { return adminBookingError(res, error); }
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
      if (error.message === "BOOKING_LOCK_TIMEOUT") return res.status(503).json({ error: "Booking service busy, retry" });
      if (error.message === "RANGE_BUSY") return res.status(409).json({ error: "Range overlaps existing booking/block" });
      throw error;
    }
  });

  app.delete("/api/admin/block/:id", requireAdminAuth, async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid block ID" });
    try {
      const block = await AvailabilityBlock.findOneAndUpdate({ _id: req.params.id, active: true }, { $set: { active: false } });
      if (!block) return res.status(404).json({ error: "Block not found" });
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: "Unable to remove block" });
    }
  });

  app.patch("/api/admin/bookings/:id/status", requireAdminAuth, async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid booking ID" });
    if (!BOOKING_STATUSES.includes(req.body?.status as BookingStatus)) return res.status(400).json({ error: "Invalid status" });
    try {
      const updated = await updateBookingStatus(req.params.id, req.body.status);
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
