// Caching static assets (application shell)
self.addEventListener('install', (event) => {
  console.log('[SW] Installing');
  event.waitUntil(
    caches.open('app-shell').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/app.bundle.js',
        '/manifest.json',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/offline.html',
        '/images/placeholder.png',
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'image') {
          return caches.match('/images/placeholder.png');
        }
      });
    })
  );
});

// Handle push notification
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Notifikasi Baru' };

  self.registration.showNotification(data.title, {
    body: data.body || 'Notifikasi dari Galeri Cerita!',
    icon: '/icons/icon-192.png',
  });
});