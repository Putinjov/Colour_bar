import { NotificationLog } from "../models.js";
import { sendBookingEmail } from "./sendBookingEmail.js";

export async function enqueueBookingCreatedNotification(input: {
  bookingId: string;
  payload: Record<string, unknown>;
}) {
  return NotificationLog.create({
    channel: "email",
    event: "booking.created",
    status: "pending",
    referenceId: input.bookingId,
    payload: input.payload,
    attempts: 0,
    maxAttempts: 3,
    nextAttemptAt: new Date(),
  });
}

export async function processNotificationLogEntry(entry: any) {
  try {
    await sendBookingEmail(entry.payload ?? {});
    await NotificationLog.updateOne(
      { _id: entry._id },
      { $set: { status: "success", message: null, processedAt: new Date() }, $inc: { attempts: 1 } }
    );
  } catch (error: any) {
    const attempts = Number(entry.attempts ?? 0) + 1;
    const maxAttempts = Number(entry.maxAttempts ?? 3);
    const terminal = attempts >= maxAttempts;

    await NotificationLog.updateOne(
      { _id: entry._id },
      {
        $set: {
          status: terminal ? "failed" : "pending",
          message: String(error?.message || error),
          nextAttemptAt: new Date(Date.now() + 30_000 * attempts),
        },
        $inc: { attempts: 1 },
      }
    );
  }
}

export async function runNotificationWorkerOnce(limit = 20) {
  const queue = await NotificationLog.find({
    status: { $in: ["pending", "failed"] },
    nextAttemptAt: { $lte: new Date() },
    $expr: { $lt: ["$attempts", "$maxAttempts"] },
  })
    .sort({ nextAttemptAt: 1 })
    .limit(limit)
    .lean();

  for (const entry of queue) await processNotificationLogEntry(entry);
  return queue.length;
}
