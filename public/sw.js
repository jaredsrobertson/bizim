// v2: Cache essential assets for a true offline experience
const CACHE_NAME = 'bizim-cache-v3';
const urlsToCache = [
  // App Shell
  '/',
  '/index.html',
  '/manifest.json',

  // Icons (from your updated manifest)
  'https://ui-avatars.com/api/?name=B&size=192&background=3b82f6&color=ffffff',
  'https://ui-avatars.com/api/?name=B&size=512&background=3b82f6&color=ffffff',

  // Styles & Fonts
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  
  // Firebase Scripts
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Installation event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from network
        return fetch(event.request);
      })
  );
});

// Activation event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});