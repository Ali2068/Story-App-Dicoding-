self.addEventListener('push', function (event) {
    const data = event.data?.json() || { title: 'Notifikasi Baru', body: 'Ada cerita baru di aplikasi!' };
  
    const options = {
      body: data.body,
      icon: '/icon.png',
      image: '/icon.png',
      vibrate: [100, 50, 100],
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
const CACHE_NAME = 'cerita-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.bundle.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Notifikasi', body: 'Ada cerita baru!' };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
    })
  );
});
