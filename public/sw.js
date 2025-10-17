// A simple service worker for caching the app shell.

// v1: Initial release
const CACHE_NAME = 'bizim-cache-v1';
const urlsToCache = [
  '/', // This caches the root URL
  '/index.html' // This explicitly caches the main HTML file
];

// Installation event: fires when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the installation is complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the essential files ('app shell') to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: fires for every network request the page makes.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the request is found in the cache, return the cached response.
        if (response) {
          return response;
        }
        // If the request is not in the cache, fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});

// Activation event: fires when the new service worker takes control.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Only the current cache is whitelisted.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is found that is not in the whitelist, delete it.
          // This removes old versions of the cache.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});