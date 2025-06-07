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