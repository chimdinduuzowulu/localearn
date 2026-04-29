/// <reference lib="webworker" />
// ─────────────────────────────────────────────────────────────────────────────
// src/service-worker.ts  –  Updated for document-centric offline support
//
// Changes from original:
//   • Removed YouTube video link caching (no longer used)
//   • Added caching for /api/documents/** routes (AI-processed content)
//   • Documents and study materials cached aggressively for offline access
// ─────────────────────────────────────────────────────────────────────────────

import { precacheAndRoute }  from "workbox-precaching";
import { registerRoute }     from "workbox-routing";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin }  from "workbox-expiration";
import { getFormData }       from "./db";

// Precache all build-time assets
precacheAndRoute(self.__WB_MANIFEST);

// Skip waiting and take control immediately
self.addEventListener("install",  () => { (self as unknown as ServiceWorkerGlobalScope).skipWaiting(); });
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil((self as unknown as ServiceWorkerGlobalScope).clients.claim());
});

// ── Static app shell (JS, CSS, HTML, images) ──────────────────────────────
registerRoute(
  ({ url }: { url: URL }) => url.origin === (self as unknown as ServiceWorkerGlobalScope).location.origin,
  new NetworkFirst({
    cacheName: "static-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries:     1000,
        maxAgeSeconds:  60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// ── AI-generated document content (study guides, translations, quizzes) ───
// Cache-first so students can study fully offline after first access
registerRoute(
  ({ url }: { url: URL }) => url.pathname.startsWith("/api/documents"),
  new CacheFirst({
    cacheName: "documents-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries:    500,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// ── General API responses ─────────────────────────────────────────────────
registerRoute(
  ({ url }: { url: URL }) => url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/api/documents"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries:    100,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
  })
);

// ── Fonts and CDN assets ──────────────────────────────────────────────────
registerRoute(
  ({ url }: { url: URL }) =>
    url.origin.includes("fonts.googleapis.com") ||
    url.origin.includes("fonts.gstatic.com")   ||
    url.origin.includes("cdnjs.cloudflare.com"),
  new StaleWhileRevalidate({
    cacheName: "cdn-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries:    50,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// ── Push notifications ────────────────────────────────────────────────────
self.addEventListener("push", (event: PushEvent) => {
  const data = event.data?.json();
  const title = data?.title ?? "Naija Learn";
  const options: NotificationOptions = {
    body:  data?.body,
    icon:  "/assets/img/wootlab-logo-1.png",
    badge: "/assets/img/wootlab-logo-1.png",
  };
  event.waitUntil((self as unknown as ServiceWorkerGlobalScope).registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
    (self as unknown as ServiceWorkerGlobalScope).clients.openWindow(
      (event.notification as Notification & { data?: { url?: string } }).data?.url ?? "/"
    )
  );
});

// ── Background sync (re-queue form data on reconnect) ─────────────────────
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "sync-form-data") {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData(): Promise<void> {
  const formData = await getFormData();
  for (const data of formData) {
    console.log("Syncing data to server:", data);
    // Server sync logic here
  }
}