// service-worker.js

const CACHE_NAME = 'quan-ly-chi-tieu-v2';

// Danh sách các file cần lưu offline (Kết hợp cấu trúc mới và file PWA cũ)
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/config.js',
    './js/app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Sự kiện Install: Lưu trữ các file cần thiết vào Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Đã mở cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Sự kiện Activate: Xóa các cache cũ nếu có phiên bản mới
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Xóa cache cũ:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Sự kiện Fetch: Trả dữ liệu từ Cache nếu có, nếu không thì tải từ Network
self.addEventListener('fetch', (event) => {
    // Bỏ qua các request tới Firebase Database hoặc API ngoài để luôn lấy dữ liệu mới nhất
    if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - trả về response từ cache
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});