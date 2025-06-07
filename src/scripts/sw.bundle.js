self.addEventListener('install', (event) => {
  console.log('Service Worker installed (custom)');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated (custom)');
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Push Notification' };
  self.registration.showNotification(data.title, {
    body: data.body || 'Notifikasi dari aplikasi Galeri Cerita!',
    icon: './icons/icon-192.png',
  });
});