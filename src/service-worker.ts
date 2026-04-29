/// <reference lib="webworker" />
/// <reference lib="dom" />

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { getFormData } from "./db";


declare const self: ServiceWorkerGlobalScope;


declare const __WB_MANIFEST: Array<
  import("workbox-precaching").PrecacheEntry
>;


interface SyncEvent extends ExtendableEvent {
  tag: string;
}


precacheAndRoute(__WB_MANIFEST);


self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});


registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new NetworkFirst({
    cacheName: "static-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/documents"),
  new CacheFirst({
    cacheName: "documents-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/api/documents"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin.includes("fonts.googleapis.com") ||
    url.origin.includes("fonts.gstatic.com") ||
    url.origin.includes("cdnjs.cloudflare.com"),
  new StaleWhileRevalidate({
    cacheName: "cdn-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);


self.addEventListener("push", (event) => {
  const data = event.data?.json();

  const title = data?.title ?? "Naija Learn";

  const options: NotificationOptions = {
    body: data?.body,
    icon: "/assets/img/wootlab-logo-1.png",
    badge: "/assets/img/wootlab-logo-1.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(
      (event.notification as Notification & {
        data?: { url?: string };
      }).data?.url ?? "/"
    )
  );
});


self.addEventListener("sync", ((event: Event) => {
  const syncEvent = event as SyncEvent;

  if (syncEvent.tag === "sync-form-data") {
    syncEvent.waitUntil(syncFormData());
  }
}) as EventListener);


async function syncFormData(): Promise<void> {
  const formData = await getFormData();

  for (const data of formData) {
    console.log("Syncing data to server:", data);
    // TODO: send to server
  }
}