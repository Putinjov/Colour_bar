import mongoose, { Schema, model, Types } from "mongoose";

export type ServiceCategory = "Стрижки" | "Фарбування" | "Відновлення";

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
    kind: { type: String, default: "booking" }, // booking | blocked
    serviceId: { type: Types.ObjectId, ref: "Service" }, // null for blocked
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    clientName: { type: String },
    phone: { type: String },
    notes: { type: String },
    status: { type: String, default: "confirmed" }, // confirmed | cancelled
  },
  { timestamps: true }
);

BookingSchema.index({ startAt: 1, endAt: 1, status: 1 });

export const Booking = model("Booking", BookingSchema);

const PushSubscriptionSchema = new Schema(
  {
    clientId: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    userAgent: { type: String },
    lastSeenAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export const PushSubscription = model("PushSubscription", PushSubscriptionSchema);

export type ServiceDoc = mongoose.InferSchemaType<typeof ServiceSchema> & { _id: Types.ObjectId };
export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema> & { _id: Types.ObjectId };
