const CACHE_NAME = "german-app-v2"; // Incremented version to force update

const urlsToCache = [
  "/",
  "/index.html",
  "/article.html",
  "/gender.html",
  "/preposition.html",
  "/verb.html",
  "/tense.html",
  "/pronoun.html",
  "/wordorder.html",
  "/number.html",
  "/connector.html",
  "/pronunciation.html",
  "/prefix.html",
  "/compound.html",
  "/school.html",
  "/slang.html",
  "/navbar.html",
  "/footer.html",
  "/style.css",
  "/manifest.json",
  "/icon.png" // Include your icon if it exists
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Forces the waiting service worker to become active
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Delete old caches
          }
        })
      );
    }).then(() => self.clients.claim()) // Takes control of open pages immediately
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});