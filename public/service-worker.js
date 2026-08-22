const CACHE = "bingo-cache-v9";

self.addEventListener("install", event => {
    self.skipWaiting(); // força ativação imediata

    event.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                "/",
                "/",
                "/index.html",
                "/logofesta.png",
                "/igreja.png",
                "/manifest.json"
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(clients.claim()); // força o PWA a usar o SW novo
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(resp => {
            return resp || fetch(event.request);
        })
    );
});
