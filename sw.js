const CACHE_NAME = "german-app-v3";

const STATIC_ASSETS = [
  "./",
  "index.html",
  "article.html",
  "gender.html",
  "preposition.html",
  "verb.html",
  "tense.html",
  "pronoun.html",
  "wordorder.html",
  "number.html",
  "connector.html",
  "pronunciation.html",
  "prefix.html",
  "compound.html",
  "school.html",
  "slang.html",
  "navbar.html",
  "footer.html",
  "style.css",
  "manifest.json",
  "icon.png"
];

// ----------------------
// INSTALL
// ----------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Activate new SW immediately (does NOT take control yet)
  self.skipWaiting();
});

// ----------------------
// ACTIVATE
// ----------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  // Take control of all pages immediately
  self.clients.claim();
});

// ----------------------
// MESSAGE (for update button)
// ----------------------
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ----------------------
// FETCH STRATEGY
// ----------------------
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. HTML → network first (always get latest version)
  if (request.mode === "navigate" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // 2. Static assets → cache first, fallback to network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });

      }).catch(() => {
        // offline fallback (optional safety)
        return caches.match("./");
      });
    })
  );
});