self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // Fallback untuk gambar
          if (event.request.destination === 'image') {
            return caches.match('/images/placeholder.png');
          }

          // Fallback untuk halaman navigasi
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Notifikasi Baru', body: 'Ada update baru!' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: './icons/icon-192.png',
  });
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((res) => {
        return res || fetch(event.request).catch(() => caches.match('/images/placeholder.png'));
      })
    );
  } else if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
});