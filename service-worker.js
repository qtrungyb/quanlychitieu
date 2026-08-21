const CACHE_NAME = 'thuchi-v6.5'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './intro.html',
    './css/style.css',
    './js/app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Cài đặt Service Worker và lưu Cache
self.addEventListener('install', event => {
    // Ép Service Worker mới thay thế cái cũ ngay lập tức (không chờ tab đóng)
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Kích hoạt và dọn dẹp Cache của phiên bản cũ
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Đã xóa bộ nhớ đệm cũ:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Chiếm quyền điều khiển trang web ngay lập tức
    return self.clients.claim(); 
});

// Phục vụ file từ Cache nếu có, nếu không thì tải từ mạng
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
