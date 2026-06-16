/* ========== WorkCare Service Worker ========== */
const CACHE_NAME = "workcare-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/global.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/screens/home.css",
  "./css/screens/welcome.css",
  "./css/screens/intro.css",
  "./css/screens/login.css",
  "./css/screens/register.css",
  "./css/screens/exercises.css",
  "./css/screens/exercise-detail.css",
  "./css/screens/water.css",
  "./css/screens/statistics.css",
  "./css/screens/achievement.css",
  "./css/screens/profile.css",
  "./css/screens/settings.css",
  "./css/screens/break.css",
  "./css/screens/ai-chat.css",
  "./js/app.js",
  "./js/ai.js",
  "./screens/home.html",
  "./screens/welcome.html",
  "./screens/intro.html",
  "./screens/login.html",
  "./screens/register.html",
  "./screens/exercises.html",
  "./screens/exercise-detail.html",
  "./screens/water.html",
  "./screens/statistics.html",
  "./screens/achievement.html",
  "./screens/profile.html",
  "./screens/settings.html",
  "./screens/break.html",
  "./screens/ai-chat.html",
];

/* Install: cache all assets */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
  self.skipWaiting();
});

/* Activate: clean old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  self.clients.claim();
});

/* Fetch: serve from cache, fallback to network */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          /* Cache new requests */
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          /* Offline fallback */
          if (event.request.destination === "document") {
            return caches.match("./index.html");
          }
        });
    }),
  );
});

/* Push notification */
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "WorkCare";
  const body = data.body || "Đã đến giờ nghỉ ngơi!";
  const icon = data.icon || "./icons/icon-192.png";
  const url = data.url || "./screens/home.html";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: icon,
      data: { url },
      actions: [
        { action: "open", title: "Mở WorkCare" },
        { action: "dismiss", title: "Bỏ qua" },
      ],
    }),
  );
});

/* Notification click */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "./screens/home.html";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("WorkCare") && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
