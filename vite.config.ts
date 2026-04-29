import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        icons: [
          {
            src: "/assets/img/wootlab-logo-1.png",
            type: "image/png",
            sizes: "48x48",
            purpose: "any maskable",
          },
        ],
      },
      // registerType: "autoUpdate",
      // strategies: "generateSW",
      workbox: {
        maximumFileSizeToCacheInBytes: 52428800000,
        // globPatterns: [
        //   "**/*.{js,tsx,ts,jsx,css,html,png,jpg,jpeg,svg,webp,json,mp4,webm,woff2}",
        // ],
        runtimeCaching: [
          // {
          //   urlPattern: ({ request }) => request.destination === "image",
          //   handler: "NetworkFirst",
          //   options: {
          //     cacheName: "images",
          //     expiration: {
          //       maxEntries: 50,
          //       maxAgeSeconds: 30 * 24 * 60 * 60,
          //     },
          //   },
          // },
          // {
          //   urlPattern: ({ url }) => url.origin === self.location.origin,
          //   handler: "NetworkFirst",
          //   options: {
          //     cacheName: "static-cache",
          //     expiration: {
          //       maxEntries: 1000,
          //       maxAgeSeconds: 60 * 60 * 24 * 30,
          // },
          // },
          // },
          // {
          //   urlPattern: /^https:\/\/www\.youtube\.com\/embed\/.*/,
          //   handler: "CacheFirst",
          //   options: {
          //     cacheName: "video-links-cache",
          //     expiration: {
          //       maxEntries: 50,
          //       maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          //     },
          //   },
          // },
          // {
          //   urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
          //   handler: "NetworkFirst",
          //   options: {
          //     cacheName: "api-cache",
          //     expiration: {
          //       maxEntries: 100,
          //       maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          //     },
          //   },
          // },
        ],
      },
      // srcDir: "src",
      // filename: "service-worker.js",
      // strategies: "injectManifest",
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
  },
});
