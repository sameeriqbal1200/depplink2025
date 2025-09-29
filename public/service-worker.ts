/// <reference lib="webworker" />

export { }; // ensure module scope

// Tell TS we're in a ServiceWorker context
declare const self: ServiceWorkerGlobalScope;

// Add this so TS accepts importScripts
declare function importScripts(...urls: string[]): void;

const CACHE_NAME = "tamkeen-cache-v1";
const PRECACHE_URLS = ["/"]; // add more assets if needed

// --- INSTALL: Precache app shell ---
self.addEventListener("install", (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
});

// --- ACTIVATE: Cleanup old caches ---
self.addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined))
            )
        )
    );
});

// --- FETCH: Cache-first fallback ---
self.addEventListener("fetch", (event: FetchEvent) => {
    event.respondWith(
        caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
});

// --- Import WebEngage service worker ---
importScripts("https://widgets.ksa.webengage.com/js/service-worker.js");

console.log("✅ Tamkeen custom service worker loaded with WebEngage support.");