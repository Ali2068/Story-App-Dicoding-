self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Push Notification' };
  self.registration.showNotification(data.title, {
    body: data.body || 'Notifikasi dari aplikasi Galeri Cerita!',
    icon: './icons/icon-192.png',
  });
});