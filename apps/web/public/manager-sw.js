
/* Private appointments and auth remain network-only. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = {
      title: "Colour Lab",
      body: "Нове бронювання",
    };
  }

  const title = payload.title || "Colour Lab";

  const options = {
    body: payload.body || "Нове бронювання",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "new-booking",
    data: {
      url: "/admin",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const destination = new URL(
    "/admin",
    self.location.origin
  ).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of windows) {
        if (client.url.startsWith(self.location.origin)) {
          await client.navigate(destination);
          return client.focus();
        }
      }

      return self.clients.openWindow(destination);
    })()
  );
});
