const CACHE_NAME = 'app-shell-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.bundle.js',
  './main.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/logo.png',
];

// Install Event - Precaching Aset
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Optional: handle fallback here (e.g., offline page or default image)
        })
      );
    })
  );
});

// Push Notification Event
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'Push Notification' };
  self.registration.showNotification(data.title, {
    body: data.body || 'Notifikasi dari aplikasi Galeri Cerita!',
    icon: './icons/icon-192.png',
  });
});