const CACHE_NAME = "bingo-cache-v10";
const CORE_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/service-worker.js",
    "/logofesta.png",
    "/igreja.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

// INSTALAÇÃO — cache inicial
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

// ATIVAÇÃO — limpa caches antigos
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

// FETCH — Stale-While-Revalidate + fallback offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            const networkFetch = fetch(event.request)
                .then(response => {
                    // Atualiza cache em background
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                    });
                    return response;
                })
                .catch(() => {
                    // Se offline → devolve cache
                    return cached || caches.match("/index.html");
                });

            // Se tem cache → devolve cache primeiro (rápido)
            return cached || networkFetch;
        })
    );
});

self.VERSION = CACHE_NAME;