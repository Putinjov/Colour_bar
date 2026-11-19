import mongoose, { Schema, model, Types } from "mongoose";

export type ServiceCategory = "Стрижки" | "Фарбування" | "Відновлення";
export const BOOKING_STATUSES = ["pending", "confirmed", "declined", "cancelled", "completed", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    durationMin: { type: Number, required: true },
    priceFrom: { type: Number },
    priceTo: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

export const Service = model("Service", ServiceSchema);

const BookingSchema = new Schema(
  {
    serviceId: { type: Types.ObjectId, ref: "Service", required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: BOOKING_STATUSES, default: "confirmed" },
  },
  { timestamps: true }
);
BookingSchema.index({ startAt: 1, endAt: 1, status: 1 });
export const Booking = model("Booking", BookingSchema);

const AvailabilityBlockSchema = new Schema(
  {
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    notes: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
AvailabilityBlockSchema.index({ startAt: 1, endAt: 1, active: 1 });
export const AvailabilityBlock = model("AvailabilityBlock", AvailabilityBlockSchema);

const NotificationLogSchema = new Schema(
  {
    channel: { type: String, required: true },
    event: { type: String, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], required: true },
    referenceId: { type: String },
    message: { type: String },
    payload: { type: Schema.Types.Mixed },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    nextAttemptAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);
NotificationLogSchema.index({ status: 1, nextAttemptAt: 1 });
export const NotificationLog = model("NotificationLog", NotificationLogSchema);

const PushSubscriptionSchema = new Schema(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    enabled: { type: Boolean, default: true },
    userAgent: { type: String },
    lastSeenAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export const PushSubscription = model(
  "PushSubscription",
  PushSubscriptionSchema,
  "webpushsubscriptions"
);

const BookingCreationLockSchema = new Schema(
  {
    _id: { type: String, required: true },
    lockedUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const BookingCreationLock = model("BookingCreationLock", BookingCreationLockSchema);

export type ServiceDoc = mongoose.InferSchemaType<typeof ServiceSchema> & { _id: Types.ObjectId };
export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema> & { _id: Types.ObjectId };
