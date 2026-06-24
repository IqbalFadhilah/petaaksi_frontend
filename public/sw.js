self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png', // Pastikan kamu punya icon aplikasi di folder public
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200], // Efek getar HP
      data: {
        url: data.url || '/' // URL yang dibuka saat notif di-klik
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});