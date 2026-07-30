// public/sw.js
const CACHE_NAME = 'petaaksi-cache-v1';
//Daftar aset utama yang WAJIB disimpan pas pertama kali aplikasi dibuka
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];
// Event INSTALL: Buka gudang cache dan masukkan aset utama
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Gudang Cache PetaAksi Berhasil Dibuat!');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});
// Event ACTIVATE: Bersihkan sampah cache versi lama jika ada pembaruan kode
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus Cache Lama yang Usang:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event FETCH bertugas mengambilkan file dari Cache saat Offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        //JIKA ONLINE, simpan riwayat laporan ke Cache
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        //JIKA OFFLINE, otomatis ambil riwayat terakhir dari Cache!
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; 
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// =========================================================================
// 🔔 Bagian 2: Logika Notifikasi (Push Notification Kamu yang Lama)
// =========================================================================

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/logo192.png', 
      badge: '/logo192.png',
      vibrate: [200, 100, 200], 
      data: {
        url: data.url || '/' 
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