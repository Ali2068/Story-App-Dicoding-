const CACHE_NAME = 'galeri-cerita-cache-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './main.css',
  './app.bundle.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: "Push Notification" };
  self.registration.showNotification(data.title, {
    body: data.body || "Notifikasi dari aplikasi Galeri Cerita!",
    icon: "./icons/icon-192.png"
  });
});