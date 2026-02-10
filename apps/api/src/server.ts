import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import catalogRouter from "./routes/catalog.js";
import { DateTime } from "luxon";
import mongoose from "mongoose";
import { Booking, Service } from "./models.js";
import { seedServicesIfEmpty } from "./seed.js";
import { generateSlotsForDay } from "./slots.js";
import { bookingCreateSchema, adminBlockSchema } from "./validators.js";
import adminAuthRouter from "./routes/adminAuth.js";
import { requireAdminJWT } from "./auth.js";


dotenv.config();

const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI ?? "";
const ADMIN_PIN = process.env.ADMIN_PIN ?? "162009";
const TIMEZONE = process.env.TIMEZONE ?? "Europe/Dublin";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Create apps/api/.env from .env.example");
  process.exit(1);
}

const app = express();
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json({ limit: "2mb" })); // for parsing application/json
app.use("/api/catalog", catalogRouter); // Catalog routes (services list)
app.use("/api/admin", adminAuthRouter); // Admin auth routes (login)



app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/api/services", async (_req, res) => {
  const items = await Service.find().sort({ category: 1, title: 1 }).lean();
  res.json(items.map(s => ({
    id: String(s._id),
    title: s.title,
    category: s.category,
    durationMin: s.durationMin,
    priceFrom: s.priceFrom ?? undefined,
    priceTo: s.priceTo ?? undefined,
    description: s.description ?? undefined,
  })));
});

app.get("/api/slots", async (req, res) => {
  const serviceId = String(req.query.serviceId ?? "");
  const date = String(req.query.date ?? ""); // YYYY-MM-DD

  if (!serviceId || !date) return res.status(400).send("serviceId and date are required");

  const svc = await Service.findById(serviceId).lean();
  if (!svc) return res.status(404).send("Service not found");

  // Default schedule
  const stepMin = 30;
  const openHour = 10, openMinute = 0;
  const closeHour = 18, closeMinute = 0;
  const workWeekdays = [2,3,4,5,6]; // Tue..Sat

  const { slots, isWorkDay } = generateSlotsForDay({
    timezone: TIMEZONE,
    dateISO: date,
    durationMin: svc.durationMin,
    stepMin,
    openHour, openMinute, closeHour, closeMinute,
    workWeekdays,
  });

  if (!isWorkDay) return res.json([]);

  // Load existing confirmed bookings/blocks for that day
  const dayStart = DateTime.fromISO(date, { zone: TIMEZONE }).startOf("day").toUTC().toJSDate();
  const dayEnd = DateTime.fromISO(date, { zone: TIMEZONE }).endOf("day").toUTC().toJSDate();

  const busy = await Booking.find({
    status: "confirmed",
    startAt: { $lte: dayEnd },
    endAt: { $gte: dayStart },
  }).lean();

  const available = slots.filter(({ start, end }) => {
    const startUTC = start.toUTC().toJSDate();
    const endUTC = end.toUTC().toJSDate();

    // overlap: existing.start < newEnd AND existing.end > newStart
    const hit = busy.some(b => (b.startAt < endUTC) && (b.endAt > startUTC));
    return !hit;
  });

  res.json(available.map(({ start, end }) => ({
    startAt: start.toUTC().toISO(),
    endAt: end.toUTC().toISO(),
  })));
});

app.post("/api/bookings", async (req, res) => {
  const parsed = bookingCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { serviceId, startAt, clientName, phone, notes } = parsed.data;

  const svc = await Service.findById(serviceId).lean();
  if (!svc) return res.status(404).send("Service not found");

  const start = DateTime.fromISO(startAt, { zone: "utc" });
  if (!start.isValid) return res.status(400).send("Invalid startAt");

  const end = start.plus({ minutes: svc.durationMin });

  // prevent overlaps (bookings + blocked)
  const overlap = await Booking.findOne({
    status: "confirmed",
    startAt: { $lt: end.toJSDate() },
    endAt: { $gt: start.toJSDate() },
  }).lean();

  if (overlap) return res.status(409).send("Цей час уже зайнятий");

  const created = await Booking.create({
    kind: "booking",
    serviceId,
    startAt: start.toJSDate(),
    endAt: end.toJSDate(),
    clientName,
    phone,
    notes,
    status: "confirmed",
  });

  res.json({
    id: String(created._id),
    serviceId,
    startAt: start.toISO(),
    endAt: end.toISO(),
    clientName,
    phone,
    notes: notes ?? undefined,
    status: "confirmed",
  });
});

function requireAdmin(req: express.Request, res: express.Response): boolean {
  const pin = req.header("x-admin-pin");
  if (!pin || pin !== ADMIN_PIN) {
    res.status(401).send("Unauthorized");
    return false;
  }
  return true;
}

app.get("/api/admin/bookings", requireAdminJWT, async (req, res) => {

  const date = String(req.query.date ?? "");
  if (!date) return res.status(400).send("date is required (YYYY-MM-DD)");

  const dayStart = DateTime.fromISO(date, { zone: TIMEZONE }).startOf("day").toUTC().toJSDate();
  const dayEnd = DateTime.fromISO(date, { zone: TIMEZONE }).endOf("day").toUTC().toJSDate();

  const items = await Booking.find({
    startAt: { $lte: dayEnd },
    endAt: { $gte: dayStart },
  }).sort({ startAt: 1 }).lean();

  /*const items = await Booking.find({
  startAt: { $lte: dayEnd },
  endAt: { $gte: dayStart },
}).sort({ startAt: 1 }).lean();*/

// підтягуємо сервіси одним запитом
const serviceIds = Array.from(
  new Set(items.map(b => b.serviceId ? String(b.serviceId) : "").filter(Boolean))
);

const services = await Service.find({ _id: { $in: serviceIds } }).lean();
const svcMap = new Map(services.map(s => [String(s._id), s]));

res.json(items.map(b => {
  const sid = b.serviceId ? String(b.serviceId) : null;
  const svc = sid ? svcMap.get(sid) : null;

  return {
    id: String(b._id),
    kind: b.kind, // booking | blocked
    status: b.status,
    startAt: DateTime.fromJSDate(b.startAt).toUTC().toISO(),
    endAt: DateTime.fromJSDate(b.endAt).toUTC().toISO(),

    clientName: b.clientName ?? null,
    phone: b.phone ?? null,
    notes: b.notes ?? null,

    service: svc ? {
      id: String(svc._id),
      title: svc.title,
      category: svc.category,
      durationMin: svc.durationMin,
      priceFrom: svc.priceFrom ?? null,
      priceTo: svc.priceTo ?? null,
      description: svc.description ?? null,
    } : null,
  };
}));

});

app.post("/api/admin/block", requireAdminJWT, async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const parsed = adminBlockSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { startAt, endAt, notes } = parsed.data;
  const start = DateTime.fromISO(startAt, { zone: "utc" });
  const end = DateTime.fromISO(endAt, { zone: "utc" });
  if (!start.isValid || !end.isValid || end <= start) return res.status(400).send("Invalid range");

  const overlap = await Booking.findOne({
    status: "confirmed",
    startAt: { $lt: end.toJSDate() },
    endAt: { $gt: start.toJSDate() },
  }).lean();
  if (overlap) return res.status(409).send("Range overlaps existing booking/block");

  const created = await Booking.create({
    kind: "blocked",
    startAt: start.toJSDate(),
    endAt: end.toJSDate(),
    notes,
    status: "confirmed",
  });

  res.json({ id: String(created._id) });
});

async function main() {
  console.log("➡️ connecting mongo");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ mongo connected");

  console.log("➡️ seeding");
  await seedServicesIfEmpty();
  console.log("✅ seed done");

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("❌ Listen error:", err?.message || err);
  });
}

main().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});
