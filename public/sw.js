// @ts-check
/// <reference lib="webworker" />

/**@type {ServiceWorkerGlobalScope} */
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

const CACHE_NAME = "v1";

sw.addEventListener("fetch", (event) => {
  async function fetchWithCacheFallback() {
    try {
      const response = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, response.clone());
      return response;
    } catch {
      const result = await caches.match(event.request);
      if (result) return result;
      return new Response("Offline or invalid url", { status: 404 });
    }
  }
  // @ts-expect-error
  if (navigator.connection && (navigator.connection.saveData || navigator.connection.type === "cellular")) {
    event.respondWith(caches.match(event.request).then((result) => result || fetchWithCacheFallback()));
  } else {
    event.respondWith(fetchWithCacheFallback());
  }
});
