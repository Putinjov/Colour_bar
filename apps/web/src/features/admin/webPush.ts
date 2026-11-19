
import {
  adminGetWebPushPublicKey,
  adminWebPushSubscribe,
} from "../../api/admin.js";

function base64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = atob(normalized);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));

  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }

  return bytes;
}


export async function enableAdminWebPush(token: string) {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error("Web Push is not supported on this device");
  }

  if (Notification.permission === "denied") {
    throw new Error("Notifications are blocked in device settings");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted");
  }

  const { publicKey } = await adminGetWebPushPublicKey(token);

  const registration = await navigator.serviceWorker.register(
    "/manager-sw.js",
    { scope: "/" }
  );

  const existing = await registration.pushManager.getSubscription();

  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(publicKey),
    }));

  const json = subscription.toJSON();

  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid browser push subscription");
  }

  await adminWebPushSubscribe(token, {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  });
  
  

  return true;
  
}
export async function isAdminWebPushEnabled(): Promise<boolean> {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration("/");
  if (!registration) return false;

  const subscription = await registration.pushManager.getSubscription();

  return subscription !== null;
}
