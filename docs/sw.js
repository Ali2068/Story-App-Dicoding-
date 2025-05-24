self.addEventListener('push', function (event) {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Notifikasi Baru!';
  const options = {
    body: data.body || 'Ada cerita baru nih!',
    icon: 'icons/icon-192.png',
    image: data.image || undefined,
    badge: 'icons/icon-192.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }

      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    }),
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