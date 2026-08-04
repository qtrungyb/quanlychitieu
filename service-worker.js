const CACHE_NAME = 'qlct-cache-v1';
const urlsToCache = [
  './4.8.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // Bạn có thể thêm các link CDN của Firebase, Chart.js, Sortable.js vào đây nếu muốn cache chúng để dùng offline hoàn toàn
];

// Sự kiện Install: Lưu trữ các file cần thiết vào Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Đã mở cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện Fetch: Trả dữ liệu từ Cache nếu có, nếu không thì tải từ Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - trả về response từ cache
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Sự kiện Activate: Xóa các cache cũ nếu có phiên bản mới
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});