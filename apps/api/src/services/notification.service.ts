import { NotificationLog } from "../models.js";
import { sendBookingEmail } from "./sendBookingEmail.js";

export async function notifyBookingCreated(input: {
  bookingId: string;
  payload: Record<string, unknown>;
}) {
  try {
    await sendBookingEmail(input.payload);
    await NotificationLog.create({
      channel: "email",
      event: "booking.created",
      status: "success",
      referenceId: input.bookingId,
    });
  } catch (error: any) {
    await NotificationLog.create({
      channel: "email",
      event: "booking.created",
      status: "failed",
      referenceId: input.bookingId,
      message: String(error?.message || error),
    });
  }
}
