import { Schema, model, Types } from "mongoose";
const ServiceSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    durationMin: { type: Number, required: true },
    priceFrom: { type: Number },
    priceTo: { type: Number },
    description: { type: String },
}, { timestamps: true });
export const Service = model("Service", ServiceSchema);
const BookingSchema = new Schema({
    kind: { type: String, default: "booking" }, // booking | blocked
    serviceId: { type: Types.ObjectId, ref: "Service" }, // null for blocked
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    clientName: { type: String },
    phone: { type: String },
    notes: { type: String },
    status: { type: String, default: "confirmed" }, // confirmed | cancelled
}, { timestamps: true });
BookingSchema.index({ startAt: 1, endAt: 1, status: 1 });
export const Booking = model("Booking", BookingSchema);
