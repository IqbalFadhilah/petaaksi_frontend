// public/sw.js

const CACHE_NAME = 'petaaksi-cache-v1';

// 1. Daftar aset utama yang WAJIB disimpan pas pertama kali aplikasi dibuka
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

// =========================================================================
// 🌐 Bagian 1: Logika Siklus Hidup & Penanganan Offline (PWA Cache)
// =========================================================================

// Event INSTALL: Buka gudang cache dan masukkan aset utama
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Gudang Cache PetaAksi Berhasil Dibuat!');
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
            console.log('🧹 Menghapus Cache Lama yang Usang:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event FETCH: Satpam yang bertugas mengambilkan file dari Cache saat Offline
self.addEventListener('fetch', (event) => {
  // Satpam 1: Hanya tangani request pembacaan data (GET). 
  // Request POST (kirim laporan) GAK BOLEH masuk cache karena bisa error.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // 🌐 Langkah 1: Coba minta data terbaru ke internet/backend dulu
    fetch(event.request)
      .then((networkResponse) => {
        // Jika internet lancar dan dapat data (status 200)
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          // Buka gudang cache dan perbarui data riwayat laporan terbaru
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        //JIKA OFFLINE (Internet Mati), otomatis ambil riwayat terakhir dari Cache!
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // <<--- Pin laporan terakhir bakal muncul di sini!
          }
          
          // Jika yang dibuka adalah perpindahan halaman, kembalikan ke index.html PWA
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
      icon: '/logo-aplikasi-petaaksi-192.png', 
      badge: '/logo-aplikasi-petaaksi-192.png',
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