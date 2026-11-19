/* No offline data cache: private appointments and auth must remain network-only. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
// Web Push delivery will be added with authenticated subscriptions.
