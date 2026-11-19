
import * as webpush from "web-push";
import { PushSubscription } from "../models.js";

type PushMessage = {
  title: string;
  body: string;
  url?: string;
};

export async function sendAdminWebPush(message: PushMessage) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    console.warn("Web Push: VAPID configuration missing");
    return;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const subscriptions = await PushSubscription.find({
    enabled: true,
    endpoint: { $exists: true, $type: "string" },
  }).lean();

  const payload = JSON.stringify(message);

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint!,
            keys: {
              p256dh: subscription.keys!.p256dh,
              auth: subscription.keys!.auth,
            },
          },
          payload
        );
      } catch (error: any) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await PushSubscription.deleteOne({
            _id: subscription._id,
          });
        } else {
          console.error(
            "Web Push delivery failed:",
            error.statusCode ?? error.message
          );
        }
      }
    })
  );
}
